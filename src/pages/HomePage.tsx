/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDetailsOverlay from "../components/ProductDetailsOverlay";
import api from "../api/axios";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<
    any | null
  >(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/v1/products/getAll")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (product: any) => {
    setSelectedProductForDetails(product);
  };

  const handleCloseDetails = () => {
    setSelectedProductForDetails(null);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.warn("User not authenticated");
        navigate("/login");
        return;
      }

      // Make API call to add the product
      await api.post(
        `/v1/cart/add/${productId}?quantity=1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Redirect to the cart page
      navigate("/cart");
    } catch (err: any) {
      console.error(
        "Failed to add to cart:",
        err.response?.data || err.message
      );
      alert("Unable to add item to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box mt={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        ToolMart Products
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
        {products?.length > 0 ? (
          products
            .filter((product) => product?.id)
            .map((product) => (
              <Box key={product.id} flex="1 1 250px" maxWidth="300px">
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                />
              </Box>
            ))
        ) : (
          <Typography>No products available</Typography>
        )}
      </Box>

      {selectedProductForDetails && (
        <ProductDetailsOverlay
          product={selectedProductForDetails}
          onClose={handleCloseDetails}
        />
      )}
    </Box>
  );
};

export default HomePage;
