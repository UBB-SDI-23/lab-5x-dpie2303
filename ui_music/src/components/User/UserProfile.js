import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import api from '../api';
import { Container, Typography,Button, TextField, Grid, MenuItem } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    location: '',
    birth_date: '',
    gender: '',
    marital_status: '',
    albums_count: 0,
    tracks_count: 0,
    artists_count: 0,
    collaborations_count: 0,
    recordcompanys_count: 0,    
  });

  const {  handleSubmit, setValue, formState: { errors } } = useForm();
  const maritalStatusOptions = [
    { value: 'S', label: 'Single' },
    { value: 'M', label: 'Married' },
    { value: 'D', label: 'Divorced' },
    { value: 'W', label: 'Widowed' },
  ];


  // Getting the user ID from the URL parameters
  const { userId } = useParams();

  const { userPaginationSize, setPaginationSize} = useContext(AuthContext);
  const { access } = useContext(AuthContext);


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
  }, [userId, setValue]);

  const onSubmit = async () => {
    let errors = {};
    if (userProfile.bio && userProfile.bio.length > 500) {
      errors.bio = "Bio cannot be more than 500 characters.";
    }
    if (userProfile.birth_date && new Date(userProfile.birth_date) > new Date()) {
      errors.birth_date = "Birth date cannot be in the future.";
    }
    if (userProfile.marital_status && !maritalStatusOptions.find(option => option.value === userProfile.marital_status)) {
      errors.marital_status = "Invalid marital status.";
    }
    if (Object.keys(errors).length > 0) {
      toast.error('Invalid inputs. Please correct the errors and try again.');
      return;
    }
    console.log(access);
    console.log(userProfile);
    try {
      await api.put(`/api/profile/${userId}/`, userProfile, {
        headers: { Authorization: `Bearer ${access}` }
      });
      toast.success('Profile updated successfully.');
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

  const handlePaginationSizeChange = (event) => {
    setPaginationSize(event.target.value);
  }


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
              <TextField
                fullWidth
                label="Albums Count"
                value={userProfile.albums_count}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tracks Count"
                  value={userProfile.tracks_count}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Artists Count"
                  value={userProfile.artists_count}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Collaborations Count"
                  value={userProfile.collaborations_count}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Record Companys Count"
                  value={userProfile.recordcompanys_count}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
              Update Profile
              </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Pagination Size"
                  name="paginationSize"
                  value={userPaginationSize}
                  onChange={handlePaginationSizeChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserProfile;

