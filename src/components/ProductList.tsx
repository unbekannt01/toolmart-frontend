/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProductList.tsx
import { Container, Box } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/v1/products/getAll").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start">
        {products.map((product: any) => (
          <Box key={product.id}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ProductList;
