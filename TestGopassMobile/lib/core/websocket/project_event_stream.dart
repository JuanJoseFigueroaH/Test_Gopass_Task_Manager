import 'dart:async';
import '../../features/project/domain/entities/project.dart';
import '../../features/project/data/models/project_model.dart';
import 'socket_service.dart';

class ProjectEventStream {
  final SocketService _socketService;
  
  final _projectCreatedController = StreamController<Project>.broadcast();
  final _projectUpdatedController = StreamController<Project>.broadcast();
  final _projectDeletedController = StreamController<String>.broadcast();

  ProjectEventStream(this._socketService) {
    _initListeners();
  }

  void _initListeners() {
    _socketService.on('project:created', (data) {
      final project = ProjectModel.fromJson(data);
      _projectCreatedController.add(project);
    });

    _socketService.on('project:updated', (data) {
      final project = ProjectModel.fromJson(data);
      _projectUpdatedController.add(project);
    });

    _socketService.on('project:deleted', (data) {
      final projectId = data['id'] as String;
      _projectDeletedController.add(projectId);
    });
  }

  Stream<Project> get onProjectCreated => _projectCreatedController.stream;
  Stream<Project> get onProjectUpdated => _projectUpdatedController.stream;
  Stream<String> get onProjectDeleted => _projectDeletedController.stream;

  void dispose() {
    _projectCreatedController.close();
    _projectUpdatedController.close();
    _projectDeletedController.close();
  }
}
