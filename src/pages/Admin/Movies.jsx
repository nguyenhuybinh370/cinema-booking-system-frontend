import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import MovieCard, { getMovieStatus } from '../../components/Admin/Movies/MovieCard';
import MovieModal from '../../components/Admin/Movies/MovieModal';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { Search, Plus } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

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
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

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
      if (editingMovie) { await adminService.updateMovie(editingMovie.MaPhim, processed); showSuccess('Cập nhật phim thành công!'); }
      else { await adminService.addMovie(processed); showSuccess('Thêm phim mới thành công!'); }
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

  const handleDelete = (id) => {
    setConfirmState({ isOpen: true, data: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.data;
    setIsDeleting(true);
    try {
      await adminService.deleteMovie(id);
      showSuccess('Xóa phim thành công!');
      await loadMovies();
    } catch (err) {
      showError(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
    }
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
      <AdminPageHeader
        title="Quản lý phim"
        subtitle="Quản lý toàn bộ thông tin hiển thị và vòng đời của tác phẩm điện ảnh."
        action={
          <button 
            onClick={openAddModal} 
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} /> Thêm phim mới
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#131A2A]/40 backdrop-blur-md p-2 rounded-2xl border border-white/[0.06] shadow-xl w-full">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                filter === key 
                  ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-md' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2.5 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all min-w-[300px]">
          <Search size={16} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, thể loại, đạo diễn..."
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-500 w-full font-bold" 
          />
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

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa phim"
        message={`Bạn có chắc chắn muốn xóa phim ${confirmState.data} khỏi cơ sở dữ liệu?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Movies;
