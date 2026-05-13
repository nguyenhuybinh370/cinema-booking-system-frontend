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

function App() {
  return (
    <>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/booking/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/rooms" replace />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/movies" element={<Movies />} />
        <Route path="/admin/seat-maps" element={<SeatMaps />} />
        <Route path="/admin/pricing" element={<Pricing />} />
        <Route path="/admin/personnel" element={<Personnel />} />
        <Route path="/admin/showtimes" element={<Showtimes />} />
        <Route path="/admin/stats" element={<Stats />} />
      </Routes>

    </>
  )
}

export default App
