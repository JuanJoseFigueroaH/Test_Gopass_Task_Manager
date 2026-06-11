import 'package:dartz/dartz.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class CreateTask {
  final TaskRepository repository;

  CreateTask(this.repository);

  Future<Either<String, TaskEntity>> call({
    required String title,
    required String projectId,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    return await repository.createTask(
      title: title,
      projectId: projectId,
      description: description,
      status: status,
      priority: priority,
      dueDate: dueDate,
    );
  }
}
