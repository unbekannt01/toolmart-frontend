import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const AdminRoute = () => {
  const { isLoggedIn, role } = useAuth();

  if(!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default AdminRoute;
