import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/di/injection.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../project/domain/entities/project.dart';
import '../../domain/entities/task.dart';
import '../bloc/task_bloc.dart';
import '../widgets/task_card.dart';
import '../widgets/task_form_dialog.dart';

class TasksPage extends StatelessWidget {
  final Project project;

  const TasksPage({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<TaskBloc>()..add(LoadTasks(project.id)),
      child: Scaffold(
        appBar: AppBar(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(project.name, style: const TextStyle(fontSize: 18)),
              if (project.description != null)
                Text(
                  project.description!,
                  style: const TextStyle(fontSize: 12, color: AppColors.grey),
                ),
            ],
          ),
        ),
        body: BlocBuilder<TaskBloc, TaskState>(
          builder: (context, state) {
            if (state is TaskLoading) {
              return const Center(
                child: CircularProgressIndicator(color: AppColors.greenPrimary),
              );
            }
            if (state is TaskError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                    const SizedBox(height: 16),
                    Text(state.message, style: const TextStyle(color: AppColors.grey)),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => context.read<TaskBloc>().add(LoadTasks(project.id)),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            if (state is TaskLoaded) {
              if (state.tasks.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.task_alt, size: 64, color: AppColors.grey),
                      const SizedBox(height: 16),
                      const Text('No tasks yet', style: TextStyle(color: AppColors.grey, fontSize: 18)),
                      const SizedBox(height: 8),
                      const Text('Create your first task!', style: TextStyle(color: AppColors.grey)),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () => _showCreateDialog(context),
                        icon: const Icon(Icons.add),
                        label: const Text('Create Task'),
                      ),
                    ],
                  ),
                );
              }
              return RefreshIndicator(
                onRefresh: () async {
                  context.read<TaskBloc>().add(LoadTasks(project.id));
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: state.tasks.length,
                  itemBuilder: (context, index) {
                    final task = state.tasks[index];
                    return TaskCard(
                      task: task,
                      onStatusToggle: () => _toggleStatus(context, task),
                      onEdit: () => _showEditDialog(context, task),
                      onDelete: () => _showDeleteDialog(context, task),
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
      ),
    );
  }

  void _toggleStatus(BuildContext context, TaskEntity task) {
    final newStatus = task.status == TaskStatus.completed
        ? TaskStatus.pending
        : TaskStatus.completed;
    context.read<TaskBloc>().add(ChangeTaskStatus(id: task.id, status: newStatus));
  }

  void _showCreateDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => BlocProvider.value(
        value: context.read<TaskBloc>(),
        child: TaskFormDialog(
          projectId: project.id,
          onSubmit: (title, description, status, priority, dueDate) {
            context.read<TaskBloc>().add(AddTask(
              title: title,
              projectId: project.id,
              description: description,
              status: status,
              priority: priority,
              dueDate: dueDate,
            ));
          },
        ),
      ),
    );
  }

  void _showEditDialog(BuildContext context, TaskEntity task) {
    showDialog(
      context: context,
      builder: (_) => BlocProvider.value(
        value: context.read<TaskBloc>(),
        child: TaskFormDialog(
          task: task,
          projectId: project.id,
          onSubmit: (title, description, status, priority, dueDate) {
            context.read<TaskBloc>().add(EditTask(
              id: task.id,
              title: title,
              description: description,
              status: status,
              priority: priority,
              dueDate: dueDate,
            ));
          },
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, TaskEntity task) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Task'),
        content: Text('Are you sure you want to delete "${task.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              context.read<TaskBloc>().add(RemoveTask(task.id));
              Navigator.pop(context);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
