import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/di/injection.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/auth/presentation/pages/register_page.dart';
import 'features/project/presentation/bloc/project_bloc.dart';
import 'features/project/presentation/pages/projects_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureDependencies();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<AuthBloc>()..add(AuthCheckRequested())),
        BlocProvider(create: (_) => getIt<ProjectBloc>()),
      ],
      child: MaterialApp(
        title: 'GoPass Task Manager',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _showRegister = false;

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthRegistrationSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Registro exitoso. Por favor inicia sesión.'),
              backgroundColor: Color(0xFF22C55E),
            ),
          );
          setState(() => _showRegister = false);
        }
      },
      builder: (context, state) {
        if (state is AuthAuthenticated) {
          context.read<ProjectBloc>().add(LoadProjects());
          return const ProjectsPage();
        }
        if (state is AuthLoading || state is AuthInitial) {
          return const Scaffold(
            backgroundColor: Color(0xFF0A0A0A),
            body: Center(
              child: CircularProgressIndicator(color: Color(0xFF22C55E)),
            ),
          );
        }
        if (_showRegister) {
          return RegisterPage(
            onLoginClick: () => setState(() => _showRegister = false),
          );
        }
        return LoginPage(
          onRegisterClick: () => setState(() => _showRegister = true),
        );
      },
    );
  }
}
