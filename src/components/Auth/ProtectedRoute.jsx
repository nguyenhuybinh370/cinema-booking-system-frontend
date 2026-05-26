import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  // Giả sử bạn lưu role vào localStorage hoặc lấy từ decode JWT
  const userRole = localStorage.getItem('userRole'); 
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Nếu role không phù hợp (vừa đăng nhập nhưng là Khách hàng đòi vào trang Admin)
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;