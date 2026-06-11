import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
  };

  test.describe('Registration Flow', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByLabel(/first name/i)).toBeVisible();
      await expect(page.getByLabel(/last name/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /register|sign up/i })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      await expect(page.getByText(/email.*required|required.*email/i)).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByLabel(/first name/i).fill(testUser.firstName);
      await page.getByLabel(/last name/i).fill(testUser.lastName);
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      await expect(page.getByText(/invalid.*email|email.*invalid/i)).toBeVisible();
    });

    test('should register successfully with valid data', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByLabel(/email/i).fill(testUser.email);
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByLabel(/first name/i).fill(testUser.firstName);
      await page.getByLabel(/last name/i).fill(testUser.lastName);
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      // Should redirect to dashboard or home after successful registration
      await expect(page).toHaveURL(/dashboard|home|\//);
    });
  });

  test.describe('Login Flow', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByLabel(/email/i).fill('nonexistent@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      await expect(page.getByText(/invalid.*credentials|credentials.*invalid|error/i)).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      // First register the user
      await page.goto('/register');
      const uniqueEmail = `login-test-${Date.now()}@example.com`;
      
      await page.getByLabel(/email/i).fill(uniqueEmail);
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByLabel(/first name/i).fill(testUser.firstName);
      await page.getByLabel(/last name/i).fill(testUser.lastName);
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      // Logout
      await page.getByRole('button', { name: /logout|sign out/i }).click();
      
      // Now login
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(uniqueEmail);
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByRole('button', { name: /login|sign in/i }).click();
      
      await expect(page).toHaveURL(/dashboard|home|\//);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      await page.goto('/dashboard');
      
      await expect(page).toHaveURL(/login/);
    });

    test('should access protected route when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/register');
      const uniqueEmail = `protected-test-${Date.now()}@example.com`;
      
      await page.getByLabel(/email/i).fill(uniqueEmail);
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByLabel(/first name/i).fill(testUser.firstName);
      await page.getByLabel(/last name/i).fill(testUser.lastName);
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      // Access protected route
      await page.goto('/dashboard');
      
      await expect(page).toHaveURL(/dashboard/);
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout and redirect to login', async ({ page }) => {
      // Login first
      await page.goto('/register');
      const uniqueEmail = `logout-test-${Date.now()}@example.com`;
      
      await page.getByLabel(/email/i).fill(uniqueEmail);
      await page.getByLabel(/password/i).fill(testUser.password);
      await page.getByLabel(/first name/i).fill(testUser.firstName);
      await page.getByLabel(/last name/i).fill(testUser.lastName);
      await page.getByRole('button', { name: /register|sign up/i }).click();
      
      // Logout
      await page.getByRole('button', { name: /logout|sign out/i }).click();
      
      // Should be redirected to login
      await expect(page).toHaveURL(/login/);
      
      // Token should be cleared
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
    });
  });
});
