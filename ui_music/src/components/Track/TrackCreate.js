import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const TrackCreate = () => {
  const [track, setTrack] = useState({
    name: '',
    genres: '',
    description: '',
    bpm: '',
    released: '',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setTrack({ ...track, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/api/tracks/', track);
      navigate('/tracks');
    } catch (error) {
      console.error('Error creating track:', error);
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
              label="Release Date"
              type="date"
              name="released"
              value={track.released}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
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