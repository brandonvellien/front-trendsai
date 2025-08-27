import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

// On garde ces imports, c'est très bien
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { AuthProvider } from './hooks/useAuth.jsx';
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* On retire withGlobalStyles et withNormalizeCSS pour l'instant */}
        <MantineProvider>
          <Notifications />
          <AuthProvider>
            <App />
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);