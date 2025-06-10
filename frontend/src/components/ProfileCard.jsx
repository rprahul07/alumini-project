import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Avatar, Box, CircularProgress } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/student/profile/get/', {
          withCredentials: true
        });
        console.log('Profile data:', response.data);
        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent>
          <Typography>No profile data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={profile.profilePicture}
            alt={profile.fullName}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" gutterBottom>
              {profile.fullName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.rollNumber}
            </Typography>
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography variant="body1">{profile.email}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
            <Typography variant="body1">{profile.phone || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Department</Typography>
            <Typography variant="body1">{profile.department}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Current Semester</Typography>
            <Typography variant="body1">{profile.currentSemester}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
            <Typography variant="body1">{profile.dateOfBirth || 'Not provided'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
            <Typography variant="body1">{profile.gender || 'Not provided'}</Typography>
          </Box>
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle2" color="textSecondary">Address</Typography>
          <Typography variant="body1">{profile.address || 'Not provided'}</Typography>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 