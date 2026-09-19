import AdminTable from '../../../components/Admin/Common/AdminTable';
import StatusBadge from '../../../components/Admin/Common/StatusBadge';
import AdminToolbar from '../../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../../components/Admin/Common/AdminPagination';
import { formatPrice } from './formatPrice';
import { Landmark, CreditCard, DollarSign, RotateCcw } from 'lucide-react';
import { normalizePaymentMethod, getPaymentMethodLabel } from '../../../utils/paymentMethodHelper';
import useBookingTransactions from './useBookingTransactions';
import TransactionRefundModal from './TransactionRefundModal';

export default function BookingTransactionsTab() {
  const model = useBookingTransactions();
  const { loading, loadError, loadTransactions, handleOpenRefund, searchQuery, setSearchQuery, filters, setFilterVal, page, setPage, pageSize, setPageSize, totalItems, paginatedItems } = model;
  const columns = [
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


  return (<>
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
          ) : loadError ? (
            <div role="alert" className="p-6"><p>{loadError}</p><button onClick={loadTransactions}>Thử lại</button></div>
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
    <TransactionRefundModal {...model} />
  </>);
}
