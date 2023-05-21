import React, { useState, useEffect, useCallback,useContext } from 'react';
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
import { AuthContext } from '../../contexts/AuthContext';


const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minCopySales, setMinCopySales] = useState('');
  const { userPaginationSize} = useContext(AuthContext);
 

  const fetchAlbums = useCallback(async () => {
    try {
      const response = await api.get('/api/albums/', {
          params: { page: currentPage, page_size: userPaginationSize, min_copy_sales: minCopySales },
        });
      setAlbums(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  }, [currentPage, minCopySales, userPaginationSize]); // fetchAlbums now has dependencies

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]); // fetchAlbums is included in dependencies array

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Albums
          </Typography>
        </Box>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                fullWidth
                value={minCopySales}
                onChange={(e) => setMinCopySales(e.target.value)}
                label="Min Copy Sales"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                fullWidth
                component={Link}
                to="/albums/create"
                variant="contained"
                color="primary"
              >
                Add Album
              </Button>
            </Grid>
          </Grid>
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