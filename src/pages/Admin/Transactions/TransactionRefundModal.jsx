import Modal from '../../../components/Admin/Common/Modal';
import { AlertTriangle } from 'lucide-react';
import { formatPrice } from './formatPrice';

export default function TransactionRefundModal({ isRefundModalOpen, setIsRefundModalOpen, selectedTx, refundReason, setRefundReason, handleRefundSubmit, isSubmitting }) {
  return (<>
      {/* Transaction Refund Confirmation Modal */}
      <Modal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        title="Yêu cầu Hủy đặt vé & Hoàn tiền"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-2xl p-4 text-red-400 text-sm">
            <AlertTriangle size={24} className="shrink-0" />
            <p>Chỉ xác nhận sau khi đã hoàn tiền thủ công. Hệ thống ghi nhận kết quả, hủy vé và giải phóng ghế còn thuộc phiếu đặt; không tự chuyển tiền qua ngân hàng hoặc cổng thanh toán.</p>
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

          <div className="rounded-2xl border p-5">
            <span>Số tiền hoàn: </span>
            <strong>{selectedTx && formatPrice(selectedTx.SoTien)}</strong>
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
              disabled={!refundReason.trim() || isSubmitting}
              onClick={handleRefundSubmit}
              className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:opacity-50 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              {isSubmitting ? 'Đang ghi nhận...' : 'Xác nhận đã hoàn tiền'}
            </button>
          </div>
        </div>
      </Modal>


  </>);
}
