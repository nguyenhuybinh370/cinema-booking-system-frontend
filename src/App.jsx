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
  )
}

export default App
