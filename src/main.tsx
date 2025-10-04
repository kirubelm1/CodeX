import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure there is a <div id="root"> in your HTML.');
}


createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

