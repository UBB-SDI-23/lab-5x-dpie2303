// src/components/ArtistDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const ArtistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await api.get(`/api/artists/${id}/`);
        setArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };

    fetchArtist();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/artists/${id}/`, artist);
      navigate('/artists');
    } catch (error) {
      console.error('Error updating artist:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/artists/${id}/`);
      navigate('/artists');
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Artist Details
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={artist.name}
              onChange={(event) => setArtist({ ...artist, name: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Country of Origin"
              name="country_of_origin"
              value={artist.country_of_origin}
              onChange={(event) => setArtist({ ...artist, country_of_origin: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Sex"
              name="sex"
              value={artist.sex}
              onChange={(event) => setArtist({ ...artist, sex: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={artist.description}
              onChange={(event) => setArtist({ ...artist, description: event.target.value })}
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
              onChange={(event) => setArtist({ ...artist, birth_day: event.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
            <Button onClick={handleDelete} variant="contained" color="secondary" style={{ marginLeft: '16px' }}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ArtistDetails;