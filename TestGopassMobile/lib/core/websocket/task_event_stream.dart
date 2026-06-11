import 'dart:async';
import '../../features/task/domain/entities/task.dart';
import '../../features/task/data/models/task_model.dart';
import 'socket_service.dart';

class TaskEventStream {
  final SocketService _socketService;
  
  final _taskCreatedController = StreamController<TaskEntity>.broadcast();
  final _taskUpdatedController = StreamController<TaskEntity>.broadcast();
  final _taskDeletedController = StreamController<String>.broadcast();

  TaskEventStream(this._socketService) {
    _initListeners();
  }

  void _initListeners() {
    _socketService.on('task:created', (data) {
      final task = TaskModel.fromJson(data);
      _taskCreatedController.add(task);
    });

    _socketService.on('task:updated', (data) {
      final task = TaskModel.fromJson(data);
      _taskUpdatedController.add(task);
    });

    _socketService.on('task:deleted', (data) {
      final taskId = data['id'] as String;
      _taskDeletedController.add(taskId);
    });
  }

  Stream<TaskEntity> get onTaskCreated => _taskCreatedController.stream;
  Stream<TaskEntity> get onTaskUpdated => _taskUpdatedController.stream;
  Stream<String> get onTaskDeleted => _taskDeletedController.stream;

  void dispose() {
    _taskCreatedController.close();
    _taskUpdatedController.close();
    _taskDeletedController.close();
  }
}
