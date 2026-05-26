import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Client Pages
import Home from './pages/Client/Home';
import MovieDetails from './pages/Client/MovieDetails';
import MoviesPage from './pages/Client/MoviesPage';
import SeatSelection from './pages/Client/SeatSelection';
import Checkout from './pages/Client/Checkout';
import Profile from './pages/Client/Profile';
import TicketConfirmation from './pages/Client/TicketConfirmation';

// Auth Pages
import ClientLogin from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';

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
import CheckIn from './pages/Staff/CheckIn';
import Dashboard from './pages/Staff/Dashboard';
import StaffProfile from './pages/Staff/Profile/Profile';
import Schedule from './pages/Staff/Schedule/Schedule';
import TransactionHistory from './pages/Staff/TransactionHistory';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const isStaffRoute = useLocation().pathname.startsWith('/staff');

  const hideNavAndFooter = isAdminRoute || isStaffRoute;

  return (
    <>
      <Toaster />
      {!hideNavAndFooter && <Navbar />}
      
      <Routes>
        {/* === PUBLIC CLIENT ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movies/now-showing" element={<MoviesPage key="now" initialType="now" />} />
        <Route path="/movies/coming-soon" element={<MoviesPage key="soon" initialType="soon" />} />

        {/* === PROTECTED CLIENT ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={["CLIENT", "STAFF", "ADMIN"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:showtimeId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
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

      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
