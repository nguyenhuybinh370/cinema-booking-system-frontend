import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import ShowtimeTable from '../../components/Admin/Showtimes/ShowtimeTable';
import ShowtimeTimeline from '../../components/Admin/Showtimes/ShowtimeTimeline';
import ShowtimeModal from '../../components/Admin/Showtimes/ShowtimeModal';
import SeatMapViewerModal from '../../components/Admin/Showtimes/SeatMapViewerModal';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { List, Calendar as CalendarIcon, Plus } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError, showWarning } from '../../utils/toastHelper';

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';

const today = new Date().toISOString().substring(0, 10);

const Showtimes = () => {
  const [viewMode, setViewMode] = useState('List');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedShowtimeSeats, setSelectedShowtimeSeats] = useState(null);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    MaPhim: '', MaPhongChieu: '', NgayChieu: today,
    GioChieu: '09:00', GioKetThuc: '', MaLoaiNgay: '', GiaVeCoBan: 85000, KhaDung: 1,
  });

  const loadData = async () => {
    try {
      const [moviesData, roomsData, dayTypesData, showtimesData] = await Promise.all([
        adminService.getMovies(), adminService.getRooms(),
        adminService.getDayTypes(), adminService.getShowtimes(),
      ]);
      setMovies(moviesData.filter(m => m.KhaDung === 1));
      setRooms(roomsData.filter(r => r.KhaDung === 1));
      setDayTypes(dayTypesData.filter(d => d.KhaDung === 1));
      setShowtimes(showtimesData);
    } catch (err) {
      console.error('Failed to load showtimes data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const calculateEndTime = (movieId, startTimeStr) => {
    const movie = movies.find(m => m.MaPhim === movieId);
    if (!movie || !startTimeStr) return '';
    const [h, m] = startTimeStr.split(':').map(Number);
    const endTotal = h * 60 + m + movie.ThoiLuong;
    return `${String(Math.floor(endTotal / 60) % 24).padStart(2, '0')}:${String(endTotal % 60).padStart(2, '0')}`;
  };

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'MaPhim' || field === 'GioChieu') {
      updated.GioKetThuc = calculateEndTime(updated.MaPhim, updated.GioChieu);
    }
    setFormData(updated);
  };

  const conflict = (() => {
    if (!isModalOpen) return null;
    const { MaPhongChieu, NgayChieu, GioChieu, GioKetThuc, KhaDung } = formData;
    if (!MaPhongChieu || !NgayChieu || !GioChieu || !GioKetThuc || parseInt(KhaDung, 10) !== 1) return null;
    const tStart = GioChieu.length === 5 ? `${GioChieu}:00` : GioChieu;
    const tEnd   = GioKetThuc.length === 5 ? `${GioKetThuc}:00` : GioKetThuc;
    const conflictShow = showtimes.find(st =>
      st.MaSuatChieu !== (editingShowtime?.MaSuatChieu || '') &&
      st.MaPhongChieu === MaPhongChieu && st.NgayChieu === NgayChieu &&
      st.KhaDung === 1 && tStart < st.GioKetThuc && tEnd > st.GioChieu
    );
    return conflictShow
      ? `Phòng đã có lịch chiếu từ ${conflictShow.GioChieu.substring(0, 5)} đến ${conflictShow.GioKetThuc.substring(0, 5)} cho phim "${conflictShow.TenPhim}".`
      : null;
  })();

  const openAddModal = () => {
    setEditingShowtime(null);
    const defaultMovieId = movies[0]?.MaPhim || '';
    setFormData({
      MaPhim: defaultMovieId, MaPhongChieu: rooms[0]?.MaPhongChieu || '',
      NgayChieu: selectedDate, GioChieu: '09:00',
      GioKetThuc: calculateEndTime(defaultMovieId, '09:00'),
      MaLoaiNgay: dayTypes[0]?.MaLoaiNgay || '', GiaVeCoBan: 85000, KhaDung: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (st) => {
    if (st.DaDat > 0) { showWarning(`Không thể sửa vì đã có ${st.DaDat} ghế được đặt!`); return; }
    setEditingShowtime(st);
    setFormData({
      MaPhim: st.MaPhim, MaPhongChieu: st.MaPhongChieu, NgayChieu: st.NgayChieu,
      GioChieu: st.GioChieu.substring(0, 5), GioKetThuc: st.GioKetThuc.substring(0, 5),
      MaLoaiNgay: st.MaLoaiNgay, GiaVeCoBan: st.GiaVeCoBan, KhaDung: st.KhaDung,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (st) => {
    if (st.DaDat > 0) { showWarning(`Không thể xóa vì đã có ${st.DaDat} ghế được đặt!`); return; }
    setConfirmState({ isOpen: true, data: st });
  };

  const handleConfirmDelete = async () => {
    const st = confirmState.data;
    setIsDeleting(true);
    try {
      await adminService.deleteShowtime(st.MaSuatChieu);
      showSuccess('Xóa suất chiếu thành công!');
      await loadData();
    } catch (err) {
      showError('Lỗi khi xóa: ' + err.message);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (conflict) return;
    setSubmitting(true);
    try {
      const payload = { ...formData, KhaDung: parseInt(formData.KhaDung, 10), GiaVeCoBan: parseFloat(formData.GiaVeCoBan) };
      if (editingShowtime) {
        await adminService.updateShowtime(editingShowtime.MaSuatChieu, payload);
        showSuccess('Cập nhật suất chiếu thành công!');
      } else {
        await adminService.addShowtime(payload);
        showSuccess('Thêm suất chiếu mới thành công!');
      }
      setIsModalOpen(false);
      setEditingShowtime(null);
      await loadData();
    } catch (err) { showError('Lỗi khi lưu: ' + err.message); }
    finally { setSubmitting(false); }
  };

  const handleViewSeatMap = async (st) => {
    try {
      const seats = await adminService.getShowtimeSeats(st.MaSuatChieu);
      setSelectedShowtimeSeats({ showtime: st, seats });
    } catch (err) { showError('Lỗi tải sơ đồ ghế: ' + err.message); }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingShowtime(null); };

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
    showtimes,
    ['TenPhim', 'TenPhong', 'MaSuatChieu'],
    (st, f) => {
      const matchMovie = !f.movieId || f.movieId === 'All' || st.MaPhim === f.movieId;
      const matchRoom = !f.roomId || f.roomId === 'All' || st.MaPhongChieu === f.roomId;
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || st.KhaDung === Number(f.activeStatus);
      const matchDate = !f.date || st.NgayChieu === f.date;
      return matchMovie && matchRoom && matchKhaDung && matchDate;
    }
  );

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4" />
        Đang tải dữ liệu suất chiếu...
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý suất chiếu"
        subtitle="Lên lịch chiếu phim, phân bổ phòng chiếu và thiết lập giá vé."
        action={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 shadow-md">
              {[{ mode: 'List', Icon: List, title: 'Danh sách' }, { mode: 'Timeline', Icon: CalendarIcon, title: 'Lịch chiếu' }].map(({ mode, Icon, title }) => (
                <button 
                  key={mode} 
                  onClick={() => setViewMode(mode)} 
                  title={title}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === mode 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold shadow-md' 
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <button 
              onClick={openAddModal}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus size={18} /> Thêm suất chiếu
            </button>
          </div>
        }
      />

      {/* Filters and search using AdminToolbar */}
      {viewMode === 'List' && (
        <AdminToolbar
          searchPlaceholder="Tìm theo tên phim, tên phòng, mã suất..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filterSlot={
            <>
              {/* Date Filter */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-[9px] focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider select-none">Ngày:</span>
                <input
                  type="date"
                  value={filters.date || ''}
                  onChange={e => setFilterVal('date', e.target.value || '')}
                  className="bg-transparent border-none text-xs font-bold text-slate-300 focus:outline-none cursor-pointer p-0 [color-scheme:dark]"
                />
                {filters.date && (
                  <button
                    type="button"
                    onClick={() => setFilterVal('date', '')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold transition-all ml-1 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Movie Filter */}
              <select
                value={filters.movieId || 'All'}
                onChange={e => setFilterVal('movieId', e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14] max-w-[200px]"
              >
                <option value="All">Tất cả phim</option>
                {movies.map(m => (
                  <option key={m.MaPhim} value={m.MaPhim}>{m.TenPhim}</option>
                ))}
              </select>

              {/* Room Filter */}
              <select
                value={filters.roomId || 'All'}
                onChange={e => setFilterVal('roomId', e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14] max-w-[150px]"
              >
                <option value="All">Tất cả phòng</option>
                {rooms.map(r => (
                  <option key={r.MaPhongChieu} value={r.MaPhongChieu}>{r.TenPhong}</option>
                ))}
              </select>

              {/* Active Status Filter */}
              <select
                value={filters.activeStatus || 'All'}
                onChange={e => setFilterVal('activeStatus', e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14] max-w-[150px]"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value={1}>Khả dụng</option>
                <option value={0}>Không khả dụng</option>
              </select>
            </>
          }
        />
      )}

      {/* View */}
      {viewMode === 'Timeline' ? (
        <ShowtimeTimeline
          selectedDate={selectedDate} rooms={rooms} showtimes={showtimes}
          onPrevDay={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().substring(0, 10)); }}
          onNextDay={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().substring(0, 10)); }}
          onClickShowtime={handleViewSeatMap}
        />
      ) : paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
          Không tìm thấy dữ liệu phù hợp
        </div>
      ) : (
        <>
          <ShowtimeTable showtimes={paginatedItems} onEdit={handleEdit} onDelete={handleDelete} onViewSeatMap={handleViewSeatMap} />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Modals */}
      <ShowtimeModal
        isOpen={isModalOpen} onClose={closeModal}
        editingShowtime={editingShowtime} formData={formData}
        conflict={conflict} submitting={submitting}
        movies={movies} rooms={rooms} dayTypes={dayTypes}
        onFormChange={handleFormChange} onSubmit={handleSave}
      />
      <SeatMapViewerModal
        selectedShowtimeSeats={selectedShowtimeSeats}
        onClose={() => setSelectedShowtimeSeats(null)}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa suất chiếu"
        message={confirmState.data ? `Bạn có chắc chắn muốn xóa suất chiếu ${confirmState.data.MaSuatChieu} của phim "${confirmState.data.TenPhim}"?` : ''}
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

export default Showtimes;
