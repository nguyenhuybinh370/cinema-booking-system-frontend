import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import KPICard from '../../components/Admin/Common/KPICard';
import StatsCharts from '../../components/Admin/Stats/StatsCharts';
import adminService from '../../services/adminService';
import { TrendingUp, Users, Ticket, Film, Download, Calendar, RefreshCw, FileText, Table } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';

const formatPrice = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const Stats = () => {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', maPhim: '', maPhongChieu: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    Promise.all([adminService.getMovies(), adminService.getRooms()]).then(([m, r]) => {
      setMovies(m.filter(x => x.KhaDung !== 0));
      setRooms(r.filter(x => x.KhaDung !== 0));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    adminService.getRevenueStats(filters).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ startDate: '', endDate: '', maPhim: '', maPhongChieu: '' });

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const result = await adminService.exportRevenueReport(format, filters);
      const content = [
        '==================================================',
        'BÁO CÁO DOANH THU & HIỆU SUẤT RẠP CHIẾU PHIM',
        '==================================================',
        `Định dạng: ${format} | Ngày xuất: ${new Date().toLocaleString('vi-VN')}`,
        '--------------------------------------------------',
        `Tổng doanh thu: ${formatPrice(stats.totalRevenue)}`,
        `Vé bán ra: ${stats.ticketsSold} | Lấp đầy: ${stats.occupancyRate} | Phim hot: ${stats.hotMovie}`,
        '--------------------------------------------------',
        ...stats.performanceDetails.map(p => `${p.name}: ${p.shows} suất, ${p.tickets} vé, ${p.fill}`),
        '==================================================',
      ].join('\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = result.fileName;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      showSuccess(`Xuất báo cáo ${format} thành công!`);
      setIsExportModalOpen(false);
    } catch { showError('Lỗi xuất báo cáo!'); }
    finally { setIsExporting(false); }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Thống kê & Doanh thu</h1>
          <p className="text-slate-500">Dashboard phân tích kết quả kinh doanh thời gian thực.</p>
        </div>
        <button onClick={() => setIsExportModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer">
          <Download size={20} /> Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-6 mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Calendar size={14} /> Bộ lọc thống kê
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {[{ label: 'Từ ngày', key: 'startDate', type: 'date' }, { label: 'Đến ngày', key: 'endDate', type: 'date' }].map(({ label, key, type }) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
              <input type={type} value={filters[key]} onChange={e => setFilter(key, e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer" />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chọn phim</label>
            <select value={filters.maPhim} onChange={e => setFilter('maPhim', e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer">
              <option value="" className="bg-[#0f1117]">Tất cả phim</option>
              {movies.map(m => <option key={m.MaPhim} value={m.MaPhim} className="bg-[#0f1117]">{m.TenPhim}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phòng chiếu</label>
            <select value={filters.maPhongChieu} onChange={e => setFilter('maPhongChieu', e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer">
              <option value="" className="bg-[#0f1117]">Tất cả phòng</option>
              {rooms.map(r => <option key={r.MaPhongChieu} value={r.MaPhongChieu} className="bg-[#0f1117]">{r.TenPhong}</option>)}
            </select>
          </div>
          <button onClick={resetFilters}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer h-[42px]">
            <RefreshCw size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Content */}
      {loading || !stats ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-[#0f1117] border border-white/5 rounded-[2.5rem]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4" />
          Đang tính toán dữ liệu báo cáo...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard title="Tổng doanh thu" value={formatPrice(stats.totalRevenue)} icon={TrendingUp} color="bg-red-500" />
            <KPICard title="Số vé bán ra" value={`${stats.ticketsSold} vé`} icon={Ticket} color="bg-amber-500" />
            <KPICard title="Tỷ lệ lấp đầy" value={stats.occupancyRate} icon={Users} color="bg-blue-500" />
            <KPICard title="Phim hot nhất" value={stats.hotMovie} icon={Film} color="bg-emerald-500" />
          </div>
          <StatsCharts stats={stats} />
        </>
      )}

      {/* Export Modal */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Chọn định dạng xuất báo cáo">
        <div className="space-y-6">
          <p className="text-sm text-slate-400">Hệ thống sẽ đóng gói dữ liệu doanh thu dựa trên bộ lọc đang chọn và tải tệp về thiết bị của bạn.</p>
          <div className="bg-white/5 rounded-2xl p-5 space-y-3 font-mono text-xs text-slate-400">
            {[
              { label: 'Từ ngày:', value: filters.startDate || 'Tất cả' },
              { label: 'Đến ngày:', value: filters.endDate || 'Tất cả' },
              { label: 'Phim:', value: filters.maPhim ? movies.find(m => m.MaPhim === filters.maPhim)?.TenPhim : 'Tất cả phim' },
              { label: 'Phòng:', value: filters.maPhongChieu ? rooms.find(r => r.MaPhongChieu === filters.maPhongChieu)?.TenPhong : 'Tất cả phòng' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span>{label}</span><span className="text-white font-bold truncate max-w-[200px] text-right">{value}</span>
              </div>
            ))}
          </div>
          {isExporting ? (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mb-3" />
              <span>Đang xuất dữ liệu...</span>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => handleExport('Excel')} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex flex-col items-center gap-2 cursor-pointer">
                <Table size={24} /><span className="text-xs uppercase tracking-widest">Xuất Excel</span>
              </button>
              <button onClick={() => handleExport('PDF')} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold flex flex-col items-center gap-2 cursor-pointer">
                <FileText size={24} /><span className="text-xs uppercase tracking-widest">Xuất PDF</span>
              </button>
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Stats;
