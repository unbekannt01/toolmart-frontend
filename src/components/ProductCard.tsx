"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface ProductCardProps {
  product: any;
  onViewDetails: (product: any) => void;
  onAddToCart: (product: any) => void;
  onAddReview: (productId: string, productName: string) => void;
}

const ProductCard = ({
  product,
  onViewDetails,
  onAddToCart,
  onAddReview,
}: ProductCardProps) => {
  const imageUrl = product?.images?.[0]?.trim()
    ? product.images[0]
    : "https://via.placeholder.com/300x180.png?text=No+Image";

  return (
    <Card
      sx={{
        minWidth: 280,
        maxWidth: 300,
        height: 370,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.3s",
        position: "relative",
        overflow: "hidden",
        ":hover": { boxShadow: 6 },
        cursor: "pointer",
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={product?.name || "Product Image"}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product?.name || "Unnamed Product"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ₹
          {typeof product?.price === "number"
            ? product.price.toFixed(2)
            : "0.00"}
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
          sx={{ mb: 1 }}
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 1 }}
          onClick={() => onAddReview(product.id, product.name)}
          startIcon={<StarIcon />}
        >
          View Reviews
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
