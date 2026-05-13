import { Route, Routes } from 'react-router-dom'
import Home from './pages/Client/Home'
import MovieDetail from './pages/Client/MovieDetail'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </>
  )
}

export default App
