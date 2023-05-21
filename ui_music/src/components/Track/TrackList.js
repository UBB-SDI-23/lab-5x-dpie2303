import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../../contexts/AuthContext';

import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import TrackCard from './TrackCard';

const TrackList = () => {
  const [tracks, setTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userPaginationSize} = useContext(AuthContext);


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await api.get('/api/tracks/', {
          params: { page: currentPage, page_size: userPaginationSize },
        });
        setTracks(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
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
          Tracks
        </Typography>
        <Button
          component={Link}
          to="/tracks/create"
          variant="contained"
          color="primary"
        >
          Add Track
        </Button>
      </Box>
      <Grid container spacing={2}>
        {tracks.map((track) => (
          <Grid item key={track.id} xs={12} sm={6} md={4}>
            <TrackCard track={track} />
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

export default TrackList;