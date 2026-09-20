import { Clock, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const groupByMovie = (showtimes) => Object.values(showtimes.reduce((groups, showtime) => {
  const key = showtime.MaPhim || showtime.TenPhim;
  groups[key] ??= { movieId: showtime.MaPhim, title: showtime.TenPhim, slots: [] };
  groups[key].slots.push(showtime);
  return groups;
}, {}));

const TodayShowtimes = ({ showtimes }) => {
  const groups = groupByMovie(showtimes);
  return (
    <section id="lich-chieu-section" className="client-section scroll-mt-24">
      <p className="client-eyebrow">Đặt nhanh</p>
      <h2 className="client-section-title">Lịch chiếu hôm nay</h2>
      <div className="mt-7 overflow-hidden rounded-2xl border border-white/8 bg-(--client-surface)">
        {groups.length === 0 ? (
          <div className="client-empty-state border-0"><MonitorPlay className="mx-auto mb-3 text-slate-500" />Hôm nay chưa có suất chiếu.</div>
        ) : groups.slice(0, 5).map((group) => (
          <article key={group.movieId || group.title} className="grid gap-4 border-b border-white/8 p-5 last:border-0 md:grid-cols-[minmax(180px,1fr)_3fr] md:items-center">
            <div>
              <h3 className="font-bold text-white">{group.title}</h3>
              <Link to={`/movie/${group.movieId}`} className="mt-1 inline-block text-xs text-slate-400 hover:text-(--client-secondary)">Xem chi tiết phim</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.slots.slice(0, 8).map((slot) => (
                <Link key={slot.MaSuatChieu} to={`/booking/${slot.MaSuatChieu}`} className="showtime-chip">
                  <Clock size={14} />{slot.GioChieu}<span>{slot.TenPhong}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TodayShowtimes;
