
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Show success indicator after mount
const successEl = document.getElementById('mount-success');
if (successEl) {
  setTimeout(() => {
    successEl.style.display = 'block';
    setTimeout(() => { successEl.style.opacity = '0'; successEl.style.transition = 'opacity 1s'; }, 4000);
  }, 1000);
}
