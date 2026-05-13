import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Client/Home'
import MovieDetail from './pages/Client/MovieDetail'

// Admin Pages
import Rooms from './pages/Admin/Rooms'
import Movies from './pages/Admin/Movies'
import SeatMaps from './pages/Admin/SeatMaps'
import Pricing from './pages/Admin/Pricing'

function App() {
  return (
    <>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/rooms" replace />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/movies" element={<Movies />} />
        <Route path="/admin/seat-maps" element={<SeatMaps />} />
        <Route path="/admin/pricing" element={<Pricing />} />

        <Route path="/admin/personnel" element={<div className="p-10 text-white">Personnel Module Placeholder</div>} />
        <Route path="/admin/showtimes" element={<div className="p-10 text-white">Showtimes Module Placeholder</div>} />
        <Route path="/admin/stats" element={<div className="p-10 text-white">Stats Module Placeholder</div>} />
      </Routes>
    </>
  )
}

export default App
