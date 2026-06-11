import 'package:dartz/dartz.dart';
import '../repositories/task_repository.dart';

class DeleteTask {
  final TaskRepository repository;

  DeleteTask(this.repository);

  Future<Either<String, bool>> call(String id) async {
    return await repository.deleteTask(id);
  }
}
