import { CalendarClock, Download, Film, Images, NotebookPen } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import KPICard from '../../components/Admin/Common/KPICard';
import { banners, blogPosts, dashboardTasks, todayShowtimes } from '../../constants/adminContentData';
import { showSuccess } from '../../utils/toastHelper';

const Stats = () => {
  const handleExport = () => {
    const report = [
      'NEXCINEMA — TỔNG QUAN VẬN HÀNH',
      `Ngày xuất: ${new Date().toLocaleString('vi-VN')}`,
      '',
      `Suất chiếu hôm nay: ${todayShowtimes.length}`,
      `Bài viết đã xuất bản: ${blogPosts.filter((post) => post.status === 'Đã xuất bản').length}`,
      `Banner đang hoạt động: ${banners.filter((banner) => banner.status === 'Đang hoạt động').length}`,
      `Nội dung cần xử lý: ${dashboardTasks.length}`,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexcinema-overview-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showSuccess('Đã xuất báo cáo tổng quan.');
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Tổng quan" subtitle="Theo dõi vận hành rạp và chất lượng nội dung cần xử lý." action={<AdminButton variant="outline" icon={Download} onClick={handleExport}>Xuất báo cáo</AdminButton>} />

      <div className="admin-metrics-grid">
        <KPICard title="Suất chiếu hôm nay" value={todayShowtimes.length} icon={CalendarClock} color="bg-blue-500" />
        <KPICard title="Phim đang chiếu" value="8" icon={Film} color="bg-red-500" />
        <KPICard title="Bài viết đã xuất bản" value={blogPosts.filter((post) => post.status === 'Đã xuất bản').length} icon={NotebookPen} color="bg-emerald-500" />
        <KPICard title="Banner đang hoạt động" value={banners.filter((banner) => banner.status === 'Đang hoạt động').length} icon={Images} color="bg-amber-500" />
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-dashboard-panel admin-dashboard-panel--wide">
          <div className="admin-panel-heading"><div><h2>Lịch chiếu hôm nay</h2><p>Các suất chiếu gần nhất và mức lấp đầy hiện tại.</p></div><Link to="/admin/showtimes">Xem tất cả</Link></div>
          <div className="admin-showtime-list">
            {todayShowtimes.map((showtime) => (
              <div key={showtime.id}><time>{showtime.time}</time><span><strong>{showtime.movie}</strong><small>{showtime.room}</small></span><em>{showtime.occupancy}</em></div>
            ))}
          </div>
        </section>

        <section className="admin-dashboard-panel">
          <div className="admin-panel-heading"><div><h2>Cần xử lý</h2><p>{dashboardTasks.length} mục ảnh hưởng nội dung website.</p></div></div>
          <div className="admin-task-list">
            {dashboardTasks.map((task) => (
              <Link key={task.id} to={task.href}><span className={`admin-task-dot admin-task-dot--${task.tone}`} /><span><strong>{task.title}</strong><small>{task.meta}</small></span></Link>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-quick-links" aria-label="Truy cập nhanh">
        <div><h2>Truy cập nhanh</h2><p>Đi thẳng tới các tác vụ quản trị thường dùng.</p></div>
        <nav><Link to="/admin/movies/new">Thêm phim</Link><Link to="/admin/showtimes">Xếp lịch chiếu</Link><Link to="/admin/blog/new">Viết bài</Link><Link to="/admin/site/banners/new">Tạo banner</Link></nav>
      </section>
    </AdminLayout>
  );
};

export default Stats;
