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
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // now email instead of userId

  useEffect(() => {
    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is missing in URL. Please register again.",
        severity: "error",
      });
    }
  }, [email]);
  const [otp, setOtp] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await api.post(`/v1/otp/verify-otp`, {
        email,
        otp,
      });

      setSnackbar({
        open: true,
        message: "Account verified successfully. You can now login.",
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
    try {
      await api.post(`/v1/otp/resend-otp`, { email });
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

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Verify Your OTP
        </Typography>

        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="number"
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

export default VerifyOtp;
