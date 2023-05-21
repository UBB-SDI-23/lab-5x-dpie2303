import React, { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { List, ListItem, ListItemText, Pagination ,Container, Typography, TextField, Button, Grid } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';


const AlbumCreate = () => {
  const { user,isAuthenticated} = useContext(AuthContext);

  const [album, setAlbum] = useState({
    name: '',
    description: '',
    top_rank: '',
    copy_sales: '',
    release_date: '',
    record_company: '',
    user: 0,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [recordCompanySearch, setRecordCompanySearch] = useState('');
  const [recordCompanySearchResults, setRecordCompanySearchResults] = useState([]);
  const [selectedRecordCompany, setSelectedRecordCompany] = useState(null);
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userPaginationSize} = useContext(AuthContext);
  const { access } = useContext(AuthContext);

  // define whether the input should be editable
  const isEditable = isAuthenticated 

  
  const handleRecordCompanySearch = async (query, page) => {
    setRecordCompanySearch(query);
    if (query) {
      try {
        const response = await api.get(`/api/record_companies/?q=${query}&page=${page}&page_size=${userPaginationSize}`);
        setRecordCompanySearchResults(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error searching for record companies:', error);
      }
    } else {
      setRecordCompanySearchResults([]);
    }
  };

  const handleRecordCompanySelection = (companyId, companyName) => {
    setSelectedRecordCompany(companyId);
    setRecordCompanySearch(companyName);
    setRecordCompanySearchResults([]);  // This will clear the search results

  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let errors = {};
    if(!isAuthenticated){
      toast.error('Error creating album.');
      errors.user = "You must be logged in to create an album.";
    }
    
    if (album.copy_sales < 0) {
      errors.copy_sales = "Copy sales must be a non-negative integer.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    album.user = user.id;
    album.record_company = selectedRecordCompany;
    try {
      const response = await api.post('/api/albums/', album, {
        headers: { Authorization: `Bearer ${access}` }
      });
      navigate('/albums/' + response.data.id + '/');
    } catch (error) {
      toast.error('Error creating album.');
      console.error('Error creating album:', error);
    }
  };

  const handleChange = (event) => {
    setAlbum({ ...album, [event.target.name]: event.target.value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Album
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={album.name}
              onChange={handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={album.description}
              onChange={handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Top Rank"
              name="top_rank"
              value={album.top_rank}
              onChange={handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Copy Sales"
              name="copy_sales"
              value={album.copy_sales}
              onChange={handleChange}
              error={errors.copy_sales ? true : false}
              helperText={errors.copy_sales}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Release Date"
              type="date"
              name="release_date"
              value={album.release_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search for a Record Company"
              name="record_company_search"
              value={recordCompanySearch}
              onChange={(event) => setRecordCompanySearch(event.target.value)}
            />
            <Button onClick={() => handleRecordCompanySearch(recordCompanySearch, 1)} variant="contained" color="primary">
              Search
            </Button>
            <List>
              {recordCompanySearchResults.map((company) => (
                <ListItem key={company.id} button onClick={() => handleRecordCompanySelection(company.id, company.name)}>
                  <ListItemText primary={company.name} />
                </ListItem>
              ))}
            </List>
            {recordCompanySearchResults.length > 0 && 
              <Pagination count={totalPages} page={page} onChange={(event, value) => handleRecordCompanySearch(recordCompanySearch, value)} />
            }
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={!isEditable}>
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AlbumCreate;