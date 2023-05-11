import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Pagination,
} from '@mui/material';
import AlbumCard from './AlbumCard';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minCopySales, setMinCopySales] = useState(''); 

  const fetchAlbums = useCallback(async () => {
    try {
      const response = await api.get('/api/albums/', {
          params: { page: currentPage, page_size: 10, min_copy_sales: minCopySales },
        });
      setAlbums(response.data.albums);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  }, [currentPage, minCopySales]); // fetchAlbums now has dependencies

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]); // fetchAlbums is included in dependencies array

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // This will trigger the useEffect hook to run again.
  };
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Albums
        </Typography>
        <div>
          <TextField
            value={minCopySales}
            onChange={(e) => setMinCopySales(e.target.value)}
            label="Min Copy Sales"
            type="number"
          />
          <Button onClick={handleFilterChange} variant="contained" color="primary">
            Filter
          </Button>
          <Button
            component={Link}
            to="/albums/create"
            variant="contained"
            color="primary"
          >
            Add Album
          </Button>
        </div>
      </Box>
      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid item key={album.id} xs={12} sm={6} md={4}>
            <AlbumCard album={album} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default AlbumList;