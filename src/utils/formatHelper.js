export const formatVND = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(amount);
};

/**
 * Format a Date object or ISO string to "HH:mm - DD/MM/YYYY"
 * Works with Date objects (from getShowtimeStartFromBooking) or plain ISO strings.
 */
export const formatDateTime = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${timeStr} - ${dateStr}`;
};
