// @ts-check
const { test, expect } = require('@playwright/test');

const SCREENSHOT_INTERVAL = 30;
const ANIMATION_DURATION = 600;
const SCREENSHOT_DIRECTORY = 'player/data';

let frameCounter = 0;
const sections = [];

function beginSection(name) {
  if (sections.length === 0 && frameCounter > 0) {
    sections.push({
      name: '',
      startFrame: 0,
    });
  }

  sections.push({
    name,
    startFrame: frameCounter - 1,
  });
}

function saveManifest() {
  const sectionsWithEndFrames = sections.map((section, index) => {
    const nextSection = sections[index + 1];
    return {
      ...section,
      endFrame: nextSection ? nextSection.startFrame : frameCounter,
    };
  });

  const json = JSON.stringify({
    sections: sectionsWithEndFrames,
    frameCount: frameCounter
  }, null, 2);

  const fs = require('fs');
  const path = require('path');
  const manifestPath = path.join(__dirname, '..', SCREENSHOT_DIRECTORY, 'screenshot-manifest.json');
  fs.writeFileSync(manifestPath, json);
  console.log(`Manifest saved to ${manifestPath}`);
}

async function screenshot(page) {
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/${frameCounter++}.png`,
  });
}

async function screenshots(page, duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    await screenshot(page);
    await page.waitForTimeout(SCREENSHOT_INTERVAL);
  }
}

async function slowType(page, element, text) {
  for (let i = 0; i <= text.length; i++) {
    let str = text.substring(0, i);
    await element.fill(str);
    await screenshot(page);
  }
}

test.describe('TODO App Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // Task reordering test
  test('FEAT-009: Completed tasks move to the end with animation', async ({ page }) => {
    await screenshot(page);
    beginSection('Create a task');

    await slowType(page, page.getByPlaceholder('Enter task...'), 'Task 1');
    await page.getByRole('button', {name: 'Add'}).click();
    await screenshots(page, ANIMATION_DURATION);

    beginSection('Create a second task');
    await slowType(page, page.getByPlaceholder('Enter task...'), 'Task 2');
    await page.getByRole('button', {name: 'Add'}).click();
    await screenshots(page, ANIMATION_DURATION);

    // Verify initial order
    const titleElement3 = page.getByTestId(`task-${1}-title`);
    await expect(titleElement3).toHaveText('Task 1');
    const titleElement2 = page.getByTestId(`task-${2}-title`);
    await expect(titleElement2).toHaveText('Task 2');

    // Mark first task as done and wait for animation
    beginSection('Mark task as done');
    await page.getByTestId(`task-${1}-checkbox`).click();
    await screenshots(page, ANIMATION_DURATION);

    // Verify new order
    const titleElement1 = page.getByTestId(`task-${1}-title`);
    const checkbox1 = page.getByTestId(`task-${1}-checkbox`);
    await expect(titleElement1).toHaveText('Task 2');
    await expect(checkbox1).not.toBeChecked();
    await expect(titleElement1).not.toHaveClass(/done/);
    const titleElement = page.getByTestId(`task-${2}-title`);
    const checkbox = page.getByTestId(`task-${2}-checkbox`);
    await expect(titleElement).toHaveText('Task 1');
    await expect(checkbox).toBeChecked();
    await expect(titleElement).toHaveClass(/done/);

    // Delete the second task
    beginSection('Delete the second task');
    await page.getByTestId(`task-${2}-delete`).click();
    await screenshots(page, ANIMATION_DURATION);
    // Verify the first task is still there
    await expect(titleElement1).toHaveText('Task 2');

    await saveManifest();
  });
});
