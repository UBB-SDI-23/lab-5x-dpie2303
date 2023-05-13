import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const AlbumCreate = () => {
  const [album, setAlbum] = useState({
    name: '',
    description: '',
    top_rank: '',
    copy_sales: '',
    release_date: '',
    record_company: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});


  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = {};
    if (album.copy_sales < 0) {
      errors.copy_sales = "Copy sales must be a non-negative integer.";
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    try {
      await api.post('/api/albums/', album);
      navigate('/albums');
    } catch (error) {
      toast.error('Error creating album.');
      console.error('Error creating album:', error);
    }
  };

  const handleChange = (event) => {
    setAlbum({ ...album, [event.target.name]: event.target.value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Album
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={album.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={album.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Top Rank"
              name="top_rank"
              value={album.top_rank}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Copy Sales"
              name="copy_sales"
              value={album.copy_sales}
              onChange={handleChange}
              error={errors.copy_sales ? true : false}
              helperText={errors.copy_sales}
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
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Record Company ID"
              name="record_company"
              value={album.record_company}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AlbumCreate;