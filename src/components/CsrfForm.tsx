/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// This file belongs in your React Vite frontend project, e.g., src/components/CsrfForm.tsx
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios

// Assuming you have a basic Button and Input component, or use native HTML elements
// If you're using Material-UI, you might use:
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

// IMPORTANT: Replace with your actual NestJS backend URL
const BACKEND_BASE_URL = "http://localhost:3001/v1"; // Example: Adjust port and path as needed

export default function CsrfForm() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Fetch the CSRF token from your NestJS backend using axios
        const res = await axios.get(`${BACKEND_BASE_URL}/csrf/token`);
        setCsrfToken(res.data.csrfToken); // Access data via .data
        localStorage.setItem("csrf_token", res.data.csrfToken); // Store the token in localStorage
        console.log("Fetched CSRF Token:", res.data.csrfToken);
      } catch (err: any) {
        console.error("Error fetching CSRF token:", err);
        setError(
          `Failed to fetch CSRF token: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);
    setError(null);

    if (!csrfToken) {
      setError("CSRF token not available. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Simulate a POST request to an API endpoint that requires CSRF protection
      // In a real application, this would be your actual backend API endpoint
      const res = await axios.post(
        `${BACKEND_BASE_URL}/submit-data`, // Example endpoint
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken, // Include the CSRF token in the header
          },
        }
      );

      setResponseMessage(res.data.message || "Data submitted successfully!"); // Access data via .data
      setMessage(""); // Clear input
    } catch (err: any) {
      console.error("Error submitting data:", err);
      setError(
        `Submission failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3 }}>
      <CardHeader
        title="CSRF Protected Form"
        subheader="Demonstrates fetching and using a CSRF token."
      />
      <CardContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {responseMessage && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {responseMessage}
          </Typography>
        )}
        {!csrfToken && !error && (
          <Typography color="text.secondary">Loading CSRF token...</Typography>
        )}
        {csrfToken && (
          <form onSubmit={handleSubmit}>
            <TextField
              id="message"
              label="Your Message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Securely"}
            </Button>
          </form>
        )}
      </CardContent>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        CSRF Token:{" "}
        {csrfToken ? (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.75em",
              wordBreak: "break-all",
            }}
          >
            {csrfToken}
          </span>
        ) : (
          "Not loaded"
        )}
      </Typography>
    </Card>
  );
}
