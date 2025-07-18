/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Rating,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    userName: string;
    first_name?: string;
    last_name?: string;
  };
}

const ReviewModal = ({
  open,
  onClose,
  productId,
  productName,
}: ReviewModalProps) => {
  const { isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    severity: "info",
  });

  // Fetch reviews when modal opens
  useEffect(() => {
    if (open && productId) {
      fetchReviews();
    }
  }, [open, productId, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/v1/reviews/product/${productId}?page=${page}&limit=5`
      );
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      setAlert({
        show: true,
        message: "Failed to load reviews",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setAlert({
        show: true,
        message: "Please login to submit a review",
        severity: "info",
      });
      return;
    }

    if (newReview.rating === 0) {
      setAlert({
        show: true,
        message: "Please select a rating",
        severity: "error",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      setAlert({
        show: true,
        message: "Please write a comment",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      await api.post(
        "/v1/reviews",
        {
          productId,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAlert({
        show: true,
        message: "Review submitted successfully!",
        severity: "success",
      });

      // Reset form
      setNewReview({ rating: 0, comment: "" });

      // Refresh reviews
      setPage(1);
      fetchReviews();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to submit review";
      setAlert({
        show: true,
        message,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserDisplayName = (user: any) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.userName || "Anonymous";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon color="primary" />
          <Typography variant="h6">Reviews for {productName}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 400 }}>
        {alert.show && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}

        {/* Existing Reviews */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Customer Reviews
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No reviews yet. Be the first to review this product!
            </Typography>
          ) : (
            <>
              {reviews.map((review) => (
                <Box key={review.id} mb={2}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {getUserDisplayName(review.user)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 6 }}>
                    {review.comment}
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Write Review Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>

          {!isLoggedIn ? (
            <Alert severity="info">Please login to write a review</Alert>
          ) : (
            <>
              <Box mb={2}>
                <Typography component="legend" gutterBottom>
                  Rating
                </Typography>
                <Rating
                  value={newReview.rating}
                  onChange={(_, newValue) =>
                    setNewReview({ ...newReview, rating: newValue || 0 })
                  }
                  size="large"
                />
              </Box>

              <Box mb={2}>
                <Typography component="legend" gutterBottom>
                  Comment
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleSubmitReview}
                disabled={
                  submitting ||
                  newReview.rating === 0 ||
                  !newReview.comment.trim()
                }
                startIcon={
                  submitting ? <CircularProgress size={20} /> : <StarIcon />
                }
                fullWidth
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
