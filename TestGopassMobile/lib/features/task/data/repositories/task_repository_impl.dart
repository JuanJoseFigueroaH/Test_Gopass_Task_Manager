import 'package:dartz/dartz.dart';
import '../../domain/entities/task.dart';
import '../../domain/repositories/task_repository.dart';
import '../datasources/task_remote_datasource.dart';
import '../../../../core/types/pagination.dart';

class TaskRepositoryImpl implements TaskRepository {
  final TaskRemoteDataSource remoteDataSource;

  TaskRepositoryImpl(this.remoteDataSource);

  @override
  Future<Either<String, PaginatedResult<TaskEntity>>> getTasksByProject(String projectId, {PaginationOptions? options}) async {
    try {
      final result = await remoteDataSource.getTasksByProject(projectId, options: options);
      return Right(result);
    } catch (e) {
      return Left('Failed to fetch tasks: ${e.toString()}');
    }
  }

  @override
  Future<Either<String, TaskEntity>> getTaskById(String id) async {
    try {
      final task = await remoteDataSource.getTaskById(id);
      return Right(task);
    } catch (e) {
      return Left('Failed to fetch task: ${e.toString()}');
    }
  }

  @override
  Future<Either<String, TaskEntity>> createTask({
    required String title,
    required String projectId,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    try {
      final task = await remoteDataSource.createTask(
        title: title,
        projectId: projectId,
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate,
      );
      return Right(task);
    } catch (e) {
      return Left('Failed to create task: ${e.toString()}');
    }
  }

  @override
  Future<Either<String, TaskEntity>> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    try {
      final task = await remoteDataSource.updateTask(
        id: id,
        title: title,
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate,
      );
      return Right(task);
    } catch (e) {
      return Left('Failed to update task: ${e.toString()}');
    }
  }

  @override
  Future<Either<String, bool>> deleteTask(String id) async {
    try {
      await remoteDataSource.deleteTask(id);
      return const Right(true);
    } catch (e) {
      return Left('Failed to delete task: ${e.toString()}');
    }
  }
}
