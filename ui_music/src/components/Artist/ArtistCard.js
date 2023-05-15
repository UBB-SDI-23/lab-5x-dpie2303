// ArtistCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

const ArtistCard = ({ artist }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{artist.name}</Typography>
        <Typography variant="subtitle1">Country: {artist.country_of_origin}</Typography>
        <Typography variant="subtitle1">Sex: {artist.sex}</Typography>
        <Typography variant="subtitle1">Description: {artist.description}</Typography>
        <Typography variant="subtitle1">Birthday: {artist.birth_day}</Typography>
        <Typography variant="subtitle1">Colaborations: {artist.collaborations_count}</Typography>
        {artist.user && (
          <Typography variant="subtitle1">
            Added by: 
            <Link to={`/userprofile/${artist.user.id}`}>{artist.user.username}</Link>
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/artists/${artist.id}`} variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ArtistCard;
