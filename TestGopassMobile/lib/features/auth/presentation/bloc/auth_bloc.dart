import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../../domain/entities/user.dart';
import '../../data/models/user_model.dart';
import '../../data/datasources/auth_remote_datasource.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthRegisterRequested extends AuthEvent {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  const AuthRegisterRequested({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });

  @override
  List<Object?> get props => [email, password, firstName, lastName];
}

class AuthLogoutRequested extends AuthEvent {}

class AuthCheckRequested extends AuthEvent {}

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final UserEntity user;
  final String token;

  const AuthAuthenticated({required this.user, required this.token});

  bool get isAdmin => user.role == Role.admin;

  bool canPerform(String resource, String action) {
    return user.canPerform(resource, action);
  }

  @override
  List<Object?> get props => [user, token];
}

class AuthUnauthenticated extends AuthState {}

class AuthRegistrationSuccess extends AuthState {}

class AuthError extends AuthState {
  final String message;

  const AuthError(this.message);

  @override
  List<Object?> get props => [message];
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRemoteDataSource _authDataSource;
  final SharedPreferences _prefs;

  AuthBloc({
    required AuthRemoteDataSource authDataSource,
    required SharedPreferences prefs,
  })  : _authDataSource = authDataSource,
        _prefs = prefs,
        super(AuthInitial()) {
    on<AuthLoginRequested>(_onLoginRequested);
    on<AuthRegisterRequested>(_onRegisterRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthCheckRequested>(_onCheckRequested);
  }

  String _extractErrorMessage(dynamic error) {
    if (error is DioException) {
      final responseData = error.response?.data;
      if (responseData is Map<String, dynamic>) {
        return responseData['message'] ?? 'Error de conexión';
      }
      return error.message ?? 'Error de conexión';
    }
    return error.toString();
  }

  Future<void> _onLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await _authDataSource.login(
        LoginCredentials(email: event.email, password: event.password),
      );
      await _prefs.setString('token', response.accessToken);
      emit(AuthAuthenticated(user: response.user, token: response.accessToken));
    } catch (e) {
      emit(AuthError(_extractErrorMessage(e)));
    }
  }

  Future<void> _onRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      await _authDataSource.register(
        RegisterData(
          email: event.email,
          password: event.password,
          firstName: event.firstName,
          lastName: event.lastName,
        ),
      );
      emit(AuthRegistrationSuccess());
    } catch (e) {
      emit(AuthError(_extractErrorMessage(e)));
    }
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _prefs.remove('token');
    emit(AuthUnauthenticated());
  }

  Future<void> _onCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    final token = _prefs.getString('token');
    if (token == null) {
      emit(AuthUnauthenticated());
      return;
    }

    try {
      final user = await _authDataSource.getCurrentUser();
      emit(AuthAuthenticated(user: user, token: token));
    } catch (e) {
      await _prefs.remove('token');
      emit(AuthUnauthenticated());
    }
  }
}
