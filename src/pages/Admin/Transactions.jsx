import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Search, Landmark, CreditCard, DollarSign } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

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
    </AdminLayout>
  );
};

export default Transactions;
