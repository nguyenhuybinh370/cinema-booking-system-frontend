import { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import { Search, RotateCcw, AlertTriangle, Receipt, CreditCard, Landmark, DollarSign, Calendar, Film } from 'lucide-react';

const mockTransactions = [
  { MaGiaoDich: 'TX10091', MaDatVe: 'BK9111', KhachHang: 'Đỗ Thùy Linh', Phim: 'Lật Mặt 7: Một Điều Ước', Ghe: 'VIP F01, VIP F02', SoTien: 240000, PhuongThuc: 'VNPay', Ngay: '2026-05-21 09:30', TrangThai: 'Success' },
  { MaGiaoDich: 'TX10090', MaDatVe: 'BK9102', KhachHang: 'Nguyễn Diệp Chi', Phim: 'Dune: Hành Tinh Cát 2', Ghe: 'H10, H11', SoTien: 290000, PhuongThuc: 'Card', Ngay: '2026-05-20 20:15', TrangThai: 'Success' },
  { MaGiaoDich: 'TX10089', MaDatVe: 'BK9045', KhachHang: 'Vũ Hoài Nam', Phim: 'Kung Fu Panda 4', Ghe: 'D01, D02', SoTien: 170000, PhuongThuc: 'VNPay', Ngay: '2026-05-19 17:30', TrangThai: 'Success' },
  { MaGiaoDich: 'TX10088', MaDatVe: 'BK9021', KhachHang: 'Phạm Minh Hoàng', Phim: 'Lật Mặt 7: Một Điều Ước', Ghe: 'F08, F09', SoTien: 210000, PhuongThuc: 'VNPay', Ngay: '2026-05-18 19:30', TrangThai: 'Success' },
  { MaGiaoDich: 'TX10087', MaDatVe: 'BK8990', KhachHang: 'Bán tại quầy (Staff)', Phim: 'Vây Hãm: Kẻ Trừng Phạt', Ghe: 'B04', SoTien: 95000, PhuongThuc: 'Cash', Ngay: '2026-05-18 10:15', TrangThai: 'Success' },
  { MaGiaoDich: 'TX10086', MaDatVe: 'BK8810', KhachHang: 'Nguyễn Diệp Chi', Phim: 'Vây Hãm: Kẻ Trừng Phạt', Ghe: 'E05', SoTien: 95000, PhuongThuc: 'MoMo', Ngay: '2026-05-05 18:00', TrangThai: 'Refunded' },
  { MaGiaoDich: 'TX10085', MaDatVe: 'BK8765', KhachHang: 'Lê Anh Đức', Phim: 'Kung Fu Panda 4', Ghe: 'C03, C04', SoTien: 170000, PhuongThuc: 'MoMo', Ngay: '2026-05-01 11:20', TrangThai: 'Failed' }
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleOpenRefund = (tx) => {
    setSelectedTx(tx);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const handleRefundSubmit = () => {
    if (!selectedTx) return;
    
    setTransactions(prev => prev.map(t => 
      t.MaGiaoDich === selectedTx.MaGiaoDich ? { ...t, TrangThai: 'Refunded' } : t
    ));
    
    setIsRefundModalOpen(false);
    
    alert(`Đã thực hiện hoàn tiền thành công cho mã đặt vé ${selectedTx.MaDatVe}!\nSố tiền hoàn lại: ${formatPrice(selectedTx.SoTien)}\nLý do: ${refundReason}`);
  };

  // Filter Transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.MaGiaoDich.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.MaDatVe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.KhachHang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Phim.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || t.TrangThai === statusFilter;
    const matchesMethod = methodFilter === 'All' || t.PhuongThuc === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const columns = [
    {
      header: 'Mã Giao dịch / Vé',
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-bold text-white text-sm font-mono">{t.MaGiaoDich}</span>
          <span className="text-xs text-red-500 font-bold font-mono">{t.MaDatVe}</span>
        </div>
      )
    },
    {
      header: 'Khách hàng',
      render: (t) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-200 text-sm">{t.KhachHang}</span>
          <span className="text-[10px] text-slate-500 font-mono">{t.Ngay}</span>
        </div>
      )
    },
    {
      header: 'Nội dung mua vé',
      render: (t) => (
        <div className="flex flex-col max-w-[220px]">
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
          {t.PhuongThuc === 'VNPay' && <Landmark size={14} className="text-blue-400" />}
          {t.PhuongThuc === 'MoMo' && <Landmark size={14} className="text-pink-400" />}
          {t.PhuongThuc === 'Card' && <CreditCard size={14} className="text-amber-400" />}
          {t.PhuongThuc === 'Cash' && <DollarSign size={14} className="text-emerald-400" />}
          <span>{t.PhuongThuc}</span>
        </div>
      )
    },
    {
      header: 'Trạng thái',
      render: (t) => <StatusBadge status={t.TrangThai} />
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end">
          {t.TrangThai === 'Success' ? (
            <button 
              onClick={() => handleOpenRefund(t)}
              className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              title="Hủy vé / Hoàn tiền"
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <span className="text-xs text-slate-600 font-semibold px-2 py-1 select-none">--</span>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow">Quản lý giao dịch</h1>
        <p className="text-slate-500">Giám sát luồng tiền vé thời gian thực, tra cứu và xử lý sự cố hoàn tiền / hủy đặt vé.</p>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm theo mã giao dịch, mã vé, tên khách hàng..." 
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
          <option value="Success" className="bg-[#0f1117]">Thành công</option>
          <option value="Refunded" className="bg-[#0f1117]">Đã hoàn tiền</option>
          <option value="Failed" className="bg-[#0f1117]">Thất bại</option>
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

      {/* Table */}
      <AdminTable columns={columns} data={filteredTransactions} rowKey="MaGiaoDich" />

      {/* Refund Request Modal */}
      <Modal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        title="Yêu cầu Hủy đặt vé & Hoàn tiền"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-red-400 text-sm">
            <AlertTriangle size={24} className="shrink-0" />
            <p>Hành động này sẽ hủy toàn bộ các vé đã đặt trong giao dịch này, giải phóng ghế trống về suất chiếu và hoàn trả lại tiền thông qua cổng thanh toán ban đầu.</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 space-y-3 font-mono text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Mã giao dịch:</span>
              <span className="text-white font-bold">{selectedTx?.MaGiaoDich}</span>
            </div>
            <div className="flex justify-between">
              <span>Mã đặt vé:</span>
              <span className="text-white font-bold">{selectedTx?.MaDatVe}</span>
            </div>
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="text-white font-bold">{selectedTx?.KhachHang}</span>
            </div>
            <div className="flex justify-between">
              <span>Nội dung mua vé:</span>
              <span className="text-white font-bold max-w-[250px] text-right truncate" title={selectedTx?.Phim}>{selectedTx?.Phim}</span>
            </div>
            <div className="flex justify-between">
              <span>Danh sách ghế:</span>
              <span className="text-white font-bold">{selectedTx?.Ghe}</span>
            </div>
            <div className="h-[1px] bg-white/5 my-2"></div>
            <div className="flex justify-between text-sm">
              <span>Số tiền hoàn trả:</span>
              <span className="text-red-500 font-bold">{selectedTx && formatPrice(selectedTx.SoTien)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lý do hoàn trả</label>
            <textarea 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm min-h-[100px]"
              placeholder="VD: Rạp hủy suất chiếu do sự cố kỹ thuật, khách hàng yêu cầu hủy vé sớm..."
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
              Hủy bỏ
            </button>
            <button 
              type="button"
              disabled={!refundReason}
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
