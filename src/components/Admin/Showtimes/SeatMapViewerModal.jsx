import Modal from '../Common/Modal';

const getSeatColor = (status, khaDung, isVIP) => {
  if (khaDung === 0) return 'admin-showtime-seat--locked';
  if (status === 1) return 'admin-showtime-seat--sold';
  if (status === 2) return 'admin-showtime-seat--held';
  if (isVIP) return 'admin-showtime-seat--vip';
  return 'admin-showtime-seat--empty';
};

const SeatsGrid = ({ seats }) => {
  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-black/40 rounded-3xl border border-white/5 w-full text-slate-500 text-sm font-semibold select-none">
        Không có sơ đồ ghế cho suất chiếu này
      </div>
    );
  }

  const rowsMap = {};
  seats.forEach(seat => {
    if (!seat || !seat.MaGhe) return;
    const parts = seat.MaGhe.split('-');
    const coord = parts[parts.length - 1] || 'A1';
    
    const rowMatch = coord.match(/[A-Za-z]+/);
    const colMatch = coord.match(/\d+/);
    
    const row = rowMatch ? rowMatch[0].toUpperCase() : 'Unknown';
    const col = colMatch ? parseInt(colMatch[0], 10) : 1;
    
    if (!rowsMap[row]) rowsMap[row] = [];
    rowsMap[row].push({ ...seat, col, label: coord });
  });

  const rowKeys = Object.keys(rowsMap);
  if (rowKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-black/40 rounded-3xl border border-white/5 w-full text-slate-500 text-sm font-semibold select-none">
        Không có sơ đồ ghế cho suất chiếu này
      </div>
    );
  }

  rowKeys.forEach(r => rowsMap[r].sort((a, b) => a.col - b.col));

  return (
    <div className="admin-showtime-seat-map">
      <div className="admin-showtime-screen">
        <span>Màn hình</span>
      </div>
      <div className="space-y-2 px-6">
        {rowKeys.sort().map(rowName => (
          <div key={rowName} className="flex gap-2 items-center justify-center">
            <span className="w-6 text-xs font-black text-slate-600 font-mono text-center">{rowName}</span>
            <div className="flex gap-2">
              {rowsMap[rowName].map(seat => {
                const isVIP = seat.TenLoaiGhe?.toUpperCase().includes('VIP');
                return (
                  <div
                    key={seat.MaGheSuatChieu}
                    title={`Ghế: ${seat.label} | Loại: ${seat.TenLoaiGhe || 'Thường'} | ${seat.TrangThai === 0 ? 'Trống' : seat.TrangThai === 1 ? 'Đã đặt' : 'Đang giữ'}`}
                    className={`admin-showtime-seat ${getSeatColor(seat.TrangThai, seat.KhaDung, isVIP)}`}
                  >
                    {seat.label}
                  </div>
                );
              })}
            </div>
            <span className="w-6 text-xs font-black text-slate-600 font-mono text-center">{rowName}</span>
          </div>
        ))}
      </div>
      <div className="admin-showtime-seat-legend">
        {[
          { color: 'admin-showtime-seat--empty', label: 'Trống' },
          { color: 'admin-showtime-seat--vip', label: 'Ghế VIP' },
          { color: 'admin-showtime-seat--held', label: 'Đang giữ' },
          { color: 'admin-showtime-seat--sold', label: 'Đã bán' },
          { color: 'admin-showtime-seat--locked', label: 'Bị khóa' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`admin-showtime-seat-swatch ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeatMapViewerModal = ({ selectedShowtimeSeats, onClose }) => (
  <Modal
    isOpen={selectedShowtimeSeats !== null}
    onClose={onClose}
    title={`Sơ đồ ghế: Suất ${selectedShowtimeSeats?.showtime.MaSuatChieu}`}
  >
    {selectedShowtimeSeats && (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-xs font-bold bg-white/5 border border-white/5 p-4 rounded-2xl">
          {[
            { label: 'Phim', value: selectedShowtimeSeats.showtime.TenPhim },
            { label: 'Phòng chiếu', value: selectedShowtimeSeats.showtime.TenPhong },
            { label: 'Ngày chiếu', value: selectedShowtimeSeats.showtime.NgayChieu },
            {
              label: 'Giờ chiếu',
              value: `${selectedShowtimeSeats.showtime.GioChieu.substring(0, 5)} - ${selectedShowtimeSeats.showtime.GioKetThuc.substring(0, 5)}`
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-slate-500 block uppercase text-[10px] tracking-widest">{label}</span>
              <span className="text-white text-sm font-mono">{value}</span>
            </div>
          ))}
        </div>

        <SeatsGrid seats={selectedShowtimeSeats.seats} />

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest text-white border border-white/5 cursor-pointer"
        >
          Đóng sơ đồ
        </button>
      </div>
    )}
  </Modal>
);

export default SeatMapViewerModal;
