"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Box, Typography, Divider, Button, CircularProgress } from "@mui/material"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import GoBackButton from "../components/GoBackButton"
import CheckCircleIcon from "@mui/icons-material/CheckCircle" // Import the icon

const MyOrderPage = () => {
  const [latestOrder, setLatestOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) {
          navigate("/login") // Redirect if not logged in
          return
        }

        // Fetch the latest order
        const res = await api.get("/v1/orders/my-orders?page=1&limit=1", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (res.data.orders.length > 0) {
          setLatestOrder(res.data.orders[0])
        } else {
          setLatestOrder(null) // No orders found
        }
      } catch (error: any) {
        console.error("Failed to load orders:", error.response?.data || error.message)
        setLatestOrder(null) // Ensure order is null on error
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate]) // Added navigate to dependency array

  const handleConfirm = async () => {
    try {
      const accessToken = localStorage.getItem("access_token")
      if (!accessToken || !latestOrder?.id) return

      const res = await api.patch(
        `/v1/orders/confirm/${latestOrder.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      // Update local state with confirmed order
      setLatestOrder(res.data)
      // Navigate to success page with updated order
      navigate("/order-success", { state: { order: res.data } })
    } catch (error: any) {
      console.error("Failed to confirm order:", error.response?.data || error.message)
      alert("Order confirmation failed")
    }
  }

  const handleCancel = async () => {
    try {
      const accessToken = localStorage.getItem("access_token")
      if (!accessToken || !latestOrder?.id) return

      await api.delete(`/v1/order/${latestOrder.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Update local state to reflect cancellation
      setLatestOrder((prev: any) => ({ ...prev, status: "CANCELLED" })) // Assuming backend sets status to CANCELLED
      alert("Order cancelled!")
      navigate("/") // or navigate("/products") or any page you want
    } catch (error: any) {
      console.error("Failed to cancel order:", error.response?.data || error.message)
      alert("Failed to cancel order.")
    }
  }

  // Helper to format address object
  const formatAddress = (address: any): string => {
    if (!address) return "Not Provided"
    return `${address.street}\n${address.city}, ${address.state} ${address.zipcode}\n${address.country}`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (!latestOrder) {
    return (
      <Box p={4} textAlign="center">
        <GoBackButton />
        <Typography variant="h5" mt={4}>
          No recent orders found.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
          Start Shopping
        </Button>
      </Box>
    )
  }

  const isPendingForConfirmation = latestOrder.status === "PENDING"
  const isConfirmed = latestOrder.status === "CONFIRMED"
  const isCancelled = latestOrder.status === "CANCELLED" // Assuming CANCELLED status
  const isPaid = latestOrder.paymentStatus === "PAID"

  return (
    <Box maxWidth="600px" mx="auto" p={4} borderRadius={2} boxShadow={2}>
      <Box mb={2}>
        <GoBackButton />
      </Box>
      <Typography variant="h5" mb={1}>
        🛍️ My Order
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {isPendingForConfirmation && "Review and confirm your order"}
        {isConfirmed && "Your order has been confirmed!"}
        {isCancelled && "Your order has been cancelled."}
        {!isPendingForConfirmation && !isConfirmed && !isCancelled && "Order Details"}
      </Typography>

      {/* Order Status Display */}
      <Box mb={2}>
        <Typography fontWeight="bold">Order Status:</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" color={isConfirmed ? "success.main" : isCancelled ? "error.main" : "warning.main"}>
            {latestOrder.status}
          </Typography>
          {isConfirmed && isPaid && <CheckCircleIcon sx={{ color: "success.main" }} />}
        </Box>
        <Typography fontWeight="bold" mt={1}>
          Payment Status:
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" color={isPaid ? "success.main" : "warning.main"}>
            {latestOrder.paymentStatus || "N/A"}
          </Typography>
          {isConfirmed && isPaid && <CheckCircleIcon sx={{ color: "success.main" }} />}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Meta */}
      <Box mb={2}>
        <Typography fontWeight="bold">Order Details</Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography>Order ID:</Typography>
          <Typography>{latestOrder.id}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Order Number:</Typography>
          <Typography>{latestOrder.orderNumber}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Items */}
      {latestOrder.orderItems && latestOrder.orderItems.length > 0 ? (
        latestOrder.orderItems.map((item: any) => (
          <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
            <Typography>
              {item.product?.name} ({item.quantity}x)
            </Typography>
            <Typography>₹{Number(item.totalPrice).toFixed(2)}</Typography>
          </Box>
        ))
      ) : (
        <Typography>No items in this order.</Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Subtotal:</Typography>
        <Typography>
          ₹
          {(
            Number(latestOrder.totalAmount) -
            Number(latestOrder.taxAmount || 0) -
            Number(latestOrder.shippingCost || 0)
          ).toFixed(2)}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Tax (8%):</Typography>
        <Typography>₹{Number(latestOrder.taxAmount || 0).toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Shipping:</Typography>
        <Typography>₹{Number(latestOrder.shippingCost || 0).toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" fontWeight="bold" mt={1}>
        <Typography>Total Amount:</Typography>
        <Typography>₹{Number(latestOrder.totalAmount).toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Shipping Address */}
      <Box mb={2}>
        <Typography fontWeight="bold">Shipping Address:</Typography>
        <Typography whiteSpace="pre-line">{formatAddress(latestOrder.shippingAddress)}</Typography>
      </Box>

      {/* Billing Address */}
      <Box mb={2}>
        <Typography fontWeight="bold">Billing Address:</Typography>
        <Typography whiteSpace="pre-line">{formatAddress(latestOrder.billingAddress)}</Typography>
      </Box>

      {isPendingForConfirmation && (
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="contained" color="success" onClick={handleConfirm}>
            ✔ Confirm Order
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            ✘ Cancel Order
          </Button>
        </Box>
      )}

      {!isPendingForConfirmation && (
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default MyOrderPage
