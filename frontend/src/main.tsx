import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { authStore } from './features/auth/store.ts';
import { setUnauthorizedHandler } from './shared/api/http.ts';
import { resetStoresOnUserChange } from './app/resetStoresOnUserChange.ts';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/app/theme';
import '@mantine/dates/styles.css';
import 'dayjs/locale/ru';
import { DatesProvider } from '@mantine/dates';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';


setUnauthorizedHandler(() => authStore.logout());
resetStoresOnUserChange()
authStore.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <App />
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>    
  </StrictMode>,
)
