import React, { useState, useEffect, useCallback ,useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const TrackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [errors, setErrors] = useState({});
  const { access } = useContext(AuthContext);


  const fetchTrack = useCallback(async () => {
    try {
      const response = await api.get(`/api/tracks/${id}/`);
      setTrack(response.data);
    } catch (error) {
      console.error('Error fetching track:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchTrack();
  }, [id, fetchTrack]);

  const handleUpdate = async () => {

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

    try {
      await api.put(`/api/tracks/${id}/`, track, {
        headers: { Authorization: `Bearer ${access}` }
      });
      navigate(`/tracks/${id}`);
    } catch (error) {
      console.error('Error updating track:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/tracks/${id}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      navigate('/tracks');
    } catch (error) {
      console.error('Error deleting track:', error);
    }
  };

  if (!track) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Track Details
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={track.name}
              onChange={(event) => setTrack({ ...track, name: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Genres"
              name="genres"
              value={track.genres}
              onChange={(event) => setTrack({ ...track, genres: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={track.description}
              onChange={(event) => setTrack({ ...track, description: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="BPM"
              name="bpm"
              value={track.bpm}
              onChange={(event) => setTrack({ ...track, bpm: event.target.value })}
              error={errors.bpm ? true : false}
              helperText={errors.bpm}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Released"
              name="released"
              value={track.released}
              onChange={(event) => setTrack({ ...track, released: event.target.value })}
              error={errors.released ? true : false}
              helperText={errors.released}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update Track
            </Button>
            <Button onClick={handleDelete} variant="contained" color="secondary">
              Delete Track
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default TrackDetail;
