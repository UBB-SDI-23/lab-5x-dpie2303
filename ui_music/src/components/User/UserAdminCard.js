import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

const UserAdminCard = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{user.username}</Typography>
        <Typography variant="subtitle1">Email: {user.email}</Typography>
        <Typography variant="subtitle1">Regular: {user.is_regular ? 'Yes' : 'No'}</Typography>
        <Typography variant="subtitle1">Moderator: {user.is_moderator ? 'Yes' : 'No'}</Typography>
        <Typography variant="subtitle1">Admin: {user.is_admin ? 'Yes' : 'No'}</Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/admin/profiles/${user.id}`} variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserAdminCard;
