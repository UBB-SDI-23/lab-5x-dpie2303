import React, { useState, useEffect,useContext } from 'react';
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
import ArtistCard from './ArtistCard';
import { AuthContext } from '../../contexts/AuthContext';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userPaginationSize} = useContext(AuthContext);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/api/artists/', {
          params: { page: currentPage, page_size: userPaginationSize},
        });
        setArtists(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, [currentPage,userPaginationSize]);

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
          Artists
        </Typography>
        <Button
          component={Link}
          data-testid="add-artist"
          to="/artists/create"
          variant="contained"
          color="primary"
        >
          Add Artist
        </Button>
      </Box>
      <Grid container spacing={2}>
        {artists.map((artist) => (
          <Grid item key={artist.id} xs={12} sm={6} md={4}>
            <ArtistCard artist={artist} />
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

export default ArtistList;