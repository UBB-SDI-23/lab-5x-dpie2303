/ src/components/ArtistDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid, Select, MenuItem, Box } from '@mui/material';
import debounce from 'lodash.debounce'; // don't forget to install lodash
onst ArtistDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedTrack, setSelectedTrack] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
  
    const fetchArtist = useCallback(async () => {
      try {
        const response = await api.get(`/api/artists/${id}/`);
        setArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    }, [id]);
  
    const debouncedSearch = useCallback(debounce(handleSearch, 500), []); // Debounce search
  
    useEffect(() => {
      fetchArtist();
    }, [id, fetchArtist]);

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
  async function handleSearch(query) {
    setSearchQuery(query);

    if (query) {
      try {
        const response = await api.get(`/api/tracks/search/?q=${query}&page=${page}&size=5`); // Limit results to 5
        setSearchResults(response.data.results);
        setTotalPages(response.data.total_pages);
        setIsSelectOpen(true);
      } catch (error) {
        console.error('Error searching for tracks:', error);
      }
    } else {
      setSearchResults([]);
      setIsSelectOpen(false);
    }
  }

  // Add functions to handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      handleSearch(searchQuery);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      handleSearch(searchQuery);
    }
  };

  const handleAddTrack = async (trackId) => {
    const collaboration = {
      track_id: trackId,
      collaboration_type: 'Default',
      royalty_percentage: 0,
    };

    try {
      await api.post(`/api/artists/${id}/tracks/`, collaboration);
      fetchArtist();
    } catch (error) {
      console.error('Error adding track to artist:', error);
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
          <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search for a track"
                  name="track_search"
                  value={searchQuery}
                  onChange={(event) => debouncedSearch(event.target.value)}
                />
                <Select
                  open={isSelectOpen}
                  onClose={() => setIsSelectOpen(false)}
                  value={selectedTrack}
                  onChange={(event) => setSelectedTrack(event.target.value)}
                >
                  {searchResults.map((track) => (
                    <MenuItem key={track.id} value={track.id}>
                      {track.name} ({track.released})
                    </MenuItem>
                  ))}
                  <Box sx={{ p: 1 }}>
                    <Button onClick={handlePrevPage} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button onClick={handleNextPage} disabled={page === totalPages}>
                      Next
                    </Button>
                  </Box>
                </Select>
                <Button onClick={() => handleAddTrack(selectedTrack)} variant="contained" color="primary">
                  Add this track
                </Button>
              </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ArtistDetails;