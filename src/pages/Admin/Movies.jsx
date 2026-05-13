import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Search, MoreVertical, Plus } from 'lucide-react';
import StatusBadge from '../../components/Admin/Common/StatusBadge';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    TenPhim: '',
    TheLoai: '',
    ThoiLuong: '',
    Status: 'Coming Soon',
    GioiHanTuoi: 'P',
    NgayKhoiChieu: '',
    NgayKetThuc: '',
    DaoDien: '',
    DienVien: '',
    NoiDung: '',
    HinhAnh: '',
    trailerUrl: '',
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
    handleChange,
    handleSubmit
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    const newMovie = {
      MaPhim: `M${String(movies.length + 1).padStart(2, '0')}`,
      ...data,
      ThoiLuong: parseInt(data.ThoiLuong)
    };
    await adminService.addMovie(newMovie);
    await loadMovies();
    setIsModalOpen(false);
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

  const filteredMovies = filter === 'All' 
    ? movies 
    : movies.filter(m => m.Status === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý phim</h1>
          <p className="text-slate-500">Quản lý toàn bộ thông tin và vòng đời của phim.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
        >
          <Plus size={20} />
          Thêm phim mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/5 p-2 rounded-2xl border border-white/5">
        {['All', 'Showing', 'Coming Soon', 'Ended'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === status ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {status === 'All' ? 'Tất cả' : status === 'Showing' ? 'Đang chiếu' : status === 'Coming Soon' ? 'Sắp ra mắt' : 'Ngừng chiếu'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2 border border-white/5">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm phim..." 
            className="bg-transparent border-none focus:outline-none text-sm text-white w-48"
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
          {filteredMovies.map((movie) => (
            <div key={movie.MaPhim} className="group bg-[#0f1117] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2 shadow-2xl">
              <div className="relative aspect-video">
                <img src={movie.HinhAnh} alt={movie.TenPhim} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <StatusBadge status={movie.Status} />
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 border border-slate-700 rounded text-slate-500 uppercase">{movie.GioiHanTuoi}</span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-500 text-xs font-medium">{movie.ThoiLuong} phút</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{movie.TenPhim}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-1">{movie.TheLoai}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-600 font-bold tracking-widest">Khởi chiếu</span>
                    <span className="text-sm font-bold text-slate-300">{movie.NgayKhoiChieu}</span>
                  </div>
                  <button className="text-xs font-bold text-red-500 hover:underline">Chi tiết →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Thêm phim mới"
      >
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Media Preview & Main Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Poster Preview</label>
                <div className="aspect-[2/3] w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative group">
                  {formData.HinhAnh ? (
                    <img src={formData.HinhAnh} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                      <Plus size={32} />
                      <span className="text-xs font-bold">Chưa có ảnh</span>
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  name="HinhAnh"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-xs"
                  value={formData.HinhAnh}
                  onChange={handleChange}
                  placeholder="Dán URL hình ảnh tại đây..."
                />
              </div>

              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Trạng thái vận hành</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">Khả dụng (Active)</span>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, KhaDung: formData.KhaDung === 1 ? 0 : 1 })}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.KhaDung === 1 ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.KhaDung === 1 ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Detailed Info */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phim</label>
                  <input 
                    type="text" required
                    name="TenPhim"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:border-red-500 transition-all text-lg font-bold text-white"
                    value={formData.TenPhim}
                    onChange={handleChange}
                    placeholder="VD: Avengers: Endgame"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thể loại</label>
                  <input 
                    type="text" required
                    name="TheLoai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.TheLoai}
                    onChange={handleChange}
                    placeholder="Hành động, Viễn tưởng..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái phát hành</label>
                  <select 
                    name="Status"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.Status}
                    onChange={handleChange}
                  >
                    <option value="Coming Soon" className="bg-[#0f1117]">Sắp ra mắt</option>
                    <option value="Showing" className="bg-[#0f1117]">Đang chiếu</option>
                    <option value="Ended" className="bg-[#0f1117]">Ngừng chiếu</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời lượng (Phút)</label>
                  <input 
                    type="number" required
                    name="ThoiLuong"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.ThoiLuong}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giới hạn tuổi</label>
                  <select 
                    name="GioiHanTuoi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.GioiHanTuoi}
                    onChange={handleChange}
                  >
                    <option value="P" className="bg-[#0f1117]">P - Mọi lứa tuổi</option>
                    <option value="C13" className="bg-[#0f1117]">C13 - Trên 13 tuổi</option>
                    <option value="C16" className="bg-[#0f1117]">C16 - Trên 16 tuổi</option>
                    <option value="C18" className="bg-[#0f1117]">C18 - Trên 18 tuổi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày khởi chiếu</label>
                  <input 
                    type="date" required
                    name="NgayKhoiChieu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.NgayKhoiChieu}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày kết thúc</label>
                  <input 
                    type="date"
                    name="NgayKetThuc"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.NgayKetThuc}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nội dung phim</label>
                <textarea 
                  required
                  name="NoiDung"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:border-red-500 transition-all text-sm min-h-[120px] resize-none"
                  value={formData.NoiDung}
                  onChange={handleChange}
                  placeholder="Nhập tóm tắt nội dung phim..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đạo diễn</label>
                  <input 
                    type="text"
                    name="DaoDien"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.DaoDien}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trailer URL (YouTube)</label>
                  <input 
                    type="text"
                    name="trailerUrl"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                    value={formData.trailerUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-grow py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest text-xs"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-grow py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs"
            >
              Lưu thông tin phim
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Movies;
