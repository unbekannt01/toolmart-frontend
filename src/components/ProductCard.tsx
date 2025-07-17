"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProductCard.tsx
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

interface ProductCardProps {
  product: any;
  onViewDetails: (product: any) => void;
  onAddToCart: (product: any) => void;
}

const ProductCard = ({
  product,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) => {
  const imageUrl =
    product?.images?.[0] && product.images[0].trim() !== ""
      ? product.images[0]
      : "https://via.placeholder.com/300x180.png?text=No+Image";

  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 300,
        flexGrow: 1,
        height: 350,
        transition: "0.3s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ":hover": {
          boxShadow: 6,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={product.name || "No name available"}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{product.price || 0.0}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 1 }}
          onClick={() => onViewDetails(product)}
        >
          View Details
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
