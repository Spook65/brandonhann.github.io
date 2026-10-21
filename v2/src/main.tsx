import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

const mount = document.getElementById('root');

if (!mount) {
  throw new Error('Portfolio mount point is missing.');
}

createRoot(mount).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
