import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx';
import './styles/preflight.css';
import './styles/index.css';
import '@nikelaz/bw-ui/dist/themes/light';
import '@nikelaz/bw-ui/dist/themes/dark';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
