import { useState } from "react";
import { Search, Download, ArrowLeft, Receipt, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TRANSACTIONS } from "../../data/mockTransactions";
import { exportToCSV } from "../../utils/exportHelper";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Logic: Lọc theo cả Từ khóa (Search) và Trạng thái (Filter)
  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    // 1. Kiểm tra từ khóa có nằm trong ID, Loại giao dịch hoặc Phương thức thanh toán không
    const keyword = searchTerm.toLowerCase();
    const matchSearch =
      tx.id.toLowerCase().includes(keyword) ||
      tx.type.toLowerCase().includes(keyword) ||
      tx.method.toLowerCase().includes(keyword);

    // 2. Kiểm tra trạng thái
    const matchStatus = statusFilter === "ALL" || tx.status === statusFilter;

    // 3. Trả về true nếu thỏa mãn cả hai điều kiện
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    // Đặt tên file có kèm timestamp để báo cáo nhìn chuyên nghiệp
    const filename = `LichSuGiaoDich_${new Date().toISOString().split("T")[0]}.csv`;
    // Chỉ xuất những data đang được lọc trên màn hình
    exportToCSV(filteredTransactions, filename);
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <button
            onClick={() => navigate("/staff/dashboard")}
            className="text-white/50 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại Tổng quan
          </button>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)] flex items-center gap-4">
            <Receipt size={32} />
            Lịch Sử Giao Dịch
          </h1>
          <p className="text-white/50 mt-2">
            Tra cứu toàn bộ phiếu đặt vé và lịch sử soát vé trong ca
          </p>
        </div>

        <button
          onClick={handleExport}
          className="staff-card-flat px-6 py-3 rounded-full text-sm font-bold hover:bg-[var(--btn-neon)]/10 hover:text-[var(--btn-neon)] transition-colors border border-white/20 flex items-center gap-2"
        >
          <Download size={16} />
          Xuất Báo Cáo (CSV)
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="staff-card-flat rounded-2xl p-4 flex gap-4 items-center">
        {/* Thanh tìm kiếm mở rộng */}
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Tìm theo Mã GD, Loại (Bán vé, Soát vé), Thanh toán (MoMo, Tiền mặt)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
          />
        </div>

        {/* Dropdown Lọc trạng thái */}
        <div className="relative min-w-[200px]">
          <Filter
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white/70 hover:text-white focus:outline-none focus:border-[var(--btn-neon)] appearance-none cursor-pointer transition-colors"
          >
            <option value="ALL" className="bg-[#0f172a]">
              Tất cả trạng thái
            </option>
            <option value="Thành công" className="bg-[#0f172a]">
              Thành công
            </option>
            <option value="Hợp lệ" className="bg-[#0f172a]">
              Hợp lệ
            </option>
            <option value="Đã hủy" className="bg-[#0f172a]">
              Đã hủy
            </option>
            <option value="Không hợp lệ" className="bg-[#0f172a]">
              Không hợp lệ
            </option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="staff-card-flat rounded-3xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-widest text-white/50">
                <th className="p-6 font-semibold">Mã Giao Dịch</th>
                <th className="p-6 font-semibold">Thời Gian</th>
                <th className="p-6 font-semibold">Loại</th>
                <th className="p-6 font-semibold text-right">Số Tiền</th>
                <th className="p-6 font-semibold">Thanh Toán</th>
                <th className="p-6 font-semibold text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6 font-mono font-bold text-white group-hover:text-[var(--btn-neon)] transition-colors">
                    {tx.id}
                  </td>
                  <td className="p-6 text-sm text-white/70">
                    <span className="font-bold text-white">{tx.time}</span>
                    <br />
                    <span className="text-xs">{tx.date}</span>
                  </td>
                  <td className="p-6 font-bold text-sm">{tx.type}</td>
                  <td className="p-6 text-right font-mono font-bold text-white">
                    {tx.amount > 0
                      ? `${tx.amount.toLocaleString("vi-VN")}đ`
                      : "-"}
                  </td>
                  <td className="p-6 text-sm text-white/70">{tx.method}</td>
                  <td className="p-6 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap
                      ${tx.status === "Thành công" ? "bg-green-500/20 text-green-400 border border-green-500/30" : ""}
                      ${tx.status === "Hợp lệ" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : ""}
                      ${tx.status === "Đã hủy" || tx.status === "Không hợp lệ" ? "bg-red-500/20 text-red-400 border border-red-500/30" : ""}
                    `}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-white/40">
                    Không tìm thấy giao dịch nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
