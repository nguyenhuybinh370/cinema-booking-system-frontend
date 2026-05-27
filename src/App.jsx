import { Navigate } from "react-router-dom";
// import Login from "./pages/Client/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellTicketWizard from "./pages/Staff/SellTicket/SellTicketWizard";
import StaffLayout from "./components/StaffLayout/StaffLayout";
import CheckIn from "./pages/Staff/CheckInPage/index";
import Dashboard from "./pages/Staff/Dashboard";
import StaffProfile from "./pages/Staff/Profile/Profile";
import Schedule from "./pages/Staff/Schedule/Schedule";
import TransactionHistory from "./pages/Staff/TransactionHistory/index";

import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Client/Home'
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer';
import MovieDetails from './pages/Client/MovieDetails';
import MoviesPage from './pages/Client/MoviesPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ClientProfile from './pages/Client/Profile';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const isStaffRoute = useLocation().pathname.startsWith('/staff');

  return (
    <>
      <Toaster />
      {!isAdminRoute && !isStaffRoute && <Navbar />}
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        {/* === CUSTOMER PROTECTED ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="/profile" element={<ClientProfile />} />
        </Route>

        <Route path="/movies/now-showing" element={<MoviesPage key="now" initialType="now" />} />
        <Route path="/movies/coming-soon" element={<MoviesPage key="soon" initialType="soon" />} />

        {/* === STAFF ROUTES (Role: STAFF) === */}
        <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            {/* Chuyển hướng mặc định vào thẳng trang dashboard */}
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sell-ticket" element={<SellTicketWizard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="profile" element={<StaffProfile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>
        </Route>
      </Routes>
      {!isAdminRoute && !isStaffRoute && <Footer />}
    </>
  );
}

export default App;
