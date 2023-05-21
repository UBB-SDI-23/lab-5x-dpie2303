import React, { useState, useEffect, useCallback,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { Container, Typography, TextField, Button, Grid, List, ListItem, ListItemText, Pagination } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const ArtistDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [collaborationType, setCollaborationType] = useState('');
    const [royaltyPercentage, setRoyaltyPercentage] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [errors, setErrors] = useState({});
    const { user, isAuthenticated } = useContext(AuthContext);
    const { userPaginationSize} = useContext(AuthContext);
    const { access } = useContext(AuthContext);


  
    const fetchArtist = useCallback(async () => {
      try {
        const response = await api.get(`/api/artists/${id}/`);
        setArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    }, [id]);
  
    useEffect(() => {
      fetchArtist();
    }, [id, fetchArtist]);

    const handleUpdate = async () => {
      const today = new Date();
      const birthDay = new Date(artist.birth_day);
      if(birthDay > today) {
        errors.birth_day = "The birth day cannot be in the future.";
      }
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }

      try {
        await api.put(`/api/artists/${id}/`, artist, {
          headers: { Authorization: `Bearer ${access}` }
        });
        navigate(`/artists/${id}`);
      } catch (error) {
        toast.error('Error updating artist.');
        console.error('Error updating artist:', error);
      }
    };

    const handleDelete = async () => {
      try {
        await api.delete(`/api/artists/${id}/`, {
          headers: { Authorization: `Bearer ${access}` }
        });
        navigate('/artists');
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
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

    const handleTrackSelection = (trackId, trackName) => {
      setSelectedTrack(trackId);
      handleSearch('', 1, trackName);
    };

    const handleAddTrack = async () => {
      if (!selectedTrack) {
        return;
      }
      if(!isAuthenticated){
        toast.error('Error creating track. you need to login.');
        errors.user = "You must be logged in to create an track.";
      }

      if (royaltyPercentage < 0) {
        errors.royalty_percentage = "Royalty percentage must be a non-negative decimal.";
      }
      if (royaltyPercentage > 100) {
        errors.royalty_percentage = "Royalty percentage must not be greater than 100.";
      }
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
  
      const collaboration = {
        track_id: selectedTrack,
        collaboration_type: collaborationType,
        royalty_percentage: parseFloat(royaltyPercentage),
        user : user.id
      };

      console.log(collaboration);
       try {
        await api.post(`/api/artists/${id}/tracks/`, collaboration, {
          headers: { Authorization: `Bearer ${access}` }
        });
        fetchArtist();
        setSearchQuery('');
        setSearchResults([]);
        setSelectedTrack(null);
        setCollaborationType('');
        setRoyaltyPercentage('');
      } catch (error) {
        toast.error('Error adding track to artist.')
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
              error={errors.birth_day ? true : false}
              helperText={errors.birth_day}
            />
          </Grid>
            <Grid item xs={12}>
              <Button onClick={handleUpdate} variant="contained" color="primary">
                Update Artist
              </Button>
              <Button onClick={handleDelete} variant="contained" color="secondary">
                Delete Artist
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Search for a track"
                name="track_search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <Button onClick={() => handleSearch(searchQuery, 1)} variant="contained" color="primary">
              Search
              </Button>
            </Grid>
            <Grid item xs={12}>
              <List>
                {searchResults.map((track) => (
                  <ListItem key={track.id} button onClick={() => handleTrackSelection(track.id, track.name)}>
                    <ListItemText primary={track.name} />
                  </ListItem>
                ))}
              </List>
              {searchResults.length > 0 && 
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
              }
            </Grid>
            {selectedTrack && (
              <>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    label="Collaboration Type"
                    name="collaboration_type"
                    value={collaborationType}
                    onChange={(event) => setCollaborationType(event.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    label="Royalty Percentage"
                    name="royalty_percentage"
                    type="number"
                    value={royaltyPercentage}
                    onChange={(event) => setRoyaltyPercentage(event.target.value)}
                    error={errors.royalty_percentage ? true : false}
                    helperText={errors.royalty_percentage}
                  />
              </Grid>
                <Grid item xs={12}>
                  <Button onClick={handleAddTrack} variant="contained" color="primary">
                    Add Collaboration
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Container>
    );
};

export default ArtistDetails;
