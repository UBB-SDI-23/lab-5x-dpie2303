import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const  Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate(); // Use useNavigate instead of Navigate

  const onSubmit = data => {
    console.log(data);
       api.post('/api/register/', data)
      .then(response => {
        alert('A confirmation Link: ' +  process.env.REACT_APP_API_BASE_URL + '/api/register/confirm/'  + response.data.confirmation_code);
        navigate('/login');
      })
      .catch(error => {
        console.error(error.response.data); // This will print the error message to the console
        setServerErrors(error.response.data);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register("username", { required: "Username is required" })}
              fullWidth
              label="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("email", { required: "Email is required" })}
              fullWidth
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("password", { required: "Password is required" })}
              fullWidth
              type="password"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("password2", { required: "Password confirmation is required" })}
              fullWidth
              type="password"
              label="Confirm Password"
              error={!!errors.password2}
              helperText={errors.password2?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Register;
