import 'package:equatable/equatable.dart';

enum Role { admin, user }

class UserEntity extends Equatable {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final Role role;

  const UserEntity({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
  });

  String get fullName => '$firstName $lastName';

  bool get isAdmin => role == Role.admin;

  bool canPerform(String resource, String action) {
    return RolePermissions.canPerform(role, resource, action);
  }

  @override
  List<Object?> get props => [id, email, firstName, lastName, role];
}

class RolePermissions {
  static const Map<Role, Map<String, Map<String, bool>>> _permissions = {
    Role.admin: {
      'projects': {'viewAll': true, 'create': true, 'editAny': true, 'deleteAny': true},
      'tasks': {'viewAll': true, 'create': true, 'editAny': true, 'deleteAny': true},
      'users': {'viewAll': true, 'create': true, 'edit': true, 'delete': true},
    },
    Role.user: {
      'projects': {'viewAll': false, 'create': true, 'editAny': false, 'deleteAny': false},
      'tasks': {'viewAll': false, 'create': true, 'editAny': false, 'deleteAny': false},
      'users': {'viewAll': false, 'create': false, 'edit': false, 'delete': false},
    },
  };

  static bool canPerform(Role role, String resource, String action) {
    return _permissions[role]?[resource]?[action] ?? false;
  }
}
