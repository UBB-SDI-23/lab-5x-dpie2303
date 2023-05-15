import  { useContext , useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { AuthContext } from '../../contexts/AuthContext'; 

import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setIsAuthenticated, setUser, setToken } = useContext(AuthContext);
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate(); // Use useNavigate instead of Navigate


  const onSubmit = data => {

    console.log(data);
    api.post('/api/token/', data)
      .then(response => {
        const access = response.data.access;
        const refresh = response.data.refresh;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        
        // Now fetch the user data
        api.get(`api/user/${data.username}/`, {
            headers: { Authorization: `Bearer ${access}` }
        })
        .then(response => {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            setIsAuthenticated(true);
            setToken(access);
            navigate('/'); 
        });
      })
      .catch(error => {
        setServerErrors(error.response.data);
      });
  };


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
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
              {...register("password", { required: "Password is required" })}
              fullWidth
              type="password"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;