import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Dashboard({ onLogout, userRole }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      localStorage.removeItem('userRole');
      navigate('/auth');
    } catch (error) {
      // Silent error handling for logout
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alumni Portal
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {userRole}!
          </Typography>
          <Typography variant="body1">
            Dashboard content will be added here.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard; 