"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/GoBackButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // *** IMPORTANT: This now calls the new backend endpoint for all orders ***
        const res = await api.get("/v1/orders/history", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (error: any) {
        console.error(
          "Failed to load order history:",
          error.response?.data || error.message
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatAddress = (address: any): string => {
    if (!address) return "Not Provided";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h4" gutterBottom>
        My Order History
      </Typography>

      {orders.length === 0 ? (
        <Typography>You have no past orders.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {orders.map((order) => (
            <Paper key={order.id} elevation={3} sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Order #{order.orderNumber}</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="subtitle1"
                    color={
                      order.status === "CONFIRMED"
                        ? "success.main"
                        : order.status === "CANCELLED"
                        ? "error.main"
                        : "warning.main"
                    }
                  >
                    {order.status}
                  </Typography>
                  {order.status === "CONFIRMED" && (
                    <CheckCircleIcon
                      sx={{ color: "success.main", fontSize: 20 }}
                    />
                  )}
                  {order.status === "CANCELLED" && (
                    <CancelIcon sx={{ color: "error.main", fontSize: 20 }} />
                  )}
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Total Amount: ₹{Number(order.totalAmount).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment Status: {order.paymentStatus || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Items:
              </Typography>
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item: any) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    mb={0.5}
                  >
                    <Typography variant="body2">
                      {item.product?.name} ({item.quantity}x)
                    </Typography>
                    <Typography variant="body2">
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No items listed for this order.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Shipping Address:
              </Typography>
              <Typography variant="body2">
                {formatAddress(order.shippingAddress)}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrderHistoryPage;
