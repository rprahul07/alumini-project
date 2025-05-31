import React from 'react';
import { Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuthButton = ({ onClick, disabled }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={
        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
          <GoogleIcon />
        </Box>
      }
      onClick={onClick}
      disabled={disabled}
      sx={{
        mt: 1,
        mb: 2,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'rgba(66, 133, 244, 0.04)',
        },
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton; 