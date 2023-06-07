import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import TrackCard from './TrackCard';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../api';  // replace with your API module

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { access } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user's playlist
      api.get(`/api/users/${user.id}/playlist/`).then(response => {
        setPlaylist(response.data);
        console.log(response.data.tracks);
      });
    }
  }, [user, isAuthenticated]);

  const handleAddToPlaylist = (trackId) => {
    // Add track to user's playlist
    api.post(`/api/playlist/${user.id}/add_track/${trackId}/`, {},{
        headers: { Authorization: `Bearer ${access}`}
      }).then(() => {
      // Refresh playlist
      api.get(`/api/users/${user.id}/playlist/`).then(response => {
        setPlaylist(response.data);
      });

      setRecommendations(recommendations.filter(track => track.id !== trackId));

    });
  };

  const handleRemoveFromPlaylist = (trackId) => {
    // Remove track from user's playlist
    api.delete(`/api/playlist/${user.id}/remove_track/${trackId}/`,{
        headers: { Authorization: `Bearer ${access}`}
      }).then(() => {
      // Refresh playlist
      api.get(`/api/users/${user.id}/playlist/`).then(response => {
        setPlaylist(response.data);
      });
    });
  };

  const handleGetRecommendations = () => {
    // Fetch recommendations
    api.get(`/api/recommend_tracks/${user.id}/`).then(response => {
      setRecommendations(response.data);
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        User Playlist
      </Typography>
      <Grid container spacing={2}>
      {isAuthenticated && playlist && playlist.tracks.map((track) => (
        <Grid item key={track.id} xs={12} sm={6} md={4}>
            <TrackCard track={track} onRemove={handleRemoveFromPlaylist} />
        </Grid>
        ))}
      </Grid>
      <Typography variant="h4" gutterBottom align="center">
        Recommended Songs
    </Typography>
    <Box mt={2}>  {/* This adds margin-top */}
    <Button variant="contained" color="primary" onClick={handleGetRecommendations}>
        Get Recommendations
    </Button>
    </Box>
    <Grid container spacing={2}>
    {recommendations.map((track) => (
        <Grid item key={track.id} xs={12} sm={6} md={4}>
        <TrackCard track={track} onAdd={handleAddToPlaylist} />
        </Grid>
    ))}
        </Grid>
    </Container>
  );
};

export default Playlist;
