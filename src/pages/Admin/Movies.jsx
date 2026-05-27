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

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';

const STATUS_LABELS = { All: 'Tất cả', Showing: 'Đang chiếu', 'Coming Soon': 'Sắp ra mắt', Ended: 'Ngừng chiếu' };

const initialFormState = {
  TenPhim: '', ThoiLuong: '', TheLoai: '', NgayKhoiChieu: '', NgayKetThuc: '',
  DaoDien: '', DienVien: '', GioiHanTuoi: 'P', NoiDung: '', Trailer: '', HinhAnh: '', KhaDung: 1,
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Age limits parsed dynamically
  const ageLimits = useMemo(() => {
    const limits = new Set(movies.map(m => m.GioiHanTuoi).filter(Boolean));
    return ['All', ...Array.from(limits)];
  }, [movies]);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = useClientPagination(
    movies,
    ['TenPhim', 'TheLoai', 'DaoDien', 'DienVien'],
    (m, f) => {
      const matchStatus = !f.status || f.status === 'All' || getMovieStatus(m) === f.status;
      const matchAge = !f.ageLimit || f.ageLimit === 'All' || m.GioiHanTuoi === f.ageLimit;
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || m.KhaDung === Number(f.activeStatus);
      return matchStatus && matchAge && matchKhaDung;
    }
  );

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
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} /> Thêm phim mới
          </button>
        }
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm kiếm theo tên, thể loại, đạo diễn, diễn viên..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <>
            {/* Status tab selectors */}
            <div className="flex bg-[#131A2A]/40 p-1 rounded-xl border border-white/[0.06] shadow-md mr-2">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <button 
                  key={key} 
                  type="button"
                  onClick={() => setFilterVal('status', key)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    (filters.status || 'All') === key 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-md' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Age Limit filter */}
            <select
              value={filters.ageLimit || 'All'}
              onChange={e => setFilterVal('ageLimit', e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
            >
              <option value="All">Tất cả độ tuổi</option>
              {ageLimits.filter(l => l !== 'All').map(limit => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
            </select>

            {/* Active Status filter */}
            <select
              value={filters.activeStatus || 'All'}
              onChange={e => setFilterVal('activeStatus', e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value={1}>Khả dụng</option>
              <option value={0}>Không khả dụng</option>
            </select>
          </>
        }
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video bg-white/5 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
          Không tìm thấy dữ liệu phù hợp
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map(movie => (
              <MovieCard key={movie.MaPhim} movie={movie} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
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
