const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      // General Status
      case 'Active':
      case 1:
      case 'Showing':
      case 'Success':
      case 'DA_HOAN':
        return {
          wrapper: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
        };
      
      case 'Inactive':
      case 0:
      case 'Ended':
      case 'Maintenance':
      case 'Failed':
      case 'TU_CHOI':
        return {
          wrapper: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]',
          dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
        };
      
      case 'Coming Soon':
      case 'Refunded':
      case 'DA_HOAN_TIEN':
        return {
          wrapper: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]',
          dot: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
        };

      case 'Pending':
      case 'CHO_XU_LY':
        return {
          wrapper: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
        };

      // Roles (Personnel)
      case 'Admin':
        return {
          wrapper: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]',
          dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
        };
      case 'Manager':
        return {
          wrapper: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
        };
      case 'Staff':
        return {
          wrapper: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]',
          dot: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
        };

      default:
        return {
          wrapper: 'bg-slate-500/10 text-slate-400 border-white/5',
          dot: 'bg-slate-400'
        };
    }
  };

  const getLabel = () => {
    if (status === 1) return 'Hoạt động / Sẵn sàng';
    if (status === 0) return 'Vô hiệu / Bảo trì';
    if (status === 'Maintenance') return 'Bảo trì';
    if (status === 'Active') return 'Sẵn sàng';
    if (status === 'Success') return 'Thành công';
    if (status === 'Failed') return 'Thất bại';
    if (status === 'Pending') return 'Chờ xử lý';
    if (status === 'Refunded' || status === 'DA_HOAN_TIEN') return 'Đã hoàn tiền';
    if (status === 'CHO_XU_LY') return 'Chờ xử lý';
    if (status === 'DA_HOAN') return 'Đã hoàn';
    if (status === 'TU_CHOI') return 'Từ chối';
    return status;
  };

  const styles = getStyles();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${styles.wrapper}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
