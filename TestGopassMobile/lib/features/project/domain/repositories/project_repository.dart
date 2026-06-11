import 'package:dartz/dartz.dart';
import '../entities/project.dart';

abstract class ProjectReadRepository {
  Future<Either<String, List<Project>>> getProjects();
  Future<Either<String, Project>> getProjectById(String id);
}

abstract class ProjectWriteRepository {
  Future<Either<String, Project>> createProject({
    required String name,
    String? description,
  });
  Future<Either<String, Project>> updateProject({
    required String id,
    String? name,
    String? description,
    bool? isActive,
  });
  Future<Either<String, bool>> deleteProject(String id);
}

abstract class ProjectRepository implements ProjectReadRepository, ProjectWriteRepository {}
