
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, Users, Ticket, Film, Download } from 'lucide-react';
import KPICard from '../../components/Admin/Common/KPICard';

const Stats = () => {
  const lineData = [
    { day: '07/05', revenue: 4500000 },
    { day: '08/05', revenue: 5200000 },
    { day: '09/05', revenue: 4800000 },
    { day: '10/05', revenue: 6100000 },
    { day: '11/05', revenue: 8500000 },
    { day: '12/05', revenue: 9200000 },
    { day: '13/05', revenue: 7800000 },
  ];

  const barData = [
    { name: 'Lật Mặt 7', value: 125000000 },
    { name: 'Hành Tinh Khỉ', value: 85000000 },
    { name: 'Dune 2', value: 45000000 },
    { name: 'Kung Fu Panda 4', value: 32000000 },
  ];

  const pieData = [
    { name: 'Phòng 01', value: 75 },
    { name: 'Phòng 02', value: 60 },
    { name: 'Phòng 03', value: 45 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];


  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Thống kê & Doanh thu</h1>
          <p className="text-slate-500">Dashboard phân tích kinh doanh thời gian thực.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-white/10">
          <Download size={20} />
          Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Tổng doanh thu" value="452.800.000đ" icon={TrendingUp} trend="12.5" color="bg-red-500" />
        <KPICard title="Số vé bán ra" value="5,240" icon={Ticket} trend="8.2" color="bg-amber-500" />
        <KPICard title="Tỷ lệ lấp đầy" value="68.4%" icon={Users} trend="4.1" color="bg-blue-500" />
        <KPICard title="Phim hot nhất" value="Lật Mặt 7" icon={Film} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-red-500 pl-4 uppercase tracking-widest text-xs">Doanh thu 7 ngày gần nhất</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-widest text-xs">Tỷ lệ lấp đầy rạp (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-widest text-xs">Top doanh thu theo phim</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4 uppercase tracking-widest text-xs">Chi tiết hiệu suất</h3>
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Phim</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Suất</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-slate-600">Vé</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-slate-600 text-right">Lấp đầy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Lật Mặt 7', shows: 45, tickets: 1200, fill: '85%' },
                  { name: 'Hành Tinh Khỉ', shows: 38, tickets: 950, fill: '72%' },
                  { name: 'Dune 2', shows: 24, tickets: 420, fill: '55%' },
                ].map((row, idx) => (
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
      </div>
    </AdminLayout>
  );
};

export default Stats;
