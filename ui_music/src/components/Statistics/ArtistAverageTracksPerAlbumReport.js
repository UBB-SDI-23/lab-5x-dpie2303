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
  TablePagination,
} from '@mui/material';

const ArtistAverageTracksPerAlbumReport = () => {
  const [data, setData] = useState({ results: [] });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/artist_average_tracks_per_album/', {
          params: {
            page: page + 1,
            page_size: rowsPerPage,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Artist Average Tracks Per Album
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist Name</TableCell>
              <TableCell align="right">Avg. Tracks per Album</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.results.map((row) => (
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
      <TablePagination
        component="div"
        count={data.count || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default ArtistAverageTracksPerAlbumReport;