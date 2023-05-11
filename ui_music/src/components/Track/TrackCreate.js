import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrackCreate = () => {
  const [track, setTrack] = useState({
    name: '',
    genres: '',
    description: '',
    bpm: 0,
    released: 0,
    album: '',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    // check if the value should be an integer
    if (name === 'bpm' || name === 'released' || name === 'album') {
      // parse the value to an integer before setting the state
      setTrack(prevTrack => ({ ...prevTrack, [name]: parseInt(value) }));
    } else {
      setTrack(prevTrack => ({ ...prevTrack, [name]: value }));
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (track.bpm < 0) {
      toast.error('BPM must be a non-negative integer.');
      return;
    }
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