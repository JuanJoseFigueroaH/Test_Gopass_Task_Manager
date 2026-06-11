import { test, expect } from '@playwright/test';

test.describe('Tasks E2E Tests', () => {
  const testUser = {
    email: `tasks-test-${Date.now()}@example.com`,
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
  };

  let projectName: string;

  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByLabel(/first name/i).fill(testUser.firstName);
    await page.getByLabel(/last name/i).fill(testUser.lastName);
    await page.getByRole('button', { name: /register|sign up/i }).click();
    
    await page.waitForURL(/dashboard|home|\//);

    // Create a project for tasks
    await page.goto('/projects');
    await page.getByRole('button', { name: /create|new|add/i }).click();
    projectName = `Task Test Project ${Date.now()}`;
    await page.getByLabel(/name|title/i).fill(projectName);
    await page.getByRole('button', { name: /save|create|submit/i }).click();
  });

  test.describe('Task List', () => {
    test('should display tasks for a project', async ({ page }) => {
      await page.getByText(projectName).click();
      
      await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
    });

    test('should show empty state when no tasks', async ({ page }) => {
      await page.getByText(projectName).click();
      
      await expect(page.getByText(/no tasks|create your first/i)).toBeVisible();
    });
  });

  test.describe('Create Task', () => {
    test('should create a new task', async ({ page }) => {
      await page.getByText(projectName).click();
      
      await page.getByRole('button', { name: /create|new|add.*task/i }).click();
      
      const taskTitle = `Test Task ${Date.now()}`;
      await page.getByLabel(/title/i).fill(taskTitle);
      await page.getByLabel(/description/i).fill('Test task description');
      
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      await expect(page.getByText(taskTitle)).toBeVisible();
    });

    test('should show validation for short title', async ({ page }) => {
      await page.getByText(projectName).click();
      
      await page.getByRole('button', { name: /create|new|add.*task/i }).click();
      
      await page.getByLabel(/title/i).fill('ab'); // Too short
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      await expect(page.getByText(/at least 3 characters|too short/i)).toBeVisible();
    });
  });

  test.describe('Task Status', () => {
    test('should change task status', async ({ page }) => {
      await page.getByText(projectName).click();
      
      // Create a task
      await page.getByRole('button', { name: /create|new|add.*task/i }).click();
      const taskTitle = `Status Test ${Date.now()}`;
      await page.getByLabel(/title/i).fill(taskTitle);
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Change status
      await page.getByText(taskTitle).click();
      await page.getByRole('combobox', { name: /status/i }).selectOption('in_progress');
      
      await expect(page.getByText(/in progress/i)).toBeVisible();
    });
  });

  test.describe('Task Priority', () => {
    test('should set task priority', async ({ page }) => {
      await page.getByText(projectName).click();
      
      // Create a task
      await page.getByRole('button', { name: /create|new|add.*task/i }).click();
      const taskTitle = `Priority Test ${Date.now()}`;
      await page.getByLabel(/title/i).fill(taskTitle);
      await page.getByRole('combobox', { name: /priority/i }).selectOption('high');
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      await expect(page.getByText(/high/i)).toBeVisible();
    });
  });

  test.describe('Delete Task', () => {
    test('should delete a task', async ({ page }) => {
      await page.getByText(projectName).click();
      
      // Create a task
      await page.getByRole('button', { name: /create|new|add.*task/i }).click();
      const taskTitle = `Delete Test ${Date.now()}`;
      await page.getByLabel(/title/i).fill(taskTitle);
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      
      // Delete the task
      await page.getByText(taskTitle).click();
      await page.getByRole('button', { name: /delete/i }).click();
      await page.getByRole('button', { name: /confirm|yes|delete/i }).click();
      
      await expect(page.getByText(taskTitle)).not.toBeVisible();
    });
  });
});
