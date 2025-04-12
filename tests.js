/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';

describe('FEAT-001: App title', () => {
  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <header>
        <h1>My TODO</h1>
      </header>
    `;
  });

  describe('EX-001: App title text', () => {
    test('app title has text "My TODO"', () => {
      const title = document.querySelector('h1');
      expect(title).not.toBeNull();
      expect(title).toHaveTextContent('My TODO');
    });
  });
});
