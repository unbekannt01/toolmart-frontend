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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/v1/auth/getAllUsers");
      setUsers(res.data.users || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load users",
        severity: "error",
      });
    }
  };

  const handleAction = async (action: string, userId: string) => {
    try {
      const endpoints: Record<string, string> = {
        suspend: `/v1/admin/suspend/${userId}`,
        reactivate: `/v1/admin/reactivate/${userId}`,
        unblock: `/v1/admin/unblock/${userId}`,
        delete: `/v1/admin/softDelete/${userId}`,
        restore: `/v1/admin/restore/${userId}`,
      };

      const method = action === "delete" ? api.delete : api.post;
      await method(
        endpoints[action],
        action === "suspend" ? { message: "Suspended by admin" } : {}
      );

      setSnackbar({
        open: true,
        message: `${action} successful`,
        severity: "success",
      });

      await fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `${action} failed`,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.userName || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.deletedAt
                    ? "Deleted"
                    : user.status === "SUSPENDED"
                    ? "Suspended"
                    : user.isBlocked === true
                    ? "Blocked"
                    : "Active"}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {user.deletedAt ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleAction("restore", user.id)}
                      >
                        Restore
                      </Button>
                    ) : user.isBlocked === true ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAction("unblock", user.id)}
                      >
                        Unblock
                      </Button>
                    ) : user.status === "SUSPENDED" ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAction("reactivate", user.id)}
                      >
                        Reactivate
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSuspendDialogOpen(true);
                          }}
                        >
                          Suspend
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleAction("delete", user.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog
          open={suspendDialogOpen}
          onClose={() => setSuspendDialogOpen(false)}
        >
          <DialogTitle>Suspend User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for suspension"
              type="text"
              fullWidth
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                if (!selectedUserId) return;

                try {
                  await api.post(`/v1/admin/suspend/${selectedUserId}`, {
                    message: suspendReason || "Suspended by admin",
                  });

                  setSnackbar({
                    open: true,
                    message: "User suspended successfully",
                    severity: "success",
                  });

                  setSuspendDialogOpen(false);
                  setSuspendReason("");
                  setSelectedUserId(null);
                  fetchUsers();
                } catch (error) {
                  setSnackbar({
                    open: true,
                    message: "Failed to suspend user",
                    severity: "error",
                  });
                }
              }}
            >
              Confirm Suspend
            </Button>
          </DialogActions>
        </Dialog>
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
    </Box>
  );
};

export default AdminUsersPage;
