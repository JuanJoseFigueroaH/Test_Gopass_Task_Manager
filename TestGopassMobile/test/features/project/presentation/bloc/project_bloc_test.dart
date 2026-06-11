import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:test_gopass_mobile/features/project/domain/entities/project.dart';
import 'package:test_gopass_mobile/features/project/domain/usecases/get_projects.dart';
import 'package:test_gopass_mobile/features/project/domain/usecases/create_project.dart';
import 'package:test_gopass_mobile/features/project/domain/usecases/update_project.dart';
import 'package:test_gopass_mobile/features/project/domain/usecases/delete_project.dart';
import 'package:test_gopass_mobile/features/project/presentation/bloc/project_bloc.dart';

class MockGetProjects extends Mock implements GetProjects {}
class MockCreateProject extends Mock implements CreateProject {}
class MockUpdateProject extends Mock implements UpdateProject {}
class MockDeleteProject extends Mock implements DeleteProject {}

void main() {
  late ProjectBloc bloc;
  late MockGetProjects mockGetProjects;
  late MockCreateProject mockCreateProject;
  late MockUpdateProject mockUpdateProject;
  late MockDeleteProject mockDeleteProject;

  setUp(() {
    mockGetProjects = MockGetProjects();
    mockCreateProject = MockCreateProject();
    mockUpdateProject = MockUpdateProject();
    mockDeleteProject = MockDeleteProject();
    bloc = ProjectBloc(
      getProjects: mockGetProjects,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
    );
  });

  tearDown(() {
    bloc.close();
  });

  final tProject = Project(
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

  group('LoadProjects', () {
    blocTest<ProjectBloc, ProjectState>(
      'emits [ProjectLoading, ProjectLoaded] when LoadProjects is successful',
      build: () {
        when(() => mockGetProjects()).thenAnswer((_) async => Right([tProject]));
        return bloc;
      },
      act: (bloc) => bloc.add(LoadProjects()),
      expect: () => [
        ProjectLoading(),
        ProjectLoaded([tProject]),
      ],
    );

    blocTest<ProjectBloc, ProjectState>(
      'emits [ProjectLoading, ProjectError] when LoadProjects fails',
      build: () {
        when(() => mockGetProjects()).thenAnswer((_) async => const Left('Error'));
        return bloc;
      },
      act: (bloc) => bloc.add(LoadProjects()),
      expect: () => [
        ProjectLoading(),
        const ProjectError('Error'),
      ],
    );
  });

  group('AddProject', () {
    blocTest<ProjectBloc, ProjectState>(
      'emits [ProjectLoading] and triggers LoadProjects when AddProject is successful',
      build: () {
        when(() => mockCreateProject(name: any(named: 'name'), description: any(named: 'description')))
            .thenAnswer((_) async => Right(tProject));
        when(() => mockGetProjects()).thenAnswer((_) async => Right([tProject]));
        return bloc;
      },
      act: (bloc) => bloc.add(const AddProject(name: 'Test', description: 'Desc')),
      expect: () => [
        ProjectLoading(),
        ProjectLoading(),
        ProjectLoaded([tProject]),
      ],
    );
  });

  group('RemoveProject', () {
    blocTest<ProjectBloc, ProjectState>(
      'emits [ProjectLoading] and triggers LoadProjects when RemoveProject is successful',
      build: () {
        when(() => mockDeleteProject(any())).thenAnswer((_) async => const Right(true));
        when(() => mockGetProjects()).thenAnswer((_) async => const Right([]));
        return bloc;
      },
      act: (bloc) => bloc.add(const RemoveProject('1')),
      expect: () => [
        ProjectLoading(),
        ProjectLoading(),
        const ProjectLoaded([]),
      ],
    );
  });
}
