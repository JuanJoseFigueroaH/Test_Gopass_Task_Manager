import '../../domain/entities/task.dart';

class TaskModel extends TaskEntity {
  const TaskModel({
    required super.id,
    required super.title,
    super.description,
    required super.status,
    required super.priority,
    super.dueDate,
    required super.projectId,
    required super.createdAt,
    required super.updatedAt,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString(),
      status: _parseStatus(json['status']?.toString() ?? 'PENDING'),
      priority: _parsePriority(json['priority']?.toString() ?? 'MEDIUM'),
      dueDate: json['dueDate'] != null ? DateTime.tryParse(json['dueDate'].toString()) : null,
      projectId: json['projectId']?.toString() ?? '',
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }

  static TaskStatus _parseStatus(String status) {
    switch (status) {
      case 'PENDING':
        return TaskStatus.pending;
      case 'IN_PROGRESS':
        return TaskStatus.inProgress;
      case 'COMPLETED':
        return TaskStatus.completed;
      case 'CANCELLED':
        return TaskStatus.cancelled;
      default:
        return TaskStatus.pending;
    }
  }

  static TaskPriority _parsePriority(String priority) {
    switch (priority) {
      case 'LOW':
        return TaskPriority.low;
      case 'MEDIUM':
        return TaskPriority.medium;
      case 'HIGH':
        return TaskPriority.high;
      case 'URGENT':
        return TaskPriority.urgent;
      default:
        return TaskPriority.medium;
    }
  }

  static String statusToString(TaskStatus status) {
    switch (status) {
      case TaskStatus.pending:
        return 'PENDING';
      case TaskStatus.inProgress:
        return 'IN_PROGRESS';
      case TaskStatus.completed:
        return 'COMPLETED';
      case TaskStatus.cancelled:
        return 'CANCELLED';
    }
  }

  static String priorityToString(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.low:
        return 'LOW';
      case TaskPriority.medium:
        return 'MEDIUM';
      case TaskPriority.high:
        return 'HIGH';
      case TaskPriority.urgent:
        return 'URGENT';
    }
  }
}
