import Modal from '../Common/Modal';

const getSeatColor = (status, khaDung, isVIP) => {
  if (khaDung === 0) return 'bg-slate-800 border-slate-900 text-slate-600 cursor-not-allowed';
  if (status === 1) return 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  if (status === 2) return 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]';
  if (isVIP) return 'bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30 shadow-[inset_0_0_8px_rgba(168,85,247,0.15)]';
  return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30';
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
    <div className="flex flex-col items-center py-6 bg-black/40 rounded-3xl border border-white/5 overflow-x-auto">
      <div className="w-full max-w-xl h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full mb-12 relative shrink-0">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.6em] text-slate-500">MÀN HÌNH</div>
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
                    className={`w-8 h-8 rounded border text-[9px] font-black flex items-center justify-center transition-all ${getSeatColor(seat.TrangThai, seat.KhaDung, isVIP)}`}
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
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] uppercase font-black tracking-wider text-slate-400 border-t border-white/5 pt-6 w-full px-6">
        {[
          { color: 'bg-emerald-500/20 border-emerald-500/30', label: 'Trống' },
          { color: 'bg-purple-600/20 border-purple-500/30', label: 'Ghế VIP' },
          { color: 'bg-amber-500 border-amber-400', label: 'Đang giữ' },
          { color: 'bg-red-500 border-red-400', label: 'Đã bán' },
          { color: 'bg-slate-800 border-slate-900', label: 'Bị khóa' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color} border`} />
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
