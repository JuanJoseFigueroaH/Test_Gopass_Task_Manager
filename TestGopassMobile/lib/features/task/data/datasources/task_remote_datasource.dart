import 'package:dio/dio.dart';
import '../../domain/entities/task.dart';
import '../models/task_model.dart';
import '../../../../core/types/pagination.dart';

abstract class TaskRemoteDataSource {
  Future<PaginatedResult<TaskModel>> getTasksByProject(String projectId, {PaginationOptions? options});
  Future<TaskModel> getTaskById(String id);
  Future<TaskModel> createTask({
    required String title,
    required String projectId,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  });
  Future<TaskModel> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  });
  Future<bool> deleteTask(String id);
}

class TaskRemoteDataSourceImpl implements TaskRemoteDataSource {
  final Dio dio;

  TaskRemoteDataSourceImpl(this.dio);

  @override
  Future<PaginatedResult<TaskModel>> getTasksByProject(String projectId, {PaginationOptions? options}) async {
    final queryParams = options?.toQueryParams() ?? {};
    final response = await dio.get('/tasks/project/$projectId', queryParameters: queryParams);
    final responseData = response.data['data'] as Map<String, dynamic>;
    return PaginatedResult.fromJson(responseData, (json) => TaskModel.fromJson(json));
  }

  @override
  Future<TaskModel> getTaskById(String id) async {
    final response = await dio.get('/tasks/$id');
    return TaskModel.fromJson(response.data['data']);
  }

  @override
  Future<TaskModel> createTask({
    required String title,
    required String projectId,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    final data = <String, dynamic>{
      'title': title,
      'projectId': projectId,
    };
    if (description != null) data['description'] = description;
    if (status != null) data['status'] = TaskModel.statusToString(status);
    if (priority != null) data['priority'] = TaskModel.priorityToString(priority);
    if (dueDate != null) data['dueDate'] = dueDate.toIso8601String().split('T')[0];

    final response = await dio.post('/tasks', data: data);
    return TaskModel.fromJson(response.data['data']);
  }

  @override
  Future<TaskModel> updateTask({
    required String id,
    String? title,
    String? description,
    TaskStatus? status,
    TaskPriority? priority,
    DateTime? dueDate,
  }) async {
    final data = <String, dynamic>{};
    if (title != null) data['title'] = title;
    if (description != null) data['description'] = description;
    if (status != null) data['status'] = TaskModel.statusToString(status);
    if (priority != null) data['priority'] = TaskModel.priorityToString(priority);
    if (dueDate != null) data['dueDate'] = dueDate.toIso8601String().split('T')[0];

    final response = await dio.put('/tasks/$id', data: data);
    return TaskModel.fromJson(response.data['data']);
  }

  @override
  Future<bool> deleteTask(String id) async {
    await dio.delete('/tasks/$id');
    return true;
  }
}
