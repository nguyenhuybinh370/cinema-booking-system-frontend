import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { ROOM_TYPES, SEAT_TYPES, DAY_TYPES } from '../../constants/adminMockData';
import { Edit2, Plus, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const [roomTypes, setRoomTypes] = useState(ROOM_TYPES);
  const [seatTypes, setSeatTypes] = useState(SEAT_TYPES);
  const [dayTypes, setDayTypes] = useState(DAY_TYPES);

  const [calc, setCalc] = useState({
    basePrice: 85000,
    roomType: ROOM_TYPES[0].id,
    seatType: SEAT_TYPES[0].id,
    dayType: DAY_TYPES[0].id
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getSurcharge = (list, id) => list.find(item => item.id === id)?.surcharge || 0;

  const total = calc.basePrice + 
                getSurcharge(roomTypes, calc.roomType) + 
                getSurcharge(seatTypes, calc.seatType) + 
                getSurcharge(dayTypes, calc.dayType);

  const PriceTable = ({ title, data, onEdit }) => (
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
            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 text-sm font-bold text-slate-300">{item.name}</td>
              <td className="px-6 py-4 text-sm font-mono text-emerald-500">
                {item.surcharge > 0 ? `+${formatPrice(item.surcharge)}` : formatPrice(item.surcharge)}
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

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Cấu hình bảng giá</h1>
        <p className="text-slate-500">Định nghĩa chính sách Dynamic Pricing cho hệ thống rạp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <PriceTable title="Phụ thu loại phòng" data={roomTypes} />
        <PriceTable title="Phụ thu hạng ghế" data={seatTypes} />
        <PriceTable title="Phụ thu loại ngày" data={dayTypes} />
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
                {roomTypes.map(t => <option key={t.id} value={t.id} className="bg-[#0f1117]">{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hạng ghế</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.seatType}
                onChange={e => setCalc({ ...calc, seatType: e.target.value })}
              >
                {seatTypes.map(t => <option key={t.id} value={t.id} className="bg-[#0f1117]">{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loại ngày</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.dayType}
                onChange={e => setCalc({ ...calc, dayType: e.target.value })}
              >
                {dayTypes.map(t => <option key={t.id} value={t.id} className="bg-[#0f1117]">{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá cơ bản</label>
              <input 
                type="number"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={calc.basePrice}
                onChange={e => setCalc({ ...calc, basePrice: parseInt(e.target.value) })}
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
                <span>+ Phụ thu phòng ({roomTypes.find(t => t.id === calc.roomType)?.name}):</span>
                <span>{formatPrice(getSurcharge(roomTypes, calc.roomType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ghế ({seatTypes.find(t => t.id === calc.seatType)?.name}):</span>
                <span>{formatPrice(getSurcharge(seatTypes, calc.seatType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ngày ({dayTypes.find(t => t.id === calc.dayType)?.name}):</span>
                <span>{formatPrice(getSurcharge(dayTypes, calc.dayType))}</span>
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
