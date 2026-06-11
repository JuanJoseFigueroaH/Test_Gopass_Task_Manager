import 'package:dartz/dartz.dart';
import '../entities/task.dart';
import '../../../../core/types/pagination.dart';

abstract class TaskReadRepository {
  Future<Either<String, PaginatedResult<TaskEntity>>> getTasksByProject(String projectId, {PaginationOptions? options});
  Future<Either<String, TaskEntity>> getTaskById(String id);
}

abstract class TaskWriteRepository {
  Future<Either<String, TaskEntity>> createTask({
    required String title,
    required String projectId,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  });
  Future<Either<String, TaskEntity>> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  });
  Future<Either<String, bool>> deleteTask(String id);
}

abstract class TaskRepository implements TaskReadRepository, TaskWriteRepository {}
