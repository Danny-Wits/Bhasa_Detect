import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { AuthProvider } from './lib/authContext';
import AuthGuard from './components/AuthGuard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';

const theme = createTheme({
  primaryColor: 'dark',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        color: 'dark',
      },
    },
    ThemeIcon: {
      defaultProps: {
        variant: 'light',
        color: 'dark',
      },
    }
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<AuthGuard />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/record" element={<Record />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
