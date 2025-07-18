"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VerifyEmail.tsx
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import GoBackButton from "../components/GoBackButton";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage("❌ Missing verification token in URL.");
        setStatus("error");
        return;
      }

      try {
        const res = await api.post(
          `/v1/email-verification-by-link/verify-email?token=${token}`
        );

        // Extract user email from response if available
        const email = res.data?.user?.email || res.data?.email || "";
        setUserEmail(email);

        setMessage(
          res.data.message ||
            "✅ Email verified successfully! You can now login."
        );
        setStatus("success");
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.message ||
          "Invalid or expired verification token.";

        // Check if it's already verified
        if (
          errorMsg.toLowerCase().includes("already verified") ||
          errorMsg.toLowerCase().includes("already active")
        ) {
          setMessage("✅ Your email is already verified! You can login now.");
          setStatus("success");
        } else if (errorMsg.toLowerCase().includes("not found")) {
          setMessage(
            "❌ User not found. Please register again or contact support."
          );
          setStatus("error");
        } else if (errorMsg.toLowerCase().includes("expired")) {
          setMessage(
            "❌ Verification link has expired. Please request a new one."
          );
          setStatus("error");
        } else {
          setMessage(`❌ ${errorMsg}`);
          setStatus("error");
        }
      }
    };

    verify();
  }, [token]);

  const handleResendVerification = () => {
    navigate("/resend-verification", {
      state: { email: userEmail },
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Box mb={2} textAlign="left">
          <GoBackButton />
        </Box>

        {status === "verifying" && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Verifying your email...</Typography>
          </>
        )}

        {status !== "verifying" && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {message}
            </Typography>

            {userEmail && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Email: {userEmail}
              </Typography>
            )}

            <Box display="flex" gap={2} justifyContent="center">
              <Button variant="contained" onClick={() => navigate("/login")}>
                Go to Login
              </Button>

              {status === "error" && (
                <Button variant="outlined" onClick={handleResendVerification}>
                  Resend Verification
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
