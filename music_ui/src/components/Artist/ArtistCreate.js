// src/components/ArtistCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const ArtistCreate = () => {
  const [artist, setArtist] = useState({
    name: '',
    contry_of_origin: '',
    sex: '',
    description: '',
    birth_day: '',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setArtist({ ...artist, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/api/artists/', artist);
      navigate('/artists');
    } catch (error) {
      console.error('Error creating artist:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Artist
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={artist.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Country of Origin"
              name="contry_of_origin"
              value={artist.contry_of_origin}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Sex"
              name="sex"
              value={artist.sex}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={artist.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Birthday"
              type="date"
              name="birth_day"
              value={artist.birth_day}
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

export default ArtistCreate;
