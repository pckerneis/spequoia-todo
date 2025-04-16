// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TODO App Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('FEAT-001: App title is "My TODO"', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('My TODO');
  });

  test('FEAT-002: Shows placeholder when task list is empty', async ({ page }) => {
    await expect(page.getByTestId('empty-state')).toHaveText('No tasks');
  });

  test('FEAT-003: Can create a new task', async ({ page }) => {
    // Check form elements
    const input = page.getByPlaceholder('Enter task...');
    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(input).toBeVisible();
    await expect(addButton).toBeVisible();

    // Create task
    await input.fill('New task');
    await addButton.click();

    // Verify task is created
    const taskElement = page.getByTestId('task-1');
    await expect(taskElement).toBeVisible();
    await expect(page.getByTestId('task-1-title')).toHaveText('New task');
    await expect(page.getByTestId('task-1-checkbox')).not.toBeChecked();
  });

  test('FEAT-004: Tasks persist after page reload', async ({ page }) => {
    // Create a task
    await page.getByPlaceholder('Enter task...').fill('Persistent task');
    await page.getByRole('button', { name: 'Add' }).click();

    // Reload page
    await page.reload();

    // Verify task still exists
    await expect(page.getByTestId('task-1')).toBeVisible();
    await expect(page.getByTestId('task-1-title')).toHaveText('Persistent task');
  });

  test('FEAT-005: Can mark tasks as done', async ({ page }) => {
    // Create a task
    await page.getByPlaceholder('Enter task...').fill('Task 1');
    await page.getByRole('button', { name: 'Add' }).click();

    // Mark task as done
    await page.getByTestId('task-1-checkbox').click();

    // Verify task is marked as done
    await expect(page.getByTestId('task-1-checkbox')).toBeChecked();
    await expect(page.getByTestId('task-1-title')).toHaveClass(/done/);
  });

  test('FEAT-006: Can mark tasks as not done', async ({ page }) => {
    // Create a task and mark it as done
    await page.getByPlaceholder('Enter task...').fill('Task 1');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByTestId('task-1-checkbox').click();

    // Mark task as not done
    await page.getByTestId('task-1-checkbox').click();

    // Verify task is marked as not done
    await expect(page.getByTestId('task-1-checkbox')).not.toBeChecked();
    await expect(page.getByTestId('task-1-title')).not.toHaveClass(/done/);
  });

  test('FEAT-007: Can delete tasks', async ({ page }) => {
    // Create a task
    await page.getByPlaceholder('Enter task...').fill('Task 1');
    await page.getByRole('button', { name: 'Add' }).click();

    // Delete task
    await page.getByTestId('task-1-delete').click();

    // Verify task is deleted
    await expect(page.getByTestId('task-1')).not.toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
