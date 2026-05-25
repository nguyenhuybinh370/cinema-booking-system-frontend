import { useState, useEffect } from "react";
import { Search, Download, ArrowLeft, Receipt, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { exportToCSV } from "../../utils/exportHelper";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCheckInLogs = async (page = 1) => {
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
      const res = await axiosClient.get(`/staff/soat-ve/lich-su?${queryStr}`);
      
      setLogs(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Error loading check-in logs:", err);
      setError("Không thể tải danh sách lịch sử soát vé.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logs when search criteria changes or on mount
  useEffect(() => {
    fetchCheckInLogs(1);
  }, [searchTerm, tuNgay, denNgay]);

  const handleExport = () => {
    const filename = `LichSuSoatVe_${new Date().toISOString().split("T")[0]}.csv`;
    
    // Map items for CSV format
    const exportData = logs.map((log) => ({
      "Mã Chi Tiết Vé": log.MaChiTietDat,
      "Thời Gian Soát": log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleString("vi-VN") : "",
      "Tên Phim": log.TicketInfo.TenPhim,
      "Phòng Chiếu": log.TicketInfo.TenPhong,
      "Ghế": log.TicketInfo.Ghe,
      "Giá Vé": log.TicketInfo.GiaVe,
      "Nhân Viên Soát": log.NhanVienCheckIn ? log.NhanVienCheckIn.HoTen : "N/A",
    }));

    exportToCSV(exportData, filename);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCheckInLogs(newPage);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <button
            onClick={() => navigate("/staff/dashboard")}
            className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Quay lại Tổng quan
          </button>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)] flex items-center gap-4">
            <Receipt size={32} />
            Lịch Sử Soát Vé
          </h1>
          <p className="text-white/50 mt-2">
            Tra cứu thông tin vé đã check-in vào rạp của nhân viên
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={logs.length === 0}
          className="staff-card-flat px-6 py-3 rounded-full text-sm font-bold hover:bg-[var(--btn-neon)]/10 hover:text-[var(--btn-neon)] transition-colors border border-white/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Xuất Báo Cáo (CSV)
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="staff-card-flat rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shrink-0">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Tìm theo Mã vé (UUID), tên phim, tên ghế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors text-sm"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-44">
            <input
              type="date"
              value={tuNgay}
              onChange={(e) => setTuNgay(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-3 text-xs text-white/70 focus:outline-none focus:border-[var(--btn-neon)]"
              placeholder="Từ ngày"
              title="Từ ngày"
            />
          </div>
          <span className="text-white/30 text-xs">đến</span>
          <div className="relative w-full md:w-44">
            <input
              type="date"
              value={denNgay}
              onChange={(e) => setDenNgay(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-3 text-xs text-white/70 focus:outline-none focus:border-[var(--btn-neon)]"
              placeholder="Đến ngày"
              title="Đến ngày"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold text-center shrink-0">
          ⚠️ {error}
        </div>
      )}

      {/* DATA TABLE */}
      <div className="staff-card-flat rounded-3xl overflow-hidden flex-1 flex flex-col min-h-[300px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-widest text-white/50">
                <th className="p-6 font-semibold">Mã Chi Tiết Vé</th>
                <th className="p-6 font-semibold">Thời Gian Soát</th>
                <th className="p-6 font-semibold">Phim</th>
                <th className="p-6 font-semibold">Phòng / Ghế</th>
                <th className="p-6 font-semibold">Nhân Viên Soát</th>
                <th className="p-6 font-semibold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-white/40 font-bold uppercase tracking-wider">
                    Đang tải danh sách lịch sử...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-white/40">
                    Không tìm thấy dữ liệu soát vé nào.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.MaChiTietDat}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 font-mono font-bold text-xs text-white group-hover:text-[var(--btn-neon)] transition-colors select-all">
                      {log.MaChiTietDat}
                    </td>
                    <td className="p-6 text-sm text-white/70">
                      <span className="font-bold text-white">
                        {log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleTimeString("vi-VN") : ""}
                      </span>
                      <br />
                      <span className="text-xs">
                        {log.ThoiGianCheckIn ? new Date(log.ThoiGianCheckIn).toLocaleDateString("vi-VN") : ""}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-sm max-w-xs truncate" title={log.TicketInfo.TenPhim}>
                      {log.TicketInfo.TenPhim}
                    </td>
                    <td className="p-6 text-sm font-semibold">
                      <span>{log.TicketInfo.TenPhong}</span>
                      <br />
                      <span className="text-base text-[var(--btn-neon)] font-mono font-bold">{log.TicketInfo.Ghe}</span>
                    </td>
                    <td className="p-6 text-sm text-white/70">
                      <span className="font-bold text-white">
                        {log.NhanVienCheckIn ? log.NhanVienCheckIn.HoTen : "N/A"}
                      </span>
                      <br />
                      <span className="text-xs font-mono opacity-50">
                        {log.NhanVienCheckIn ? log.NhanVienCheckIn.MaNhanVien : ""}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                        ĐÃ SOÁT VÉ
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {pagination.totalPages > 1 && (
          <div className="bg-black/30 border-t border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
            <span className="text-xs text-white/40">
              Hiển thị {logs.length} / {pagination.total} bản ghi
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-xs font-mono font-bold text-[var(--btn-neon)] bg-[var(--btn-neon)]/10 rounded-xl border border-[var(--btn-neon)]/20">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 cursor-pointer"
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
