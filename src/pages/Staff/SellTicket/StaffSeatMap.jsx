import { SeatIcon, CoupleSeatIcon } from './SeatIcons';

/**
 * StaffSeatMap — renders the cinema seat grid for the POS module.
 *
 * Props:
 *  seatMapData     – { SoDoGhe: { TongCot }, Ghe: [...] } from backend
 *  selectedSeats   – array of currently selected seat objects
 *  onSeatClick     – (seat) => void
 */
const StaffSeatMap = ({ seatMapData, selectedSeats, onSeatClick }) => {
  if (!seatMapData) return null;

  const { SoDoGhe, Ghe: gheList } = seatMapData;
  const totalCols = SoDoGhe.TongCot;

  // Group seats by row letter
  const seatsByRow = {};
  gheList.forEach((seat) => {
    const rowLetter = seat.TenGhe.charAt(0);
    if (!seatsByRow[rowLetter]) seatsByRow[rowLetter] = [];
    seatsByRow[rowLetter].push(seat);
  });

  // Sort each row by column number
  Object.keys(seatsByRow).forEach((row) => {
    seatsByRow[row].sort((a, b) => {
      return parseInt(a.TenGhe.substring(1), 10) - parseInt(b.TenGhe.substring(1), 10);
    });
  });

  const sortedRowKeys = Object.keys(seatsByRow).sort();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Column numbers header */}
      <div className="flex gap-1.5 items-center justify-center mb-3 min-w-max px-4 shrink-0">
        <div className="w-8 shrink-0" />
        {Array.from({ length: totalCols }).map((_, idx) => (
          <div key={idx} className="w-9 h-6 flex items-center justify-center text-xs font-black text-[#FFB000] font-mono shrink-0">
            {idx + 1}
          </div>
        ))}
        <div className="w-8 shrink-0" />
      </div>

      {/* Seat grid rows */}
      <div className="flex flex-col gap-1.5 min-w-max px-4">
        {sortedRowKeys.map((rowLetter) => {
          const rowSeats = seatsByRow[rowLetter] || [];
          const colMap = {};
          rowSeats.forEach((seat) => {
            const colNum = parseInt(seat.TenGhe.substring(1), 10);
            colMap[colNum] = seat;
          });

          return (
            <div key={rowLetter} className="flex gap-1.5 items-center justify-center">
              <div className="w-8 text-center text-[#FFB000] font-black text-sm shrink-0 font-mono">
                {rowLetter}
              </div>

              {Array.from({ length: totalCols }).map((_, idx) => {
                const colNum = idx + 1;
                const seat = colMap[colNum];

                let isAisle = false;
                if (SoDoGhe?.CauTruc) {
                  try {
                    const struct = typeof SoDoGhe.CauTruc === 'string' ? JSON.parse(SoDoGhe.CauTruc) : SoDoGhe.CauTruc;
                    const rIndex = rowLetter.charCodeAt(0) - 65;
                    const cIndex = colNum - 1;
                    isAisle = struct?.aisles?.cols?.includes(cIndex + 1) || struct?.aisles?.rows?.includes(rIndex + 1);
                    if (!isAisle && struct?.aisles?.custom) {
                      const customRow = struct.aisles.custom.find(item => item.row === rIndex);
                      if (customRow) {
                        isAisle = customRow.cols.includes(cIndex) || customRow.cols.includes(cIndex + 1);
                      }
                    }
                  } catch (e) {}
                }

                if (!seat || isAisle) {
                  return <div key={`aisle-${rowLetter}-${colNum}`} className="w-9 h-9 shrink-0" />;
                }

                const isSold = seat.TrangThai === 'DA_DAT';
                const isHeld = seat.TrangThai === 'DANG_GIU';
                const isSelected = selectedSeats.some((s) => s.MaGheSuatChieu === seat.MaGheSuatChieu);
                const isVIP = seat.TenLoaiGhe.toUpperCase().includes('VIP');
                const isCouple =
                  seat.TenLoaiGhe.toUpperCase().includes('ĐÔI') ||
                  seat.TenLoaiGhe.toUpperCase().includes('COUPLE');

                let iconClass = 'text-[#232B3A]';
                let strokeClass = 'stroke-slate-700/40';
                let textClass = 'text-slate-400 group-hover:text-white';

                if (isVIP) {
                  iconClass = 'text-[#18112C]';
                  strokeClass = 'stroke-purple-500/70';
                  textClass = 'text-purple-400 group-hover:text-purple-200';
                }
                if (isCouple) {
                  iconClass = 'text-[#281123]';
                  strokeClass = 'stroke-pink-500/60';
                  textClass = 'text-pink-400 group-hover:text-pink-200';
                }
                if (isSelected) {
                  iconClass = 'text-[#FFB000] filter drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]';
                  strokeClass = 'stroke-[#FFB000]';
                  textClass = 'text-slate-950 font-black';
                }
                if (isSold) {
                  iconClass = 'text-[#0E131F] opacity-30';
                  strokeClass = 'stroke-slate-900/60 opacity-30';
                  textClass = 'text-slate-700 font-medium opacity-30';
                }
                if (isHeld) {
                  iconClass = 'text-[#2A160F] opacity-40';
                  strokeClass = 'stroke-orange-900/40 opacity-40';
                  textClass = 'text-orange-600/50 font-medium opacity-40';
                }

                return (
                  <button
                    key={seat.MaGheSuatChieu}
                    disabled={isSold || isHeld}
                    onClick={() => onSeatClick(seat)}
                    className={`h-9 rounded transition-all duration-200 flex items-center justify-center shrink-0 relative group select-none border-0 bg-transparent
                      ${isCouple ? 'w-[76px]' : 'w-9'}
                      ${isSold || isHeld ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${seat.GiaVeTinhToan.toLocaleString()}đ)`}
                  >
                    {isCouple ? (
                      <CoupleSeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                    ) : (
                      <SeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                    )}
                    <span className={`relative z-10 text-[9px] font-black font-mono tracking-tighter transition-colors ${textClass}`}>
                      {seat.TenGhe}
                    </span>
                  </button>
                );
              })}

              <div className="w-8 text-center text-[#FFB000] font-black text-sm shrink-0 font-mono">
                {rowLetter}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffSeatMap;
