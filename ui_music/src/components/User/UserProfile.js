import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import api from '../api';
import { Container, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    location: '',
    birth_date: '',
    gender: '',
    marital_status: '',
  });

  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const maritalStatusOptions = [
    { value: 'S', label: 'Single' },
    { value: 'M', label: 'Married' },
    { value: 'D', label: 'Divorced' },
    { value: 'W', label: 'Widowed' },
  ];

  // Getting the user ID from the URL parameters
  const { userId } = useParams();

  useEffect(() => {
    // Fetch user's profile
    api.get(`/api/profile/${userId}/`)
      .then(response => {
        const data = response.data;
        for (let field in data) {
          setValue(field, data[field]);
        }
        setUserProfile(data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [userId]);

  const onSubmit = async (data) => {
    let errors = {};
    if (data.bio && data.bio.length > 500) {
      errors.bio = "Bio cannot be more than 500 characters.";
    }
    if (data.birth_date && new Date(data.birth_date) > new Date()) {
      errors.birth_date = "Birth date cannot be in the future.";
    }
    if (data.marital_status && !maritalStatusOptions.find(option => option.value === data.marital_status)) {
      errors.marital_status = "Invalid marital status.";
    }
    if (Object.keys(errors).length > 0) {
      toast.error('Invalid inputs. Please correct the errors and try again.');
      return;
    }
    try {
      await api.put('/api/profile/', data);
      toast.success('Profile updated successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User: {userProfile.username}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={userProfile.bio}
              onChange={handleChange}
              helperText={errors.bio}
              error={errors.bio ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={userProfile.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              name="birth_date"
              value={userProfile.birth_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={errors.birth_date}
              error={errors.birth_date ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={userProfile.gender}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Marital Status"
              name="marital_status"
              value={userProfile.marital_status}
              onChange={handleChange}
              helperText={errors.marital_status}
              error={errors.marital_status ? true : false}
            >
              {maritalStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserProfile;

