/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/EditProduct.tsx
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    name: "",
    model: "",
    description: "",
    price: "",
    originalPrice: "",
    sku: "",
    condition: "",
    powerType: "",
    voltage: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "cm",
    },
    warrantyPeriod: "",
    includedAccessories: "",
    compatibleWith: "",
    images: [""],
    videoUrl: "",
    brandId: "",
    subCategoryId: "",
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/v1/products/getById/${id}`);
        const p = res.data;

        setForm({
          name: p.name || "",
          model: p.model || "",
          description: p.description || "",
          price: p.price || "",
          originalPrice: p.originalPrice || "",
          sku: p.sku || "",
          condition: p.condition || "",
          powerType: p.powerType || "",
          voltage: p.voltage || "",
          weight: p.weight || "",
          dimensions: {
            length: p.dimensions?.length || "",
            width: p.dimensions?.width || "",
            height: p.dimensions?.height || "",
            unit: p.dimensions?.unit || "cm",
          },
          warrantyPeriod: p.warrantyPeriod || "",
          includedAccessories: (p.includedAccessories || []).join(", "),
          compatibleWith: (p.compatibleWith || []).join(", "),
          videoUrl: p.videoUrl || "",
          images: p.images || [""],
          brandId: p.brandId || "",
          subCategoryId: p.subCategoryId || "",
          stockQuantity: p.stockQuantity || "",
        });
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes("dimensions.")) {
      const field = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [field]: value,
        },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        includedAccessories: form.includedAccessories
          .split(",")
          .map((s: string) => s.trim()),
        compatibleWith: form.compatibleWith
          .split(",")
          .map((s: string) => s.trim()),
      };

      console.log("Sending update payload:", payload);

      if (Object.keys(payload).length === 0) {
        alert("No fields changed.");
        return;
      }

      await api.patch(`/v1/products/${id}`, payload);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mb={2}>
        Update Product
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Model"
          name="model"
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
        />
        <TextField
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
        <TextField
          label="Original Price"
          name="originalPrice"
          value={form.originalPrice}
          onChange={handleChange}
        />
        <TextField
          label="SKU"
          name="sku"
          value={form.sku}
          onChange={handleChange}
        />

        <TextField
          label="Condition"
          name="condition"
          value={form.condition}
          onChange={handleChange}
          select
        >
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="USED">Used</MenuItem>
        </TextField>

        <TextField
          label="Power Type"
          name="powerType"
          value={form.powerType}
          onChange={handleChange}
          select
        >
          <MenuItem value="ELECTRIC_CORDLESS">Electric Cordless</MenuItem>
          <MenuItem value="ELECTRIC_CORDED">Electric Corded</MenuItem>
          <MenuItem value="MANUAL">Manual</MenuItem>
        </TextField>

        <TextField
          label="Voltage"
          name="voltage"
          value={form.voltage}
          onChange={handleChange}
        />
        <TextField
          label="Weight (kg)"
          name="weight"
          value={form.weight}
          onChange={handleChange}
        />

        <TextField
          label="Length"
          name="dimensions.length"
          value={form.dimensions.length}
          onChange={handleChange}
        />
        <TextField
          label="Width"
          name="dimensions.width"
          value={form.dimensions.width}
          onChange={handleChange}
        />
        <TextField
          label="Height"
          name="dimensions.height"
          value={form.dimensions.height}
          onChange={handleChange}
        />
        <TextField
          label="Dimensions Unit"
          name="dimensions.unit"
          value={form.dimensions.unit}
          onChange={handleChange}
        />

        <TextField
          label="Warranty Period"
          name="warrantyPeriod"
          value={form.warrantyPeriod}
          onChange={handleChange}
        />
        <TextField
          label="Included Accessories"
          name="includedAccessories"
          value={form.includedAccessories}
          onChange={handleChange}
        />
        <TextField
          label="Compatible With"
          name="compatibleWith"
          value={form.compatibleWith}
          onChange={handleChange}
        />
        <TextField
          label="Image URL"
          name="images"
          value={form.images[0]}
          onChange={(e) => setForm({ ...form, images: [e.target.value] })}
        />
        <TextField
          label="Video URL"
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
        />
        <TextField
          label="Stock Quantity"
          name="stockQuantity"
          value={form.stockQuantity}
          onChange={handleChange}
        />
        <TextField
          label="Brand ID"
          name="brandId"
          value={form.brandId}
          onChange={handleChange}
        />
        <TextField
          label="SubCategory ID"
          name="subCategoryId"
          value={form.subCategoryId}
          onChange={handleChange}
        />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update Product
        </Button>
      </Box>
    </Container>
  );
};

export default EditProduct;
