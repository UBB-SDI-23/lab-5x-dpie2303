import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

const AlbumCard = ({ album }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{album.name}</Typography>
        <Typography variant="subtitle1">Top Rank: {album.top_rank}</Typography>
        <Typography variant="subtitle1">Copy Sales: {album.copy_sales}</Typography>
        <Typography variant="subtitle1">Release Date: {album.release_date}</Typography>
        <Typography variant="subtitle1">Top Rank: {album.top_rank}</Typography>
        <Typography variant="subtitle1">Description: {album.description}</Typography>
        <Typography variant="subtitle1">Tracks Count: {album.tracks_count}</Typography>
        {album.user && (
          <Typography variant="subtitle1">
            Added by: 
            <Link to={`/userprofile/${album.user.id}`}>{album.user.username}</Link>
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/albums/${album.id}`} variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default AlbumCard;