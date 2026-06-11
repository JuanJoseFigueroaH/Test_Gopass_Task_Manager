part of 'project_bloc.dart';

abstract class ProjectEvent extends Equatable {
  const ProjectEvent();

  @override
  List<Object?> get props => [];
}

class LoadProjects extends ProjectEvent {}

class AddProject extends ProjectEvent {
  final String name;
  final String? description;

  const AddProject({required this.name, this.description});

  @override
  List<Object?> get props => [name, description];
}

class EditProject extends ProjectEvent {
  final String id;
  final String? name;
  final String? description;
  final bool? isActive;

  const EditProject({
    required this.id,
    this.name,
    this.description,
    this.isActive,
  });

  @override
  List<Object?> get props => [id, name, description, isActive];
}

class RemoveProject extends ProjectEvent {
  final String id;

  const RemoveProject(this.id);

  @override
  List<Object?> get props => [id];
}

class ProjectCreatedFromSocket extends ProjectEvent {
  final Project project;

  const ProjectCreatedFromSocket(this.project);

  @override
  List<Object?> get props => [project];
}

class ProjectUpdatedFromSocket extends ProjectEvent {
  final Project project;

  const ProjectUpdatedFromSocket(this.project);

  @override
  List<Object?> get props => [project];
}

class ProjectDeletedFromSocket extends ProjectEvent {
  final String projectId;

  const ProjectDeletedFromSocket(this.projectId);

  @override
  List<Object?> get props => [projectId];
}
