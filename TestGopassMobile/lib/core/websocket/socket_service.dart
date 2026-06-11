import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  final Map<String, List<Function(dynamic)>> _listeners = {};

  String get _baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000';
    }
    return 'http://10.0.2.2:3000';
  }

  void connect() {
    if (_socket?.connected == true) return;

    _socket = IO.io(_baseUrl, <String, dynamic>{
      'transports': ['websocket', 'polling'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) {
      print('WebSocket connected');
    });

    _socket!.onDisconnect((_) {
      print('WebSocket disconnected');
    });

    _socket!.on('project:created', (data) => _emit('project:created', data));
    _socket!.on('project:updated', (data) => _emit('project:updated', data));
    _socket!.on('project:deleted', (data) => _emit('project:deleted', data));
    _socket!.on('task:created', (data) => _emit('task:created', data));
    _socket!.on('task:updated', (data) => _emit('task:updated', data));
    _socket!.on('task:deleted', (data) => _emit('task:deleted', data));
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  void _emit(String event, dynamic data) {
    final eventListeners = _listeners[event];
    if (eventListeners != null) {
      for (final callback in eventListeners) {
        callback(data);
      }
    }
  }

  void on(String event, Function(dynamic) callback) {
    _listeners[event] ??= [];
    _listeners[event]!.add(callback);
  }

  void off(String event, Function(dynamic) callback) {
    _listeners[event]?.remove(callback);
  }
}

final socketService = SocketService();
