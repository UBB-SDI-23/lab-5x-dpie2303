import React, { useState, useEffect,useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Container, Typography, TextField, Button, Grid, FormControlLabel, Switch } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const UserAdminDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const { access } = useContext(AuthContext);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`/api/admin/profiles/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = async () => {
    try {
      console.log(user);
      await api.put(`/api/admin/profiles/${userId}/`, user, {
        headers: { Authorization: `Bearer ${access}` }
      });
      toast.success('User updated successfully.');
    } catch (error) {
      toast.error('Error updating user.');
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/profiles/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      navigate('/admin/users/');
    } catch (error) {
      toast.error('Error deleting user.');
      console.error('Error deleting user:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={user.username}
              onChange={(event) => setUser({ ...user, username: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={(event) => setUser({ ...user, email: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={user.is_regular} onChange={(event) => setUser({ ...user, is_regular: event.target.checked })} />}
              label="Regular User"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={user.is_moderator} onChange={(event) => setUser({ ...user, is_moderator: event.target.checked })} />}
              label="Moderator User"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={user.is_admin} onChange={(event) => setUser({ ...user, is_admin: event.target.checked })} />}
              label="Admin User"
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update User
            </Button>
            <Button onClick={handleDelete} variant="contained" color="secondary">
              Delete User
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserAdminDetails;