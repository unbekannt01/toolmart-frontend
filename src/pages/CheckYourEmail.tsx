// src/pages/CheckYourEmail.tsx
import { Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CheckYourEmail = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          📩 Check Your Email
        </Typography>
        <Typography variant="body1" mb={3}>
          We've sent a verification link to your email. Please click the link to activate your account.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to Homepage
        </Button>
      </Paper>
    </Container>
  );
};

export default CheckYourEmail;
