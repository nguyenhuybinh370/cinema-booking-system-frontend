/**
 * Shared status label helpers for Profile sub-components.
 * Returns { text, css } for inline badge rendering.
 * DO NOT change these mappings — they mirror backend enum values.
 */

export const getBookingStatusLabel = (status) => {
  switch (status) {
    case 'CHO_THANH_TOAN':
      return { text: 'Chờ thanh toán', css: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' };
    case 'DA_THANH_TOAN':
      return { text: 'Đã thanh toán', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    case 'DA_HUY':
      return { text: 'Đã hủy', css: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' };
    default:
      return { text: status, css: 'bg-white/5 text-gray-400 border border-white/5' };
  }
};

export const getTransactionStatusLabel = (status) => {
  switch (status) {
    case 'CHO_XU_LY':
      return { text: 'Chờ xử lý', css: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' };
    case 'THANH_CONG':
      return { text: 'Thành công', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    case 'THAT_BAI':
      return { text: 'Thất bại', css: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
    case 'DA_HOAN_TIEN':
      return { text: 'Đã hoàn tiền', css: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
    default:
      return { text: status, css: 'bg-white/5 text-gray-400 border border-white/5' };
  }
};

export const getRefundStatusLabel = (status) => {
  switch (status) {
    case 'CHO_XU_LY':
      return { text: 'Chờ hoàn tiền', css: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    case 'DA_HOAN':
      return { text: 'Đã hoàn tiền', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    case 'TU_CHOI':
      return { text: 'Từ chối hoàn tiền', css: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
    default:
      return { text: status, css: 'bg-white/5 text-gray-400 border border-white/5' };
  }
};
