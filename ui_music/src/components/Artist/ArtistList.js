// ArtistList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
} from '@mui/material';
import ArtistCard from './ArtistCard';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/api/artists/');
        setArtists(response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Artists
        </Typography>
        <Button component={Link} to="/artists/create" variant="contained" color="primary">
          Add Artist
        </Button>
      </Box>
      <Grid container spacing={2}>
        {artists.map((artist) => (
          <Grid item key={artist.id} xs={12} sm={6} md={4}>
            <ArtistCard artist={artist} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ArtistList;
