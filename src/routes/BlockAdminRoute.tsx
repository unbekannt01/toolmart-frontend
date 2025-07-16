import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const BlockAdminRoute = () => {
  const { role } = useAuth();

  // If admin, redirect to admin panel
  if (role === 'ADMIN') {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default BlockAdminRoute;
