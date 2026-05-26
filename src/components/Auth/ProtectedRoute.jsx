import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  // Giả sử bạn lưu role vào localStorage hoặc lấy từ decode JWT
  const userRole = localStorage.getItem('userRole'); 

  if (!token) {
    const isStaffOrAdmin = window.location.pathname.startsWith('/staff') || window.location.pathname.startsWith('/admin');
    return <Navigate to={isStaffOrAdmin ? "/staff/login" : "/login"} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Nếu role không phù hợp (vừa đăng nhập nhưng là Khách hàng đòi vào trang Admin)
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;