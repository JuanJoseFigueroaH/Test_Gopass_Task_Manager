import 'package:dartz/dartz.dart';
import '../../error/failures.dart';

class Email {
  static final RegExp _emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');

  final String value;

  const Email._(this.value);

  static Either<ValidationFailure, Email> create(String email) {
    if (email.isEmpty || email.trim().isEmpty) {
      return Left(ValidationFailure('Email cannot be empty'));
    }

    final trimmedEmail = email.trim().toLowerCase();

    if (!_emailRegex.hasMatch(trimmedEmail)) {
      return Left(ValidationFailure('Invalid email format'));
    }

    return Right(Email._(trimmedEmail));
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Email && runtimeType == other.runtimeType && value == other.value;

  @override
  int get hashCode => value.hashCode;

  @override
  String toString() => value;
}
