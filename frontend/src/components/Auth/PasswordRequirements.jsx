import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PasswordRequirements = ({ passwordRequirements, password = '' }) => {
  const requirements = [
    {
      text: `At least ${passwordRequirements.minLength} characters long`,
      check: (password) => password.length >= passwordRequirements.minLength,
    },
    {
      text: 'Contains at least one uppercase letter',
      check: (password) => passwordRequirements.requireUppercase ? /[A-Z]/.test(password) : true,
    },
    {
      text: 'Contains at least one lowercase letter',
      check: (password) => passwordRequirements.requireLowercase ? /[a-z]/.test(password) : true,
    },
    {
      text: 'Contains at least one number',
      check: (password) => passwordRequirements.requireNumber ? /[0-9]/.test(password) : true,
    },
    {
      text: 'Contains at least one special character',
      check: (password) => passwordRequirements.requireSpecialChar ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
    },
  ];

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        Password must meet the following requirements:
      </Typography>
      <List dense sx={{ py: 0 }}>
        {requirements.map((requirement, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {requirement.check(password) ? (
                <CheckCircleOutlineIcon color="success" fontSize="small" />
              ) : (
                <ErrorOutlineIcon color="error" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={requirement.text}
              primaryTypographyProps={{
                variant: 'caption',
                color: requirement.check(password) ? 'success.main' : 'error.main',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PasswordRequirements; 