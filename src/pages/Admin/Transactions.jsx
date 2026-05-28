import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Landmark, CreditCard, DollarSign, RotateCcw, AlertTriangle, Eye, Check, X, FileText } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import { normalizePaymentMethod, getPaymentMethodLabel } from '../../utils/paymentMethodHelper';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'refunds'
  const tabs = [
    { id: 'transactions', label: 'Giao dịch' },
    { id: 'refunds', label: 'Yêu cầu hoàn tiền' }
  ];

  // ----------------------------------------------------
  // TRANSACTION TAB STATE & LOGIC (Client-side Paginated)
  // ----------------------------------------------------
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Direct transaction refund states
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
      showSuccess(
        `HOÀN TIỀN THÀNH CÔNG!\n` +
        `1. Giao dịch đã chuyển sang "Refunded" và lưu ghi chú: "${refundReason}".\n` +
        `2. Phiếu đặt vé liên quan chuyển sang "Đã hủy".\n` +
        `3. Đã tự động giải phóng tất cả ghế trong suất chiếu.`
      );
    } catch (error) {
      console.error("Failed to refund transaction:", error);
      showError("Đã xảy ra lỗi khi hoàn tiền giao dịch!");
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
    transactions,
    ['MaGiaoDich', 'MaPhieuDatVe', 'MaThamChieuDoiTac', 'KhachHang', 'Phim'],
    (t, f) => {
      const matchStatus = !f.status || f.status === 'All' || t.TrangThai === f.status;
      const transactionMethod = normalizePaymentMethod(t.PhuongThucThanhToan || t.PhuongThuc);
      const filterMethod = normalizePaymentMethod(f.method);
      const matchMethod = !f.method || f.method === 'All' || transactionMethod === filterMethod;
      return matchStatus && matchMethod;
    }
  );

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
      render: (t) => {
        const rawMethod = t.PhuongThucThanhToan || t.PhuongThuc;
        const normalized = normalizePaymentMethod(rawMethod);
        const label = getPaymentMethodLabel(rawMethod);
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {normalized === 'VNPAY' && <Landmark size={14} className="text-blue-400" />}
            {normalized === 'PAYOS' && <Landmark size={14} className="text-cyan-400" />}
            {normalized === 'MOMO' && <Landmark size={14} className="text-pink-400" />}
            {normalized === 'CARD' && <CreditCard size={14} className="text-amber-400" />}
            {normalized === 'TIEN_MAT' && <DollarSign size={14} className="text-emerald-400" />}
            {normalized === 'CHUYEN_KHOAN' && <CreditCard size={14} className="text-indigo-400" />}
            <span>{label}</span>
          </div>
        );
      }
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

  // ----------------------------------------------------
  // REFUND REQUEST TAB STATE & LOGIC (Server-side Paginated)
  // ----------------------------------------------------
  const [refundRequests, setRefundRequests] = useState([]);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundPagination, setRefundPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [refundFilters, setRefundFilters] = useState({
    trangThai: '',
    keyword: ''
  });
  const [keywordInput, setKeywordInput] = useState('');

  // Approve / Reject modal states
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [activeRefund, setActiveRefund] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setRefundFilters(prev => ({ ...prev, keyword: keywordInput }));
      setRefundPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [keywordInput]);

  const loadRefundRequests = async () => {
    setRefundLoading(true);
    try {
      const res = await adminService.getRefundRequests({
        page: refundPagination.page,
        limit: refundPagination.limit,
        trangThai: refundFilters.trangThai || undefined,
        keyword: refundFilters.keyword || undefined
      });
      setRefundRequests(res.data || []);
      setRefundPagination(prev => ({
        ...prev,
        total: res.pagination?.total || 0,
        totalPages: res.pagination?.totalPages || 1
      }));
    } catch (error) {
      console.error("Failed to load refund requests:", error);
      showError("Lỗi khi tải danh sách yêu cầu hoàn tiền!");
    } finally {
      setRefundLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'refunds') {
      loadRefundRequests();
    }
  }, [activeTab, refundPagination.page, refundPagination.limit, refundFilters.trangThai, refundFilters.keyword]);

  const handleOpenDetail = async (refund) => {
    setActiveRefund(refund);
    setIsDetailModalOpen(true);
    try {
      const freshData = await adminService.getRefundRequestDetail(refund.MaHoanTien);
      if (freshData) {
        setActiveRefund(freshData);
      }
    } catch (error) {
      console.error("Failed to load refund details:", error);
    }
  };

  const handleOpenApproveConfirm = (refund) => {
    setActiveRefund(refund);
    setIsConfirmApproveOpen(true);
  };

  const handleApproveSubmit = async () => {
    if (!activeRefund) return;
    setIsActionLoading(true);
    try {
      await adminService.approveRefundRequest(activeRefund.MaHoanTien, { GhiChu: "Đã duyệt hoàn tiền." });
      showSuccess("Đã duyệt yêu cầu hoàn tiền thành công!");
      setIsConfirmApproveOpen(false);
      await loadRefundRequests();
      if (isDetailModalOpen && activeRefund) {
        handleOpenDetail(activeRefund);
      }
    } catch (error) {
      console.error("Failed to approve refund:", error);
      showError(error.message || "Lỗi khi duyệt yêu cầu hoàn tiền!");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenRejectModal = (refund) => {
    setActiveRefund(refund);
    setRejectReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!activeRefund || !rejectReasonInput.trim()) return;
    setIsActionLoading(true);
    try {
      await adminService.rejectRefundRequest(activeRefund.MaHoanTien, { LyDoTuChoi: rejectReasonInput });
      showSuccess("Đã từ chối yêu cầu hoàn tiền thành công!");
      setIsRejectModalOpen(false);
      await loadRefundRequests();
      if (isDetailModalOpen && activeRefund) {
        handleOpenDetail(activeRefund);
      }
    } catch (error) {
      console.error("Failed to reject refund:", error);
      showError(error.message || "Lỗi khi từ chối yêu cầu hoàn tiền!");
    } finally {
      setIsActionLoading(false);
    }
  };

  const refundColumns = [
    {
      header: 'Mã hoàn tiền',
      render: (r) => (
        <span 
          onClick={() => handleOpenDetail(r)}
          className="font-bold text-slate-300 hover:text-red-400 text-xs font-mono cursor-pointer transition-colors"
        >
          {r.MaHoanTien.substring(0, 8)}...
        </span>
      )
    },
    {
      header: 'Mã phiếu đặt',
      render: (r) => {
        const maPhieu = r.GiaoDich?.PhieuDatVe?.MaPhieuDat || 'N/A';
        return <span className="font-bold text-red-500 text-xs font-mono">{maPhieu.substring(0, 8)}...</span>;
      }
    },
    {
      header: 'Khách hàng',
      render: (r) => {
        const name = r.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.HoTen || 'N/A';
        return <span className="font-bold text-slate-200 text-sm">{name}</span>;
      }
    },
    {
      header: 'Phim / suất chiếu',
      render: (r) => {
        const phim = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu?.Phim;
        const room = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu?.PhongChieu;
        const sc = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu;
        
        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-bold text-slate-300 text-xs truncate" title={phim?.TenPhim || 'N/A'}>
              {phim?.TenPhim || 'N/A'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium font-mono">
              Phòng: {room?.TenPhong || 'N/A'} | {sc ? `${sc.GioChieu.substring(0, 5)} ${sc.NgayChieu}` : ''}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Số tiền hoàn',
      render: (r) => <span className="font-bold font-mono text-emerald-500 text-sm">{formatPrice(r.SoTienHoan)}</span>
    },
    {
      header: 'Lý do',
      render: (r) => (
        <span className="text-xs text-slate-400 truncate max-w-[150px] inline-block font-medium" title={r.LyDo}>
          {r.LyDo}
        </span>
      )
    },
    {
      header: 'Trạng thái',
      render: (r) => <StatusBadge status={r.TrangThai} />
    },
    {
      header: 'Ngày yêu cầu',
      render: (r) => <span className="text-xs text-slate-500 font-mono">{r.NgayTao ? new Date(r.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : '--'}</span>
    },
    {
      header: 'Ngày xử lý',
      render: (r) => <span className="text-xs text-slate-500 font-mono">{r.NgayHoanTien ? new Date(r.NgayHoanTien).toISOString().replace('T', ' ').substring(0, 10) : '--'}</span>
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button 
            onClick={() => handleOpenDetail(r)}
            className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Chi tiết"
          >
            <Eye size={16} />
          </button>
          {r.TrangThai === 'CHO_XU_LY' ? (
            <>
              <button 
                onClick={() => handleOpenApproveConfirm(r)}
                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-emerald-500/20 text-xs font-bold"
                title="Duyệt"
              >
                <Check size={14} />
                <span>Duyệt</span>
              </button>
              <button 
                onClick={() => handleOpenRejectModal(r)}
                className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-red-500/20 text-xs font-bold"
                title="Từ chối"
              >
                <X size={14} />
                <span>Từ chối</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-600 font-semibold px-2 py-1 select-none">Đã xử lý</span>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý giao dịch & Hoàn tiền"
        subtitle="Giám sát toàn bộ luồng tiền thanh toán vé và xét duyệt các yêu cầu hoàn tiền của khách hàng."
      />

      {/* Tabs Layout */}
      <div className="flex border-b border-white/10 mb-8 gap-2">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full" />}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' ? (
        <>
          {/* Filters and search using AdminToolbar */}
          <AdminToolbar
            searchPlaceholder="Tìm theo mã giao dịch, mã vé, khách hàng, tên phim..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filterSlot={
              <>
                {/* Status Filter */}
                <select 
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
                  value={filters.status || 'All'}
                  onChange={e => setFilterVal('status', e.target.value)}
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Success">Thành công (Success)</option>
                  <option value="Refunded">Đã hoàn tiền (Refunded)</option>
                  <option value="Failed">Thất bại (Failed)</option>
                </select>

                {/* Method Filter */}
                <select 
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
                  value={filters.method || 'All'}
                  onChange={e => setFilterVal('method', e.target.value)}
                >
                  <option value="All">Phương thức thanh toán</option>
                  <option value="PAYOS">PayOS</option>
                  <option value="VNPAY">VNPay</option>
                  <option value="CARD">Thẻ Quốc tế</option>
                  <option value="TIEN_MAT">Tiền mặt</option>
                  <option value="CHUYEN_KHOAN">Chuyển khoản</option>
                  <option value="MOMO">MoMo (cũ)</option>
                </select>
              </>
            }
          />

          {/* Table grid with horizontal scroll wrapper */}
          {loading ? (
            <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
          ) : paginatedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
              Không tìm thấy dữ liệu phù hợp
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full custom-scrollbar">
                <AdminTable columns={columns} data={paginatedItems} rowKey="MaGiaoDich" />
              </div>
              <AdminPagination
                page={page}
                pageSize={pageSize}
                total={totalItems}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Refund Requests Filters */}
          <AdminToolbar
            searchPlaceholder="Tìm theo mã hoàn tiền, mã vé, khách hàng, lý do..."
            searchValue={keywordInput}
            onSearchChange={setKeywordInput}
            filterSlot={
              <select 
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
                value={refundFilters.trangThai}
                onChange={e => {
                  setRefundFilters(prev => ({ ...prev, trangThai: e.target.value }));
                  setRefundPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="CHO_XU_LY">Chờ xử lý (CHO_XU_LY)</option>
                <option value="DA_HOAN">Đã hoàn (DA_HOAN)</option>
                <option value="TU_CHOI">Từ chối (TU_CHOI)</option>
              </select>
            }
          />

          {/* Refund Requests Table */}
          {refundLoading ? (
            <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
          ) : refundRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
              Không tìm thấy dữ liệu phù hợp
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full custom-scrollbar">
                <AdminTable columns={refundColumns} data={refundRequests} rowKey="MaHoanTien" />
              </div>
              <AdminPagination
                page={refundPagination.page}
                pageSize={refundPagination.limit}
                total={refundPagination.total}
                onPageChange={(p) => setRefundPagination(prev => ({ ...prev, page: p }))}
                onPageSizeChange={(s) => setRefundPagination(prev => ({ ...prev, limit: s, page: 1 }))}
              />
            </>
          )}
        </>
      )}

      {/* ----------------------------------------------------
          MODALS & DIALOGS
      ---------------------------------------------------- */}

      {/* Transaction Refund Confirmation Modal */}
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

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
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

          <div className="border border-white/5 rounded-2xl p-5 bg-[#05070a] space-y-3 font-mono text-xs text-slate-400">
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
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-300 text-sm min-h-[80px]"
              placeholder="Nhập lý do hoàn tiền..."
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsRefundModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Đóng
            </button>
            <button 
              type="button"
              disabled={!refundReason.trim()}
              onClick={handleRefundSubmit}
              className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Xác nhận Hoàn tiền
            </button>
          </div>
        </div>
      </Modal>

      {/* Refund Request Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Chi tiết yêu cầu hoàn tiền"
      >
        {activeRefund && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Thông tin khách hàng</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Họ tên:</span>
                  <span className="text-white font-bold">{activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.HoTen || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Số điện thoại:</span>
                  <span className="text-white font-bold font-mono">{activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.SoDienThoai || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-1">Email:</span>
                  <span className="text-white font-bold font-mono">{activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.Email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Ticket & Transaction Information */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Thông tin vé & giao dịch</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Mã phiếu đặt:</span>
                  <span className="text-red-400 font-bold font-mono text-xs truncate block max-w-[200px]" title={activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat || 'N/A'}>
                    {activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Mã giao dịch:</span>
                  <span className="text-white font-bold font-mono text-xs truncate block max-w-[200px]" title={activeRefund.GiaoDich?.MaGiaoDich || 'N/A'}>
                    {activeRefund.GiaoDich?.MaGiaoDich || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Phương thức:</span>
                  <span className="text-white font-bold">{getPaymentMethodLabel(activeRefund.GiaoDich?.PhuongThuc || 'N/A')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Mã giao dịch ngoài:</span>
                  <span className="text-white font-bold font-mono text-xs truncate block max-w-[200px]" title={activeRefund.GiaoDich?.MaGiaoDichNgoai || '--'}>
                    {activeRefund.GiaoDich?.MaGiaoDichNgoai || '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Movie details */}
            <div className="bg-[#05070a] border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Suất chiếu & Ghế đặt</h4>
              {(() => {
                const firstDetail = activeRefund.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0];
                const phim = firstDetail?.GheSuatChieu?.SuatChieu?.Phim;
                const room = firstDetail?.GheSuatChieu?.SuatChieu?.PhongChieu;
                const sc = firstDetail?.GheSuatChieu?.SuatChieu;
                const seatsList = activeRefund.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.map(ct => {
                  const ghe = ct.GheSuatChieu?.Ghe;
                  return ghe ? `${ghe.ViTriDay}${ghe.ViTriCot}` : '';
                }).filter(Boolean).join(', ') || 'N/A';

                return (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phim:</span>
                      <span className="text-white font-bold">{phim?.TenPhim || 'N/A'} ({phim?.ThoiLuong || 0} phút)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phòng chiếu:</span>
                      <span className="text-white font-bold">{room?.TenPhong || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời gian:</span>
                      <span className="text-white font-bold font-mono">{sc ? `${sc.GioChieu.substring(0, 5)} - ${sc.NgayChieu}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Danh sách ghế:</span>
                      <span className="text-amber-500 font-extrabold">{seatsList}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Refund detail info */}
            <div className="border border-white/5 rounded-2xl p-5 bg-[#0a0d14]/95 space-y-3 font-mono text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Mã hoàn tiền:</span>
                <span className="text-white font-bold text-xs truncate max-w-[200px]" title={activeRefund.MaHoanTien}>{activeRefund.MaHoanTien}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tiền hoàn:</span>
                <span className="text-emerald-500 font-extrabold text-sm">{formatPrice(activeRefund.SoTienHoan)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono">Lý do hoàn trả của khách hàng:</span>
                <span className="text-amber-500 font-bold bg-white/[0.02] border border-white/5 p-3 rounded-xl font-sans mt-1 whitespace-pre-wrap">{activeRefund.LyDo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Trạng thái:</span>
                <span><StatusBadge status={activeRefund.TrangThai} /></span>
              </div>
              <div className="flex justify-between">
                <span>Ngày yêu cầu:</span>
                <span className="text-white font-bold">{activeRefund.NgayTao ? new Date(activeRefund.NgayTao).toLocaleString('vi-VN') : '--'}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày xử lý:</span>
                <span className="text-white font-bold">{activeRefund.NgayHoanTien ? new Date(activeRefund.NgayHoanTien).toLocaleDateString('vi-VN') : '--'}</span>
              </div>
            </div>

            {/* Actions if pending */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => setIsDetailModalOpen(false)} 
                className="flex-1 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400 text-center"
              >
                Đóng
              </button>
              {activeRefund.TrangThai === 'CHO_XU_LY' && (
                <>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenApproveConfirm(activeRefund);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest cursor-pointer text-center"
                  >
                    Duyệt hoàn tiền
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenRejectModal(activeRefund);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer text-center"
                  >
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Reason Form Modal */}
      <Modal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        title="Từ chối yêu cầu hoàn tiền"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-red-400 text-sm">
            <AlertTriangle size={24} className="shrink-0" />
            <p>Hành động này sẽ từ chối đơn hoàn tiền. Trạng thái yêu cầu hoàn tiền chuyển thành "Từ chối". Vé và giao dịch đặt vé vẫn sẽ ở trạng thái đã hủy (hoặc giữ nguyên).</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nhập lý do từ chối (LyDoTuChoi)</label>
            <textarea 
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-300 text-sm min-h-[80px]"
              placeholder="Nhập lý do từ chối hoàn tiền..."
              value={rejectReasonInput}
              onChange={e => setRejectReasonInput(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsRejectModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Đóng
            </button>
            <button 
              type="button"
              disabled={!rejectReasonInput.trim() || isActionLoading}
              onClick={handleRejectSubmit}
              className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Xác nhận Từ chối
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog for Approve */}
      <ConfirmDialog 
        isOpen={isConfirmApproveOpen}
        title="Xác nhận duyệt yêu cầu hoàn tiền"
        message="Hệ thống sẽ cập nhật trạng thái đơn hoàn tiền thành 'Đã hoàn' và cập nhật giao dịch tương ứng thành 'Đã hoàn tiền'."
        confirmText="Xác nhận duyệt"
        cancelText="Quay lại"
        variant="warning"
        isLoading={isActionLoading}
        onConfirm={handleApproveSubmit}
        onCancel={() => setIsConfirmApproveOpen(false)}
      />
    </AdminLayout>
  );
};

export default Transactions;
