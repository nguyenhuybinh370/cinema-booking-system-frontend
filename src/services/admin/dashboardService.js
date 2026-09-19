import axiosClient from '../../api/axiosClient';

export const cinemaDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);

export function mapDashboard(revenue, showtimes, refunds) {
  const capacity = showtimes.reduce((sum, show) => sum + Number(show.TongSoGhe), 0);
  const occupied = showtimes.reduce((sum, show) => sum + Number(show.SoGheDaDat), 0);
  return {
    revenue: Number(revenue.TongDoanhThu),
    pendingRefunds: refunds.pagination.total,
    occupancy: capacity ? (occupied / capacity * 100).toFixed(1) : '0.0',
    showtimes: [...showtimes].sort((a, b) => a.GioChieu.localeCompare(b.GioChieu)),
  };
}

export async function getDashboard(day = cinemaDay()) {
  const [revenue, showtimes, refunds] = await Promise.all([
    axiosClient.get('/admin/thong-ke/doanh-thu'),
    axiosClient.get('/admin/thong-ke/ti-le-ghe', { params: { tuNgay: day, denNgay: day } }),
    axiosClient.get('/admin/hoan-tien', { params: { trangThai: 'CHO_XU_LY', limit: 1 } }),
  ]);
  return { ...mapDashboard(revenue, showtimes, refunds), day };
}
