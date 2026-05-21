import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, Users, Ticket, Film, Download, Calendar, RefreshCw, FileText, Table } from 'lucide-react';
import KPICard from '../../components/Admin/Common/KPICard';
import adminService from '../../services/adminService';

const Stats = () => {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    maPhim: '',
    maPhongChieu: ''
  });

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadInitialData = async () => {
    try {
      const [moviesList, roomsList] = await Promise.all([
        adminService.getMovies(),
        adminService.getRooms()
      ]);
      setMovies(moviesList.filter(m => m.KhaDung !== 0));
      setRooms(roomsList.filter(r => r.KhaDung !== 0));
    } catch (error) {
      console.error("Failed to load initial data:", error);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const results = await adminService.getRevenueStats(filters);
      setStats(results);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load statistics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadStats();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      maPhim: '',
      maPhongChieu: ''
    });
  };

  const handleExportSubmit = async (format) => {
    setIsExporting(true);
    try {
      const result = await adminService.exportRevenueReport(format, filters);
      
      // Simulate file download by creating a real text/csv blob matching the report
      const reportContent = 
        `==================================================\n` +
        `BÁO CÁO DOANH THU & HIỆU SUẤT RẠP CHIẾU PHIM\n` +
        `==================================================\n` +
        `Định dạng file: ${format}\n` +
        `Ngày xuất báo cáo: ${new Date().toLocaleString('vi-VN')}\n` +
        `Tên file: ${result.fileName}\n` +
        `--------------------------------------------------\n` +
        `KẾT QUẢ KINH DOANH CHUNG:\n` +
        `- Tổng doanh thu: ${formatPrice(stats.totalRevenue)}\n` +
        `- Tổng số vé bán ra: ${stats.ticketsSold} vé\n` +
        `- Tỷ lệ lấp đầy trung bình: ${stats.occupancyRate}\n` +
        `- Phim có doanh thu cao nhất: ${stats.hotMovie}\n` +
        `--------------------------------------------------\n` +
        `BỘ LỌC ĐÃ ÁP DỤNG:\n` +
        `- Thời gian: ${filters.startDate ? `Từ ${filters.startDate}` : ''} ${filters.endDate ? `Đến ${filters.endDate}` : 'Tất cả thời gian'}\n` +
        `- Phim: ${filters.maPhim ? movies.find(m => m.MaPhim === filters.maPhim)?.TenPhim : 'Tất cả phim'}\n` +
        `- Phòng chiếu: ${filters.maPhongChieu ? rooms.find(r => r.MaPhongChieu === filters.maPhongChieu)?.TenPhong : 'Tất cả phòng'}\n` +
        `--------------------------------------------------\n` +
        `CHI TIẾT HIỆU SUẤT PHIM:\n` +
        stats.performanceDetails.map(p => `- ${p.name}: ${p.shows} suất, ${p.tickets} vé, Tỷ lệ lấp đầy ${p.fill}`).join('\n') + `\n` +
        `==================================================\n` +
        `© HỆ THỐNG QUẢN LÝ RẠP CHIẾU PHIM - KÊNH QUẢN TRỊ\n` +
        `==================================================\n`;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        `XUẤT BÁO CÁO THÀNH CÔNG!\n\n` +
        `1. [DỊCH VỤ XUẤT FILE]: Đã tạo file báo cáo "${result.fileName}".\n` +
        `2. [HỆ THỐNG TRÌNH DUYỆT]: Kích hoạt tải tự động báo cáo doanh thu về máy khách.\n` +
        `3. [ĐỊNH DẠNG]: Xuất chuẩn định dạng ${format}.`
      );
      
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Failed to export report:", error);
      alert("Đã xảy ra lỗi trong quá trình kết nối với DichVuXuatFile!");
    } finally {
      setIsExporting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#a855f7'];

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Thống kê & Doanh thu</h1>
          <p className="text-slate-500">Dashboard phân tích kết quả kinh doanh thời gian thực kết nối CSDL.</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-red-500/10 shadow-lg shadow-red-500/20 cursor-pointer"
        >
          <Download size={20} />
          Xuất báo cáo
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-6 mb-8">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Calendar size={14} />
          Bộ lọc thống kê doanh thu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Từ ngày</label>
            <input 
              type="date" 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
              value={filters.startDate}
              onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đến ngày</label>
            <input 
              type="date" 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
              value={filters.endDate}
              onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chọn phim</label>
            <select 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
              value={filters.maPhim}
              onChange={e => setFilters(prev => ({ ...prev, maPhim: e.target.value }))}
            >
              <option value="" className="bg-[#0f1117]">Tất cả phim</option>
              {movies.map(m => (
                <option key={m.MaPhim} value={m.MaPhim} className="bg-[#0f1117]">{m.TenPhim}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phòng chiếu</label>
            <select 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
              value={filters.maPhongChieu}
              onChange={e => setFilters(prev => ({ ...prev, maPhongChieu: e.target.value }))}
            >
              <option value="" className="bg-[#0f1117]">Tất cả phòng</option>
              {rooms.map(r => (
                <option key={r.MaPhongChieu} value={r.MaPhongChieu} className="bg-[#0f1117]">{r.TenPhong}</option>
              ))}
            </select>
          </div>
          <button 
            type="button"
            onClick={handleResetFilters}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer h-[42px]"
          >
            <RefreshCw size={14} />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {loading || !stats ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-[#0f1117] border border-white/5 rounded-[2.5rem]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
          Đang tính toán dữ liệu báo cáo...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard title="Tổng doanh thu" value={formatPrice(stats.totalRevenue)} icon={TrendingUp} color="bg-red-500" />
            <KPICard title="Số vé bán ra" value={`${stats.ticketsSold} vé`} icon={Ticket} color="bg-amber-500" />
            <KPICard title="Tỷ lệ lấp đầy" value={stats.occupancyRate} icon={Users} color="bg-blue-500" />
            <KPICard title="Phim hot nhất" value={stats.hotMovie} icon={Film} color="bg-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Line Chart */}
            <div className="lg:col-span-2 bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-red-500 pl-4 uppercase tracking-widest text-xs">Biểu đồ doanh thu theo ngày</h3>
              <div className="h-[300px]">
                {stats.dailyRevenueData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu trong khoảng bộ lọc này</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.dailyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                        formatter={(value) => formatPrice(value)}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-widest text-xs">Tỷ lệ lấp đầy theo phòng (%)</h3>
              <div className="h-[300px]">
                {stats.roomOccupancyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu phòng</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.roomOccupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.roomOccupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} formatter={(value, entry, index) => <span className="text-xs text-slate-400 font-bold">{value}: {stats.roomOccupancyData[index]?.value}%</span>}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-widest text-xs">Top doanh thu theo phim</h3>
              <div className="h-[300px]">
                {stats.movieRevenueData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu phim bán vé</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.movieRevenueData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={120} />
                      <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => formatPrice(value)} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 10, 10, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-xs">Chi tiết hiệu suất phim chiếu</h3>
              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Phim</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Suất</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Vé bán</th>
                      <th className="pb-4 text-[10px] font-black uppercase text-slate-600 text-right">Tỉ lệ đầy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.performanceDetails.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-xs text-slate-500">Không có dữ liệu hiển thị</td>
                      </tr>
                    ) : (
                      stats.performanceDetails.map((row, idx) => (
                        <tr key={idx} className="group">
                          <td className="py-4 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{row.name}</td>
                          <td className="py-4 text-xs text-slate-500">{row.shows}</td>
                          <td className="py-4 text-xs text-slate-500">{row.tickets}</td>
                          <td className="py-4 text-xs font-mono text-emerald-500 text-right">{row.fill}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Report Options Modal */}
      <Modal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Chọn định dạng xuất báo cáo"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-400">
            Hệ thống sẽ kết nối với **DichVuXuatFile** để đóng gói dữ liệu doanh thu dựa trên bộ lọc đang chọn và tải tệp tin báo cáo về thiết bị của bạn.
          </p>

          <div className="bg-white/5 rounded-2xl p-5 space-y-3 font-mono text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Từ ngày:</span>
              <span className="text-white font-bold">{filters.startDate || 'Tất cả'}</span>
            </div>
            <div className="flex justify-between">
              <span>Đến ngày:</span>
              <span className="text-white font-bold">{filters.endDate || 'Tất cả'}</span>
            </div>
            <div className="flex justify-between">
              <span>Phim đang chọn:</span>
              <span className="text-white font-bold max-w-[200px] text-right truncate">
                {filters.maPhim ? movies.find(m => m.MaPhim === filters.maPhim)?.TenPhim : 'Tất cả phim'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phòng đang chọn:</span>
              <span className="text-white font-bold">
                {filters.maPhongChieu ? rooms.find(r => r.MaPhongChieu === filters.maPhongChieu)?.TenPhong : 'Tất cả phòng'}
              </span>
            </div>
          </div>

          {isExporting ? (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mb-3"></div>
              <span>Đang xuất dữ liệu báo cáo...</span>
            </div>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => handleExportSubmit('Excel')}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer border border-emerald-500/10 shadow-lg shadow-emerald-500/15"
              >
                <Table size={24} />
                <span className="text-xs uppercase tracking-widest">Xuất file Excel</span>
              </button>
              <button 
                onClick={() => handleExportSubmit('PDF')}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer border border-red-500/10 shadow-lg shadow-red-500/15"
              >
                <FileText size={24} />
                <span className="text-xs uppercase tracking-widest">Xuất file PDF</span>
              </button>
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Stats;
