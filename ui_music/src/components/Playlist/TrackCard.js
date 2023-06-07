import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const TrackCard = ({ track, onAdd, onRemove }) => {
  console.log(track);  // Add this line to log the track object

  // Check if track is not null or undefined
  if (!track) {
    return <div>Error: track is null or undefined</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{track.name}</Typography>
        <Typography variant="subtitle1">Release year: {track.released}</Typography>
        {onAdd && <Button onClick={() => onAdd(track.id)}>Add to Playlist</Button>}
        {onRemove && <Button onClick={() => onRemove(track.id)}>Remove from Playlist</Button>}
      </CardContent>
    </Card>
  );
};

export default TrackCard;
