import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';

const ArtistAverageTracksPerAlbumReport = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('artist_name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/artist_average_tracks_per_album/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = data.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Artist Average Tracks Per Album
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'artist_name'}
                  direction={orderBy === 'artist_name' ? order : 'asc'}
                  onClick={() => handleSort('artist_name')}
                >
                  Artist Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'average_tracks_per_album'}
                  direction={orderBy === 'average_tracks_per_album' ? order : 'asc'}
                  onClick={() => handleSort('average_tracks_per_album')}
                >
                  Avg. Tracks per Album
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.artist_id}>
                <TableCell component="th" scope="row">
                  {row.artist_name}
                </TableCell>
                <TableCell align="right">
                  {(row.average_tracks_per_album || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ArtistAverageTracksPerAlbumReport;
