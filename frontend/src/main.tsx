import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './app/styles/global.css';
import { authStore } from './features/auth/store.ts';
import { setUnauthorizedHandler } from './shared/api/http.ts';

setUnauthorizedHandler(() => authStore.logout());
authStore.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
