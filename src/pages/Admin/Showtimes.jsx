import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import ShowtimeTable from '../../components/Admin/Showtimes/ShowtimeTable';
import ShowtimeTimeline from '../../components/Admin/Showtimes/ShowtimeTimeline';
import ShowtimeModal from '../../components/Admin/Showtimes/ShowtimeModal';
import SeatMapViewerModal from '../../components/Admin/Showtimes/SeatMapViewerModal';
import { List, Calendar as CalendarIcon, Plus } from 'lucide-react';

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
    if (st.DaDat > 0) { alert(`Không thể sửa vì đã có ${st.DaDat} ghế được đặt!`); return; }
    setEditingShowtime(st);
    setFormData({
      MaPhim: st.MaPhim, MaPhongChieu: st.MaPhongChieu, NgayChieu: st.NgayChieu,
      GioChieu: st.GioChieu.substring(0, 5), GioKetThuc: st.GioKetThuc.substring(0, 5),
      MaLoaiNgay: st.MaLoaiNgay, GiaVeCoBan: st.GiaVeCoBan, KhaDung: st.KhaDung,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (st) => {
    if (st.DaDat > 0) { alert(`Không thể xóa vì đã có ${st.DaDat} ghế được đặt!`); return; }
    if (!window.confirm(`Xóa suất chiếu ${st.MaSuatChieu} của phim "${st.TenPhim}"?`)) return;
    try {
      await adminService.deleteShowtime(st.MaSuatChieu);
      alert('Xóa suất chiếu thành công!');
      await loadData();
    } catch (err) { alert('Lỗi khi xóa: ' + err.message); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (conflict) return;
    setSubmitting(true);
    try {
      const payload = { ...formData, KhaDung: parseInt(formData.KhaDung, 10), GiaVeCoBan: parseFloat(formData.GiaVeCoBan) };
      if (editingShowtime) {
        await adminService.updateShowtime(editingShowtime.MaSuatChieu, payload);
        alert('Cập nhật suất chiếu thành công!');
      } else {
        await adminService.addShowtime(payload);
        alert('Thêm suất chiếu mới thành công!');
      }
      setIsModalOpen(false);
      setEditingShowtime(null);
      await loadData();
    } catch (err) { alert('Lỗi khi lưu: ' + err.message); }
    finally { setSubmitting(false); }
  };

  const handleViewSeatMap = async (st) => {
    try {
      const seats = await adminService.getShowtimeSeats(st.MaSuatChieu);
      setSelectedShowtimeSeats({ showtime: st, seats });
    } catch (err) { alert('Lỗi tải sơ đồ ghế: ' + err.message); }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingShowtime(null); };

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý suất chiếu</h1>
          <p className="text-slate-500 font-medium">Lên lịch chiếu phim, phân bổ phòng chiếu và thiết lập giá vé.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {[{ mode: 'List', Icon: List, title: 'Danh sách' }, { mode: 'Timeline', Icon: CalendarIcon, title: 'Lịch chiếu' }].map(({ mode, Icon, title }) => (
              <button key={mode} onClick={() => setViewMode(mode)} title={title}
                className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white/10 text-white font-bold' : 'text-slate-500'}`}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
          <button onClick={openAddModal}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={20} /> Thêm suất chiếu
          </button>
        </div>
      </div>

      {/* View */}
      {viewMode === 'Timeline' ? (
        <ShowtimeTimeline
          selectedDate={selectedDate} rooms={rooms} showtimes={showtimes}
          onPrevDay={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().substring(0, 10)); }}
          onNextDay={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().substring(0, 10)); }}
          onClickShowtime={handleViewSeatMap}
        />
      ) : (
        <ShowtimeTable showtimes={showtimes} onEdit={handleEdit} onDelete={handleDelete} onViewSeatMap={handleViewSeatMap} />
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
    </AdminLayout>
  );
};

export default Showtimes;
