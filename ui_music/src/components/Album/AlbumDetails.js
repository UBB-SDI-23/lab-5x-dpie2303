import React, { useState, useEffect,useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [errors, setErrors] = useState({});
  const { access } = useContext(AuthContext);
  const {user,isAuthenticated} = useContext(AuthContext);
  const [isEditable, setIsEditable] = useState(false);


  const fetchAlbum = useCallback(async () => {
    try {
      const response = await api.get(`/api/albums/${id}/`);
      setAlbum(response.data);
      setIsEditable((isAuthenticated && (user.is_admin || user.is_moderator)) || (isAuthenticated && response.data.user.id === user.id));
    } catch (error) {
      console.error('Error fetching album:', error);
    }
  }, [id,isAuthenticated,user]);

  useEffect(() => {
    fetchAlbum();
  }, [id, fetchAlbum]);

  const handleUpdate = async () => {
    let errors = {};
    if (album.copy_sales < 0) {
      errors.copy_sales = "Copy sales must be a non-negative integer.";
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      await api.put(`/api/albums/${id}/`, album, {
        headers: { Authorization: `Bearer ${access}`}
      });
      navigate(`/albums/${id}`);
      setIsEditable((isAuthenticated && (user.is_admin || user.is_moderator)) || (isAuthenticated && album.user.id === user.id));

    } catch (error) {
      toast.error('Error updating album.');
      console.error('Error updating album:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/albums/${id}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
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
              InputProps={{
                readOnly: !isEditable,
              }}
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
              InputProps={{
                readOnly: !isEditable,
              }}
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
                InputProps={{
                  readOnly: !isEditable,
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
                InputProps={{
                  readOnly: !isEditable,
                }}
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
                error={errors.copy_sales ? true : false}
                helperText={errors.copy_sales}
                InputProps={{
                  readOnly: !isEditable,
                }}
            />
            </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdate}  disabled={!isEditable} variant="contained" color="primary">
              Update Album
            </Button>
            <Button onClick={handleDelete}  disabled={!isEditable} variant="contained" color="secondary">
              Delete Album
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AlbumDetail;
