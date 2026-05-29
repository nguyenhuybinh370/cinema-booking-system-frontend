import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import KPICard from '../../components/Admin/Common/KPICard';
import StatsCharts from '../../components/Admin/Stats/StatsCharts';
import adminService from '../../services/adminService';
import { TrendingUp, Users, Ticket, Film, Download, Calendar, RefreshCw, FileText, Table } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';

import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';

const formatPrice = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const Stats = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', maPhim: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    adminService.getMovies().then(m => {
      setMovies(m.filter(x => x.KhaDung !== 0));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    adminService.getRevenueStats(filters).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ startDate: '', endDate: '', maPhim: '' });

  const handleExport = async (format) => {
    if (!stats) return;
    setIsExporting(true);
    try {
      const result = await adminService.exportRevenueReport(format, filters);
      
      if (format === 'Excel') {
        const excelContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
            <style>
              table { border-collapse: collapse; }
              td, th { border: 1px solid #ccc; padding: 5px; }
              th { background-color: #f2f2f2; font-weight: bold; }
            </style>
          </head>
          <body>
            <table>
              <tr><th colspan="4" style="font-size:16px;font-weight:bold;text-align:center;">BÁO CÁO DOANH THU & HIỆU SUẤT RẠP CHIẾU PHIM</th></tr>
              <tr><td colspan="4" style="text-align:center;">Ngày xuất: ${new Date().toLocaleString('vi-VN')}</td></tr>
              <tr><td colspan="4" style="text-align:center;">Từ ngày: ${filters.startDate || 'Tất cả'} | Đến ngày: ${filters.endDate || 'Tất cả'}</td></tr>
              <tr></tr>
              <tr style="background-color:#e2e8f0;font-weight:bold;">
                <th>Tổng doanh thu</th>
                <th>Vé bán ra</th>
                <th>Tỷ lệ lấp đầy</th>
                <th>Phim hot nhất</th>
              </tr>
              <tr>
                <td>${formatPrice(stats.totalRevenue)}</td>
                <td>${stats.ticketsSold}</td>
                <td>${stats.occupancyRate}</td>
                <td>${stats.hotMovie}</td>
              </tr>
              <tr></tr>
              <tr><th colspan="4" style="font-size:14px;font-weight:bold;text-align:left;background-color:#cbd5e1;">CHI TIẾT HIỆU SUẤT CÁC PHIM</th></tr>
              <tr style="background-color:#e2e8f0;font-weight:bold;">
                <th>Tên Phim</th>
                <th>Số Suất Chiếu</th>
                <th>Số Vé Bán Ra</th>
                <th>Tỷ Lệ Lấp Đầy</th>
              </tr>
              ${stats.performanceDetails.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.shows}</td>
                  <td>${p.tickets}</td>
                  <td>${p.fill}</td>
                </tr>
              `).join('')}
            </table>
          </body>
          </html>
        `;
        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = result.fileName;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        showSuccess(`Xuất báo cáo Excel thành công!`);
        setIsExportModalOpen(false);
      } else if (format === 'PDF') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Báo cáo doanh thu</title>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background-color: #fff; }
                  .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 30px; }
                  .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; color: #0f172a; }
                  .header p { margin: 5px 0 0 0; font-size: 14px; color: #64748b; }
                  .meta-table, .data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  .meta-table td { padding: 8px 0; font-size: 14px; color: #334155; }
                  .meta-table td.label { font-weight: bold; width: 150px; color: #475569; }
                  .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-size: 14px; }
                  .data-table th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
                  .data-table tr:nth-child(even) { background-color: #f8fafc; }
                  .kpi-container { display: flex; gap: 20px; margin-bottom: 40px; }
                  .kpi-card { flex: 1; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; background-color: #f8fafc; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                  .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; font-weight: bold; letter-spacing: 0.05em; }
                  .kpi-value { font-size: 20px; font-weight: 800; color: #0f172a; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Báo cáo doanh thu & hiệu suất rạp</h1>
                  <p>Ngày xuất: ${new Date().toLocaleString('vi-VN')}</p>
                </div>
                
                <table class="meta-table">
                  <tr>
                    <td class="label">Từ ngày:</td>
                    <td>${filters.startDate || 'Tất cả'}</td>
                    <td class="label">Đến ngày:</td>
                    <td>${filters.endDate || 'Tất cả'}</td>
                  </tr>
                  <tr>
                    <td class="label">Bộ lọc phim:</td>
                    <td colspan="3">${filters.maPhim ? movies.find(m => m.MaPhim === filters.maPhim)?.TenPhim : 'Tất cả phim'}</td>
                  </tr>
                </table>
                
                <div class="kpi-container">
                  <div class="kpi-card">
                    <div class="kpi-title">Tổng doanh thu</div>
                    <div class="kpi-value">${formatPrice(stats.totalRevenue)}</div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-title">Vé bán ra</div>
                    <div class="kpi-value">${stats.ticketsSold} vé</div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-title">Tỷ lệ lấp đầy</div>
                    <div class="kpi-value">${stats.occupancyRate}</div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-title">Phim hot nhất</div>
                    <div class="kpi-value">${stats.hotMovie}</div>
                  </div>
                </div>
                
                <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 15px;">Chi tiết hiệu suất các phim</h2>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Tên Phim</th>
                      <th>Số Suất Chiếu</th>
                      <th>Số Vé Bán Ra</th>
                      <th>Tỷ Lệ Lấp Đầy</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${stats.performanceDetails.map(p => `
                      <tr>
                        <td style="font-weight: 600;">${p.name}</td>
                        <td>${p.shows}</td>
                        <td>${p.tickets}</td>
                        <td>${p.fill}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                
                <script>
                  window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          showSuccess(`Xuất báo cáo PDF thành công!`);
          setIsExportModalOpen(false);
        } else {
          showError('Không thể mở cửa sổ in ấn PDF!');
        }
      }
    } catch (err) {
      console.error(err);
      showError('Lỗi xuất báo cáo!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Dashboard & Doanh thu"
        subtitle="Dashboard phân tích kết quả kinh doanh thời gian thực."
        action={
          !loading && stats && (
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 transition-all text-sm"
            >
              <Download size={20} /> Xuất báo cáo
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Calendar size={14} className="text-red-500" /> Bộ lọc dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {[{ label: 'Từ ngày', key: 'startDate', type: 'date' }, { label: 'Đến ngày', key: 'endDate', type: 'date' }].map(({ label, key, type }) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
              <input type={type} value={filters[key]} onChange={e => setFilter(key, e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 cursor-pointer transition-all" />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chọn phim</label>
            <select value={filters.maPhim} onChange={e => setFilter('maPhim', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 cursor-pointer transition-all [&>option]:bg-[#0a0d14]">
              <option value="">Tất cả phim</option>
              {movies.map(m => <option key={m.MaPhim} value={m.MaPhim}>{m.TenPhim}</option>)}
            </select>
          </div>
          <button onClick={resetFilters}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer h-[42px] transition-all active:scale-95">
            <RefreshCw size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Content */}
      {loading || !stats ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl">
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
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 font-mono text-xs text-slate-400">
            {[
              { label: 'Từ ngày:', value: filters.startDate || 'Tất cả' },
              { label: 'Đến ngày:', value: filters.endDate || 'Tất cả' },
              { label: 'Phim:', value: filters.maPhim ? movies.find(m => m.MaPhim === filters.maPhim)?.TenPhim : 'Tất cả phim' },
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
              <button onClick={() => handleExport('Excel')} className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold flex flex-col items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
                <Table size={24} /><span className="text-xs uppercase tracking-widest">Xuất Excel</span>
              </button>
              <button onClick={() => handleExport('PDF')} className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-bold flex flex-col items-center gap-2 cursor-pointer transition-all shadow-lg shadow-red-500/10 active:scale-95">
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
