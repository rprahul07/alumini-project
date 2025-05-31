import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Currently enrolled student',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'Graduated student',
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 'faculty',
    title: 'Faculty',
    description: 'Teaching staff',
    icon: <PersonIcon sx={{ fontSize: 40 }} />,
  },
];

const RoleSelection = ({ onSelect }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Welcome to Alumni Connect
      </Typography>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
        Select your role to continue
      </Typography>
      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} sm={4} key={role.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                minHeight: 200, // Set minimum height
              }}
            >
              <CardActionArea
                onClick={() => onSelect(role.id)}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {role.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoleSelection; 