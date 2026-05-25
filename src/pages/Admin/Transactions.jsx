import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Search, Landmark, CreditCard, DollarSign, RotateCcw, AlertTriangle } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Refund states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const loadTransactions = async () => {
    try {
      const data = await adminService.getTransactions();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleOpenRefund = (tx) => {
    setSelectedTx(tx);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!selectedTx || !refundReason.trim()) return;
    try {
      await adminService.refundTransaction(selectedTx.MaGiaoDich, refundReason);
      await loadTransactions();
      setIsRefundModalOpen(false);
      alert(
        `HOÀN TIỀN THÀNH CÔNG!\n\n` +
        `1. [CSDL - GIAODICH]: Đã chuyển trạng thái sang "Refunded" và cập nhật Ghi chú: "${refundReason}".\n` +
        `2. [CSDL - PHIEUDATVE]: Đã chuyển trạng thái hóa đơn liên quan sang "Đã hủy".\n` +
        `3. [CSDL - GHE_SUATCHIEU]: Đã tự động giải phóng tất cả ghế trong suất chiếu của hóa đơn này về trạng thái Trống (0).`
      );
    } catch (error) {
      console.error("Failed to refund transaction:", error);
      alert("Đã xảy ra lỗi khi hoàn tiền giao dịch!");
    }
  };

  // Filter Transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.MaGiaoDich.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.MaPhieuDatVe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.MaThamChieuDoiTac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.KhachHang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Phim.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || t.TrangThai === statusFilter;
    const matchesMethod = methodFilter === 'All' || t.PhuongThucThanhToan === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const columns = [
    {
      header: 'Mã Giao dịch',
      render: (t) => <span className="font-bold text-white text-sm font-mono">{t.MaGiaoDich}</span>
    },
    {
      header: 'Mã Phiếu Đặt Vé',
      render: (t) => <span className="font-bold text-red-500 text-sm font-mono">{t.MaPhieuDatVe}</span>
    },
    {
      header: 'Tham Chiếu Đối Tác',
      render: (t) => <span className="text-slate-400 text-xs font-mono">{t.MaThamChieuDoiTac}</span>
    },
    {
      header: 'Khách hàng',
      render: (t) => <span className="font-bold text-slate-200 text-sm">{t.KhachHang}</span>
    },
    {
      header: 'Nội dung mua vé',
      render: (t) => (
        <div className="flex flex-col max-w-[200px]">
          <span className="font-bold text-slate-300 text-xs truncate" title={t.Phim}>{t.Phim}</span>
          <span className="text-[10px] text-slate-500 font-medium">Ghế: {t.Ghe}</span>
        </div>
      )
    },
    {
      header: 'Số tiền',
      render: (t) => <span className="font-bold font-mono text-emerald-500 text-sm">{formatPrice(t.SoTien)}</span>
    },
    {
      header: 'Phương thức',
      render: (t) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {t.PhuongThucThanhToan === 'VNPay' && <Landmark size={14} className="text-blue-400" />}
          {t.PhuongThucThanhToan === 'MoMo' && <Landmark size={14} className="text-pink-400" />}
          {t.PhuongThucThanhToan === 'Card' && <CreditCard size={14} className="text-amber-400" />}
          {t.PhuongThucThanhToan === 'Cash' && <DollarSign size={14} className="text-emerald-400" />}
          <span>{t.PhuongThucThanhToan}</span>
        </div>
      )
    },
    {
      header: 'Trạng thái',
      render: (t) => <StatusBadge status={t.TrangThai} />
    },
    {
      header: 'Ngày giao dịch',
      render: (t) => <span className="text-xs text-slate-400 font-mono">{t.NgayGiaoDich}</span>
    },
    {
      header: 'Ghi chú',
      render: (t) => <span className="text-xs text-slate-500 truncate max-w-[150px] inline-block" title={t.GhiChu}>{t.GhiChu || '--'}</span>
    },
    {
      header: 'Khả dụng',
      render: (t) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.KhaDung === 1 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {t.KhaDung === 1 ? 'Khả dụng' : 'Khóa'}
        </span>
      )
    },
    {
      header: 'Ngày tạo',
      render: (t) => <span className="text-xs text-slate-500 font-mono">{t.NgayTao}</span>
    },
    {
      header: 'Ngày cập nhật',
      render: (t) => <span className="text-xs text-slate-500 font-mono">{t.NgayCapNhat || '--'}</span>
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end">
          {t.TrangThai === 'Success' ? (
            <button 
              onClick={() => handleOpenRefund(t)}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-red-500/20 text-xs font-bold"
              title="Hủy vé & Hoàn tiền"
            >
              <RotateCcw size={14} />
              <span>Hoàn tiền</span>
            </button>
          ) : (
            <span className="text-xs text-slate-600 font-semibold px-2 py-1 select-none">--</span>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4"></div>
          Đang tải danh sách giao dịch...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow">Quản lý giao dịch</h1>
        <p className="text-slate-500">Giám sát toàn bộ luồng tiền giao dịch vé thực tế (bảng GIAODICH) từ các cổng thanh toán.</p>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm theo mã giao dịch, mã vé, khách hàng, tên phim..." 
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All" className="bg-[#0f1117]">Tất cả trạng thái</option>
          <option value="Success" className="bg-[#0f1117]">Thành công (Success)</option>
          <option value="Refunded" className="bg-[#0f1117]">Đã hoàn tiền (Refunded)</option>
          <option value="Failed" className="bg-[#0f1117]">Thất bại (Failed)</option>
        </select>
        <select 
          className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
        >
          <option value="All" className="bg-[#0f1117]">Phương thức thanh toán</option>
          <option value="VNPay" className="bg-[#0f1117]">VNPay</option>
          <option value="MoMo" className="bg-[#0f1117]">MoMo</option>
          <option value="Card" className="bg-[#0f1117]">Thẻ Quốc tế</option>
          <option value="Cash" className="bg-[#0f1117]">Tiền mặt</option>
        </select>
      </div>

      {/* Table grid with horizontal scroll wrapper */}
      <div className="overflow-x-auto w-full custom-scrollbar">
        <AdminTable columns={columns} data={filteredTransactions} rowKey="MaGiaoDich" />
      </div>

      {/* Refund Confirmation Modal */}
      <Modal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        title="Yêu cầu Hủy đặt vé & Hoàn tiền"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-red-400 text-sm">
            <AlertTriangle size={24} className="shrink-0" />
            <p>Hành động này sẽ hoàn trả lại tiền thông qua cổng thanh toán, đồng thời hủy bỏ vé và giải phóng ghế trống về suất chiếu.</p>
          </div>

          {/* Customer / Ticket context */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="text-white font-bold">{selectedTx?.KhachHang}</span>
            </div>
            <div className="flex justify-between">
              <span>Nội dung vé:</span>
              <span className="text-white font-bold text-right truncate max-w-[200px]" title={selectedTx?.Phim}>{selectedTx?.Phim}</span>
            </div>
            <div className="flex justify-between">
              <span>Ghế đã chọn:</span>
              <span className="text-white font-bold">{selectedTx?.Ghe}</span>
            </div>
          </div>

          {/* LICHSUHOANTIEN Record Preview */}
          <div className="border border-white/5 rounded-2xl p-5 bg-[#0a0c10] space-y-3 font-mono text-xs text-slate-400">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2 flex justify-between">
              <span>Bảng CSDL: LICHSUHOANTIEN</span>
              <span className="text-red-500 font-semibold lowercase">preview</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>MaLichSuHoanTien:</span>
                <span className="text-slate-500 font-bold italic">HT_XXXXXX (Tự động)</span>
              </div>
              <div className="flex justify-between">
                <span>MaGiaoDich:</span>
                <span className="text-white font-bold">{selectedTx?.MaGiaoDich}</span>
              </div>
              <div className="flex justify-between">
                <span>MaPhieuDatVe:</span>
                <span className="text-white font-bold">{selectedTx?.MaPhieuDatVe}</span>
              </div>
              <div className="flex justify-between">
                <span>SoTienHoan:</span>
                <span className="text-red-500 font-bold">{selectedTx && formatPrice(selectedTx.SoTien)}</span>
              </div>
              <div className="flex justify-between">
                <span>LyDoHoan:</span>
                <span className="text-amber-500 font-bold truncate max-w-[200px]" title={refundReason || 'Chưa nhập'}>
                  {refundReason || '(Yêu cầu nhập lý do)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>TrangThai:</span>
                <span className="text-emerald-500 font-bold">Success</span>
              </div>
              <div className="flex justify-between">
                <span>NgayYeuCau:</span>
                <span className="text-white font-bold">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
              </div>
              <div className="flex justify-between">
                <span>NgayHoan:</span>
                <span className="text-white font-bold">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
              </div>
              <div className="flex justify-between">
                <span>NgayTao:</span>
                <span className="text-white font-bold">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
              </div>
              <div className="flex justify-between">
                <span>NgayCapNhat:</span>
                <span className="text-slate-600 font-bold">null</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nhập lý do hoàn trả (LyDoHoan)</label>
            <textarea 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm min-h-[80px]"
              placeholder="Nhập lý do hoàn tiền..."
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsRefundModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Đóng
            </button>
            <button 
              type="button"
              disabled={!refundReason.trim()}
              onClick={handleRefundSubmit}
              className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Xác nhận Hoàn tiền
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Transactions;
