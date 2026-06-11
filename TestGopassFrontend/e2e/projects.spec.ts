import { test, expect } from '@playwright/test';

test.describe('Projects E2E Tests', () => {
  const testUser = {
    email: `projects-test-${Date.now()}@example.com`,
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
  };

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto('/register');
    
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByLabel(/first name/i).fill(testUser.firstName);
    await page.getByLabel(/last name/i).fill(testUser.lastName);
    await page.getByRole('button', { name: /register|sign up/i }).click();
    
    // Wait for authentication
    await page.waitForURL(/dashboard|home|\//);
  });

  test.describe('Project List', () => {
    test('should display projects page', async ({ page }) => {
      await page.goto('/projects');
      
      await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    });

    test('should show empty state when no projects', async ({ page }) => {
      await page.goto('/projects');
      
      await expect(page.getByText(/no projects|create your first/i)).toBeVisible();
    });
  });

  test.describe('Create Project', () => {
    test('should open create project modal/form', async ({ page }) => {
      await page.goto('/projects');
      
      await page.getByRole('button', { name: /create|new|add/i }).click();
      
      await expect(page.getByLabel(/name|title/i)).toBeVisible();
      await expect(page.getByLabel(/description/i)).toBeVisible();
    });

    test('should create a new project', async ({ page }) => {
      await page.goto('/projects');
      
      await page.getByRole('button', { name: /create|new|add/i }).click();
      
      const projectName = `Test Project ${Date.now()}`;
      await page.getByLabel(/name|title/i).fill(projectName);
      await page.getByLabel(/description/i).fill('Test project description');
      
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Project should appear in the list
      await expect(page.getByText(projectName)).toBeVisible();
    });

    test('should show validation error for empty name', async ({ page }) => {
      await page.goto('/projects');
      
      await page.getByRole('button', { name: /create|new|add/i }).click();
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      await expect(page.getByText(/name.*required|required.*name/i)).toBeVisible();
    });
  });

  test.describe('Edit Project', () => {
    test('should edit an existing project', async ({ page }) => {
      await page.goto('/projects');
      
      // Create a project first
      await page.getByRole('button', { name: /create|new|add/i }).click();
      const projectName = `Edit Test ${Date.now()}`;
      await page.getByLabel(/name|title/i).fill(projectName);
      await page.getByLabel(/description/i).fill('Original description');
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Edit the project
      await page.getByText(projectName).click();
      await page.getByRole('button', { name: /edit/i }).click();
      
      const updatedName = `Updated ${projectName}`;
      await page.getByLabel(/name|title/i).fill(updatedName);
      await page.getByRole('button', { name: /save|update|submit/i }).click();
      
      await expect(page.getByText(updatedName)).toBeVisible();
    });
  });

  test.describe('Delete Project', () => {
    test('should delete a project', async ({ page }) => {
      await page.goto('/projects');
      
      // Create a project first
      await page.getByRole('button', { name: /create|new|add/i }).click();
      const projectName = `Delete Test ${Date.now()}`;
      await page.getByLabel(/name|title/i).fill(projectName);
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Delete the project
      await page.getByText(projectName).click();
      await page.getByRole('button', { name: /delete/i }).click();
      
      // Confirm deletion
      await page.getByRole('button', { name: /confirm|yes|delete/i }).click();
      
      await expect(page.getByText(projectName)).not.toBeVisible();
    });
  });
});
