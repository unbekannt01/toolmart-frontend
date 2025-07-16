/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/RegisterForm.tsx
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  title?: string;
  onSubmit: (formData: any) => Promise<void>;
};

const RegisterForm = ({ title = 'Register', onSubmit }: Props) => {
  const [form, setForm] = useState({
    userName: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile_no: '',
    birth_date: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed!';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField name="userName" label="Username" value={form.userName} onChange={handleChange} />
            <TextField name="email" label="Email" value={form.email} onChange={handleChange} required />
            <TextField name="first_name" label="First Name" value={form.first_name} onChange={handleChange} />
            <TextField name="last_name" label="Last Name" value={form.last_name} onChange={handleChange} />
            <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} required />
            <TextField name="mobile_no" label="Mobile (+91...)" value={form.mobile_no} onChange={handleChange} />
            <TextField
              name="birth_date"
              label="Birth Date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" type="submit" fullWidth>
              {title}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterForm;
