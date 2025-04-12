import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadHTML() {
    const htmlPath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;
    
    // Load and execute the script
    const scriptPath = path.join(__dirname, 'script.js');
    const script = fs.readFileSync(scriptPath, 'utf-8');
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);
}
