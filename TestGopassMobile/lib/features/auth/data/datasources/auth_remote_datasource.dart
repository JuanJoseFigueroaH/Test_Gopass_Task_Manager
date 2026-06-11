import 'package:dio/dio.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<AuthResponse> login(LoginCredentials credentials);
  Future<AuthResponse> register(RegisterData data);
  Future<UserModel> getCurrentUser();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl(this.dio);

  @override
  Future<AuthResponse> login(LoginCredentials credentials) async {
    final response = await dio.post('/auth/login', data: credentials.toJson());
    final responseData = response.data['data'] ?? response.data;
    return AuthResponse.fromJson(responseData);
  }

  @override
  Future<AuthResponse> register(RegisterData data) async {
    final response = await dio.post('/auth/register', data: data.toJson());
    final responseData = response.data['data'] ?? response.data;
    return AuthResponse.fromJson(responseData);
  }

  @override
  Future<UserModel> getCurrentUser() async {
    final response = await dio.get('/auth/me');
    final responseData = response.data['data'] ?? response.data;
    return UserModel.fromJson(responseData);
  }
}
