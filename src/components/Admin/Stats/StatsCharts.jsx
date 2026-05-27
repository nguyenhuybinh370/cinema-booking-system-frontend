import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#a855f7'];
const formatPrice = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const StatsCharts = ({ stats }) => (
  <>
    {/* Revenue line + Room pie */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-8 border-l-4 border-red-500 pl-4">Biểu đồ doanh thu theo ngày</h3>
        <div className="h-[300px]">
          {stats.dailyRevenueData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }} formatter={formatPrice} />
                <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-8 border-l-4 border-blue-500 pl-4">Tỷ lệ lấp đầy theo phòng (%)</h3>
        <div className="h-[300px]">
          {stats.roomOccupancyData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu phòng</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.roomOccupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.roomOccupancyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
                <Legend verticalAlign="bottom" height={36} formatter={(v, e, i) => <span className="text-xs text-slate-400 font-bold">{v}: {stats.roomOccupancyData[i]?.value}%</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>

    {/* Movie bar + performance table */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-8 border-l-4 border-amber-500 pl-4">Top doanh thu theo phim</h3>
        <div className="h-[300px]">
          {stats.movieRevenueData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">Không có dữ liệu phim bán vé</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.movieRevenueData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={120} />
                <Tooltip cursor={{ fill: 'transparent' }} formatter={formatPrice} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white mb-8 border-l-4 border-emerald-500 pl-4">Chi tiết hiệu suất phim chiếu</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              {['Phim', 'Suất', 'Vé bán', 'Tỉ lệ đầy'].map((h, i) => (
                <th key={h} className={`pb-4 text-[10px] font-black uppercase text-slate-500 tracking-wider ${i === 3 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stats.performanceDetails.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-xs text-slate-500">Không có dữ liệu</td></tr>
            ) : stats.performanceDetails.map((row, idx) => (
              <tr key={idx} className="group">
                <td className="py-4 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{row.name}</td>
                <td className="py-4 text-xs text-slate-500">{row.shows}</td>
                <td className="py-4 text-xs text-slate-500">{row.tickets}</td>
                <td className="py-4 text-xs font-mono text-emerald-500 text-right">{row.fill}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default StatsCharts;
