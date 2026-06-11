import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../models/project_model.dart';
import '../../../../core/error/failures.dart';

abstract class ProjectRemoteDataSource {
  Future<Either<Failure, List<ProjectModel>>> getProjects();
  Future<Either<Failure, ProjectModel>> getProjectById(String id);
  Future<Either<Failure, ProjectModel>> createProject({required String name, String? description});
  Future<Either<Failure, ProjectModel>> updateProject({required String id, String? name, String? description, bool? isActive});
  Future<Either<Failure, bool>> deleteProject(String id);
}

class ProjectRemoteDataSourceImpl implements ProjectRemoteDataSource {
  final Dio dio;

  ProjectRemoteDataSourceImpl(this.dio);

  @override
  Future<Either<Failure, List<ProjectModel>>> getProjects() async {
    try {
      final response = await dio.get('/projects');
      final responseData = response.data['data'];
      final List<dynamic> data = responseData is List ? responseData : responseData['data'] as List;
      return Right(data.map((json) => ProjectModel.fromJson(json)).toList());
    } on DioException catch (e) {
      return Left(ServerFailure(_extractErrorMessage(e)));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ProjectModel>> getProjectById(String id) async {
    try {
      final response = await dio.get('/projects/$id');
      return Right(ProjectModel.fromJson(response.data['data']));
    } on DioException catch (e) {
      return Left(ServerFailure(_extractErrorMessage(e)));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ProjectModel>> createProject({required String name, String? description}) async {
    try {
      final response = await dio.post('/projects', data: {
        'name': name,
        'description': description,
      });
      return Right(ProjectModel.fromJson(response.data['data']));
    } on DioException catch (e) {
      return Left(ServerFailure(_extractErrorMessage(e)));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, ProjectModel>> updateProject({
    required String id,
    String? name,
    String? description,
    bool? isActive,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (name != null) data['name'] = name;
      if (description != null) data['description'] = description;
      if (isActive != null) data['isActive'] = isActive;

      final response = await dio.put('/projects/$id', data: data);
      return Right(ProjectModel.fromJson(response.data['data']));
    } on DioException catch (e) {
      return Left(ServerFailure(_extractErrorMessage(e)));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> deleteProject(String id) async {
    try {
      await dio.delete('/projects/$id');
      return const Right(true);
    } on DioException catch (e) {
      return Left(ServerFailure(_extractErrorMessage(e)));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  String _extractErrorMessage(DioException e) {
    if (e.response?.data != null && e.response?.data['message'] != null) {
      return e.response!.data['message'];
    }
    return e.message ?? 'Unknown error occurred';
  }
}
