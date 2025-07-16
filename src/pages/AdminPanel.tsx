import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <Box mt={4} p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/products")}
        >
          Manage Products
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate("/admin/categories")}
        >
          Manage Categories
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/admin/brands")}
        >
          Manage Brands
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPanel;
