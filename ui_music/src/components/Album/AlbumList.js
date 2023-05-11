import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import AlbumCard from './AlbumCard';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get('/api/albums/', {
            params: { page: currentPage, page_size: 10 },
          });
          setAlbums(response.data.albums);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching albums:', error);
        }
      };
  
      fetchAlbums();
    }, [currentPage]);
  
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
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
          <Button
            component={Link}
            to="/albums/create"
            variant="contained"
            color="primary"
          >
            Add Album
          </Button>
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