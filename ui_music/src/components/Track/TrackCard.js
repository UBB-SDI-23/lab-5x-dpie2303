import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

const TrackCard = ({ track }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{track.name}</Typography>
        <Typography variant="subtitle1">Genres: {track.genres}</Typography>
        <Typography variant="subtitle1">Description: {track.description}</Typography>
        <Typography variant="subtitle1">BPM: {track.bpm}</Typography>
        <Typography variant="subtitle1">Released: {track.released}</Typography>
        <Typography variant="subtitle1">Collaborations: {track.collaborations_count}</Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/tracks/${track.id}`} variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TrackCard;
