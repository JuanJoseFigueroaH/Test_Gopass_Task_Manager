import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/task.dart';
import '../../domain/usecases/get_tasks_by_project.dart';
import '../../domain/usecases/create_task.dart';
import '../../domain/usecases/update_task.dart';
import '../../domain/usecases/delete_task.dart';
import '../../../../core/websocket/task_event_stream.dart';

part 'task_event.dart';
part 'task_state.dart';

class TaskBloc extends Bloc<TaskEvent, TaskState> {
  final GetTasksByProject getTasksByProject;
  final CreateTask createTask;
  final UpdateTask updateTask;
  final DeleteTask deleteTask;
  final TaskEventStream taskEventStream;

  String? _currentProjectId;
  StreamSubscription<TaskEntity>? _createdSubscription;
  StreamSubscription<TaskEntity>? _updatedSubscription;
  StreamSubscription<String>? _deletedSubscription;

  TaskBloc({
    required this.getTasksByProject,
    required this.createTask,
    required this.updateTask,
    required this.deleteTask,
    required this.taskEventStream,
  }) : super(TaskInitial()) {
    on<LoadTasks>(_onLoadTasks);
    on<AddTask>(_onAddTask);
    on<EditTask>(_onEditTask);
    on<RemoveTask>(_onRemoveTask);
    on<ChangeTaskStatus>(_onChangeTaskStatus);
    on<TaskCreatedFromSocket>(_onTaskCreatedFromSocket);
    on<TaskUpdatedFromSocket>(_onTaskUpdatedFromSocket);
    on<TaskDeletedFromSocket>(_onTaskDeletedFromSocket);
    
    _initEventStreams();
  }

  void _initEventStreams() {
    _createdSubscription = taskEventStream.onTaskCreated.listen((task) {
      if (task.projectId == _currentProjectId) {
        add(TaskCreatedFromSocket(task));
      }
    });

    _updatedSubscription = taskEventStream.onTaskUpdated.listen((task) {
      add(TaskUpdatedFromSocket(task));
    });

    _deletedSubscription = taskEventStream.onTaskDeleted.listen((taskId) {
      add(TaskDeletedFromSocket(taskId));
    });
  }

  Future<void> _onLoadTasks(LoadTasks event, Emitter<TaskState> emit) async {
    _currentProjectId = event.projectId;
    emit(TaskLoading());
    final result = await getTasksByProject(event.projectId);
    result.fold(
      (failure) => emit(TaskError(failure)),
      (paginatedResult) => emit(TaskLoaded(paginatedResult.data)),
    );
  }

  Future<void> _onAddTask(AddTask event, Emitter<TaskState> emit) async {
    emit(TaskLoading());
    final result = await createTask(
      title: event.title,
      projectId: event.projectId,
      description: event.description,
      status: event.status,
      priority: event.priority,
      dueDate: event.dueDate,
    );
    result.fold(
      (failure) => emit(TaskError(failure)),
      (_) {
        if (_currentProjectId != null) {
          add(LoadTasks(_currentProjectId!));
        }
      },
    );
  }

  Future<void> _onEditTask(EditTask event, Emitter<TaskState> emit) async {
    emit(TaskLoading());
    final result = await updateTask(
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      priority: event.priority,
      dueDate: event.dueDate,
    );
    result.fold(
      (failure) => emit(TaskError(failure)),
      (_) {
        if (_currentProjectId != null) {
          add(LoadTasks(_currentProjectId!));
        }
      },
    );
  }

  Future<void> _onRemoveTask(RemoveTask event, Emitter<TaskState> emit) async {
    emit(TaskLoading());
    final result = await deleteTask(event.id);
    result.fold(
      (failure) => emit(TaskError(failure)),
      (_) {
        if (_currentProjectId != null) {
          add(LoadTasks(_currentProjectId!));
        }
      },
    );
  }

  Future<void> _onChangeTaskStatus(ChangeTaskStatus event, Emitter<TaskState> emit) async {
    final result = await updateTask(id: event.id, status: event.status);
    result.fold(
      (failure) => emit(TaskError(failure)),
      (_) {
        if (_currentProjectId != null) {
          add(LoadTasks(_currentProjectId!));
        }
      },
    );
  }

  void _onTaskCreatedFromSocket(TaskCreatedFromSocket event, Emitter<TaskState> emit) {
    final currentState = state;
    if (currentState is TaskLoaded) {
      final exists = currentState.tasks.any((t) => t.id == event.task.id);
      if (!exists) {
        emit(TaskLoaded([event.task, ...currentState.tasks]));
      }
    }
  }

  void _onTaskUpdatedFromSocket(TaskUpdatedFromSocket event, Emitter<TaskState> emit) {
    final currentState = state;
    if (currentState is TaskLoaded) {
      final updatedTasks = currentState.tasks.map((t) {
        return t.id == event.task.id ? event.task : t;
      }).toList();
      emit(TaskLoaded(updatedTasks));
    }
  }

  void _onTaskDeletedFromSocket(TaskDeletedFromSocket event, Emitter<TaskState> emit) {
    final currentState = state;
    if (currentState is TaskLoaded) {
      final filteredTasks = currentState.tasks.where((t) => t.id != event.taskId).toList();
      emit(TaskLoaded(filteredTasks));
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
