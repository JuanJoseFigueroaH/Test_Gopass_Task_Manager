import 'package:dartz/dartz.dart';
import '../../error/failures.dart';

class TaskTitle {
  static const int minLength = 3;
  static const int maxLength = 255;

  final String value;

  const TaskTitle._(this.value);

  static Either<ValidationFailure, TaskTitle> create(String title) {
    if (title.isEmpty || title.trim().isEmpty) {
      return Left(ValidationFailure('Task title cannot be empty'));
    }

    final trimmedTitle = title.trim();

    if (trimmedTitle.length < minLength) {
      return Left(
        ValidationFailure('Task title must be at least $minLength characters long'),
      );
    }

    if (trimmedTitle.length > maxLength) {
      return Left(
        ValidationFailure('Task title cannot exceed $maxLength characters'),
      );
    }

    return Right(TaskTitle._(trimmedTitle));
  }

  int get length => value.length;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TaskTitle && runtimeType == other.runtimeType && value == other.value;

  @override
  int get hashCode => value.hashCode;

  @override
  String toString() => value;
}
