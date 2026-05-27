import { useState, useEffect } from "react";
import { Search, Download, ArrowLeft, Receipt } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { exportToCSV } from "../../utils/exportHelper";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  const [activeTab, setActiveTab] = useState(location.state?.defaultTab || "ban-ve"); // "ban-ve" or "soat-ve"
  
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");

      const params = {
        page: page.toString(),
        limit: "10",
      };

      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }
      if (tuNgay) {
        params.tuNgay = new Date(tuNgay).toISOString();
      }
      if (denNgay) {
        params.denNgay = new Date(denNgay).toISOString();
      }

      // Build query string manually to avoid Axios formatting differences
      const queryStr = new URLSearchParams(params).toString();
      const endpoint = activeTab === "soat-ve" ? "/staff/soat-ve/lich-su" : "/staff/ban-ve/lich-su";
      const res = await axiosClient.get(`${endpoint}?${queryStr}`);
      
      setLogs(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(`Error loading history logs for ${activeTab}:`, err);
      setError(
        activeTab === "soat-ve"
          ? "Không thể tải danh sách lịch sử soát vé."
          : "Không thể tải danh sách lịch sử bán vé."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logs when search criteria or tab changes
  useEffect(() => {
    fetchLogs(1);
  }, [activeTab, searchTerm, tuNgay, denNgay]);

  const handleExport = () => {
    const isSoatVe = activeTab === "soat-ve";
    const prefix = isSoatVe ? "LichSuSoatVe" : "LichSuBanVe";
    const filename = `${prefix}_${new Date().toISOString().split("T")[0]}.csv`;
    
    // Map items for CSV format
    const exportData = logs.map((log) => {
      if (isSoatVe) {
        return {
          "Mã Chi Tiết Vé": log.MaChiTietDat,
          "Thời Gian Soát": log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleString("vi-VN") : "",
          "Tên Phim": log.TicketInfo.TenPhim,
          "Phòng Chiếu": log.TicketInfo.TenPhong,
          "Ghế": log.TicketInfo.Ghe,
          "Giá Vé": log.TicketInfo.GiaVe,
          "Nhân Viên Soát": log.NhanVienCheckIn ? log.NhanVienCheckIn.HoTen : "N/A",
        };
      } else {
        return {
          "Mã Hóa Đơn": log.MaPhieuDat,
          "Thời Gian Bán": log.NgayTao ? new Date(log.NgayTao).toLocaleString("vi-VN") : "",
          "Tên Phim": log.Phim ? log.Phim.TenPhim : "N/A",
          "Phòng Chiếu": log.PhongChieu ? log.PhongChieu.TenPhong : "N/A",
          "Ghế": log.Ghe || "N/A",
          "Tổng Tiền": log.TongTien,
          "Phương Thức": log.PhuongThuc === "CHUYEN_KHOAN" ? "Chuyển khoản" : "Tiền mặt",
        };
      }
    });

    exportToCSV(exportData, filename);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 py-2">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <button
            onClick={() => navigate("/staff/dashboard")}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Quay lại Tổng quan
          </button>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[#FFB000] flex items-center gap-4">
            <Receipt size={28} />
            Lịch Sử Giao Dịch
          </h1>
          <p className="text-slate-400 mt-2 text-xs">
            {activeTab === "soat-ve"
              ? "Tra cứu thông tin vé đã check-in vào rạp của nhân viên"
              : "Tra cứu thông tin hóa đơn vé đã bán tại quầy của nhân viên"}
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={logs.length === 0}
          className="bg-[#131A2A] border border-white/[0.08] hover:bg-[#FFB000]/10 hover:text-[#FFB000] hover:border-[#FFB000]/20 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
        >
          <Download size={14} />
          Xuất Báo Cáo (CSV)
        </button>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-white/5 shrink-0 gap-6">
        <button
          onClick={() => {
            setActiveTab("ban-ve");
            setLogs([]);
            setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 });
          }}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative cursor-pointer ${
            activeTab === "ban-ve" ? "text-[#FFB000]" : "text-slate-400 hover:text-white"
          }`}
        >
          Lịch sử bán vé
          {activeTab === "ban-ve" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFB000] shadow-[0_0_8px_#FFB000]"></div>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("soat-ve");
            setLogs([]);
            setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 });
          }}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative cursor-pointer ${
            activeTab === "soat-ve" ? "text-[#FFB000]" : "text-slate-400 hover:text-white"
          }`}
        >
          Lịch sử soát vé
          {activeTab === "soat-ve" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFB000] shadow-[0_0_8px_#FFB000]"></div>
          )}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#131A2A]/80 border border-white/[0.06] shadow-xl rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shrink-0">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder={
              activeTab === "soat-ve"
                ? "Tìm theo Mã vé (UUID), tên phim, tên ghế..."
                : "Tìm theo Mã hóa đơn (UUID), tên phim..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000]/20 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all text-xs"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-44">
            <input
              type="date"
              value={tuNgay}
              onChange={(e) => setTuNgay(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 focus:border-[#FFB000] rounded-xl py-2.5 px-3 text-xs text-white/70 focus:outline-none"
              placeholder="Từ ngày"
              title="Từ ngày"
            />
          </div>
          <span className="text-slate-500 text-xs">đến</span>
          <div className="relative w-full md:w-44">
            <input
              type="date"
              value={denNgay}
              onChange={(e) => setDenNgay(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 focus:border-[#FFB000] rounded-xl py-2.5 px-3 text-xs text-white/70 focus:outline-none"
              placeholder="Đến ngày"
              title="Đến ngày"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center shrink-0">
          ⚠️ {error}
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-[#131A2A]/80 border border-white/[0.06] shadow-xl rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[300px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-[10px] uppercase tracking-widest text-slate-400 border-b border-white/5">
                {activeTab === "soat-ve" ? (
                  <>
                    <th className="p-5 font-black">Mã Chi Tiết Vé</th>
                    <th className="p-5 font-black">Thời Gian Soát</th>
                    <th className="p-5 font-black">Phim</th>
                    <th className="p-5 font-black">Phòng / Ghế</th>
                    <th className="p-5 font-black">Nhân Viên Soát</th>
                    <th className="p-5 font-black text-center">Trạng Thái</th>
                  </>
                ) : (
                  <>
                    <th className="p-5 font-black">Mã Hóa Đơn</th>
                    <th className="p-5 font-black">Thời Gian Bán</th>
                    <th className="p-5 font-black">Phim</th>
                    <th className="p-5 font-black">Phòng / Ghế</th>
                    <th className="p-5 font-black text-right">Tổng Tiền</th>
                    <th className="p-5 font-black text-center">Thanh Toán</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500 font-bold uppercase tracking-wider text-xs">
                    Đang tải danh sách lịch sử...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500 text-xs">
                    {activeTab === "soat-ve"
                      ? "Không tìm thấy dữ liệu soát vé nào."
                      : "Không tìm thấy dữ liệu hóa đơn bán vé nào."}
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  if (activeTab === "soat-ve") {
                    return (
                      <tr
                        key={log.MaChiTietDat}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
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
                  } else {
                    return (
                      <tr
                        key={log.MaPhieuDat}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
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
                  }
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {pagination.totalPages > 1 && (
          <div className="bg-slate-950/20 border-t border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              Hiển thị {logs.length} / {pagination.total} bản ghi
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer text-slate-300"
              >
                Trước
              </button>
              <span className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#FFB000] bg-[#FFB000]/10 rounded-lg border border-[#FFB000]/20">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer text-slate-300"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
