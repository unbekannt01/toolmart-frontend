/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import GoBackButton from "../components/GoBackButton"; // Import GoBackButton

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const handlePlaceOrder = async () => {
    const accessToken = localStorage.getItem("access_token");

    const payload = {
      shippingAddress: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
      billingAddress: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
    };

    try {
      const res = await api.post("/v1/orders/create", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Order placed!", res.data);
      navigate("/my-order");
    } catch (error: any) {
      console.error("Order failed:", error.response?.data || error.message);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" p={4}>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h5" mb={2}>
        Checkout - Shipping Details
      </Typography>

      <Box mb={2}>
        <TextField
          fullWidth
          name="street"
          label="Street Address"
          value={address.street}
          onChange={handleChange}
        />
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          name="city"
          label="City"
          value={address.city}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          name="state"
          label="State"
          value={address.state}
          onChange={handleChange}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          name="zipCode"
          label="ZIP Code"
          value={address.zipCode}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          name="country"
          label="Country"
          value={address.country}
          onChange={handleChange}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handlePlaceOrder}
      >
        Save & Continue
      </Button>
    </Box>
  );
};

export default CheckoutPage;
