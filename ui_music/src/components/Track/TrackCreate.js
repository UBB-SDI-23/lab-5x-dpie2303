import React, { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';

const TrackCreate = () => {
  const [track, setTrack] = useState({
    name: '',
    genres: '',
    description: '',
    bpm: 0,
    released: 0,
    album: '',
    user: 0,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { user, isAuthenticated } = useContext(AuthContext);

  const handleChange = (event) => {
    setTrack({ ...track, [event.target.name]: event.target.value });
  };
  
  const handleSubmit = async (event) => {
    if(!isAuthenticated){
      toast.error('Error creating track. you need to login.');
      errors.user = "You must be logged in to create an track.";
    }
    event.preventDefault();
    if (track.bpm  < 0) {
       errors.bpm =  'BPM must be a non-negative integer.';
    } 
    if (track.released > new Date().getFullYear()) {
      errors.released = 'The released year cannot be in the future.';
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    track.user = user.id;
    console.log(track);
    try {
      // no need to parse to int again, track.bpm is already an integer
      await api.post('/api/tracks/', track);
      toast.success('Track created successfully!');
      navigate('/tracks');
    } catch (error) {
      console.error('Error creating track:', error);
      toast.error('Error creating track.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Track
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={track.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Genres"
              name="genres"
              value={track.genres}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="BPM"
              name="bpm"
              value={track.bpm}
              onChange={handleChange}
              error={errors.bpm ? true : false}
              helperText={errors.bpm}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={track.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Release Year"
              name="released"
              value={track.released}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.released ? true : false}
              helperText={errors.released}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Album ID"
              name="album"
              value={track.album}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default TrackCreate;