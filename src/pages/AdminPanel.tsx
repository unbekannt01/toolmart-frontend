/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_URL = "https://nestjs-openapi-1.onrender.com/notifications";
const AdminPanel = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket as Admin");
    });

    // Login attempt listener
    socket.on("loginAttempt", (data: any) => {
      if (data?.data?.success) {
        const msg = `✅ [${new Date(
          data.data.timestamp
        ).toLocaleTimeString()}] User login success`;
        setNotifications((prev) => [msg, ...prev]);
      } else {
        const msg = `❌ [${new Date(
          data.data.timestamp
        ).toLocaleTimeString()}] Failed login attempt`;
        setNotifications((prev) => [msg, ...prev]);
      }
    });

    // Status change event
    socket.on("userStatusChanged", (data: any) => {
      const msg = `⚠️ [${new Date(
        data.data.timestamp
      ).toLocaleTimeString()}] User ${data.userId} status changed to ${
        data.data.newStatus
      }`;
      setNotifications((prev) => [msg, ...prev]);
    });

    // Admin log listener from backend (custom logs)
    socket.on(
      "adminConsoleLog",
      (log: { message: string; timestamp: string }) => {
        const msg = `🛠️ [${new Date(log.timestamp).toLocaleTimeString()}] ${
          log.message
        }`;
        setNotifications((prev) => [msg, ...prev]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box mt={4} p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Real-time messages */}
      {notifications.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#fefefe",
            padding: 2,
            mb: 3,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          <Typography variant="h6" gutterBottom>
            🔔 Real-Time Notifications
          </Typography>
          {notifications.map((note, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{ fontFamily: "monospace", mb: 0.5 }}
            >
              {note}
            </Typography>
          ))}
        </Paper>
      )}

      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/products")}
        >
          Manage Products
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate("/admin/categories")}
        >
          Manage Categories
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/admin/brands")}
        >
          Manage Brands
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPanel;
