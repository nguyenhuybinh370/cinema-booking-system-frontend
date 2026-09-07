const statusGroups = {
  success: ['Active', 'Showing', 'Success', 'DA_HOAN', 'Đang hoạt động', 'Đã xuất bản', 'Đang chiếu', 1],
  danger: ['Inactive', 'Ended', 'Maintenance', 'Failed', 'TU_CHOI', 'Đang ẩn', 'Đã lưu trữ', 'Ngừng chiếu', 'Ngừng hoạt động', 0],
  info: ['Coming Soon', 'Refunded', 'DA_HOAN_TIEN', 'Sắp chiếu'],
  warning: ['Pending', 'CHO_XU_LY', 'Bản nháp', 'Đã lên lịch'],
};

const labels = {
  1: 'Hoạt động / Sẵn sàng',
  0: 'Vô hiệu / Bảo trì',
  Maintenance: 'Bảo trì',
  Active: 'Sẵn sàng',
  Success: 'Thành công',
  Failed: 'Thất bại',
  Pending: 'Chờ xử lý',
  Refunded: 'Đã hoàn tiền',
  DA_HOAN_TIEN: 'Đã hoàn tiền',
  CHO_XU_LY: 'Chờ xử lý',
  DA_HOAN: 'Đã hoàn',
  TU_CHOI: 'Từ chối',
};

const StatusBadge = ({ status }) => {
  const tone = Object.entries(statusGroups).find(([, statuses]) => statuses.includes(status))?.[0] || 'neutral';
  return <span className={`admin-status admin-status--${tone}`}><i aria-hidden="true" />{labels[status] || status}</span>;
};

export default StatusBadge;
