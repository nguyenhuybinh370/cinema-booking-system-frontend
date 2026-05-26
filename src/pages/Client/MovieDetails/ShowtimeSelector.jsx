import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

/**
 * Helper: format a GioChieu ISO-string or "HH:mm:ss" to "HH:mm".
 * Kept local since it is only used here and in the container.
 */
export const formatTime = (isoString) => {
  if (!isoString) return '00:00';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * ShowtimeSelector — date strip + time-slot grid + "Đặt vé" action button.
 * Pure presentational. Receives all showtime data and callbacks via props.
 *
 * Props:
 *  realDates         – [{ id, dayName, dateNum }]
 *  selectedDateId    – currently selected date string
 *  onSelectDate      – (dateId) => void
 *  availableSlots    – showtime slots for the selected date
 *  selectedSlotIndex – index of the currently selected slot
 *  onSelectSlot      – (index) => void
 *  hasShowtimes      – boolean: any showtimes exist at all
 *  onBook            – () => void  (triggers booking flow)
 */
const ShowtimeSelector = ({
  realDates,
  selectedDateId,
  onSelectDate,
  availableSlots,
  selectedSlotIndex,
  onSelectSlot,
  hasShowtimes,
  onBook,
}) => {
  return (
    <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-8 shadow-2xl text-left">

      {/* ── Date strip ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 w-full">
        <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Chọn Ngày Chiếu</p>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
            {realDates.map((d) => {
              const isSelected = d.id === selectedDateId;
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDate(d.id)}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#ff436e] border-[#ff436e] text-white font-bold shadow-[0_0_15px_rgba(255,67,110,0.4)] scale-105'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-70">{d.dayName}</span>
                  <span className="text-lg font-bold">{d.dateNum}</span>
                </button>
              );
            })}
            {realDates.length === 0 && (
              <p className="text-gray-500 italic text-sm py-2">
                Hiện tại không có suất chiếu nào khả dụng cho phim này.
              </p>
            )}
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* ── Time-slot grid ───────────────────────────────── */}
      {realDates.length > 0 && (
        <div className="flex flex-col gap-4 w-full border-t border-white/5 pt-6">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
            Chọn Suất Chiếu &amp; Phòng Chiếu
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableSlots.map((slot, index) => {
              const isSelected = index === selectedSlotIndex;
              return (
                <button
                  key={slot.showId || index}
                  onClick={() => onSelectSlot(index)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-linear-to-r from-[#ff436e] to-[#e0325a] border-[#ff436e] text-white shadow-[0_0_20px_rgba(255,67,110,0.4)] scale-105'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <span className="text-lg font-black tracking-wider">{formatTime(slot.time)}</span>
                  <span className="text-[10px] uppercase opacity-80 mt-1 font-bold">
                    {slot.PhongChieu?.TenPhong || 'Phòng chiếu'}
                  </span>
                  <span className="text-xs font-semibold text-green-400 mt-0.5">
                    {formatVND(slot.GiaVeGoc)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {realDates.length === 0 && (
        <div className="w-full text-center py-4">
          <p className="text-gray-400 italic text-sm">Hiện chưa có suất chiếu cho phim này.</p>
        </div>
      )}

      {realDates.length > 0 && (
        <p className="text-xs text-gray-500 italic mt-1">
          * Giá vé gốc hiển thị trên suất chiếu. Giá ghế cuối cùng đã bao gồm phụ thu loại ghế, phòng chiếu và ngày chiếu.
        </p>
      )}

      {/* ── Book button ─────────────────────────────────── */}
      <div className="w-full flex justify-end border-t border-white/5 pt-6">
        <button
          disabled={!hasShowtimes}
          onClick={onBook}
          className={`w-full md:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-12 py-4 rounded-2xl transition-all text-base tracking-wider active:scale-98 whitespace-nowrap cursor-pointer ${
            !hasShowtimes ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_30px_rgba(255,67,110,0.4)]'
          }`}
        >
          {hasShowtimes ? 'ĐẶT VÉ NGAY' : 'CHƯA CÓ SUẤT CHIẾU'}
        </button>
      </div>
    </div>
  );
};

export default ShowtimeSelector;
