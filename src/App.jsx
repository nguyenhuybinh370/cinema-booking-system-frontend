import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Client Pages
import Home from './pages/Client/Home';
import MovieDetail from './pages/Client/MovieDetail'; // legacy single detail
import MovieDetails from './pages/Client/MovieDetails'; // plural (refactored)
import SeatSelection from './pages/Client/SeatSelection';
import Checkout from './pages/Client/Checkout';
import MoviesPage from './pages/Client/MoviesPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ClientProfile from './pages/Client/Profile';
import VNPayReturn from './pages/Client/VNPayReturn';

// Admin Pages
import Rooms from './pages/Admin/Rooms';
import Movies from './pages/Admin/Movies';
import SeatMaps from './pages/Admin/SeatMaps';
import Pricing from './pages/Admin/Pricing';
import Personnel from './pages/Admin/Personnel';
import Showtimes from './pages/Admin/Showtimes';
import Stats from './pages/Admin/Stats';
import SeatMapTemplates from './pages/Admin/SeatMapTemplates';
import Shifts from './pages/Admin/Shifts';
import Customers from './pages/Admin/Customers';
import Transactions from './pages/Admin/Transactions';

// Staff Pages
import SellTicketWizard from './pages/Staff/SellTicket/SellTicketWizard';
import StaffLayout from './components/StaffLayout/StaffLayout';
import CheckIn from './pages/Staff/CheckInPage/index';
import Dashboard from './pages/Staff/Dashboard';
import StaffProfile from './pages/Staff/Profile/index';
import Schedule from './pages/Staff/Schedule/index';
import TransactionHistory from './pages/Staff/TransactionHistory/index';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const isStaffRoute = useLocation().pathname.startsWith("/staff");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#131A2A",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {!isAdminRoute && !isStaffRoute && <Navbar />}
      
      <Routes>
        {/* === PUBLIC CLIENT ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Map movie detail routes: old singular and new plural */}
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie-old/:id" element={<MovieDetail />} />
        
        <Route path="/booking/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/movies/now-showing" element={<MoviesPage key="now" initialType="now" />} />
        <Route path="/movies/coming-soon" element={<MoviesPage key="soon" initialType="soon" />} />

        {/* === CUSTOMER PROTECTED ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/payment/vnpay-return" element={<VNPayReturn />} />
        </Route>

        {/* === STAFF ROUTES (Role: STAFF) === */}
        <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sell-ticket" element={<SellTicketWizard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="profile" element={<StaffProfile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>
        </Route>

        {/* === ADMIN ROUTES (Role: ADMIN) === */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<Navigate to="/admin/rooms" replace />} />
          <Route path="/admin/rooms" element={<Rooms />} />
          <Route path="/admin/rooms/:roomId/seats" element={<SeatMaps />} />
          <Route path="/admin/movies" element={<Movies />} />
          <Route path="/admin/seat-templates" element={<SeatMapTemplates />} />
          <Route path="/admin/pricing" element={<Pricing />} />
          <Route path="/admin/personnel" element={<Personnel />} />
          <Route path="/admin/shifts" element={<Shifts />} />
          <Route path="/admin/showtimes" element={<Showtimes />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/stats" element={<Stats />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && !isStaffRoute && <Footer />}
    </>
  );
}

export default App;
