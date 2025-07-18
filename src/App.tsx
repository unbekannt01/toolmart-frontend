import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AdminRoute from "./routes/AdminRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminUsersPage from "./pages/AdminUsersPage";
import LoginPage from "./pages/LoginPage";
import AdminProductList from "./pages/admin/AdminProductList";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminBrandsPage from "./pages/admin/AdminBrandsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import RegisterOptions from "./pages/RegisterOptions";
import RegisterSimple from "./pages/RegisterSimple";
import RegisterUsingOtp from "./pages/RegisterOTP";
import RegisterUsingEmailToken from "./pages/RegisterUsingEmailToken";
import VerifyOtp from "./pages/VerifyOTP";
import VerifyEmail from "./pages/VerifyEmail";
import CheckYourEmail from "./pages/CheckYourEmail";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrderPage from "./pages/MyOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserRoute from "./routes/UserRoute";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterOptions />} />
          <Route path="/register/simple" element={<RegisterSimple />} />
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
          <Route path="/register/otp" element={<RegisterUsingOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/register/email-token"
            element={<RegisterUsingEmailToken />}
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/check-your-email" element={<CheckYourEmail />} />
          {/* User-only routes */}
          <Route element={<UserRoute />}>
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-order" element={<MyOrderPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />{" "}
          </Route>
          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/products" element={<AdminProductList />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/brands" element={<AdminBrandsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            {/* Add more admin routes as needed */}
          </Route>
        </Routes>
      </Container>
    </>
  );
};

export default App;
