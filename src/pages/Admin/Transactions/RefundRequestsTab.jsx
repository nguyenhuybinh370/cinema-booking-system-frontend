import AdminTable from '../../../components/Admin/Common/AdminTable';
import StatusBadge from '../../../components/Admin/Common/StatusBadge';
import AdminToolbar from '../../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../../components/Admin/Common/AdminPagination';
import { formatPrice } from './formatPrice';
import { AlertTriangle, Eye, Check, X } from 'lucide-react';
import Modal from '../../../components/Admin/Common/Modal';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import useRefundRequests from './useRefundRequests';
import RefundDetailModal from './RefundDetailModal';

export default function RefundRequestsTab({ activeTab }) {
  const model = useRefundRequests(activeTab);
  const { refundRequests, refundLoading, refundPagination, setRefundPagination, refundFilters, setRefundFilters, keywordInput, setKeywordInput, isConfirmApproveOpen, setIsConfirmApproveOpen, isRejectModalOpen, setIsRejectModalOpen, rejectReasonInput, setRejectReasonInput, isActionLoading, handleOpenDetail, handleOpenApproveConfirm, handleApproveSubmit, handleOpenRejectModal, handleRejectSubmit } = model;
  const refundColumns = [
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
            aria-label="Xem chi tiết yêu cầu hoàn tiền"
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


  return (<>
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
    <RefundDetailModal {...model} />
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
        message="Chỉ xác nhận sau khi đã hoàn tiền thủ công. Hệ thống ghi nhận kết quả và hủy vé; thao tác này không tự chuyển tiền."
        confirmText="Xác nhận duyệt"
        cancelText="Quay lại"
        variant="warning"
        isLoading={isActionLoading}
        onConfirm={handleApproveSubmit}
        onCancel={() => setIsConfirmApproveOpen(false)}
      />

  </>);
}
