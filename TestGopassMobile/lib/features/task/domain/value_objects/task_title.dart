import 'package:equatable/equatable.dart';

class TaskTitle extends Equatable {
  static const int minLength = 3;
  static const int maxLength = 255;

  final String value;

  const TaskTitle._(this.value);

  factory TaskTitle.create(String title) {
    final trimmed = title.trim();
    
    if (trimmed.isEmpty) {
      throw ArgumentError('Task title cannot be empty');
    }
    
    if (trimmed.length < minLength) {
      throw ArgumentError('Task title must be at least $minLength characters long');
    }
    
    if (trimmed.length > maxLength) {
      throw ArgumentError('Task title cannot exceed $maxLength characters');
    }
    
    return TaskTitle._(trimmed);
  }

  factory TaskTitle.fromString(String title) {
    return TaskTitle._(title);
  }

  @override
  List<Object?> get props => [value];

  @override
  String toString() => value;
}
