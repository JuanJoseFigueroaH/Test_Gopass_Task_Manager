part of 'task_bloc.dart';

abstract class TaskEvent extends Equatable {
  const TaskEvent();

  @override
  List<Object?> get props => [];
}

class LoadTasks extends TaskEvent {
  final String projectId;

  const LoadTasks(this.projectId);

  @override
  List<Object?> get props => [projectId];
}

class AddTask extends TaskEvent {
  final String title;
  final String projectId;
  final String? description;
  final TaskStatus? status;
  final TaskPriority? priority;
  final DateTime? dueDate;

  const AddTask({
    required this.title,
    required this.projectId,
    this.description,
    this.status,
    this.priority,
    this.dueDate,
  });

  @override
  List<Object?> get props => [title, projectId, description, status, priority, dueDate];
}

class EditTask extends TaskEvent {
  final String id;
  final String? title;
  final String? description;
  final TaskStatus? status;
  final TaskPriority? priority;
  final DateTime? dueDate;

  const EditTask({
    required this.id,
    this.title,
    this.description,
    this.status,
    this.priority,
    this.dueDate,
  });

  @override
  List<Object?> get props => [id, title, description, status, priority, dueDate];
}

class RemoveTask extends TaskEvent {
  final String id;

  const RemoveTask(this.id);

  @override
  List<Object?> get props => [id];
}

class ChangeTaskStatus extends TaskEvent {
  final String id;
  final TaskStatus status;

  const ChangeTaskStatus({required this.id, required this.status});

  @override
  List<Object?> get props => [id, status];
}

class TaskCreatedFromSocket extends TaskEvent {
  final TaskEntity task;

  const TaskCreatedFromSocket(this.task);

  @override
  List<Object?> get props => [task];
}

class TaskUpdatedFromSocket extends TaskEvent {
  final TaskEntity task;

  const TaskUpdatedFromSocket(this.task);

  @override
  List<Object?> get props => [task];
}

class TaskDeletedFromSocket extends TaskEvent {
  final String taskId;

  const TaskDeletedFromSocket(this.taskId);

  @override
  List<Object?> get props => [taskId];
}
