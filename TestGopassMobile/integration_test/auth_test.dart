import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Authentication E2E Tests', () {
    final testEmail = 'test-${DateTime.now().millisecondsSinceEpoch}@example.com';
    const testPassword = 'Test123!@#';
    const testFirstName = 'Test';
    const testLastName = 'User';

    group('Registration Flow', () {
      testWidgets('should display registration form', (tester) async {
        // Navigate to register screen
        await tester.pumpAndSettle();
        
        expect(find.byType(TextFormField), findsWidgets);
        expect(find.text('Email'), findsOneWidget);
        expect(find.text('Password'), findsOneWidget);
        expect(find.widgetWithText(ElevatedButton, 'Register'), findsOneWidget);
      });

      testWidgets('should show validation errors for empty fields', (tester) async {
        await tester.pumpAndSettle();
        
        // Tap register without filling fields
        await tester.tap(find.widgetWithText(ElevatedButton, 'Register'));
        await tester.pumpAndSettle();
        
        expect(find.text('Email is required'), findsOneWidget);
      });

      testWidgets('should show error for invalid email', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('email_field')), 'invalid-email');
        await tester.enterText(find.byKey(const Key('password_field')), testPassword);
        await tester.tap(find.widgetWithText(ElevatedButton, 'Register'));
        await tester.pumpAndSettle();
        
        expect(find.text('Invalid email format'), findsOneWidget);
      });

      testWidgets('should register successfully with valid data', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('email_field')), testEmail);
        await tester.enterText(find.byKey(const Key('password_field')), testPassword);
        await tester.enterText(find.byKey(const Key('first_name_field')), testFirstName);
        await tester.enterText(find.byKey(const Key('last_name_field')), testLastName);
        await tester.tap(find.widgetWithText(ElevatedButton, 'Register'));
        await tester.pumpAndSettle();
        
        // Should navigate to home/dashboard
        expect(find.text('Dashboard'), findsOneWidget);
      });
    });

    group('Login Flow', () {
      testWidgets('should display login form', (tester) async {
        await tester.pumpAndSettle();
        
        expect(find.byKey(const Key('email_field')), findsOneWidget);
        expect(find.byKey(const Key('password_field')), findsOneWidget);
        expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
      });

      testWidgets('should show error for invalid credentials', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('email_field')), 'wrong@example.com');
        await tester.enterText(find.byKey(const Key('password_field')), 'wrongpassword');
        await tester.tap(find.widgetWithText(ElevatedButton, 'Login'));
        await tester.pumpAndSettle();
        
        expect(find.text('Invalid credentials'), findsOneWidget);
      });

      testWidgets('should login successfully with valid credentials', (tester) async {
        await tester.pumpAndSettle();
        
        await tester.enterText(find.byKey(const Key('email_field')), testEmail);
        await tester.enterText(find.byKey(const Key('password_field')), testPassword);
        await tester.tap(find.widgetWithText(ElevatedButton, 'Login'));
        await tester.pumpAndSettle();
        
        expect(find.text('Dashboard'), findsOneWidget);
      });
    });

    group('Logout Flow', () {
      testWidgets('should logout and return to login screen', (tester) async {
        // Assume user is logged in
        await tester.pumpAndSettle();
        
        await tester.tap(find.byIcon(Icons.logout));
        await tester.pumpAndSettle();
        
        expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
      });
    });
  });
}
