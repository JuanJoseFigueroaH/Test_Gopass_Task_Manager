import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/project.dart';
import '../../domain/usecases/get_projects.dart';
import '../../domain/usecases/create_project.dart';
import '../../domain/usecases/update_project.dart';
import '../../domain/usecases/delete_project.dart';
import '../../../../core/websocket/project_event_stream.dart';
import '../../../../core/websocket/socket_service.dart';

part 'project_event.dart';
part 'project_state.dart';

class ProjectBloc extends Bloc<ProjectEvent, ProjectState> {
  final GetProjects getProjects;
  final CreateProject createProject;
  final UpdateProject updateProject;
  final DeleteProject deleteProject;
  final ProjectEventStream projectEventStream;
  final SocketService _socketService;

  StreamSubscription<Project>? _createdSubscription;
  StreamSubscription<Project>? _updatedSubscription;
  StreamSubscription<String>? _deletedSubscription;

  ProjectBloc({
    required this.getProjects,
    required this.createProject,
    required this.updateProject,
    required this.deleteProject,
    required this.projectEventStream,
    required SocketService socketService,
  }) : _socketService = socketService, super(ProjectInitial()) {
    on<LoadProjects>(_onLoadProjects);
    on<AddProject>(_onAddProject);
    on<EditProject>(_onEditProject);
    on<RemoveProject>(_onRemoveProject);
    on<ProjectCreatedFromSocket>(_onProjectCreatedFromSocket);
    on<ProjectUpdatedFromSocket>(_onProjectUpdatedFromSocket);
    on<ProjectDeletedFromSocket>(_onProjectDeletedFromSocket);
    
    _initEventStreams();
  }

  void _initEventStreams() {
    _socketService.connect();
    
    _createdSubscription = projectEventStream.onProjectCreated.listen((project) {
      add(ProjectCreatedFromSocket(project));
    });

    _updatedSubscription = projectEventStream.onProjectUpdated.listen((project) {
      add(ProjectUpdatedFromSocket(project));
    });

    _deletedSubscription = projectEventStream.onProjectDeleted.listen((projectId) {
      add(ProjectDeletedFromSocket(projectId));
    });
  }

  Future<void> _onLoadProjects(LoadProjects event, Emitter<ProjectState> emit) async {
    emit(ProjectLoading());
    final result = await getProjects();
    result.fold(
      (failure) => emit(ProjectError(failure)),
      (projects) => emit(ProjectLoaded(projects)),
    );
  }

  Future<void> _onAddProject(AddProject event, Emitter<ProjectState> emit) async {
    final currentProjects = state is ProjectLoaded ? (state as ProjectLoaded).projects : <Project>[];
    emit(ProjectLoading());
    final result = await createProject(name: event.name, description: event.description);
    await result.fold(
      (failure) async => emit(ProjectError(failure)),
      (project) async {
        final loadResult = await getProjects();
        loadResult.fold(
          (failure) => emit(ProjectError(failure)),
          (projects) => emit(ProjectOperationSuccess(message: 'Proyecto creado exitosamente', projects: projects)),
        );
      },
    );
  }

  Future<void> _onEditProject(EditProject event, Emitter<ProjectState> emit) async {
    emit(ProjectLoading());
    final result = await updateProject(
      id: event.id,
      name: event.name,
      description: event.description,
      isActive: event.isActive,
    );
    await result.fold(
      (failure) async => emit(ProjectError(failure)),
      (_) async {
        final loadResult = await getProjects();
        loadResult.fold(
          (failure) => emit(ProjectError(failure)),
          (projects) => emit(ProjectOperationSuccess(message: 'Proyecto actualizado exitosamente', projects: projects)),
        );
      },
    );
  }

  Future<void> _onRemoveProject(RemoveProject event, Emitter<ProjectState> emit) async {
    emit(ProjectLoading());
    final result = await deleteProject(event.id);
    await result.fold(
      (failure) async => emit(ProjectError(failure)),
      (_) async {
        final loadResult = await getProjects();
        loadResult.fold(
          (failure) => emit(ProjectError(failure)),
          (projects) => emit(ProjectOperationSuccess(message: 'Proyecto eliminado exitosamente', projects: projects)),
        );
      },
    );
  }

  void _onProjectCreatedFromSocket(ProjectCreatedFromSocket event, Emitter<ProjectState> emit) {
    final currentState = state;
    if (currentState is ProjectLoaded) {
      final exists = currentState.projects.any((p) => p.id == event.project.id);
      if (!exists) {
        emit(ProjectLoaded([event.project, ...currentState.projects]));
      }
    }
  }

  void _onProjectUpdatedFromSocket(ProjectUpdatedFromSocket event, Emitter<ProjectState> emit) {
    final currentState = state;
    if (currentState is ProjectLoaded) {
      final updatedProjects = currentState.projects.map((p) {
        return p.id == event.project.id ? event.project : p;
      }).toList();
      emit(ProjectLoaded(updatedProjects));
    }
  }

  void _onProjectDeletedFromSocket(ProjectDeletedFromSocket event, Emitter<ProjectState> emit) {
    final currentState = state;
    if (currentState is ProjectLoaded) {
      final filteredProjects = currentState.projects.where((p) => p.id != event.projectId).toList();
      emit(ProjectLoaded(filteredProjects));
    }
  }

  @override
  Future<void> close() {
    _createdSubscription?.cancel();
    _updatedSubscription?.cancel();
    _deletedSubscription?.cancel();
    return super.close();
  }
}
