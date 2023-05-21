import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid, List, ListItem, ListItemText, Pagination } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';

const TrackCreate = () => {
  const [track, setTrack] = useState({
    name: '',
    genres: '',
    description: '',
    bpm: 0,
    released: 0,
    album: '',
    user: 0,
  });
  
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { user, isAuthenticated } = useContext(AuthContext);
  const [albumSearch, setAlbumSearch] = useState('');
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userPaginationSize} = useContext(AuthContext);
  const { access } = useContext(AuthContext);

  const handleChange = (event) => {
    setTrack({ ...track, [event.target.name]: event.target.value });
  };

  const handleAlbumSearch = async (query, page) => {
    setAlbumSearch(query);
    if (query) {
      try {
        const response = await api.get(`/api/albums/?q=${query}&page=${page}&page_size=${userPaginationSize}`);
        setAlbumSearchResults(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error searching for albums:', error);
      }
    } else {
      setAlbumSearchResults([]);
    }
  };

  const handleAlbumSelection = (albumId, albumName) => {
    setSelectedAlbum(albumId);
    setAlbumSearch(albumName);
    setAlbumSearchResults([]);  // This will clear the search results
  };

  const handleSubmit = async (event) => {
    if(!isAuthenticated){
      toast.error('Error creating track. You need to login.');
      errors.user = "You must be logged in to create a track.";
    }

    event.preventDefault();
    if (track.bpm  < 0) {
       errors.bpm =  'BPM must be a non-negative integer.';
    } 

    if (track.released > new Date().getFullYear()) {
      errors.released = 'The released year cannot be in the future.';
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    track.user = user.id;
    track.album = selectedAlbum;

    try {
      const response = await api.post('/api/tracks/', track, {
        headers: { Authorization: `Bearer ${access}` }
      });
      navigate('/tracks/' + response.data.id + '/');
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
              InputProps={{
                readOnly: !isAuthenticated,
              }}
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
              InputProps={{
                readOnly: !isAuthenticated,
              }}
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
              error={errors.bpm ? true : false}
              helperText={errors.bpm}
              InputProps={{
                readOnly: !isAuthenticated,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={track.description}
              onChange={handleChange}
              InputProps={{
                readOnly: !isAuthenticated,
              }}
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
              error={errors.released ? true : false}
              helperText={errors.released}
              InputProps={{
                readOnly: !isAuthenticated,
              }}
            />
          </Grid>
         <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search for an Album"
              name="album_search"
              value={albumSearch}
              onChange={(event) => setAlbumSearch(event.target.value)}
              InputProps={{
                readOnly: !isAuthenticated,
              }}
            />
              <Button onClick={() => handleAlbumSearch(albumSearch, 1)}  disabled={!isAuthenticated} variant="contained" color="primary">
              Search
            </Button>
            <List>
              {albumSearchResults.map((album) => (
                <ListItem key={album.id} button onClick={() => handleAlbumSelection(album.id, album.name)}>
                  <ListItemText primary={album.name} />
                </ListItem>
              ))}
            </List>
            {albumSearchResults.length > 0 && 
              <Pagination count={totalPages} page={page} onChange={(event, value) => handleAlbumSearch(albumSearch, value)} />
            }
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" disabled={!isAuthenticated} variant="contained" color="primary">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default TrackCreate;
