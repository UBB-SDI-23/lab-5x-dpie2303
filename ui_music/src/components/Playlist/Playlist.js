import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Box, Button, List, TextField, Pagination } from '@mui/material';
import TrackCard from './TrackCard';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../api';  // replace with your API module

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { user, isAuthenticated, userPaginationSize} = useContext(AuthContext);
  const { access } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

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

      setSearchResults([]);
      setSearchQuery('');
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

  async function handleSearch(query, page, trackName = '') {
    setSearchQuery(trackName || query);
    if (query && !trackName) {
      try {
        const response = await api.get(`/api/tracks/search/?q=${query}&page=${page}&page_size=${userPaginationSize}`); // Limit results to 5
        setSearchResults(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error searching for tracks:', error);
      }
    } else {
      setSearchResults([]);
    }
  }

  const handlePageChange = (event, value) => {
    setPage(value);
    handleSearch(searchQuery, value);
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
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
          <Typography variant="h4" gutterBottom align="center" disabled={!isAuthenticated} > 
            Recommended Songs
          </Typography>
          <Box mt={2}>  {/* This adds margin-top */}
            <Button variant="contained" color="primary" onClick={handleGetRecommendations} disabled={!isAuthenticated} >
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
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Search for a track"
              name="track_search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              InputProps={{
                readOnly: !isAuthenticated,
              }} 
            />
            <Button onClick={() => handleSearch(searchQuery, 1)} variant="contained" disabled={!isAuthenticated} color="primary">
              Search
            </Button>
          </Box>
          <Grid container spacing={2}>
            {searchResults.map((track) => (
              <Grid item key={track.id} xs={12} sm={6} md={4}>
                <TrackCard track={track} onAdd={handleAddToPlaylist} />
              </Grid>
            ))}
          </Grid>
          {searchResults.length > 0 && 
            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
          }
        </Grid>
      </Grid>
    </Container>
  );
}; 

export default Playlist;
