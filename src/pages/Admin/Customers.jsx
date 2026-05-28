import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Search, UserX, UserCheck, History, X, CheckSquare, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isUnlocking, setIsUnlocking] = useState(false);

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
      
      showSuccess(
        `KHÓA TÀI KHOẢN THÀNH CÔNG!\n` +
        `1. Cập nhật KhaDung = 0 và LyDoKhoa: "${result.reason}".\n` +
        `2. Đã gửi thư thông báo đến địa chỉ: ${result.email}.`
      );
    } catch (error) {
      showError("Lỗi khi khóa tài khoản: " + error.message);
    }
  };

  const openLockModal = async (cust) => {
    setSelectedCust(cust);
    if (cust.TrangThai === 'Active') {
      setLockReason('');
      setIsLockModalOpen(true);
    } else {
      setConfirmState({ isOpen: true, data: cust });
    }
  };

  const handleConfirmUnlock = async () => {
    const cust = confirmState.data;
    setIsUnlocking(true);
    try {
      await adminService.unlockCustomerAccount(cust.MaKhachHang);
      await loadCustomers();
      showSuccess(`Đã mở khóa tài khoản của ${cust.HoTen} thành công. Trạng thái đã chuyển sang Đang hoạt động.`);
    } catch (error) {
      showError("Lỗi khi mở khóa tài khoản: " + error.message);
    } finally {
      setIsUnlocking(false);
      setConfirmState({ isOpen: false, data: null });
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
      showError("Lỗi tải lịch sử giao dịch: " + error.message);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = useClientPagination(
    customers,
    ['HoTen', 'Email', 'SoDienThoai'],
    (c, f) => {
      const matchStatus = !f.status || f.status === 'All' || c.TrangThai === f.status;
      return matchStatus;
    }
  );

  const columns = [
    {
      header: 'Khách hàng',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm tracking-wide shrink-0">
            {c.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white text-sm truncate">{c.HoTen}</span>
            <span className="text-xs text-slate-500 truncate">{c.Email}</span>
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
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Lịch sử mua vé"
          >
            <History size={16} />
          </button>
          <button 
            onClick={() => openLockModal(c)}
            className={`p-2 bg-white/5 border border-white/5 rounded-xl transition-all cursor-pointer ${
              c.TrangThai === 'Active' 
                ? 'hover:bg-red-500/10 text-slate-400 hover:text-red-500 hover:border-red-500/20' 
                : 'hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/20'
            }`} 
            title={c.TrangThai === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
          >
            {c.TrangThai === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý khách hàng"
        subtitle="Tra cứu hồ sơ khách hàng, xem lịch sử giao dịch và quản lý khóa/mở tài khoản."
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm kiếm khách hàng theo tên, email, sđt..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <select 
            className="bg-white/[0.04] border border-white/10 rounded-xl px-6 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
            value={filters.status || 'All'}
            onChange={e => setFilterVal('status', e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Banned">Bị khóa</option>
          </select>
        }
      />

      {/* Table */}
      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
          Không tìm thấy dữ liệu phù hợp
        </div>
      ) : (
        <>
          <AdminTable columns={columns} data={paginatedItems} rowKey="MaKhachHang" />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Side Drawer: Transaction History */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#0b0f19] h-screen shadow-2xl border-l border-white/10 p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Lịch sử đặt vé</h3>
                <p className="text-slate-500 text-xs mt-1">Khách hàng: {selectedCust?.HoTen} ({selectedCust?.Email})</p>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/5 rounded-xl cursor-pointer text-slate-400 hover:text-white transition-all"><X size={20} /></button>
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
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-300 text-sm min-h-[100px]"
              placeholder="Nhập lý do chi tiết..."
              value={lockReason}
              onChange={e => setLockReason(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsLockModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button 
              type="button"
              disabled={!lockReason.trim()}
              onClick={handleToggleLockStatus}
              className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Xác nhận Khóa
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Mở khóa tài khoản"
        message={confirmState.data ? `Bạn có chắc chắn muốn mở khóa tài khoản cho ${confirmState.data.HoTen}?` : ''}
        confirmText="Mở khóa"
        cancelText="Hủy"
        variant="default"
        isLoading={isUnlocking}
        onConfirm={handleConfirmUnlock}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Customers;
