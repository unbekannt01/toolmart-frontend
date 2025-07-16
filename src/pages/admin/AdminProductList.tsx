/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">All Products</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/products/add")}
          >
            Add Product
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setEditDialogOpen(true);
            }}
          >
            Bulk Upload
          </Button>
        </Box>
      </Box>

      {/* Under development dialog */}
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
                      onClick={() => {
                        setEditDialogOpen(true);
                        setEditProductId(product.id);
                      }}
                    >
                      Edit
                    </Button>
                    {/* Optional Delete Button */}
                    {/* <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button> */}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProductList;
