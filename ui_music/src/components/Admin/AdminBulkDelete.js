import React, { useState, useEffect, useContext,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  ButtonGroup,
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

const AdminBulkDelete = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState([]);
  const [type, setType] = useState('record_companies');
  const { userPaginationSize, access, user, isAuthenticated} = useContext(AuthContext);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState('');
  const [view, setView] = useState('bulkDelete'); // new state for switching views
  const navigate = useNavigate();
  // Method to handle the SQL Query execution
  const executeSqlQuery = async () => {
    try {
      const response = await api.post(`/api/admin/execute_sql/`, { query: sqlQuery }, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setSqlResult(JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to execute SQL query");
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(`/api/${type}/`, {
        params: {
          page: currentPage,
          page_size: userPaginationSize,
        },
        headers: { Authorization: `Bearer ${access}` },
      });
      setTotalPages(response.data.total_pages);
      if(type === 'trackartistcolab') {
        const formattedData = response.data.results.map(item => ({...item, name: `${item.artist.name} - ${item.track.name}`}));
        setItems(formattedData);
      } else {
        setItems(response.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  }, [type, currentPage, userPaginationSize, access]); 



  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleBulkDelete = async () => {
    try {
      await api.post(`/api/admin/bulk_delete/${type}/`, { ids: selected }, {
        headers: { Authorization: `Bearer ${access}` }
      });
      setSelected([]);
      fetchItems(); // Fetch items again to refresh the page
      // alert("Items successfully deleted");
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to delete items");
    }
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setCurrentPage(1);
    setSelected([]);
    fetchItems();
  };

  useEffect(() => {
    if(!isAuthenticated || !user.is_admin) {
      navigate('/');
    };
    fetchItems();
  }, [currentPage, type, userPaginationSize,isAuthenticated,user,navigate,fetchItems]);



  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handlePageChange = (event, value) => {
    setCurrentPage(value );
  };

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <ButtonGroup color="primary" variant="contained" sx={{ mb: 2 }}>
          <Button onClick={() => setView('bulkDelete')} disabled={view === 'bulkDelete'}>Bulk Delete</Button>
          <Button onClick={() => setView('executeSQL')} disabled={view === 'executeSQL'}>Execute SQL Query</Button>
        </ButtonGroup>
  
        {view === 'bulkDelete' && (
          <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Admin Bulk Delete
            </Typography>
            <FormControl variant="filled" sx={{ minWidth: 200 }}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <MenuItem value={'record_companies'}>Record Companies</MenuItem>
                  <MenuItem value={'trackartistcolab'}>Collaborations</MenuItem>
                  <MenuItem value={'artists'}>Artists</MenuItem>
                  <MenuItem value={'tracks'}>Tracks</MenuItem>
                  <MenuItem value={'albums'}>Albums</MenuItem>
                </Select>
              </FormControl>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < items.length}
                      checked={items.length > 0 && selected.length === items.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  {type === 'trackartistcolab' && <TableCell>Collaboration Type</TableCell>}
                  {type === 'record_companies' && <TableCell>Founded Date</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      {type === 'trackartistcolab' && <TableCell>{row.collaboration_type}</TableCell>}
                      {type === 'record_companies' && <TableCell>{new Date(row.founded_date).toDateString()}</TableCell>}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
            <Button onClick={handleBulkDelete} variant="contained" color="secondary" sx={{ mt: 2 }}>
              Bulk Delete
            </Button>
  
          </React.Fragment>
  
          
        )}
  
        {view === 'executeSQL' && (
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Execute SQL Query
            </Typography>
            <TextField
              id="outlined-multiline-static"
              label="SQL Query"
              multiline
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              variant="outlined"
              sx={{ width: '100%', mb: 1 }}
            />
            <Button onClick={executeSqlQuery} variant="contained" color="primary" sx={{ mb: 1 }}>
              Execute Query
            </Button>
            <TextField
              id="outlined-multiline-static"
              label="Query Result"
              multiline
              rows={4}
              value={sqlResult}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{ width: '100%', mb: 2 }}
            />
          </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
};

export default AdminBulkDelete;
     
