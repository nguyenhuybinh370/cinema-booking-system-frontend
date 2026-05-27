/**
 * CheckInHistoryRow — one row in the "soát vé" table.
 * Pure presentational. All data via props.
 */
const CheckInHistoryRow = ({ log }) => (
  <tr className="hover:bg-white/[0.02] transition-colors group">
    <td className="p-5 font-mono font-bold text-xs text-white group-hover:text-[#FFB000] transition-colors select-all">
      {log.MaChiTietDat}
    </td>
    <td className="p-5 text-xs text-slate-300">
      <span className="font-bold text-white">
        {log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleTimeString("vi-VN") : ""}
      </span>
      <br />
      <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
        {log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleDateString("vi-VN") : ""}
      </span>
    </td>
    <td className="p-5 font-bold text-xs max-w-xs truncate text-white" title={log.TicketInfo?.TenPhim}>
      {log.TicketInfo?.TenPhim}
    </td>
    <td className="p-5 text-xs font-semibold text-slate-300">
      <span>{log.TicketInfo?.TenPhong}</span>
      <br />
      <span className="text-sm text-[#FFB000] font-mono font-bold">{log.TicketInfo?.Ghe}</span>
    </td>
    <td className="p-5 text-xs text-slate-300">
      <span className="font-bold text-white">
        {log.NhanVienCheckIn ? log.NhanVienCheckIn.HoTen : "N/A"}
      </span>
      <br />
      <span className="text-[10px] font-mono text-slate-500">
        {log.NhanVienCheckIn ? log.NhanVienCheckIn.MaNhanVien : ""}
      </span>
    </td>
    <td className="p-5 text-center">
      <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
        ĐÃ SOÁT VÉ
      </span>
    </td>
  </tr>
);

export default CheckInHistoryRow;
