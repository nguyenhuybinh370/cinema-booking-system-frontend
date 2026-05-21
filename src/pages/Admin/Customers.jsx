import { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import { Search, UserX, UserCheck, Key, History, X, CheckSquare, AlertTriangle } from 'lucide-react';

const mockCustomers = [
  { MaKhachHang: 'KH001', HoTen: 'Phạm Minh Hoàng', Email: 'hoang.pham@gmail.com', SoDienThoai: '0912345678', DiemTichLuy: 120, TrangThai: 'Active' },
  { MaKhachHang: 'KH002', HoTen: 'Nguyễn Diệp Chi', Email: 'chi.nd@gmail.com', SoDienThoai: '0987654321', DiemTichLuy: 450, TrangThai: 'Active' },
  { MaKhachHang: 'KH003', HoTen: 'Lê Anh Đức', Email: 'duc.la@gmail.com', SoDienThoai: '0901234567', DiemTichLuy: 0, TrangThai: 'Banned' },
  { MaKhachHang: 'KH004', HoTen: 'Vũ Hoài Nam', Email: 'nam.vh@gmail.com', SoDienThoai: '0934567890', DiemTichLuy: 95, TrangThai: 'Active' },
  { MaKhachHang: 'KH005', HoTen: 'Đỗ Thùy Linh', Email: 'linh.dt@gmail.com', SoDienThoai: '0978901234', DiemTichLuy: 880, TrangThai: 'Active' }
];

const mockCustomerTransactions = {
  'KH001': [
    { MaDatVe: 'BK9021', NgayDat: '2026-05-18 19:30', Phim: 'Lật Mặt 7: Một Điều Ước', Ghe: 'F08, F09', TongTien: 210000, PTThanhToan: 'VNPay', TrangThai: 'Thành công' },
    { MaDatVe: 'BK8902', NgayDat: '2026-05-10 14:00', Phim: 'Hành Tinh Khỉ: Vương Quốc Mới', Ghe: 'G03', TongTien: 115000, PTThanhToan: 'MoMo', TrangThai: 'Thành công' }
  ],
  'KH002': [
    { MaDatVe: 'BK9102', NgayDat: '2026-05-20 20:15', Phim: 'Dune: Hành Tinh Cát 2', Ghe: 'H10, H11', TongTien: 290000, PTThanhToan: 'Card', TrangThai: 'Thành công' },
    { MaDatVe: 'BK8810', NgayDat: '2026-05-05 18:00', Phim: 'Vây Hãm: Kẻ Trừng Phạt', Ghe: 'E05', TongTien: 95000, PTThanhToan: 'MoMo', TrangThai: 'Đã hoàn tiền' }
  ],
  'KH003': [],
  'KH004': [
    { MaDatVe: 'BK9045', NgayDat: '2026-05-19 17:30', Phim: 'Kung Fu Panda 4', Ghe: 'D01, D02', TongTien: 170000, PTThanhToan: 'VNPay', TrangThai: 'Thành công' }
  ],
  'KH005': [
    { MaDatVe: 'BK9111', NgayDat: '2026-05-21 09:30', Phim: 'Lật Mặt 7: Một Điều Ước', Ghe: 'VIP F01, VIP F02', TongTien: 240000, PTThanhToan: 'VNPay', TrangThai: 'Thành công' },
    { MaDatVe: 'BK9001', NgayDat: '2026-05-15 21:00', Phim: 'Dune: Hành Tinh Cát 2', Ghe: 'I12, I13', TongTien: 310000, PTThanhToan: 'Card', TrangThai: 'Thành công' }
  ]
};

const Customers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [lockReason, setLockReason] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleResetPassword = (cust) => {
    const tempPass = Math.random().toString(36).slice(-8);
    alert(`Đã đặt lại mật khẩu thành công cho ${cust.HoTen}!\nMật khẩu mới tạm thời là: ${tempPass}\n(Thông báo đã được gửi đến email ${cust.Email})`);
  };

  const handleToggleLockStatus = () => {
    if (!selectedCust) return;
    const newStatus = selectedCust.TrangThai === 'Active' ? 'Banned' : 'Active';
    
    setCustomers(prev => prev.map(c => 
      c.MaKhachHang === selectedCust.MaKhachHang ? { ...c, TrangThai: newStatus } : c
    ));
    
    setIsLockModalOpen(false);
    setLockReason('');
    
    alert(`Đã ${newStatus === 'Banned' ? 'khóa' : 'mở khóa'} tài khoản của ${selectedCust.HoTen} thành công.`);
  };

  const openLockModal = (cust) => {
    setSelectedCust(cust);
    if (cust.TrangThai === 'Active') {
      setLockReason('');
      setIsLockModalOpen(true);
    } else {
      // Unban directly or via alert confirmation
      if (window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản cho ${cust.HoTen}?`)) {
        setCustomers(prev => prev.map(c => 
          c.MaKhachHang === cust.MaKhachHang ? { ...c, TrangThai: 'Active' } : c
        ));
        alert(`Đã mở khóa tài khoản của ${cust.HoTen} thành công.`);
      }
    }
  };

  const openHistoryDrawer = (cust) => {
    setSelectedCust(cust);
    setIsHistoryOpen(true);
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
            onClick={() => handleResetPassword(c)}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Reset mật khẩu"
          >
            <Key size={18} />
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
              {mockCustomerTransactions[selectedCust?.MaKhachHang]?.length === 0 ? (
                <div className="h-64 flex flex-col justify-center items-center text-slate-600 border border-dashed border-white/5 rounded-3xl">
                  <CheckSquare size={32} className="mb-2" />
                  <span>Chưa có giao dịch nào được thực hiện.</span>
                </div>
              ) : (
                mockCustomerTransactions[selectedCust?.MaKhachHang]?.map((t) => (
                  <div key={t.MaDatVe} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-red-500 font-bold font-mono">{t.MaDatVe}</span>
                        <h4 className="font-bold text-white text-sm mt-1">{t.Phim}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.TrangThai === 'Thành công' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-500'
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lý do khóa tài khoản</label>
            <textarea 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm min-h-[100px]"
              placeholder="VD: Nghi ngờ giao dịch gian lận, vi phạm điều khoản dịch vụ..."
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
              disabled={!lockReason}
              onClick={handleToggleLockStatus}
              className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
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
