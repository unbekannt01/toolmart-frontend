/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProductCard.tsx
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useState } from "react";

const ProductCard = ({ product }: { product: any }) => {
  const [hovered, setHovered] = useState(false);

  // Use fallback if image not found
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
        height: hovered ? 400 : 320,
        transition: "0.3s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ":hover": {
          boxShadow: 6,
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={product.name || "Product Image"}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ₹{product.price}
        </Typography>

        {hovered && (
          <Box mt={2} maxHeight={140} overflow="auto">
            <Typography variant="body2">
              <strong>Model:</strong> {product.model}
            </Typography>
            <Typography variant="body2">
              <strong>SKU:</strong> {product.sku}
            </Typography>
            <Typography variant="body2">
              <strong>Voltage:</strong> {product.voltage}
            </Typography>
            <Typography variant="body2">
              <strong>Power Type:</strong> {product.powerType}
            </Typography>
            <Typography variant="body2">
              <strong>Condition:</strong> {product.condition}
            </Typography>
            <Typography variant="body2">
              <strong>Stock:</strong> {product.stockQuantity || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Warranty:</strong> {product.warrantyPeriod || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Brand:</strong> {product.brandName || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Category:</strong> {product.categoryName || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>SubCategory:</strong> {product.subCategoryName || "N/A"}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
