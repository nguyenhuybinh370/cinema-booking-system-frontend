import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import { Edit2, Plus } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const PriceTable = ({ title, data, typeKey, nameKey }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-xl h-full">
    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
      <h3 className="font-bold text-white uppercase tracking-widest text-xs">{title}</h3>
      <button className="text-slate-500 hover:text-white transition-colors">
        <Plus size={16} />
      </button>
    </div>
    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">
          <th className="px-6 py-3">Tên</th>
          <th className="px-6 py-3">Phụ thu</th>
          <th className="px-6 py-3 text-right"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.map((item) => (
          <tr key={item[typeKey]} className="hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-4 text-sm font-bold text-slate-300">{item[nameKey]}</td>
            <td className="px-6 py-4 text-sm font-mono text-emerald-500">
              {item.GiaPhuThu > 0 ? `+${formatPrice(item.GiaPhuThu)}` : formatPrice(item.GiaPhuThu)}
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                <Edit2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pricing = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [calc, setCalc] = useState({
    basePrice: 85000,
    roomType: '',
    seatType: '',
    dayType: ''
  });

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const [rooms, seats, days] = await Promise.all([
        adminService.getRoomTypes(),
        adminService.getSeatTypes(),
        adminService.getDayTypes()
      ]);
      if (!ignore) {
        setRoomTypes(rooms);
        setSeatTypes(seats);
        setDayTypes(days);
        
        setCalc(prev => ({
          ...prev,
          roomType: rooms[0]?.MaLoaiPhong || '',
          seatType: seats[0]?.MaLoaiGhe || '',
          dayType: days[0]?.MaLoaiNgay || ''
        }));
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const getSurcharge = (list, key, id) => list.find(item => item[key] === id)?.GiaPhuThu || 0;

  const total = calc.basePrice + 
                getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType) + 
                getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType) + 
                getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          Đang tải cấu hình bảng giá...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Cấu hình bảng giá</h1>
        <p className="text-slate-500">Định nghĩa chính sách Dynamic Pricing cho hệ thống rạp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <PriceTable title="Phụ thu loại phòng" data={roomTypes} typeKey="MaLoaiPhong" nameKey="TenLoaiPhong" />
        <PriceTable title="Phụ thu hạng ghế" data={seatTypes} typeKey="MaLoaiGhe" nameKey="TenLoaiGhe" />
        <PriceTable title="Phụ thu loại ngày" data={dayTypes} typeKey="MaLoaiNgay" nameKey="TenLoaiNgay" />
      </div>

      {/* Price Preview */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500 opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity"></div>
        
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          Preview công thức giá
        </h3>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Controls */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loại phòng</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.roomType}
                onChange={e => setCalc({ ...calc, roomType: e.target.value })}
              >
                {roomTypes.map(t => <option key={t.MaLoaiPhong} value={t.MaLoaiPhong} className="bg-[#0f1117]">{t.TenLoaiPhong}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hạng ghế</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.seatType}
                onChange={e => setCalc({ ...calc, seatType: e.target.value })}
              >
                {seatTypes.map(t => <option key={t.MaLoaiGhe} value={t.MaLoaiGhe} className="bg-[#0f1117]">{t.TenLoaiGhe}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loại ngày</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.dayType}
                onChange={e => setCalc({ ...calc, dayType: e.target.value })}
              >
                {dayTypes.map(t => <option key={t.MaLoaiNgay} value={t.MaLoaiNgay} className="bg-[#0f1117]">{t.TenLoaiNgay}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá cơ bản</label>
              <input 
                type="number"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.basePrice}
                onChange={e => setCalc({ ...calc, basePrice: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Result */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-3 font-mono text-sm border-l border-white/5 pl-10">
              <div className="flex justify-between text-slate-400">
                <span>Giá vé cơ sở:</span>
                <span>{formatPrice(calc.basePrice)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu phòng ({roomTypes.find(t => t.MaLoaiPhong === calc.roomType)?.TenLoaiPhong}):</span>
                <span>{formatPrice(getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ghế ({seatTypes.find(t => t.MaLoaiGhe === calc.seatType)?.TenLoaiGhe}):</span>
                <span>{formatPrice(getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ngày ({dayTypes.find(t => t.MaLoaiNgay === calc.dayType)?.TenLoaiNgay}):</span>
                <span>{formatPrice(getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType))}</span>
              </div>
              <div className="h-[1px] bg-white/10 my-4"></div>
              <div className="flex justify-between text-2xl font-black text-white">
                <span className="uppercase tracking-tighter italic">Tổng dự kiến:</span>
                <span className="text-red-500">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pricing;
