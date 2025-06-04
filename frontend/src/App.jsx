import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';

// Create a light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  useEffect(() => {
    // Check for existing authentication
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const handleAuthSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/auth" 
            element={
              !isAuthenticated ? (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AuthPage onAuthSuccess={handleAuthSuccess} />
                </React.Suspense>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Dashboard onLogout={handleLogout} userRole={userRole} />
                </React.Suspense>
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 