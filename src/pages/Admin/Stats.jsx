import { useEffect, useState } from 'react';
import { CalendarClock, RefreshCw, ReceiptText, Theater, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import KPICard from '../../components/Admin/Common/KPICard';
import { AdminEmptyState, AdminErrorState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import { getDashboard } from '../../services/admin/dashboardService';

export default function Stats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);
  const reload = () => { setLoading(true); setError(false); setVersion(value => value + 1); };
  useEffect(() => {
    let ignore = false;
    getDashboard().then(result => { if (!ignore) setData(result); })
      .catch(() => { if (!ignore) setError(true); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [version]);

  return <AdminLayout>
    <AdminPageHeader title="Tổng quan" subtitle="Dữ liệu từ API. Lịch chiếu theo ngày tại Việt Nam." action={<AdminButton variant="outline" icon={RefreshCw} onClick={reload} disabled={loading}>Làm mới</AdminButton>} />
    {loading ? <AdminLoadingSkeleton /> : error ? <AdminErrorState onRetry={reload} /> : data && <>
      <div className="admin-metrics-grid">
        <KPICard title="Doanh thu còn hiệu lực · toàn kỳ" value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.revenue)} icon={WalletCards} color="bg-emerald-500" />
        <KPICard title={'Suất chiếu · ' + data.day} value={data.showtimes.length} icon={CalendarClock} color="bg-blue-500" />
        <KPICard title="Lấp đầy ghế · hôm nay" value={data.occupancy + '%'} icon={Theater} color="bg-red-500" />
        <KPICard title="Yêu cầu hoàn tiền chờ xử lý" value={data.pendingRefunds} icon={ReceiptText} color="bg-amber-500" />
      </div>
      <section className="admin-dashboard-panel">
        <div className="admin-panel-heading"><div><h2>Lịch chiếu hôm nay</h2><p>Ghế đã đặt / tổng ghế. Doanh thu toàn kỳ loại giao dịch đã hoàn và đơn đã hủy.</p></div><Link to="/admin/showtimes">Quản lý suất chiếu</Link></div>
        {data.showtimes.length === 0 ? <AdminEmptyState title="Hôm nay chưa có suất chiếu" /> : <div className="admin-showtime-list">
          {data.showtimes.map(show => <div key={show.MaSuatChieu}>
            <time>{show.GioChieu.slice(11, 16)}</time>
            <span><strong>{show.TenPhim}</strong><small>{show.TenPhong}</small></span>
            <em>{show.SoGheDaDat}/{show.TongSoGhe} ghế</em>
          </div>)}
        </div>}
      </section>
    </>}
    <section className="admin-quick-links" aria-label="Truy cập nhanh">
      <div><h2>Truy cập nhanh</h2><p>Các luồng đã kết nối backend.</p></div>
      <nav><Link to="/admin/movies/new">Thêm phim</Link><Link to="/admin/showtimes">Xếp lịch chiếu</Link><Link to="/admin/transactions">Xử lý hoàn tiền</Link></nav>
    </section>
  </AdminLayout>;
}
