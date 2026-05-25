import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Client/Home'
import MovieDetail from './pages/Client/MovieDetail'
import SeatSelection from './pages/Client/SeatSelection'
import Checkout from './pages/Client/Checkout'


// Admin Pages
import Rooms from './pages/Admin/Rooms'
import Movies from './pages/Admin/Movies'
import SeatMaps from './pages/Admin/SeatMaps'
import Pricing from './pages/Admin/Pricing'
import Personnel from './pages/Admin/Personnel'
import Showtimes from './pages/Admin/Showtimes'
import Stats from './pages/Admin/Stats'
import SeatMapTemplates from './pages/Admin/SeatMapTemplates'
import Shifts from './pages/Admin/Shifts'
import Customers from './pages/Admin/Customers'
import Transactions from './pages/Admin/Transactions'
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Client/Home";
import Login from "./pages/Client/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellTicketWizard from "./pages/Staff/SellTicket/SellTicketWizard";
import StaffLayout from "./components/StaffLayout/StaffLayout";
import CheckIn from "./pages/Staff/CheckIn";
import Dashboard from "./pages/Staff/Dashboard";
import Profile from "./pages/Staff/Profile/Profile";
import Schedule from "./pages/Staff/Schedule/Schedule";
import TransactionHistory from "./pages/Staff/TransactionHistory";

import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Client/Home'
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer';
import MovieDetails from './pages/Client/MovieDetails';
import MoviesPage from './pages/Client/MoviesPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Client/Profile';
import ForgotPassword from './pages/Auth/ForgotPassword';
function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  // const location = useLocation().pathname;
  // const isAuthRoute = location === '/login' || location === '/register';
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/booking/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />


        {/* Admin Routes */}
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
      </Routes>

        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* === STAFF ROUTES (Role: STAFF) === */}
        <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
          <Route path="/staff" element={<StaffLayout />}>
            {/* Chuyển hướng mặc định vào thẳng trang dashboard */}
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sell-ticket" element={<SellTicketWizard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies/now-showing" element={<MoviesPage key="now" initialType="now" />} />
        <Route path="/movies/coming-soon" element={<MoviesPage key="soon" initialType="soon" />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
