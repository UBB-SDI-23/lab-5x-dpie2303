import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);

  const fetchAlbum = useCallback(async () => {
    try {
      const response = await api.get(`/api/albums/${id}/`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error fetching album:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbum();
  }, [id, fetchAlbum]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/albums/${id}/`, album);
      navigate('/albums');
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/albums/${id}/`);
      navigate('/albums');
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  if (!album) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Album Details
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={album.name}
              onChange={(event) => setAlbum({ ...album, name: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={album.description}
              onChange={(event) => setAlbum({ ...album, description: event.target.value })}
            />
          </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                label="Release Date"
                type="date"
                name="release_date"
                value={album.release_date}
                onChange={(event) => setAlbum({ ...album, release_date: event.target.value })}
                InputLabelProps={{
                shrink: true,
                }}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                label="Top Rank"
                name="top_rank"
                value={album.top_rank}
                onChange={(event) => setAlbum({ ...album, top_rank: event.target.value })}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                label="Copy Sales"
                name="copy_sales"
                value={album.copy_sales}
                onChange={(event) => setAlbum({ ...album, copy_sales: event.target.value })}
            />
            </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update Album
            </Button>
            <Button onClick={handleDelete} variant="contained" color="secondary">
              Delete Album
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AlbumDetail;
