"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/AdminBrandsPage.tsx
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import GoBackButton from "../../components/GoBackButton"; // Import GoBackButton

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchBrands = async () => {
    try {
      const res = await api.get("/v1/brands/getAll");
      setBrands(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load brands",
        severity: "error",
      });
    }
  };

  const handleAddBrand = async () => {
    try {
      await api.post("/v1/brands/add", newBrand);
      setSnackbar({ open: true, message: "Brand added", severity: "success" });
      setNewBrand({ name: "", description: "" });
      fetchBrands();
    } catch (err) {
      setSnackbar({ open: true, message: "Add failed", severity: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/v1/brands/${id}`);
      setSnackbar({
        open: true,
        message: "Brand deleted",
        severity: "success",
      });
      fetchBrands();
    } catch (err) {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <Container>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h4" gutterBottom>
        Manage Brands
      </Typography>

      {/* Add Brand Form */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Brand Name"
          value={newBrand.name}
          onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
        />
        <TextField
          label="Description"
          value={newBrand.description}
          onChange={(e) =>
            setNewBrand({ ...newBrand, description: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleAddBrand}>
          Add Brand
        </Button>
      </Box>

      {/* Brand List Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand: any) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(brand.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminBrandsPage;
