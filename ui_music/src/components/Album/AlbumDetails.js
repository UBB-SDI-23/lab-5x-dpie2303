import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await api.get(`/api/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error('Error fetching album:', error);
      }
    };

    fetchAlbum();
  }, [id]);

  if (!album) {
    return null;
  }

  return (
    <Container>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>{album.name}</Typography>
        <Typography variant="h6">Description: {album.description}</Typography>
        <Typography variant="h6">Top Rank: {album.top_rank}</Typography>
        <Typography variant="h6">Copy Sales: {album.copy_sales}</Typography>
        <Typography variant="h6">Release Date: {album.release_date}</Typography>
        <Typography variant="h6">Record Company: {album.record_company.name}</Typography>
      </Box>
    </Container>
  );
};

export default AlbumDetail;