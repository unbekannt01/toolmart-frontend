"use client";

// src/pages/OrderSuccessPage.tsx
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom";
import GoBackButton from "../components/GoBackButton"; // Import GoBackButton

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return <Typography p={4}>No order found!</Typography>;
  }

  return (
    <Box
      maxWidth="600px"
      mx="auto"
      p={4}
      borderRadius={2}
      boxShadow={2}
      textAlign="center"
    >
      <Box mb={2} textAlign="left">
        <GoBackButton />
      </Box>
      <CheckCircleIcon sx={{ fontSize: 64, color: "green", mb: 2 }} />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Thank you for your purchase. Your order has been confirmed and will be
        processed shortly.
      </Typography>

      <Box textAlign="left" mb={2}>
        <Typography fontWeight="bold" mb={1}>
          Order Details
        </Typography>
        <Typography>
          <strong>Order ID:</strong> {order.id}
        </Typography>
        <Typography>
          <strong>Order Number:</strong> {order.orderNumber}
        </Typography>
        <Typography>
          <strong>Total Amount:</strong> ₹{Number(order.totalAmount).toFixed(2)}
        </Typography>
        <Typography>
          <strong>Status:</strong> {order.status}
        </Typography>
      </Box>

      <Typography color="error" fontWeight="bold" mt={2} mb={3}>
        ⚠ Payment integration is currently under development by the developer.
      </Typography>

      <Button variant="contained" size="large" onClick={() => navigate("/")}>
        Continue Shopping
      </Button>
    </Box>
  );
};

export default OrderSuccessPage;
