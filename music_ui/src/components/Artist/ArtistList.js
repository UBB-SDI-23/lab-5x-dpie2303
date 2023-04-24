import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';

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
            <Card>
              <CardContent>
                <Typography variant="h5">{artist.name}</Typography>
                <Typography variant="subtitle1">Country: {artist.contry_of_origin}</Typography>
                <Typography variant="subtitle1">Sex: {artist.sex}</Typography>
                <Typography variant="subtitle1">Description: {artist.description}</Typography>
                <Typography variant="subtitle1">Birthday: {artist.birth_day}</Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/artists/${artist.id}`} variant="outlined">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ArtistList;
