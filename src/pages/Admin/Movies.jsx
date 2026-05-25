import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Search, Plus, Edit2, Trash2, AlertCircle, Play, Film, Calendar, User, Users, Clock } from 'lucide-react';
import StatusBadge from '../../components/Admin/Common/StatusBadge';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const initialFormState = {
    TenPhim: '',
    ThoiLuong: '',
    TheLoai: '',
    NgayKhoiChieu: '',
    NgayKetThuc: '',
    DaoDien: '',
    DienVien: '',
    GioiHanTuoi: 'P',
    NoiDung: '',
    Trailer: '',
    HinhAnh: '',
    KhaDung: 1
  };

  const loadMovies = async () => {
    const data = await adminService.getMovies();
    setMovies(data);
    setLoading(false);
  };

  const {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    resetForm
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    // Process form data values
    const processedData = {
      ...data,
      ThoiLuong: parseInt(data.ThoiLuong, 10),
      KhaDung: parseInt(data.KhaDung, 10),
      NgayKetThuc: data.NgayKetThuc && data.NgayKetThuc.trim() !== '' ? data.NgayKetThuc : null,
      DaoDien: data.DaoDien && data.DaoDien.trim() !== '' ? data.DaoDien : null,
      DienVien: data.DienVien && data.DienVien.trim() !== '' ? data.DienVien : null,
      HinhAnh: data.HinhAnh && data.HinhAnh.trim() !== '' ? data.HinhAnh : null,
      NoiDung: data.NoiDung && data.NoiDung.trim() !== '' ? data.NoiDung : null
    };

    if (editingMovie) {
      await adminService.updateMovie(editingMovie.MaPhim, processedData);
      alert("Cập nhật thông tin phim thành công!");
    } else {
      const newMovie = {
        MaPhim: `M${String(movies.length + 1).padStart(2, '0')}`,
        ...processedData
      };
      await adminService.addMovie(newMovie);
      alert("Thêm phim mới thành công!");
    }
    await loadMovies();
    setIsModalOpen(false);
    setEditingMovie(null);
    resetForm();
  });

  useEffect(() => {
    let ignore = false;
    const fetchMovies = async () => {
      const data = await adminService.getMovies();
      if (!ignore) {
        setMovies(data);
        setLoading(false);
      }
    };
    fetchMovies();
    return () => { ignore = true; };
  }, []);

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      TenPhim: movie.TenPhim || '',
      ThoiLuong: movie.ThoiLuong || '',
      TheLoai: movie.TheLoai || '',
      NgayKhoiChieu: movie.NgayKhoiChieu || '',
      NgayKetThuc: movie.NgayKetThuc || '',
      DaoDien: movie.DaoDien || '',
      DienVien: movie.DienVien || '',
      GioiHanTuoi: movie.GioiHanTuoi || 'P',
      NoiDung: movie.NoiDung || '',
      Trailer: movie.Trailer || '',
      HinhAnh: movie.HinhAnh || '',
      KhaDung: movie.KhaDung !== undefined ? movie.KhaDung : 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phim ${id} khỏi cơ sở dữ liệu?`)) {
      try {
        const success = await adminService.deleteMovie(id);
        if (success) {
          alert("Xóa phim khỏi cơ sở dữ liệu thành công!");
          await loadMovies();
        }
      } catch (err) {
        alert(`Lỗi khi xóa: ${err.message}`);
      }
    }
  };

  const getMovieStatus = (movie) => {
    if (movie.KhaDung === 0) return 'Ended'; // Ngừng chiếu
    const today = new Date().toISOString().split('T')[0];
    if (today < movie.NgayKhoiChieu) return 'Coming Soon'; // Sắp ra mắt
    if (movie.NgayKetThuc && today > movie.NgayKetThuc) return 'Ended'; // Ngừng chiếu
    return 'Showing'; // Đang chiếu
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Showing': return 'Đang chiếu';
      case 'Coming Soon': return 'Sắp ra mắt';
      case 'Ended': return 'Ngừng chiếu';
      default: return 'Không xác định';
    }
  };

  const filteredMovies = movies.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.TenPhim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.DaoDien && m.DaoDien.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.TheLoai.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (filter === 'All') return true;
    return getMovieStatus(m) === filter;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý phim</h1>
          <p className="text-slate-500 font-medium">Quản lý toàn bộ thông tin hiển thị và vòng đời của tác phẩm điện ảnh.</p>
        </div>
        <button 
          onClick={() => {
            setEditingMovie(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer"
        >
          <Plus size={20} />
          Thêm phim mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/5 p-2 rounded-2xl border border-white/5">
        {['All', 'Showing', 'Coming Soon', 'Ended'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              filter === status ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {status === 'All' ? 'Tất cả' : getStatusLabel(status)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2 border border-white/5 min-w-[280px]">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, thể loại, đạo diễn..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-video bg-white/5 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map((movie) => {
            const status = getMovieStatus(movie);
            return (
              <div key={movie.MaPhim} className="group bg-[#0f1117] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video">
                    {movie.HinhAnh ? (
                      <img src={movie.HinhAnh} alt={movie.TenPhim} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                        <Film size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                        status === 'Showing' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        status === 'Coming Soon' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleEdit(movie)}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-blue-400 hover:text-white hover:bg-blue-500 transition-all cursor-pointer"
                        title="Sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(movie.MaPhim)}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 border border-red-500/20 rounded text-red-400 uppercase tracking-widest">{movie.GioiHanTuoi}</span>
                        <span className="text-slate-600 text-xs font-bold">•</span>
                        <span className="text-slate-400 text-xs font-mono font-bold flex items-center gap-1">
                          <Clock size={12} /> {movie.ThoiLuong} phút
                        </span>
                        <span className="text-slate-600 text-xs font-bold">•</span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{movie.MaPhim}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{movie.TenPhim}</h3>
                      <p className="text-slate-500 text-sm line-clamp-1">{movie.TheLoai}</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                      {movie.DaoDien && (
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <User size={12} className="text-slate-600" />
                          <span className="text-slate-500">Đạo diễn:</span>
                          <span className="font-bold text-slate-300">{movie.DaoDien}</span>
                        </div>
                      )}
                      {movie.DienVien && (
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <Users size={12} className="text-slate-600" />
                          <span className="text-slate-500">Diễn viên:</span>
                          <span className="font-medium text-slate-400">{movie.DienVien}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-slate-600 font-bold tracking-widest">Khởi chiếu</span>
                    <span className="text-xs font-mono font-bold text-slate-300">{movie.NgayKhoiChieu}</span>
                  </div>
                  <div className="flex gap-2">
                    {movie.Trailer && (
                      <a 
                        href={movie.Trailer} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 hover:bg-red-500/10 text-red-500 hover:text-red-400 rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
                        title="Xem Trailer"
                      >
                        <Play size={14} fill="currentColor" /> Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingMovie(null);
        }}
        title={editingMovie ? "Cập nhật phim" : "Thêm phim mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 no-scrollbar">
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Media URL, Active status */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ảnh Poster (HinhAnh)</label>
                <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group">
                  {formData.HinhAnh ? (
                    <img src={formData.HinhAnh} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                      <Film size={32} />
                      <span className="text-xs font-bold">Chưa có ảnh poster</span>
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  name="HinhAnh"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-xs text-white"
                  value={formData.HinhAnh}
                  onChange={handleChange}
                  placeholder="Nhập link URL hình ảnh poster..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Khả dụng (KhaDung)</label>
                <select 
                  name="KhaDung"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300"
                  value={formData.KhaDung}
                  onChange={handleChange}
                >
                  <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
                  <option value={0} className="bg-[#0f1117]">0 (Chưa khả dụng)</option>
                </select>
              </div>
            </div>

            {/* Right Column: Info fields */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phim (TenPhim)</label>
                  <input 
                    type="text" required
                    name="TenPhim"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm font-bold text-white"
                    value={formData.TenPhim}
                    onChange={handleChange}
                    placeholder="VD: Lật Mặt 7: Một Điều Ước"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời lượng (ThoiLuong - phút)</label>
                  <input 
                    type="number" required min="1"
                    name="ThoiLuong"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.ThoiLuong}
                    onChange={handleChange}
                    placeholder="VD: 120"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thể loại (TheLoai)</label>
                  <input 
                    type="text" required
                    name="TheLoai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.TheLoai}
                    onChange={handleChange}
                    placeholder="VD: Hành động, Tâm lý"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giới hạn độ tuổi (GioiHanTuoi)</label>
                  <select 
                    name="GioiHanTuoi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300"
                    value={formData.GioiHanTuoi}
                    onChange={handleChange}
                  >
                    <option value="P" className="bg-[#0f1117]">P - Mọi lứa tuổi</option>
                    <option value="C13" className="bg-[#0f1117]">C13 - Trên 13 tuổi</option>
                    <option value="C16" className="bg-[#0f1117]">C16 - Trên 16 tuổi</option>
                    <option value="C18" className="bg-[#0f1117]">C18 - Trên 18 tuổi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trailer bộ phim (Trailer)</label>
                  <input 
                    type="text" required
                    name="Trailer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.Trailer}
                    onChange={handleChange}
                    placeholder="VD: https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày khởi chiếu (NgayKhoiChieu)</label>
                  <input 
                    type="date" required
                    name="NgayKhoiChieu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.NgayKhoiChieu}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày kết thúc chiếu (NgayKetThuc)</label>
                  <input 
                    type="date"
                    name="NgayKetThuc"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.NgayKetThuc}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đạo diễn (DaoDien)</label>
                  <input 
                    type="text"
                    name="DaoDien"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.DaoDien}
                    onChange={handleChange}
                    placeholder="VD: Lý Hải"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Diễn viên (DienVien)</label>
                  <input 
                    type="text"
                    name="DienVien"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white"
                    value={formData.DienVien}
                    onChange={handleChange}
                    placeholder="VD: Trương Minh Cường, Đinh Y Nhung"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả nội dung (NoiDung)</label>
                <textarea 
                  name="NoiDung"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm min-h-[100px] resize-none text-white"
                  value={formData.NoiDung}
                  onChange={handleChange}
                  placeholder="Nhập tóm tắt cốt truyện hoặc mô tả chi tiết của phim..."
                ></textarea>
              </div>
            </div>
          </div>

          {editingMovie && (
            <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
              <div>Ngày tạo: {editingMovie.NgayTao || '--:--'}</div>
              <div>Ngày cập nhật: {editingMovie.NgayCapNhat || 'Chưa cập nhật'}</div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingMovie(null);
              }}
              className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all uppercase tracking-widest text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs cursor-pointer"
            >
              {editingMovie ? "Cập nhật" : "Lưu phim"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Movies;
