/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import { loadHTML } from './test-utils.js';
import { updateTaskList, addTask } from './script.js';

describe('FEAT-001: App title', () => {
  beforeEach(() => {
    loadHTML();
  });

  describe('EX-001: App title text', () => {
    test('app title has text "My TODO"', () => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('My TODO');
    });
  });
});

describe('FEAT-002: Empty state', () => {
  beforeEach(() => {
    localStorage.clear();
    loadHTML();
    updateTaskList();
  });

  describe('EX-002: Empty state text', () => {
    test('task list placeholder has text "No tasks"', () => {
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toHaveTextContent('No tasks');
    });
  });
});

describe('FEAT-003: Task creation', () => {
  beforeEach(() => {
    localStorage.clear();
    loadHTML();
  });

  describe('EX-003: Create task form and functionality', () => {
    test('task creation form has required elements', () => {
      const input = screen.getByPlaceholderText('Enter task...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');

      const addButton = screen.getByText('Add');
      expect(addButton).toBeInTheDocument();
      expect(addButton.closest('button')).toHaveAttribute('type', 'submit');
    });

    test('can create a new task', () => {
      // Create a new task
      addTask('New task');
      
      // Verify task is created correctly
      const taskElement = screen.getByTestId('task-1');
      expect(taskElement).toBeInTheDocument();

      const taskTitle = screen.getByTestId('task-1-title');
      expect(taskTitle).toHaveTextContent('New task');

      const taskCheckbox = screen.getByTestId('task-1-checkbox');
      expect(taskCheckbox).not.toBeChecked();
    });
  });
});
