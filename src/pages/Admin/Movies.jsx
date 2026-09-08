import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminConfirmDialog from '../../components/Admin/Common/AdminConfirmDialog';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import { AdminErrorState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import AdminTable from '../../components/Admin/Common/AdminTable';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { showError, showSuccess } from '../../utils/toastHelper';

const getMovieStatus = (movie) => {
  if (movie.KhaDung === 0) return 'Đang ẩn';
  const today = new Date().toISOString().slice(0, 10);
  if (movie.NgayKhoiChieu > today) return 'Sắp chiếu';
  if (movie.NgayKetThuc && movie.NgayKetThuc < today) return 'Ngừng chiếu';
  return 'Đang chiếu';
};

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadMovies = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setMovies(await adminService.getMovies());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    adminService.getMovies()
      .then((result) => { if (!ignore) setMovies(result); })
      .catch(() => { if (!ignore) setLoadError(true); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const filteredMovies = useMemo(() => movies.filter((movie) => {
    const searchable = [movie.TenPhim, movie.TheLoai, movie.DaoDien, movie.DienVien].filter(Boolean).join(' ').toLowerCase();
    return searchable.includes(searchQuery.toLowerCase()) && (statusFilter === 'Tất cả' || getMovieStatus(movie) === statusFilter);
  }), [movies, searchQuery, statusFilter]);
  const paginatedMovies = filteredMovies.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async () => {
    try {
      await adminService.deleteMovie(pendingDelete.MaPhim);
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.MaPhim !== pendingDelete.MaPhim));
      showSuccess(`Đã xóa phim “${pendingDelete.TenPhim}”.`);
    } catch (error) {
      showError(error.message || 'Không thể xóa phim.');
    } finally {
      setPendingDelete(null);
    }
  };

  const columns = [
    { header: 'Phim', render: (movie) => <div className="admin-movie-cell"><div className="admin-poster-thumb">{movie.HinhAnh ? <img src={movie.HinhAnh} alt="" /> : <span>{movie.TenPhim?.[0]}</span>}</div><div><strong>{movie.TenPhim}</strong><small>{movie.DaoDien || 'Chưa cập nhật đạo diễn'}</small></div></div> },
    { header: 'Trạng thái', render: (movie) => <StatusBadge status={getMovieStatus(movie)} /> },
    { header: 'Thể loại', accessor: 'TheLoai' },
    { header: 'Thời lượng', render: (movie) => `${movie.ThoiLuong || 0} phút` },
    { header: 'Khởi chiếu', render: (movie) => movie.NgayKhoiChieu ? new Date(movie.NgayKhoiChieu).toLocaleDateString('vi-VN') : '—' },
    { header: 'Độ tuổi', accessor: 'GioiHanTuoi' },
    { header: 'Hành động', className: 'w-[132px] text-right', render: (movie) => <div className="flex justify-end gap-1"><button type="button" className="admin-table-action" onClick={() => navigate(`/admin/movies/${movie.MaPhim}`)} aria-label={`Chỉnh sửa ${movie.TenPhim}`}><Pencil size={16} /></button><button type="button" className="admin-table-action admin-table-action--danger" onClick={() => setPendingDelete(movie)} aria-label={`Xóa ${movie.TenPhim}`}><Trash2 size={16} /></button></div> },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader title="Phim" subtitle="Quản lý nội dung phim hiển thị trên website." action={<AdminButton icon={Plus} onClick={() => navigate('/admin/movies/new')}>Thêm phim</AdminButton>} />
      <AdminToolbar
        searchPlaceholder="Tìm theo tên phim, thể loại, đạo diễn..."
        searchValue={searchQuery}
        onSearchChange={(value) => { setSearchQuery(value); setPage(1); }}
        filterSlot={<select className="admin-input min-w-44" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>{['Tất cả', 'Đang chiếu', 'Sắp chiếu', 'Ngừng chiếu', 'Đang ẩn'].map((status) => <option key={status}>{status}</option>)}</select>}
      />
      {loading ? <AdminLoadingSkeleton rows={6} /> : loadError ? <AdminErrorState onRetry={loadMovies} /> : <AdminTable columns={columns} data={paginatedMovies} rowKey="MaPhim" />}
      {!loading && !loadError && <AdminPagination page={page} pageSize={pageSize} total={filteredMovies.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />}
      <AdminConfirmDialog isOpen={Boolean(pendingDelete)} title={pendingDelete ? `Xóa phim “${pendingDelete.TenPhim}”?` : 'Xóa phim?'} message="Phim sẽ bị gỡ khỏi danh sách quản trị. Các suất chiếu liên quan cần được kiểm tra riêng." confirmText="Xóa phim" onConfirm={handleDelete} onCancel={() => setPendingDelete(null)} />
    </AdminLayout>
  );
};

export default Movies;
