import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import ArtistList from './components/Artist/ArtistList';
import ArtistCreate from './components/Artist/ArtistCreate';
import ArtistDetails from './components/Artist/ArtistDetails';
import ArtistAverageTracksPerAlbumReport from './components/Statistics/ArtistAverageTracksPerAlbumReport';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <AppBar position="static">
                  <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Music Library
                    </Typography>
                  </Toolbar>
                </AppBar>
                <Container>
                  <Typography variant="h4" gutterBottom>
                    Music Library
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/artists"
                    sx={{ marginRight: 2 }}
                  >
                    Artists
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/statistics"
                  >
                    Statistics
                  </Button>
                </Container>
              </div>
            }
          />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/create" element={<ArtistCreate />} />
          <Route path="/artists/:id" element={<ArtistDetails />} />
          <Route
            path="/statistics"
            element={<ArtistAverageTracksPerAlbumReport />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
