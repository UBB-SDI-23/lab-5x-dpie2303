import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, Typography, Box } from '@mui/material';

const TrackDetail = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await api.get(`/api/tracks/${id}`);
        setTrack(response.data);
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };

    fetchTrack();
  }, [id]);

  if (!track) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {track.name}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Genres: {track.genres.join(", ")}</Typography>
        <Typography variant="h6">Description: {track.description}</Typography>
        <Typography variant="h6">BPM: {track.bpm}</Typography>
        <Typography variant="h6">Released: {track.released}</Typography>
        <Typography variant="h6">Album: {track.album}</Typography>
        <Typography variant="h6">Collaborations Count: {track.collaborations_count}</Typography>
      </Box>
    </Container>
  );
};

export default TrackDetail;

