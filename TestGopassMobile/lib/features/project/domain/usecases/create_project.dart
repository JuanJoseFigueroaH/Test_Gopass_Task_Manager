import 'package:dartz/dartz.dart';
import '../entities/project.dart';
import '../repositories/project_repository.dart';

class CreateProject {
  final ProjectRepository repository;

  CreateProject(this.repository);

  Future<Either<String, Project>> call({
    required String name,
    String? description,
  }) async {
    return await repository.createProject(name: name, description: description);
  }
}
