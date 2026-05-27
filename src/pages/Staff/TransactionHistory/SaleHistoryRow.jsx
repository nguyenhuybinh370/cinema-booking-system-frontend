/**
 * SaleHistoryRow — one row in the "bán vé" table.
 * Pure presentational. All data via props.
 */
const SaleHistoryRow = ({ log }) => (
  <tr className="hover:bg-white/[0.02] transition-colors group">
    <td className="p-5 font-mono font-bold text-xs text-white group-hover:text-[#FFB000] transition-colors select-all">
      {log.MaPhieuDat}
    </td>
    <td className="p-5 text-xs text-slate-300">
      <span className="font-bold text-white">
        {log.NgayTao ? new Date(log.NgayTao).toLocaleTimeString("vi-VN") : ""}
      </span>
      <br />
      <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
        {log.NgayTao ? new Date(log.NgayTao).toLocaleDateString("vi-VN") : ""}
      </span>
    </td>
    <td className="p-5 font-bold text-xs max-w-xs truncate text-white" title={log.Phim?.TenPhim}>
      {log.Phim?.TenPhim || "N/A"}
    </td>
    <td className="p-5 text-xs font-semibold text-slate-300">
      <span>{log.PhongChieu?.TenPhong || "N/A"}</span>
      <br />
      <span className="text-sm text-[#FFB000] font-mono font-bold">{log.Ghe || "N/A"}</span>
    </td>
    <td className="p-5 text-right font-black text-xs text-glow text-emerald-400">
      {log.TongTien ? `${log.TongTien.toLocaleString("vi-VN")}đ` : "0đ"}
    </td>
    <td className="p-5 text-center">
      <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-wider">
        {log.PhuongThuc === "CHUYEN_KHOAN" ? "Chuyển khoản" : "Tiền mặt"}
      </span>
    </td>
  </tr>
);

export default SaleHistoryRow;
