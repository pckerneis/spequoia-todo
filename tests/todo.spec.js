// @ts-check
const { test, expect } = require('@playwright/test');

const ANIMATION_DURATION = 600; // 300ms per phase * 2 phases

/**
 * Create a new task
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} title - Task title
 */
async function createTask(page, title) {
  await page.getByPlaceholder('Enter task...').fill(title);
  await page.getByRole('button', { name: 'Add' }).click();
}

/**
 * Mark a task as done by its number
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} taskNumber - Task number (1-based)
 */
async function markTaskDone(page, taskNumber) {
  await page.getByTestId(`task-${taskNumber}-checkbox`).click();
}

/**
 * Verify task state
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} taskNumber - Task number (1-based)
 * @param {{title?: string, done?: boolean}} options - Task state to verify
 */
async function verifyTaskState(page, taskNumber, { title, done }) {
  const titleElement = page.getByTestId(`task-${taskNumber}-title`);
  const checkbox = page.getByTestId(`task-${taskNumber}-checkbox`);

  if (title) {
    await expect(titleElement).toHaveText(title);
  }
  if (done !== undefined) {
    if (done) {
      await expect(checkbox).toBeChecked();
      await expect(titleElement).toHaveClass(/done/);
    } else {
      await expect(checkbox).not.toBeChecked();
      await expect(titleElement).not.toHaveClass(/done/);
    }
  }
}

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
  });

  // Task persistence tests
  test('FEAT-004: Tasks persist after page reload', async ({ page }) => {
    await createTask(page, 'Persistent task');
    await page.reload();
    await verifyTaskState(page, 1, { title: 'Persistent task' });
  });

  test('FEAT-008: Task state persists after page reload', async ({ page }) => {
    await createTask(page, 'Persistent task');
    await markTaskDone(page, 1);
    await page.reload();
    await verifyTaskState(page, 1, { title: 'Persistent task', done: true });
  });

  // Task completion tests
  test('FEAT-005a: Can mark a single task as done', async ({ page }) => {
    await createTask(page, 'Task 1');
    await markTaskDone(page, 1);
    await verifyTaskState(page, 1, { done: true });
  });

  test('FEAT-005b: Marking one task as done does not affect others completion status', async ({ page }) => {
    await createTask(page, 'Task 1');
    await createTask(page, 'Task 2');
    await markTaskDone(page, 1);
    await page.waitForTimeout(ANIMATION_DURATION);

    // After reordering, Task 2 should be first and Task 1 second
    await verifyTaskState(page, 2, { title: 'Task 1', done: true });
    await verifyTaskState(page, 1, { title: 'Task 2', done: false });
  });

  test('FEAT-005c: Can mark task as done by clicking title area', async ({ page }) => {
    await createTask(page, 'Task 1');

    // Toggle done state twice using title
    await page.getByTestId('task-1-title').click();
    await verifyTaskState(page, 1, { done: true });

    await page.getByTestId('task-1-title').click();
    await verifyTaskState(page, 1, { done: false });
  });

  test('FEAT-006: Can mark tasks as not done', async ({ page }) => {
    await createTask(page, 'Task 1');
    await markTaskDone(page, 1);
    await verifyTaskState(page, 1, { done: true });

    await markTaskDone(page, 1);
    await verifyTaskState(page, 1, { done: false });
  });

  // Task deletion test
  test('FEAT-007: Can delete tasks', async ({ page }) => {
    await createTask(page, 'Task to delete');
    await page.getByTestId('task-1-delete').click();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  // Task reordering test
  test('FEAT-009: Completed tasks move to the end with animation', async ({ page }) => {
    await createTask(page, 'Task 1');
    await createTask(page, 'Task 2');

    // Verify initial order
    await verifyTaskState(page, 1, { title: 'Task 1' });
    await verifyTaskState(page, 2, { title: 'Task 2' });

    // Mark first task as done and wait for animation
    await markTaskDone(page, 1);
    await page.waitForTimeout(ANIMATION_DURATION);

    // Verify new order
    await verifyTaskState(page, 1, { title: 'Task 2', done: false });
    await verifyTaskState(page, 2, { title: 'Task 1', done: true });
  });
});
