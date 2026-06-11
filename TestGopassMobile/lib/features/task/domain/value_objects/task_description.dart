import 'package:equatable/equatable.dart';

class TaskDescription extends Equatable {
  static const int maxLength = 1000;

  final String? value;

  const TaskDescription._(this.value);

  factory TaskDescription.create(String? description) {
    if (description == null || description.trim().isEmpty) {
      return const TaskDescription._(null);
    }
    
    final trimmed = description.trim();
    
    if (trimmed.length > maxLength) {
      throw ArgumentError('Task description cannot exceed $maxLength characters');
    }
    
    return TaskDescription._(trimmed);
  }

  factory TaskDescription.fromString(String? description) {
    return TaskDescription._(description);
  }

  bool get isEmpty => value == null || value!.isEmpty;

  @override
  List<Object?> get props => [value];

  @override
  String toString() => value ?? '';
}
