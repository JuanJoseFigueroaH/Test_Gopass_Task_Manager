import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Tasks E2E Tests', () {
    final taskTitle = 'Test Task ${DateTime.now().millisecondsSinceEpoch}';
    final projectName = 'Task Test Project ${DateTime.now().millisecondsSinceEpoch}';

    setUpAll(() async {
      // Login and create a project before running task tests
    });

    group('Task List', () {
      testWidgets('should display tasks for a project', (tester) async {
        await tester.pumpAndSettle();
        
        // Navigate to project
        await tester.tap(find.text(projectName));
        await tester.pumpAndSettle();
        
        expect(find.text('Tasks'), findsOneWidget);
      });

      testWidgets('should show empty state when no tasks', (tester) async {
        await tester.pumpAndSettle();
        
        expect(find.text('No tasks yet'), findsOneWidget);
      });
    });

    group('Create Task', () {
      testWidgets('should create a new task', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.add));
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('task_title_field')), taskTitle);
        await tester.enterText(find.byKey(const Key('task_description_field')), 'Test description');
        await tester.tap(find.widgetWithText(ElevatedButton, 'Create'));
        await tester.pumpAndSettle();
        
        expect(find.text(taskTitle), findsOneWidget);
      });

      testWidgets('should show validation for short title', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.add));
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('task_title_field')), 'ab');
        await tester.tap(find.widgetWithText(ElevatedButton, 'Create'));
        await tester.pumpAndSettle();
        
        expect(find.text('Title must be at least 3 characters'), findsOneWidget);
      });
    });

    group('Task Status', () {
      testWidgets('should change task status', (tester) async {
        await tester.pumpAndSettle();
        
        // Tap on task
        await tester.tap(find.text(taskTitle));
        await tester.pumpAndSettle();
        
        // Change status
        await tester.tap(find.byKey(const Key('status_dropdown')));
        await tester.pumpAndSettle();
        
        await tester.tap(find.text('In Progress'));
        await tester.pumpAndSettle();
        
        expect(find.text('In Progress'), findsOneWidget);
      });

      testWidgets('should mark task as completed', (tester) async {
        await tester.pumpAndSettle();
        
        // Tap checkbox
        await tester.tap(find.byType(Checkbox).first);
        await tester.pumpAndSettle();
        
        expect(find.byIcon(Icons.check_circle), findsOneWidget);
      });
    });

    group('Task Priority', () {
      testWidgets('should set task priority', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.tap(find.text(taskTitle));
        await tester.pumpAndSettle();
        
        await tester.tap(find.byKey(const Key('priority_dropdown')));
        await tester.pumpAndSettle();
        
        await tester.tap(find.text('High'));
        await tester.pumpAndSettle();
        
        expect(find.text('High'), findsOneWidget);
      });
    });

    group('Delete Task', () {
      testWidgets('should delete a task', (tester) async {
        await tester.pumpAndSettle();
        
        // Swipe to delete
        await tester.drag(find.text(taskTitle), const Offset(-300, 0));
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.delete));
        await tester.pumpAndSettle();
        
        expect(find.text(taskTitle), findsNothing);
      });
    });
  });
}
