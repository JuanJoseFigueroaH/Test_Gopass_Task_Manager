import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/project.dart';
import '../bloc/project_bloc.dart';
import '../widgets/project_card.dart';
import '../widgets/project_form_dialog.dart';
import '../../../task/presentation/pages/tasks_page.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';

class ProjectsPage extends StatelessWidget {
  const ProjectsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.greenPrimary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.dashboard, size: 24),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('GoPass', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text('Task Manager', style: TextStyle(fontSize: 12, color: AppColors.greenPrimary)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => _showLogoutDialog(context),
            icon: const Icon(Icons.logout),
            tooltip: 'Salir',
          ),
        ],
      ),
      body: BlocConsumer<ProjectBloc, ProjectState>(
        listener: (context, state) {
          if (state is ProjectOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: AppColors.greenPrimary,
                duration: const Duration(seconds: 2),
              ),
            );
          }
          if (state is ProjectError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: AppColors.error,
                duration: const Duration(seconds: 3),
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is ProjectLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.greenPrimary),
            );
          }
          if (state is ProjectError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                  const SizedBox(height: 16),
                  Text(state.message, style: const TextStyle(color: AppColors.grey)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.read<ProjectBloc>().add(LoadProjects()),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }
          if (state is ProjectLoaded || state is ProjectOperationSuccess) {
            final projects = state is ProjectLoaded 
                ? state.projects 
                : (state as ProjectOperationSuccess).projects;
            if (projects.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.folder_off, size: 64, color: AppColors.grey),
                    const SizedBox(height: 16),
                    const Text('No projects yet', style: TextStyle(color: AppColors.grey, fontSize: 18)),
                    const SizedBox(height: 8),
                    const Text('Create your first project!', style: TextStyle(color: AppColors.grey)),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => _showCreateDialog(context),
                      icon: const Icon(Icons.add),
                      label: const Text('Create Project'),
                    ),
                  ],
                ),
              );
            }
            return RefreshIndicator(
              onRefresh: () async {
                context.read<ProjectBloc>().add(LoadProjects());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: projects.length,
                itemBuilder: (context, index) {
                  final project = projects[index];
                  return ProjectCard(
                    project: project,
                    onTap: () => _navigateToTasks(context, project),
                    onEdit: () => _showEditDialog(context, project),
                    onDelete: () => _showDeleteDialog(context, project),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _navigateToTasks(BuildContext context, Project project) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => TasksPage(project: project)),
    );
  }

  void _showCreateDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => ProjectFormDialog(
        onSubmit: (name, description) {
          context.read<ProjectBloc>().add(AddProject(name: name, description: description));
        },
      ),
    );
  }

  void _showEditDialog(BuildContext context, Project project) {
    showDialog(
      context: context,
      builder: (_) => ProjectFormDialog(
        project: project,
        onSubmit: (name, description) {
          context.read<ProjectBloc>().add(EditProject(
            id: project.id,
            name: name,
            description: description,
          ));
        },
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, Project project) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Project'),
        content: Text('Are you sure you want to delete "${project.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              context.read<ProjectBloc>().add(RemoveProject(project.id));
              Navigator.pop(context);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Cerrar Sesión'),
        content: const Text('¿Estás seguro que deseas salir de la aplicación?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              Navigator.pop(context);
              context.read<AuthBloc>().add(AuthLogoutRequested());
            },
            child: const Text('Salir'),
          ),
        ],
      ),
    );
  }
}
