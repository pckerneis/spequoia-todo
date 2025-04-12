import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadHTML() {
    // Set up localStorage mock
    const localStorageMock = {
        store: {},
        getItem: jest.fn((key) => localStorageMock.store[key] || null),
        setItem: jest.fn((key, value) => localStorageMock.store[key] = value),
        clear: jest.fn(() => localStorageMock.store = {})
    };
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
    });

    // Set up crypto mock
    Object.defineProperty(window, 'crypto', {
        value: {
            randomUUID: () => '12345678-1234-1234-1234-123456789012'
        }
    });

    // Load HTML
    const htmlPath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;

    // Load and initialize script
    const scriptPath = path.join(__dirname, 'script.js');
    const script = fs.readFileSync(scriptPath, 'utf-8');
    eval(script);

    // Trigger DOMContentLoaded
    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
    }));
}
