import React, { useEffect, useState, useRef,useContext} from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const ws = useRef(null);
  const scrollTarget = useRef(null);
  const { user,isAuthenticated, setUser, access} = useContext(AuthContext);
  const [newNickname, setNewNickname] = useState(isAuthenticated ? user.nickname : 'Anonymous');

  const handleSend = () => {
    if (newMessage) {
      const message = {
        type: 'chat.message',
        message: newMessage,
        nickname: isAuthenticated ? user.nickname : 'Anonymous',
        user_id: isAuthenticated ? user.id : 'Anonymous',
      };

      if(ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
        setNewMessage('');
      }
    }
  };

  const fetchLastMessages = async () => {
    try {
      const res = await api.get('/chat/messages/last/10/');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNicknameUpdate = async () => {
    try {
      await api.put(`/api/users/${user.id}/nickname/`, { nickname: newNickname }, {
        headers: { Authorization: `Bearer ${access}` }
      });
      const updatedUser = { ...user };
      updatedUser.nickname = newNickname;
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser); // update user data in context
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/chat/');
    console.log(user)
    ws.current.onopen = () => {
      console.log("WebSocket open");
      setConnectionOpen(true);
    };

    ws.current.onmessage = (event) => {
      console.log("Received WebSocket message: ", event.data);
      const data = JSON.parse(event.data);
      setMessages((messages) => [...messages, data]);
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket closed. Code: ", event.code, ", Reason: ", event.reason);
      setConnectionOpen(false);
    };

    return () => {
      console.log("Cleaning up WebSocket.");
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    fetchLastMessages();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // prevent form submission
      handleSend();
    }
  };
  
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box display="flex" alignItems="center" padding={2}>
            <TextField
                fullWidth
                value={newNickname}
                onChange={(event) => { setNewNickname(event.target.value); }}
                variant="outlined"
                placeholder="Update your nickname here..."
              />
              <Button onClick={handleNicknameUpdate} color="primary" disabled={!isConnectionOpen}>
                Update Nickname
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box display="flex" flexDirection="column" minHeight="60vh">
              <Box flexGrow={1} overflow="auto" style={{padding: '1rem'}}>
                  {messages.map((messageData, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="h9" color="textSecondary">
                      {messageData.nickname}
                    </Typography>
                    <Paper elevation={1} sx={{ p: 1, backgroundColor: 'grey.100' }}>
                      <Typography variant="body1">{messageData.message}</Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={scrollTarget} />
              </Box>
              <Box display="flex" alignItems="center" padding={2}>
                <TextField
                  fullWidth
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  variant="outlined"
                  placeholder="Type your message here..."
                />
                <Button onClick={handleSend} color="primary" startIcon={<SendIcon />} disabled={!isConnectionOpen}>
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
  };
  
  export default Chat;
