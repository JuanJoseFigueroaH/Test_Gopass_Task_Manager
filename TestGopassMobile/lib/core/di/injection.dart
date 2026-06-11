import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/project/data/datasources/project_remote_datasource.dart';
import '../../features/project/data/repositories/project_repository_impl.dart';
import '../../features/project/domain/repositories/project_repository.dart';
import '../../features/project/domain/usecases/get_projects.dart';
import '../../features/project/domain/usecases/create_project.dart';
import '../../features/project/domain/usecases/update_project.dart';
import '../../features/project/domain/usecases/delete_project.dart';
import '../../features/project/presentation/bloc/project_bloc.dart';
import '../../features/task/data/datasources/task_remote_datasource.dart';
import '../../features/task/data/repositories/task_repository_impl.dart';
import '../../features/task/domain/repositories/task_repository.dart';
import '../../features/task/domain/usecases/get_tasks_by_project.dart';
import '../../features/task/domain/usecases/create_task.dart';
import '../../features/task/domain/usecases/update_task.dart';
import '../../features/task/domain/usecases/delete_task.dart';
import '../../features/task/presentation/bloc/task_bloc.dart';
import '../websocket/socket_service.dart';
import '../websocket/task_event_stream.dart';
import '../websocket/project_event_stream.dart';

final getIt = GetIt.instance;

String _getBaseUrl() {
  if (kIsWeb) {
    return 'http://localhost:3000/api/v1';
  }
  return 'http://10.0.2.2:3000/api/v1';
}

Future<void> configureDependencies() async {
  final prefs = await SharedPreferences.getInstance();
  getIt.registerSingleton<SharedPreferences>(prefs);

  final dio = Dio(BaseOptions(
    baseUrl: _getBaseUrl(),
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      final token = prefs.getString('token');
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      return handler.next(options);
    },
  ));

  getIt.registerLazySingleton<Dio>(() => dio);

  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(getIt<Dio>()),
  );
  getIt.registerFactory(() => AuthBloc(
    authDataSource: getIt<AuthRemoteDataSource>(),
    prefs: getIt<SharedPreferences>(),
  ));

  getIt.registerLazySingleton<SocketService>(() => SocketService());
  getIt.registerLazySingleton<TaskEventStream>(
    () => TaskEventStream(getIt<SocketService>()),
  );
  getIt.registerLazySingleton<ProjectEventStream>(
    () => ProjectEventStream(getIt<SocketService>()),
  );

  getIt.registerLazySingleton<ProjectRemoteDataSource>(
    () => ProjectRemoteDataSourceImpl(getIt<Dio>()),
  );

  getIt.registerLazySingleton<ProjectRepository>(
    () => ProjectRepositoryImpl(getIt<ProjectRemoteDataSource>()),
  );

  getIt.registerLazySingleton(() => GetProjects(getIt<ProjectRepository>()));
  getIt.registerLazySingleton(() => CreateProject(getIt<ProjectRepository>()));
  getIt.registerLazySingleton(() => UpdateProject(getIt<ProjectRepository>()));
  getIt.registerLazySingleton(() => DeleteProject(getIt<ProjectRepository>()));

  getIt.registerFactory(() => ProjectBloc(
    getProjects: getIt<GetProjects>(),
    createProject: getIt<CreateProject>(),
    updateProject: getIt<UpdateProject>(),
    deleteProject: getIt<DeleteProject>(),
    projectEventStream: getIt<ProjectEventStream>(),
    socketService: getIt<SocketService>(),
  ));

  getIt.registerLazySingleton<TaskRemoteDataSource>(
    () => TaskRemoteDataSourceImpl(getIt<Dio>()),
  );

  getIt.registerLazySingleton<TaskRepository>(
    () => TaskRepositoryImpl(getIt<TaskRemoteDataSource>()),
  );

  getIt.registerLazySingleton(() => GetTasksByProject(getIt<TaskRepository>()));
  getIt.registerLazySingleton(() => CreateTask(getIt<TaskRepository>()));
  getIt.registerLazySingleton(() => UpdateTask(getIt<TaskRepository>()));
  getIt.registerLazySingleton(() => DeleteTask(getIt<TaskRepository>()));

  getIt.registerFactory(() => TaskBloc(
    getTasksByProject: getIt<GetTasksByProject>(),
    createTask: getIt<CreateTask>(),
    updateTask: getIt<UpdateTask>(),
    deleteTask: getIt<DeleteTask>(),
    taskEventStream: getIt<TaskEventStream>(),
  ));
}
