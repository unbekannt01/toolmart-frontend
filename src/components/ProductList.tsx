"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProductList.tsx
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import ReviewModal from "./ReviewModel";

interface Product {
  id: number;
  name: string;
  model: string;
  price: number;
  originalPrice: number;
  images: string[];
  stockQuantity: number;
  brandName: string;
  categoryName: string;
  subCategoryName: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/v1/products/getAll");
        setProducts(res.data);
      } catch (err: any) {
        setError("Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddReview = (productId: string, productName: string) => {
    setSelectedProductForReview({ id: productId, name: productName });
    setReviewModalOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
        {products.map((product) => (
          <Box key={product.id}>
            <ProductCard
              product={product}
              onViewDetails={() => {
                console.log("Viewing product:", product.id);
              }}
              onAddToCart={() => {
                console.log("Adding to cart:", product.id);
              }}
              onAddReview={handleAddReview}
            />
          </Box>
        ))}
      </Box>
      {selectedProductForReview && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProductForReview(null);
          }}
          productId={selectedProductForReview.id}
          productName={selectedProductForReview.name}
        />
      )}
    </Container>
  );
};

export default ProductList;
