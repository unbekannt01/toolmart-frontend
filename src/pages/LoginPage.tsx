/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const LoginPage = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/v1/auth/login`, form, {});

      const token = res.data.access_token;
      const decoded: any = jwtDecode(token);
      const userRole = decoded?.role;

      // Save tokens
      login(token);
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      setTimeout(() => {
        if (userRole === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";
      console.error("Login error:", message);
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          Login to ToolMart
        </Typography>
        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="identifier"
              label="Email or Username"
              value={form.identifier}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
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

export default LoginPage;
