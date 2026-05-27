import { SeatIcon, CoupleSeatIcon } from './SeatIcons';

/**
 * SeatLegend — static legend row displayed above the staff seat map.
 * Pure presentational.
 */
const SeatLegend = () => (
  <div className="flex flex-wrap items-center justify-center gap-8 mb-8 shrink-0 select-none">
    <div className="flex items-center gap-2">
      <SeatIcon className="w-6 h-6 text-[#232B3A]" strokeClassName="stroke-slate-700/40" />
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">CÒN TRỐNG</span>
    </div>
    <div className="flex items-center gap-2">
      <SeatIcon className="w-6 h-6 text-[#FFB000] filter drop-shadow-[0_0_8px_rgba(255,176,0,0.4)]" strokeClassName="stroke-[#FFB000]" />
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐANG CHỌN</span>
    </div>
    <div className="flex items-center gap-2 opacity-40">
      <SeatIcon className="w-6 h-6 text-[#0E131F]" strokeClassName="stroke-slate-900/60" />
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐÃ BÁN</span>
    </div>
    <div className="flex items-center gap-2">
      <SeatIcon className="w-6 h-6 text-[#18112C]" strokeClassName="stroke-purple-500/70" />
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GHẾ VIP</span>
    </div>
  </div>
);

export default SeatLegend;
