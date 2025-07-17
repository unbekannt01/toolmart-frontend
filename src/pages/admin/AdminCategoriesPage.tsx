"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import GoBackButton from "../../components/GoBackButton"; // Import GoBackButton

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [openAddCat, setOpenAddCat] = useState(false);
  const [openAddSubCat, setOpenAddSubCat] = useState(false);
  const [editCatDialogOpen, setEditCatDialogOpen] = useState(false);
  const [editSubCatDialogOpen, setEditSubCatDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    categoryId: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/v1/categories/tree");
      setCategories(res.data || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      await api.post("/v1/categories/add-category", [newCategory]);
      setSnackbar({
        open: true,
        message: "Category added",
        severity: "success",
      });
      setOpenAddCat(false);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add category",
        severity: "error",
      });
    }
  };

  const handleAddSubCategory = async () => {
    try {
      await api.post("/v1/categories/add-subcategory", newSubCategory);
      setSnackbar({
        open: true,
        message: "Subcategory added",
        severity: "success",
      });
      setOpenAddSubCat(false);
      setNewSubCategory({ name: "", description: "", categoryId: "" });
      fetchCategories();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add subcategory",
        severity: "error",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/v1/categories/deteteCategory/${id}`);
      setSnackbar({
        open: true,
        message: "Category deleted",
        severity: "success",
      });
      fetchCategories();
    } catch {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      await api.delete(`/v1/categories/deleteSubcategory/${id}`);
      setSnackbar({
        open: true,
        message: "SubCategory deleted",
        severity: "success",
      });
      fetchCategories();
    } catch {
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box p={3}>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h4" gutterBottom>
        Manage Categories & SubCategories
      </Typography>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => setOpenAddCat(true)}
        >
          Add Category
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenAddSubCat(true)}
        >
          Add SubCategory
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>SubCategories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Typography fontWeight="bold">{cat.name}</Typography>
                    <Box display="flex" gap={1} mt={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setEditCatDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>{cat.description || "-"}</TableCell>

                <TableCell>
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    cat.subcategories.map((sub: any) => (
                      <Box
                        key={sub.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography>{sub.name}</Typography>
                        <Box>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedSubCategory(sub);
                              setEditSubCatDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSubCategory(sub.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <i>No subcategories</i>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Category Dialog */}
      <Dialog open={openAddCat} onClose={() => setOpenAddCat(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCat(false)}>Cancel</Button>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={editCatDialogOpen}
        onClose={() => setEditCatDialogOpen(false)}
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={selectedCategory?.name || ""}
            onChange={(e) =>
              setSelectedCategory({ ...selectedCategory, name: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={selectedCategory?.description || ""}
            onChange={(e) =>
              setSelectedCategory({
                ...selectedCategory,
                description: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCatDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await api.patch(
                  `/v1/categories/updateCategory/${selectedCategory.id}`,
                  {
                    name: selectedCategory.name,
                    description: selectedCategory.description,
                  }
                );
                setSnackbar({
                  open: true,
                  message: "Category updated",
                  severity: "success",
                });
                setEditCatDialogOpen(false);
                fetchCategories();
              } catch {
                setSnackbar({
                  open: true,
                  message: "Failed to update category",
                  severity: "error",
                });
              }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add SubCategory Dialog */}
      <Dialog open={openAddSubCat} onClose={() => setOpenAddSubCat(false)}>
        <DialogTitle>Add New SubCategory</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Category"
            value={newSubCategory.categoryId}
            onChange={(e) =>
              setNewSubCategory({
                ...newSubCategory,
                categoryId: e.target.value,
              })
            }
            fullWidth
            margin="dense"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="SubCategory Name"
            value={newSubCategory.name}
            onChange={(e) =>
              setNewSubCategory({ ...newSubCategory, name: e.target.value })
            }
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Description"
            value={newSubCategory.description}
            onChange={(e) =>
              setNewSubCategory({
                ...newSubCategory,
                description: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddSubCat(false)}>Cancel</Button>
          <Button
            onClick={handleAddSubCategory}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit SubCategory Dialog */}
      <Dialog
        open={editSubCatDialogOpen}
        onClose={() => setEditSubCatDialogOpen(false)}
      >
        <DialogTitle>Edit SubCategory</DialogTitle>
        <DialogContent>
          <TextField
            label="SubCategory Name"
            value={selectedSubCategory?.name || ""}
            onChange={(e) =>
              setSelectedSubCategory({
                ...selectedSubCategory,
                name: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={selectedSubCategory?.description || ""}
            onChange={(e) =>
              setSelectedSubCategory({
                ...selectedSubCategory,
                description: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSubCatDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await api.patch(
                  `/v1/categories/updateSubCategory/${selectedSubCategory.id}`,
                  {
                    name: selectedSubCategory.name,
                    description: selectedSubCategory.description,
                  }
                );
                setSnackbar({
                  open: true,
                  message: "SubCategory updated",
                  severity: "success",
                });
                setEditSubCatDialogOpen(false);
                fetchCategories();
              } catch {
                setSnackbar({
                  open: true,
                  message: "Failed to update subcategory",
                  severity: "error",
                });
              }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCategoriesPage;
