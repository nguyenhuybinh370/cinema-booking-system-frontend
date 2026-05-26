import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import MovieCard, { getMovieStatus } from '../../components/Admin/Movies/MovieCard';
import MovieModal from '../../components/Admin/Movies/MovieModal';
import { Search, Plus } from 'lucide-react';

const STATUS_LABELS = { All: 'Tất cả', Showing: 'Đang chiếu', 'Coming Soon': 'Sắp ra mắt', Ended: 'Ngừng chiếu' };

const initialFormState = {
  TenPhim: '', ThoiLuong: '', TheLoai: '', NgayKhoiChieu: '', NgayKetThuc: '',
  DaoDien: '', DienVien: '', GioiHanTuoi: 'P', NoiDung: '', Trailer: '', HinhAnh: '', KhaDung: 1,
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const loadMovies = async () => {
    const data = await adminService.getMovies();
    setMovies(data);
    setLoading(false);
  };

  const { formData, setFormData, errors, handleChange, handleSubmit, resetForm } = useAdminForm(
    initialFormState,
    async (data, { resetForm }) => {
      const processed = {
        ...data,
        ThoiLuong: parseInt(data.ThoiLuong, 10),
        KhaDung: parseInt(data.KhaDung, 10),
        NgayKetThuc: data.NgayKetThuc?.trim() || null,
        DaoDien: data.DaoDien?.trim() || null,
        DienVien: data.DienVien?.trim() || null,
        HinhAnh: data.HinhAnh?.trim() || null,
        NoiDung: data.NoiDung?.trim() || null,
      };
      if (editingMovie) { await adminService.updateMovie(editingMovie.MaPhim, processed); alert('Cập nhật phim thành công!'); }
      else { await adminService.addMovie(processed); alert('Thêm phim mới thành công!'); }
      await loadMovies();
      setIsModalOpen(false);
      setEditingMovie(null);
      resetForm();
    }
  );

  useEffect(() => {
    let ignore = false;
    adminService.getMovies().then(data => { if (!ignore) { setMovies(data); setLoading(false); } });
    return () => { ignore = true; };
  }, []);

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({ TenPhim: movie.TenPhim || '', ThoiLuong: movie.ThoiLuong || '', TheLoai: movie.TheLoai || '', NgayKhoiChieu: movie.NgayKhoiChieu || '', NgayKetThuc: movie.NgayKetThuc || '', DaoDien: movie.DaoDien || '', DienVien: movie.DienVien || '', GioiHanTuoi: movie.GioiHanTuoi || 'P', NoiDung: movie.NoiDung || '', Trailer: movie.Trailer || '', HinhAnh: movie.HinhAnh || '', KhaDung: movie.KhaDung ?? 1 });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Xóa phim ${id} khỏi cơ sở dữ liệu?`)) return;
    try { await adminService.deleteMovie(id); alert('Xóa phim thành công!'); await loadMovies(); }
    catch (err) { alert(`Lỗi khi xóa: ${err.message}`); }
  };

  const filteredMovies = movies.filter(m => {
    const matchSearch = !searchQuery || m.TenPhim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.DaoDien && m.DaoDien.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.TheLoai.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch && (filter === 'All' || getMovieStatus(m) === filter);
  });

  const openAddModal = () => { setEditingMovie(null); resetForm(); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingMovie(null); };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý phim</h1>
          <p className="text-slate-500 font-medium">Quản lý toàn bộ thông tin hiển thị và vòng đời của tác phẩm điện ảnh.</p>
        </div>
        <button onClick={openAddModal} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer">
          <Plus size={20} /> Thêm phim mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/5 p-2 rounded-2xl border border-white/5">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${filter === key ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2 border border-white/5 min-w-[280px]">
          <Search size={18} className="text-slate-500" />
          <input type="text" placeholder="Tìm kiếm theo tên, thể loại, đạo diễn..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-white/5 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.MaPhim} movie={movie} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <MovieModal
        isOpen={isModalOpen} onClose={closeModal}
        editingMovie={editingMovie} formData={formData} errors={errors}
        onChange={handleChange} onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
};

export default Movies;
