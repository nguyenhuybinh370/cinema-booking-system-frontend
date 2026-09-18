import Modal from '../../../components/Admin/Common/Modal';
import StatusBadge from '../../../components/Admin/Common/StatusBadge';
import { getPaymentMethodLabel } from '../../../utils/paymentMethodHelper';
import { showSuccess } from '../../../utils/toastHelper';
import { formatPrice } from './formatPrice';

export default function RefundDetailModal({ isDetailModalOpen, setIsDetailModalOpen, activeRefund, handleOpenApproveConfirm, handleOpenRejectModal }) {
  return (<>
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

            {/* Customer Bank Info & VietQR */}
            {activeRefund.SoTaiKhoan && activeRefund.TenNganHang && (
              <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  Thông tin hoàn tiền & mã VietQR
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Ngân hàng nhận:</span>
                      <span className="text-white font-bold">{activeRefund.TenNganHang}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Số tài khoản:</span>
                      <span className="text-white font-bold font-mono text-sm select-all flex items-center gap-1">
                        {activeRefund.SoTaiKhoan}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeRefund.SoTaiKhoan);
                            showSuccess('Đã sao chép số tài khoản!');
                          }}
                          className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                        >
                          (Sao chép)
                        </button>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Chủ tài khoản:</span>
                      <span className="text-white font-bold uppercase">{activeRefund.TenChuTaiKhoan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Số tiền hoàn:</span>
                      <span className="text-emerald-400 font-extrabold text-sm">{formatPrice(activeRefund.SoTienHoan)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-white/10 shrink-0 self-center">
                    <img
                      src={`https://img.vietqr.io/image/${(() => {
                        const lower = activeRefund.TenNganHang.toLowerCase();
                        if (lower.includes('mbbank') || lower.includes('quân đội') || lower === 'mb') return 'mbbank';
                        if (lower.includes('vietcombank') || lower.includes('ngoại thương') || lower === 'vcb') return 'vietcombank';
                        if (lower.includes('techcombank') || lower.includes('kỹ thương') || lower === 'tcb') return 'techcombank';
                        if (lower.includes('bidv') || lower.includes('đầu tư') || lower === 'bidv') return 'bidv';
                        if (lower.includes('vietinbank') || lower.includes('công thương') || lower === 'ctg') return 'vietinbank';
                        if (lower.includes('agribank') || lower.includes('nông nghiệp') || lower === 'agr') return 'agribank';
                        if (lower.includes('acb') || lower.includes('á châu') || lower === 'acb') return 'acb';
                        if (lower.includes('tpbank') || lower.includes('tiên phong') || lower === 'tpb') return 'tpbank';
                        if (lower.includes('vpbank') || lower.includes('thịnh vượng') || lower === 'vpb') return 'vpbank';
                        if (lower.includes('sacombank') || lower.includes('sài gòn thương tín') || lower === 'stb') return 'sacombank';
                        return lower.replace(/[^a-z0-9]/g, '');
                      })()}-${activeRefund.SoTaiKhoan}-compact.png?amount=${activeRefund.SoTienHoan}&addInfo=${encodeURIComponent(`Hoan tien ve ${activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat?.substring(0, 8) || ''}`)}&accountName=${encodeURIComponent(activeRefund.TenChuTaiKhoan)}`}
                      alt="VietQR Code"
                      className="w-40 h-40 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[10px] text-slate-800 font-bold mt-1">Quét QR để chuyển khoản nhanh</span>
                  </div>
                </div>
              </div>
            )}

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


  </>);
}
