import 'package:dartz/dartz.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class UpdateTask {
  final TaskRepository repository;

  UpdateTask(this.repository);

  Future<Either<String, TaskEntity>> call({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    return await repository.updateTask(
      id: id,
      title: title,
      description: description,
      status: status,
      priority: priority,
      dueDate: dueDate,
    );
  }
}
