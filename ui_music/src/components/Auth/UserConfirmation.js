import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import api from '../api';

const UserConfirmation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  useEffect(() => {
    const confirmUser = async () => {
      try {
        console.log(token);
        await api.get(`/api/register/confirm/${token}/`);  
        setConfirmationSuccess(true);
      } catch (error) {
      }
    };

    confirmUser();
  }, [token]); // Empty dependency array ensures this runs only once

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Confirmation Page
      </Typography>
      {  confirmationSuccess ? (
        <Typography>
          Your account has been successfully confirmed. You can now proceed to the login page.
        </Typography>
      ) : (
        <Typography>
          Activating your account...
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
        Go to Login
      </Button>
    </Container>
  );
};

export default UserConfirmation;
