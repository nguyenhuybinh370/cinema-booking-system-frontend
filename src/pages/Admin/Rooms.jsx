import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';

const Rooms = () => {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý phòng chiếu</h1>
          <p className="text-slate-500">Quản lý danh sách phòng chiếu vật lý trong rạp.</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">
          + Thêm phòng chiếu
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tên phòng</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Loại phòng</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sức chứa</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">Phòng chiếu 0{i}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold">IMAX</span>
                </td>
                <td className="px-6 py-4 text-slate-400">120 ghế</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold">Đang sử dụng</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">Sửa</button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-colors">Đổi trạng thái</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Rooms;
