import React, { useContext ,Profiler, useEffect } from 'react';
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
import StatsView from './components/Statistics/StatsView';
import TrackList from './components/Track/TrackList';
import TrackCreate from './components/Track/TrackCreate';
import TrackDetails from './components/Track/TrackDetails';
import AlbumList from './components/Album/AlbumList';
import AlbumCreate from './components/Album/AlbumCreate';
import AlbumDetails from './components/Album/AlbumDetails';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import UserConfirmation from './components/Auth/UserConfirmation';
import UserProfile from './components/User/UserProfile';
import UserAdminList from './components/User/UserAdminList';
import UserAdminDetails from './components/User/UserAdminDetails';
import AdminBulkDelete from './components/Admin/AdminBulkDelete';
import Chat from './components/Chat/Chat';
import Playlist from './components/Playlist/Playlist';

import { AuthContext } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthProvider';

function App() {

  function callback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) {
    // You can log or store these values for further analysis.
    // console.log('id:', id);
    // console.log('phase:', phase);
    // console.log('actualDuration:', actualDuration);
    // console.log('baseDuration:', baseDuration);
    // console.log('startTime:', startTime);
    // console.log('commitTime:', commitTime);
    // console.log('interactions:', interactions);
  }
  return (
    <Profiler id="Application" onRender={callback}>

    <Router>
      <AuthProvider>
        <AppContent/>
      </AuthProvider>
    </Router>
</Profiler>

  );
}





function AppContent() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  useEffect(() => {
    console.log('AppContent re-rendered');
  });
  return (
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
            {isAuthenticated ? (
              <>
                <Button data-testid="user-profile-button" color="inherit" component={Link} to={`/userprofile/${user.id}`}>
                  {user.username}
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button data-testid="register-button" color="inherit" component={Link} to="/register">
                  Register
                </Button>
                <Button data-testid="login-button"  color="inherit" component={Link} to="/login">
                  Login
                </Button>
              </>
            )}
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
                      sx={{ marginRight: 2 }}

                    >
                      Statistics
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/chat"
                      sx={{ marginRight: 2 }}

                    >
                      Chat
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/playlist"
                      sx={{ marginRight: 2 }}

                    >
                      Playlist
                    </Button>
                    {isAuthenticated && user.is_admin && (
                      <React.Fragment>
                      <Button
                        variant="contained"
                        data-testid="manage-users-button"
                        color="primary"
                        component={Link}
                        to="/admin/users"
                        sx={{ marginRight: 2 }}
                      >
                        Manage Users
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/admin/editor"
                        sx={{ marginRight: 2 }}
                      >
                        Edit data
                      </Button>
                    </React.Fragment>
                    
                    )}
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
              <Route path="/statistics" element={<StatsView />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/confirm/:token" element={<UserConfirmation />} />
              <Route path="/userprofile/:userId" element={<UserProfile />} />
              <Route path="/admin/users" element={<UserAdminList />} />
              <Route path="/admin/profiles/:userId" element={<UserAdminDetails />} />
              <Route path="/admin/users" element={<UserAdminList />} />
              <Route path="/admin/editor" element={<AdminBulkDelete />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/playlist" element={<Playlist />} />

          </Routes>
        </Container>
      </div>
  );
}
export default App;
