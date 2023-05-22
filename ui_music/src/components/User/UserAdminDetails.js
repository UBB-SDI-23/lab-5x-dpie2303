import React, { useState, useEffect,useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Container, Typography, TextField, Button, Grid, FormControlLabel, Switch } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const UserAdminDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUser] = useState(null);
  const { access, user, isAuthenticated } = useContext(AuthContext);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`/api/admin/profiles/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [userId,access]);

  useEffect(() => {
    if(!isAuthenticated || !user.is_admin) {
      navigate('/');
    };
    fetchUser();
  }, [fetchUser,isAuthenticated, user, navigate]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/admin/profiles/${userId}/`, userProfile, {
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

  if (!userProfile) {
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
              value={userProfile.username}
              onChange={(event) => setUser({ ...userProfile, username: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              value={userProfile.email}
              onChange={(event) => setUser({ ...userProfile, email: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              name="is_regular"
              control={<Switch checked={userProfile.is_regular} onChange={(event) => setUser({ ...userProfile, is_regular: event.target.checked })} />}
              label="Regular User"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              name="is_moderator"
              control={<Switch checked={userProfile.is_moderator} onChange={(event) => setUser({ ...userProfile, is_moderator: event.target.checked })} />}
              label="Moderator User"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              name="is_admin"
              control={<Switch checked={userProfile.is_admin} onChange={(event) => setUser({ ...userProfile, is_admin: event.target.checked })} />}
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