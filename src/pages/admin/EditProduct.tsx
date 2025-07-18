/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import GoBackButton from "../../components/GoBackButton";

interface Brand {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: "",
    model: "",
    price: "",
    originalPrice: "",
    stockQuantity: "",
    brandId: "",
    categoryId: "", // ✅ Added
    subCategoryId: "",
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      console.error("Failed to fetch brands:", err);
      setSnackbar({
        open: true,
        message: "Failed to load brands",
        severity: "error",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/v1/categories/getAll");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setSnackbar({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/v1/products/${id}`);
      const product = res.data;

      // Find the subcategory and its parent category
      const allSubCategories = categories.flatMap((c) => c.subcategories);
      const selectedSubCategory = allSubCategories.find(
        (s) => s.id === product.subCategory?.id
      );
      const parentCategory = categories.find((cat) =>
        cat.subcategories.some((s) => s.id === selectedSubCategory?.id)
      );

      setFormData({
        name: product.name || "",
        model: product.model || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        stockQuantity: product.stockQuantity || "",
        brandId: product.brand?.id || "",
        categoryId: parentCategory?.id || "",
        subCategoryId: selectedSubCategory?.id || "",
      });
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch product details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBrands(), fetchCategories()]);
    };
    loadData();
  }, [id]);

  // After categories are loaded, fetch the product
  useEffect(() => {
    if (categories.length > 0) {
      fetchProduct();
    }
  }, [categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      if (!formData.brandId || !formData.subCategoryId) {
        setSnackbar({
          open: true,
          message: "Please select both brand and subcategory",
          severity: "error",
        });
        return;
      }

      const payload = {
        name: formData.name,
        model: formData.model,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stockQuantity: Number(formData.stockQuantity),
        brandId: formData.brandId,
        subCategoryId: formData.subCategoryId,
      };

      await api.patch(`/v1/products/${id}`, payload);

      setSnackbar({
        open: true,
        message: "Product updated successfully",
        severity: "success",
      });

      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update product",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-4">
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          type="number"
          required
          inputProps={{ min: 0, step: 0.01 }}
        />
        <TextField
          fullWidth
          label="Original Price"
          name="originalPrice"
          value={formData.originalPrice}
          onChange={handleChange}
          margin="normal"
          type="number"
          required
          inputProps={{ min: 0, step: 0.01 }}
        />
        <TextField
          fullWidth
          label="Stock Quantity"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          margin="normal"
          type="number"
          required
          inputProps={{ min: 0 }}
        />

        {/* Brand Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Brand</InputLabel>
          <Select
            value={formData.brandId}
            onChange={(e) => handleSelectChange("brandId", e.target.value)}
            label="Brand"
          >
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Category Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.categoryId}
            onChange={(e) => {
              const selectedCategoryId = e.target.value;
              setFormData({
                ...formData,
                categoryId: selectedCategoryId,
                subCategoryId: "", // Reset subcategory
              });
            }}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subcategory Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={formData.subCategoryId}
            onChange={(e) =>
              handleSelectChange("subCategoryId", e.target.value)
            }
            label="Subcategory"
            disabled={!formData.categoryId}
          >
            {categories
              .find((cat) => cat.id === formData.categoryId)
              ?.subcategories.map((sub: SubCategory) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Upload Placeholder */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setDialogOpen(true)}
          >
            Upload Image or Video (Coming Soon)
          </Button>
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            fullWidth
            disabled={!formData.brandId || !formData.subCategoryId}
          >
            Update Product
          </Button>
        </Box>
      </CardContent>

      {/* Snackbar & Dialog */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Feature in Development</DialogTitle>
        <DialogContent>
          File upload feature is under development and will be available soon.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
