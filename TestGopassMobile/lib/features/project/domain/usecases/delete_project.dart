import 'package:dartz/dartz.dart';
import '../repositories/project_repository.dart';

class DeleteProject {
  final ProjectRepository repository;

  DeleteProject(this.repository);

  Future<Either<String, bool>> call(String id) async {
    return await repository.deleteProject(id);
  }
}
