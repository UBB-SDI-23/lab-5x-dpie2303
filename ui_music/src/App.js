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
import TrackList from './components/Track/TrackList';
import TrackCreate from './components/Track/TrackCreate';
import TrackDetails from './components/Track/TrackDetails';
import AlbumList from './components/Album/AlbumList';
import AlbumCreate from './components/Album/AlbumCreate';
import AlbumDetails from './components/Album/AlbumDetails';

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h5"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              component={Link}
              to="/"
            >
              Music Library
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Typography variant="h4" gutterBottom>
                    Welcome to Music Library
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
                    to="/tracks"
                    sx={{ marginRight: 2 }}
                  >
                    Tracks
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/albums"
                    sx={{ marginRight: 2 }}
                  >
                    Albums
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/statistics"
                  >
                    Statistics
                  </Button>
                </div>
              }
            />
            <Route path="/artists" element={<ArtistList />} />
            <Route path="/artists/create" element={<ArtistCreate />} />
            <Route path="/artists/:id" element={<ArtistDetails />} />
            <Route path="/tracks" element={<TrackList />} />
            <Route path="/tracks/create" element={<TrackCreate />} />
            <Route path="/tracks/:id" element={<TrackDetails />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/albums/create" element={<AlbumCreate />} />
            <Route path="/albums/:id" element={<AlbumDetails />} />
            <Route path="/statistics" element={<ArtistAverageTracksPerAlbumReport />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
