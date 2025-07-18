"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const ResendVerificationPage = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [emailInput, setEmailInput] = useState("");
  const [dialogType, setDialogType] = useState<"OTP" | "EMAIL" | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendOtp = async (emailToUse: string) => {
    if (!isValidEmail(emailToUse)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/v1/otp/resend-otp", { email: emailToUse });
      setSnackbar({
        open: true,
        message: "OTP has been sent to your email.",
        severity: "success",
      });

      // Close dialog if it was open
      setDialogType(null);
      setEmailInput("");

      setTimeout(() => {
        navigate("/verify-otp", { state: { email: emailToUse } });
      }, 1500);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to resend OTP",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailToken = async (emailToUse: string) => {
    if (!isValidEmail(emailToUse)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/v1/email-verification-by-link/resend-verification", {
        email: emailToUse,
      });
      setSnackbar({
        open: true,
        message:
          "Verification link sent to your email. Please check your inbox.",
        severity: "success",
      });

      // Close dialog if it was open
      setDialogType(null);
      setEmailInput("");
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to resend verification link",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpClick = () => {
    if (email && isValidEmail(email)) {
      handleResendOtp(email);
    } else {
      setDialogType("OTP");
    }
  };

  const handleEmailClick = () => {
    if (email && isValidEmail(email)) {
      handleResendEmailToken(email);
    } else {
      setDialogType("EMAIL");
    }
  };

  const handleDialogSubmit = () => {
    const trimmedEmail = emailInput.trim();

    if (!trimmedEmail) {
      setSnackbar({
        open: true,
        message: "Please enter an email address",
        severity: "error",
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    if (dialogType === "OTP") {
      handleResendOtp(trimmedEmail);
    } else if (dialogType === "EMAIL") {
      handleResendEmailToken(trimmedEmail);
    }
  };

  const handleDialogClose = () => {
    setDialogType(null);
    setEmailInput("");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold">
          Verify Your Account
        </Typography>

        <Typography textAlign="center" mb={3} color="text.secondary">
          Your account is not active. Please choose how you'd like to verify:
        </Typography>

        {email && (
          <Typography
            textAlign="center"
            mb={3}
            color="primary"
            sx={{ fontWeight: "medium" }}
          >
            Email: {email}
          </Typography>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            onClick={handleOtpClick}
            disabled={loading}
            size="large"
          >
            {loading && dialogType === "OTP"
              ? "Sending OTP..."
              : "Verify via OTP"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleEmailClick}
            disabled={loading}
            size="large"
          >
            {loading && dialogType === "EMAIL"
              ? "Sending Link..."
              : "Send Email Verification Link"}
          </Button>

          <Button
            variant="text"
            color="error"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Cancel / Go Back to Login
          </Button>
        </Box>
      </Paper>

      {/* Email Input Dialog for OTP */}
      <Dialog
        open={dialogType === "OTP"}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Your Email for OTP Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please enter your email address to receive the OTP code.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            autoFocus
            margin="normal"
            required
            placeholder="example@email.com"
            error={emailInput.trim() !== "" && !isValidEmail(emailInput)}
            helperText={
              emailInput.trim() !== "" && !isValidEmail(emailInput)
                ? "Please enter a valid email address"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogSubmit}
            disabled={
              loading || !emailInput.trim() || !isValidEmail(emailInput)
            }
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Input Dialog for Email Verification */}
      <Dialog
        open={dialogType === "EMAIL"}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Your Email for Verification Link</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please enter your email address to receive the verification link.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            autoFocus
            margin="normal"
            required
            placeholder="example@email.com"
            error={emailInput.trim() !== "" && !isValidEmail(emailInput)}
            helperText={
              emailInput.trim() !== "" && !isValidEmail(emailInput)
                ? "Please enter a valid email address"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogSubmit}
            disabled={
              loading || !emailInput.trim() || !isValidEmail(emailInput)
            }
          >
            {loading ? "Sending..." : "Send Verification Link"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default ResendVerificationPage;
