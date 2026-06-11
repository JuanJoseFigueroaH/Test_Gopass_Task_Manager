import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Projects E2E Tests', () {
    final projectName = 'Test Project ${DateTime.now().millisecondsSinceEpoch}';

    setUpAll(() async {
      // Login before running project tests
    });

    group('Project List', () {
      testWidgets('should display projects screen', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.folder));
        await tester.pumpAndSettle();
        
        expect(find.text('Projects'), findsOneWidget);
      });

      testWidgets('should show empty state when no projects', (tester) async {
        await tester.pumpAndSettle();
        
        expect(find.text('No projects yet'), findsOneWidget);
      });
    });

    group('Create Project', () {
      testWidgets('should open create project dialog', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.add));
        await tester.pumpAndSettle();
        
        expect(find.text('Create Project'), findsOneWidget);
        expect(find.byKey(const Key('project_name_field')), findsOneWidget);
      });

      testWidgets('should create a new project', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.add));
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('project_name_field')), projectName);
        await tester.enterText(find.byKey(const Key('project_description_field')), 'Test description');
        await tester.tap(find.widgetWithText(ElevatedButton, 'Create'));
        await tester.pumpAndSettle();
        
        expect(find.text(projectName), findsOneWidget);
      });

      testWidgets('should show validation error for empty name', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.add));
        await tester.pumpAndSettle();
        
        await tester.tap(find.widgetWithText(ElevatedButton, 'Create'));
        await tester.pumpAndSettle();
        
        expect(find.text('Name is required'), findsOneWidget);
      });
    });

    group('Edit Project', () {
      testWidgets('should edit an existing project', (tester) async {
        await tester.pumpAndSettle();
        
        // Tap on project
        await tester.tap(find.text(projectName));
        await tester.pumpAndSettle();
        
        // Tap edit button
        await tester.tap(find.byIcon(Icons.edit));
        await tester.pumpAndSettle();
        
        final updatedName = 'Updated $projectName';
        await tester.enterText(find.byKey(const Key('project_name_field')), updatedName);
        await tester.tap(find.widgetWithText(ElevatedButton, 'Save'));
        await tester.pumpAndSettle();
        
        expect(find.text(updatedName), findsOneWidget);
      });
    });

    group('Delete Project', () {
      testWidgets('should delete a project', (tester) async {
        await tester.pumpAndSettle();
        
        // Long press to show delete option
        await tester.longPress(find.text(projectName));
        await tester.pumpAndSettle();
        
        await tester.tap(find.text('Delete'));
        await tester.pumpAndSettle();
        
        // Confirm deletion
        await tester.tap(find.widgetWithText(ElevatedButton, 'Confirm'));
        await tester.pumpAndSettle();
        
        expect(find.text(projectName), findsNothing);
      });
    });
  });
}
