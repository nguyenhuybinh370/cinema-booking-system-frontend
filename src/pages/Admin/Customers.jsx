import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Search, UserX, UserCheck, History, X, CheckSquare, AlertTriangle } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await adminService.getCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };



  const handleToggleLockStatus = async () => {
    if (!selectedCust || !lockReason.trim()) return;
    try {
      const result = await adminService.lockCustomerAccount(selectedCust.MaKhachHang, lockReason);
      await loadCustomers();
      
      setIsLockModalOpen(false);
      setLockReason('');
      
      alert(
        `KHÓA TÀI KHOẢN THÀNH CÔNG!\n\n` +
        `1. [CSDL - KHACHHANG]: Đã cập nhật KhaDung = 0 và lưu LyDoKhoa: "${result.reason}".\n` +
        `2. [HỆ THỐNG EMAIL]: Đã gửi thư thông báo chi tiết lý do khóa đến khách hàng tại địa chỉ email: ${result.email}.`
      );
    } catch (error) {
      alert("Lỗi khi khóa tài khoản: " + error.message);
    }
  };

  const openLockModal = async (cust) => {
    setSelectedCust(cust);
    if (cust.TrangThai === 'Active') {
      setLockReason('');
      setIsLockModalOpen(true);
    } else {
      if (window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản cho ${cust.HoTen}?`)) {
        try {
          await adminService.unlockCustomerAccount(cust.MaKhachHang);
          await loadCustomers();
          alert(`Đã mở khóa tài khoản của ${cust.HoTen} thành công. Trạng thái đã chuyển sang Đang hoạt động (KhaDung = 1).`);
        } catch (error) {
          alert("Lỗi khi mở khóa tài khoản: " + error.message);
        }
      }
    }
  };

  const openHistoryDrawer = async (cust) => {
    setSelectedCust(cust);
    setIsHistoryOpen(true);
    setLoadingTransactions(true);
    try {
      const trans = await adminService.getCustomerTransactions(cust.MaKhachHang);
      setTransactions(trans);
    } catch (error) {
      alert("Lỗi tải lịch sử giao dịch: " + error.message);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.SoDienThoai.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || c.TrangThai === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Khách hàng',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
            {c.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{c.HoTen}</span>
            <span className="text-xs text-slate-500">{c.Email}</span>
          </div>
        </div>
      )
    },
    { header: 'Số điện thoại', accessor: 'SoDienThoai', className: 'text-sm text-slate-400 font-mono' },
    { 
      header: 'Điểm tích lũy', 
      render: (c) => <span className="font-bold text-white text-sm">{c.DiemTichLuy} <span className="text-[10px] text-red-500 font-normal">pts</span></span>
    },
    {
      header: 'Trạng thái',
      render: (c) => <StatusBadge status={c.TrangThai} />
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => openHistoryDrawer(c)}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Lịch sử mua vé"
          >
            <History size={18} />
          </button>
          <button 
            onClick={() => openLockModal(c)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              c.TrangThai === 'Active' 
                ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500' 
                : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'
            }`} 
            title={c.TrangThai === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
          >
            {c.TrangThai === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4"></div>
          Đang tải danh sách khách hàng...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow">Quản lý khách hàng</h1>
        <p className="text-slate-500">Tra cứu hồ sơ khách hàng, xem lịch sử giao dịch và quản lý khóa/mở tài khoản.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng theo tên, email, sđt..." 
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
          <option value="Active" className="bg-[#0f1117]">Đang hoạt động</option>
          <option value="Banned" className="bg-[#0f1117]">Bị khóa</option>
        </select>
      </div>

      {/* Table */}
      <AdminTable columns={columns} data={filteredCustomers} rowKey="MaKhachHang" />

      {/* Side Drawer: Transaction History */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#0f1117] h-screen shadow-2xl border-l border-white/10 p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Lịch sử đặt vé</h3>
                <p className="text-slate-500 text-xs mt-1">Khách hàng: {selectedCust?.HoTen} ({selectedCust?.Email})</p>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/5 rounded-xl cursor-pointer"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-1 no-scrollbar">
              {loadingTransactions ? (
                <div className="h-64 flex justify-center items-center text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mr-3"></div>
                  Đang tải giao dịch...
                </div>
              ) : transactions.length === 0 ? (
                <div className="h-64 flex flex-col justify-center items-center text-slate-600 border border-dashed border-white/5 rounded-3xl">
                  <CheckSquare size={32} className="mb-2" />
                  <span>Chưa có giao dịch nào được thực hiện.</span>
                </div>
              ) : (
                transactions.map((t) => (
                  <div key={t.MaDatVe} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-red-500 font-bold font-mono">{t.MaDatVe}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{t.Phim}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.TrangThai === 'Thành công' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}>
                        {t.TrangThai}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-400 mt-4">
                      <div>Ghế: <span className="text-slate-200">{t.Ghe}</span></div>
                      <div>Phương thức: <span className="text-slate-200">{t.PTThanhToan}</span></div>
                      <div>Ngày đặt: <span className="text-slate-200 font-mono">{t.NgayDat}</span></div>
                      <div>Tổng tiền: <span className="text-red-500 font-bold font-mono">{formatPrice(t.TongTien)}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Lock Modal */}
      <Modal 
        isOpen={isLockModalOpen} 
        onClose={() => setIsLockModalOpen(false)} 
        title="Khóa tài khoản khách hàng"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-red-400 text-sm">
            <AlertTriangle size={24} className="shrink-0" />
            <p>Hành động này sẽ khóa tài khoản của <strong>{selectedCust?.HoTen}</strong>, ngăn chặn hoàn toàn việc đăng nhập và đặt vé trực tuyến.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lý do khóa tài khoản (Bắt buộc)</label>
            <textarea 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm min-h-[100px]"
              placeholder="Nhập lý do chi tiết..."
              value={lockReason}
              onChange={e => setLockReason(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsLockModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button 
              type="button"
              disabled={!lockReason.trim()}
              onClick={handleToggleLockStatus}
              className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Xác nhận Khóa
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Customers;
