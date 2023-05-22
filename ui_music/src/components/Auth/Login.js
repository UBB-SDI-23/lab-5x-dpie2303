import  { useContext , useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../../contexts/AuthContext'; 

import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setIsAuthenticated, setUser, setAccess, setRefresh } = useContext(AuthContext);
  const [ setServerErrors] = useState({});
  const navigate = useNavigate(); // Use useNavigate instead of Navigate

  const onSubmit = async data => {
    try {
        const response = await api.post('/api/token/', data)
        const access = response.data.access;
        const refresh = response.data.refresh;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        const userResponse = await api.get(`api/user/${data.username}/`, {
            headers: { Authorization: `Bearer ${access}` }
        });

        localStorage.setItem('user', JSON.stringify(userResponse.data));
        setUser(userResponse.data);
        setIsAuthenticated(true);
        setAccess(access);
        setRefresh(refresh);
        navigate('/'); 

    } catch (error) {
        setServerErrors(error.response.data);
    }
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