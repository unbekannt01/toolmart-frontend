/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import GoBackButton from "../../components/GoBackButton";

const AdminProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/v1/products/getAll");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      const res = await api.delete(`/v1/products/${id}`);
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: "success",
      });
      fetchProducts();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Failed to delete product",
        severity: "error",
      });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <GoBackButton />
        <Typography variant="h4">All Products</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/products/add")}
          >
            Add Product
          </Button>
          <Button variant="outlined" onClick={() => setEditDialogOpen(true)}>
            Bulk Upload
          </Button>
        </Box>
      </Box>

      {/* Under Development Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Under Development</DialogTitle>
        <DialogContent>
          <Typography>
            This feature is currently under development. Please check back
            later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brandName || "N/A"}</TableCell>
                <TableCell>{product.categoryName || "N/A"}</TableCell>
                <TableCell>{product.subCategoryName || "N/A"}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity as any}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProductList;
