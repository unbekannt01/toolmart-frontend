"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ProductDetailsOverlayProps {
  product: any;
  onClose: () => void;
}

const ProductDetailsOverlay = ({
  product,
  onClose,
}: ProductDetailsOverlayProps) => {
  if (!product) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300, // Ensure it's above other content like the Navbar
      }}
      onClick={onClose} // Close when clicking outside the paper
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          width: "90%",
          maxHeight: "90%",
          overflowY: "auto", // Allow scrolling if content is too long
          position: "relative",
          bgcolor: "background.paper", // Use theme background color
          color: "text.primary", // Use theme text color
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the paper
        // Removed onMouseLeave as it's no longer a hover-triggered overlay
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2}>
          ₹{product.price || 0.0}
        </Typography>

        <Typography variant="body1" paragraph>
          {product.description || "No description available."}
        </Typography>

        <Box mt={2}>
          <Typography variant="body2">
            <strong>Model:</strong> {product.model || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>SKU:</strong> {product.sku || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Voltage:</strong> {product.voltage || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Power Type:</strong> {product.powerType || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Condition:</strong> {product.condition || "N/A"}
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
          {product.includedAccessories &&
            product.includedAccessories.length > 0 && (
              <Typography variant="body2">
                <strong>Accessories:</strong>{" "}
                {product.includedAccessories.join(", ")}
              </Typography>
            )}
          {product.compatibleWith && product.compatibleWith.length > 0 && (
            <Typography variant="body2">
              <strong>Compatible With:</strong>{" "}
              {product.compatibleWith.join(", ")}
            </Typography>
          )}
          {product.videoUrl && (
            <Typography variant="body2">
              <strong>Video:</strong>{" "}
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.videoUrl}
              </a>
            </Typography>
          )}
          {product.dimensions && (
            <Typography variant="body2">
              <strong>Dimensions:</strong> {product.dimensions.length}x
              {product.dimensions.width}x{product.dimensions.height}{" "}
              {product.dimensions.unit}
            </Typography>
          )}
          {product.weight && (
            <Typography variant="body2">
              <strong>Weight:</strong> {product.weight} kg
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductDetailsOverlay;
