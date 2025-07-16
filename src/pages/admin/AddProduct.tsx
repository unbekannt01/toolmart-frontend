/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    name: "",
    model: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "NEW",
    powerType: "ELECTRIC_CORDLESS",
    voltage: "",
    weight: "",
    dimensions: { length: "", width: "", height: "", unit: "cm" },
    isFeatured: false,
    isOnSale: false,
    warrantyPeriod: "",
    includedAccessories: "",
    compatibleWith: "",
    videoUrl: "",
    brandId: "",
    categoryId: "",
    subCategoryId: "",
    stockQuantity: "",
    images: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/v1/categories/main"),
          api.get("/v1/brands/main"),
        ]);

        // Ensure they are arrays
        setCategories(Array.isArray(catRes.data.data) ? catRes.data.data : []);
        setBrands(Array.isArray(brandRes.data.data) ? brandRes.data.data : []);
      } catch (err) {
        console.error("Failed to fetch dropdown options", err);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (form.categoryId) {
      api.get(`/v1/categories/subcategories/${form.categoryId}`).then((res) => {
        setSubcategories(res.data.data);
      });
    }
  }, [form.categoryId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes("dimensions.")) {
      const key = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [key]: value,
        },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice || 0),
        weight: parseFloat(form.weight || 0),
        stockQuantity: parseInt(form.stockQuantity),
        includedAccessories: form.includedAccessories
          .split(",")
          .map((a: string) => a.trim()),
        compatibleWith: form.compatibleWith
          .split(",")
          .map((c: string) => c.trim()),
        images: form.images
          ? form.images.split(",").map((url: string) => url.trim())
          : [],
        sku: form.sku,
      };

      await api.post("/v1/products/add", payload);
      navigate("/admin/products");
    } catch (err) {
      console.error("Add product failed", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" mb={2}>
        Add Product
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="model"
          label="Model"
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          multiline
        />
        <TextField
          name="price"
          label="Price"
          value={form.price}
          onChange={handleChange}
        />
        <TextField
          name="originalPrice"
          label="Original Price"
          value={form.originalPrice}
          onChange={handleChange}
        />
        <TextField
          name="condition"
          label="Condition"
          value={form.condition}
          onChange={handleChange}
          select
        >
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="USED">Used</MenuItem>
        </TextField>
        <TextField
          name="powerType"
          label="Power Type"
          value={form.powerType}
          onChange={handleChange}
          select
        >
          <MenuItem value="ELECTRIC_CORDLESS">Electric Cordless</MenuItem>
          <MenuItem value="ELECTRIC_CORDED">Electric Corded</MenuItem>
          <MenuItem value="MANUAL">Manual</MenuItem>
        </TextField>
        <TextField
          name="voltage"
          label="Voltage"
          value={form.voltage}
          onChange={handleChange}
        />
        <TextField
          name="weight"
          label="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
        />

        {/* Dimensions */}
        <TextField
          name="dimensions.length"
          label="Length"
          value={form.dimensions.length}
          onChange={handleChange}
        />
        <TextField
          name="dimensions.width"
          label="Width"
          value={form.dimensions.width}
          onChange={handleChange}
        />
        <TextField
          name="dimensions.height"
          label="Height"
          value={form.dimensions.height}
          onChange={handleChange}
        />
        <TextField
          name="dimensions.unit"
          label="Unit"
          value={form.dimensions.unit}
          onChange={handleChange}
        />

        <TextField
          name="warrantyPeriod"
          label="Warranty Period"
          value={form.warrantyPeriod}
          onChange={handleChange}
        />
        <TextField
          name="includedAccessories"
          label="Included Accessories (comma separated)"
          value={form.includedAccessories}
          onChange={handleChange}
        />
        <TextField
          name="compatibleWith"
          label="Compatible With (comma separated)"
          value={form.compatibleWith}
          onChange={handleChange}
        />
        <TextField
          name="videoUrl"
          label="Video URL"
          value={form.videoUrl}
          onChange={handleChange}
        />
        <TextField
          name="images"
          label="Image URLs (comma separated)"
          value={form.images}
          onChange={handleChange}
        />
        <TextField
          name="stockQuantity"
          label="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
        />
        <TextField
          name="brandId"
          label="Brand"
          value={form.brandId}
          onChange={handleChange}
          select
        >
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.id}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Subcategory"
          name="subCategoryId"
          value={form.subCategoryId}
          onChange={handleChange}
          disabled={!form.categoryId}
        >
          {subcategories.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.name}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Product
        </Button>
      </Box>
    </Container>
  );
};

export default AddProduct;
