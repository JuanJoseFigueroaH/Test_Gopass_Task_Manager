import 'package:dartz/dartz.dart';
import '../../domain/entities/project.dart';
import '../../domain/repositories/project_repository.dart';
import '../datasources/project_remote_datasource.dart';

class ProjectRepositoryImpl implements ProjectRepository {
  final ProjectRemoteDataSource remoteDataSource;

  ProjectRepositoryImpl(this.remoteDataSource);

  @override
  Future<Either<String, List<Project>>> getProjects() async {
    final result = await remoteDataSource.getProjects();
    return result.fold(
      (failure) => Left(failure.message),
      (projects) => Right(projects),
    );
  }

  @override
  Future<Either<String, Project>> getProjectById(String id) async {
    final result = await remoteDataSource.getProjectById(id);
    return result.fold(
      (failure) => Left(failure.message),
      (project) => Right(project),
    );
  }

  @override
  Future<Either<String, Project>> createProject({
    required String name,
    String? description,
  }) async {
    final result = await remoteDataSource.createProject(
      name: name,
      description: description,
    );
    return result.fold(
      (failure) => Left(failure.message),
      (project) => Right(project),
    );
  }

  @override
  Future<Either<String, Project>> updateProject({
    required String id,
    String? name,
    String? description,
    bool? isActive,
  }) async {
    final result = await remoteDataSource.updateProject(
      id: id,
      name: name,
      description: description,
      isActive: isActive,
    );
    return result.fold(
      (failure) => Left(failure.message),
      (project) => Right(project),
    );
  }

  @override
  Future<Either<String, bool>> deleteProject(String id) async {
    final result = await remoteDataSource.deleteProject(id);
    return result.fold(
      (failure) => Left(failure.message),
      (success) => Right(success),
    );
  }
}
