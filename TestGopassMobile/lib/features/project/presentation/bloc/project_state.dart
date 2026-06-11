part of 'project_bloc.dart';

abstract class ProjectState extends Equatable {
  const ProjectState();

  @override
  List<Object?> get props => [];
}

class ProjectInitial extends ProjectState {}

class ProjectLoading extends ProjectState {}

class ProjectLoaded extends ProjectState {
  final List<Project> projects;

  const ProjectLoaded(this.projects);

  @override
  List<Object?> get props => [projects];
}

class ProjectError extends ProjectState {
  final String message;

  const ProjectError(this.message);

  @override
  List<Object?> get props => [message];
}

class ProjectOperationSuccess extends ProjectState {
  final String message;
  final List<Project> projects;

  const ProjectOperationSuccess({required this.message, required this.projects});

  @override
  List<Object?> get props => [message, projects];
}
