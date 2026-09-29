import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { AuthProvider } from './lib/authContext';
import AuthGuard from './components/AuthGuard';
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';
import Admin from './pages/Admin';

const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  headings: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' },
  colors: {
    // Keep existing dark/gray palette intact; add indigo as primary
  },
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        color: 'indigo',
      },
    },
    ThemeIcon: {
      defaultProps: {
        variant: 'light',
        color: 'indigo',
      },
    },
    Badge: {
      defaultProps: {
        color: 'indigo',
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />

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
