"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/GoBackButton"; // Import GoBackButton

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get("/v1/cart", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("Cart Response:", response.data);

        setCartItems(response.data.items || []);
        setTotal(response.data.total || 0);
      } catch (err: any) {
        console.error(
          "Failed to fetch cart:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  return (
    <Box p={4}>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {cartItems.map((item) => (
            <Box key={item.id} mb={2}>
              <Typography variant="h6">{item.product?.name}</Typography>
              <Typography>Brand: {item.product?.brand?.name}</Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              <Typography>Price (each): ₹{item.price}</Typography>
              <Typography>
                Total: ₹{(item.price * item.quantity).toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
          <Box mt={4}>
            <Typography variant="h6">
              Cart Total: ₹{total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartPage;
