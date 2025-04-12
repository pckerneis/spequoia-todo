/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { loadHTML } from './test-utils.js';

describe('FEAT-001: App title', () => {
  beforeEach(() => {
    // Load the actual HTML file
    loadHTML();
  });

  describe('EX-001: App title text', () => {
    test('app title has text "My TODO"', () => {
      const title = document.querySelector('h1');
      expect(title).not.toBeNull();
      expect(title).toHaveTextContent('My TODO');
    });
  });
});
