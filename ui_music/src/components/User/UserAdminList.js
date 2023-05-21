import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Pagination
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import UserAdminCard from './UserAdminCard';



const UserAdminList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const { userPaginationSize } = useContext(AuthContext);
  const { access , user, isAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();
  const fetchUsers = useCallback(async () => {
    try {
    const response = await api.get('api/admin/profiles/', {
        params: { page: currentPage, page_size: userPaginationSize, q: query },
        headers: { Authorization: `Bearer ${access}` }
    });
      setUsers(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentPage, query, userPaginationSize,access]);

  useEffect(() => {
    if(!isAuthenticated || !user.is_admin) {
      navigate('/');
    };
    fetchUsers();
  }, [fetchUsers, isAuthenticated,user,navigate]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
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
          User Profiles
        </Typography>
        <div>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            label="Search Users"
          />
          <Button onClick={handleFilterChange} variant="contained" color="primary">
            Filter
          </Button>
        </div>
      </Box>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <UserAdminCard user={user} />
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

export default UserAdminList;
