import 'package:dartz/dartz.dart';
import '../entities/project.dart';
import '../repositories/project_repository.dart';

class UpdateProject {
  final ProjectRepository repository;

  UpdateProject(this.repository);

  Future<Either<String, Project>> call({
    required String id,
    String? name,
    String? description,
    bool? isActive,
  }) async {
    return await repository.updateProject(
      id: id,
      name: name,
      description: description,
      isActive: isActive,
    );
  }
}
