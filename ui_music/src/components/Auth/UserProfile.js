// src/components/UserProfile.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

export function UserProfile() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  
  const onSubmit = data => {
    axios.patch('http://localhost:8000/api/userprofile/', data)
      .then(response => {
        alert('User profile updated successfully');
      })
      .catch(error => {
        setServerErrors(error.response.data);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Include fields for bio, location, birth_date, gender, and marital_status */}
          {/* You can use the TextField component and the register function from react-hook-form */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default UserProfile;