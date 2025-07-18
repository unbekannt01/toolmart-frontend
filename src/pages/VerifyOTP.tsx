"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VerifyOtp.tsx
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
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import GoBackButton from "../components/GoBackButton"; // Import GoBackButton

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from URL params or location state
  const emailFromParams = searchParams.get("email");
  const emailFromState = location.state?.email;
  const email = emailFromParams || emailFromState;

  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is missing. Please try the verification process again.",
        severity: "error",
      });

      setTimeout(() => {
        navigate("/resend-verification");
      }, 2000);
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is required for verification.",
        severity: "error",
      });
      return;
    }

    if (!otp.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter the OTP code.",
        severity: "error",
      });
      return;
    }

    try {
      await api.post(`/v1/otp/verify-otp`, {
        email: email,
        otp: otp.trim(),
      });

      setSnackbar({
        open: true,
        message: "Account verified successfully! You can now login.",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "OTP verification failed";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is required to resend OTP.",
        severity: "error",
      });
      return;
    }

    try {
      await api.post(`/v1/otp/resend-otp`, { email: email });
      setSnackbar({
        open: true,
        message: "OTP resent successfully to your email.",
        severity: "info",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to resend OTP";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  if (!email) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography variant="h6" color="error" textAlign="center">
            Email is missing. Redirecting...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Box mb={2} textAlign="left">
          <GoBackButton />
        </Box>
        <Typography variant="h5" fontWeight="bold" align="center" mb={2}>
          Verify Your OTP
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={3}
        >
          We've sent a verification code to: <strong>{email}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          inputProps={{ maxLength: 6 }}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
          <Button variant="outlined" fullWidth onClick={handleResendOtp}>
            Resend OTP
          </Button>
          <Button variant="contained" fullWidth onClick={handleVerify}>
            Verify
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VerifyOtp;
