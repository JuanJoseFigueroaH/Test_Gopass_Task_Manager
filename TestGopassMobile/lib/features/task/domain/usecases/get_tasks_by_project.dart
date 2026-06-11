import 'package:dartz/dartz.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';
import '../../../../core/types/pagination.dart';

class GetTasksByProject {
  final TaskRepository repository;

  GetTasksByProject(this.repository);

  Future<Either<String, PaginatedResult<TaskEntity>>> call(String projectId, {PaginationOptions? options}) async {
    return await repository.getTasksByProject(projectId, options: options);
  }
}
