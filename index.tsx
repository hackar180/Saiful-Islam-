
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting Error:", error);
    rootElement.innerHTML = `<div style="padding:20px; color:red; font-family:monospace;">Critical Error: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
} else {
  console.error("Critical Error: Unable to find application root element.");
}