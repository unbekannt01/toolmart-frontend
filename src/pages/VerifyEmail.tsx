/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VerifyEmail.tsx
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.post(`/v1/email-verification-by-link/verify-email?token=${token}`);
        setMessage(res.data.message || '✅ Email verified successfully. You can login now.');
        setStatus('success');
      } catch (err: any) {
        const msg = err?.response?.data?.message || '❌ Invalid or expired verification token.';
        setMessage(msg);
        setStatus('error');
      }
    };

    if (token) verify();
    else {
      setMessage('❌ Missing token in URL.');
      setStatus('error');
    }
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {status === 'verifying' && <CircularProgress />}
        {status !== 'verifying' && (
          <>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
