const StatusBadge = ({ status }) => {
  const getStyles = () => {
    // Shared status types
    switch (status) {
      // General Status
      case 'Active':
      case 1:
      case 'Showing':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      
      case 'Inactive':
      case 0:
      case 'Ended':
      case 'Maintenance':
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      
      case 'Coming Soon':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';

      // Roles (Personnel)
      case 'Admin':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Manager':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Staff':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';

      default:
        return 'bg-slate-500/10 text-slate-400 border-white/5';
    }
  };

  const getLabel = () => {
    if (status === 1) return 'Hoạt động / Sẵn sàng';
    if (status === 0) return 'Vô hiệu / Bảo trì';
    if (status === 'Maintenance') return 'Bảo trì';
    if (status === 'Active') return 'Sẵn sàng';
    return status;
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap uppercase tracking-wider ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
