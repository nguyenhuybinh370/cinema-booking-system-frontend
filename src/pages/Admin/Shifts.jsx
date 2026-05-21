import { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { Calendar, Clock, Check, X, ShieldAlert, Award, ArrowLeftRight, UserCheck, Plus } from 'lucide-react';

const mockShiftTypes = [
  { MaCa: 'C01', TenCa: 'Ca Sáng', KhungGio: '08:00 - 14:00' },
  { MaCa: 'C02', TenCa: 'Ca Chiều', KhungGio: '14:00 - 20:00' },
  { MaCa: 'C03', TenCa: 'Ca Tối', KhungGio: '20:00 - 02:00' }
];

const mockAssignments = [
  { id: 1, HoTen: 'Nguyễn Huy Bình', VaiTro: 'Quản lý', Ca: 'Ca Sáng', Ngay: '2026-05-21', Status: 'Present' },
  { id: 2, HoTen: 'Trần Thị Mai', VaiTro: 'Thu ngân', Ca: 'Ca Chiều', Ngay: '2026-05-21', Status: 'Present' },
  { id: 3, HoTen: 'Lê Văn Nam', VaiTro: 'Soát vé', Ca: 'Ca Chiều', Ngay: '2026-05-21', Status: 'Absent' },
  { id: 4, HoTen: 'Phạm Hồng Đăng', VaiTro: 'Bán vé', Ca: 'Ca Tối', Ngay: '2026-05-21', Status: 'Scheduled' },
  { id: 5, HoTen: 'Hoàng Minh Thu', VaiTro: 'Thu ngân', Ca: 'Ca Sáng', Ngay: '2026-05-22', Status: 'Scheduled' }
];

const mockRequests = [
  { id: 101, HoTen: 'Trần Thị Mai', Loai: 'Nghỉ phép', ChiTiet: 'Nghỉ ca Chiều ngày 23/05 (Lý do cá nhân)', Status: 'Pending' },
  { id: 102, HoTen: 'Lê Văn Nam', Loai: 'Đổi ca', ChiTiet: 'Đổi ca Chiều ngày 22/05 sang ca Sáng với Hoàng Minh Thu', Status: 'Pending' },
  { id: 103, HoTen: 'Phạm Hồng Đăng', Loai: 'Nghỉ phép', ChiTiet: 'Nghỉ ca Tối ngày 20/05 (Ốm sốt)', Status: 'Approved' },
  { id: 104, HoTen: 'Nguyễn Huy Bình', Loai: 'Đổi ca', ChiTiet: 'Đổi ca Sáng ngày 19/05 với Lê Văn Nam', Status: 'Rejected' }
];

const mockAttendance = [
  { id: 201, HoTen: 'Nguyễn Huy Bình', Ca: 'Ca Sáng (08:00 - 14:00)', CheckIn: '07:58', CheckOut: '14:05', Status: 'Đúng giờ' },
  { id: 202, HoTen: 'Trần Thị Mai', Ca: 'Ca Chiều (14:00 - 20:00)', CheckIn: '14:12', CheckOut: '20:01', Status: 'Đi muộn (12 phút)' },
  { id: 203, HoTen: 'Lê Văn Nam', Ca: 'Ca Chiều (14:00 - 20:00)', CheckIn: '--:--', CheckOut: '--:--', Status: 'Vắng mặt' }
];

const Shifts = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'requests', 'attendance'
  const [assignments, setAssignments] = useState(mockAssignments);
  const [requests, setRequests] = useState(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    HoTen: '',
    Ca: 'Ca Sáng',
    Ngay: '2026-05-21',
    Status: 'Scheduled'
  });

  const handleApprove = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, Status: 'Approved' } : req));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, Status: 'Rejected' } : req));
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    const id = assignments.length + 1;
    const staffName = newAssignment.HoTen || 'Nhân viên mới';
    setAssignments(prev => [...prev, {
      id,
      HoTen: staffName,
      VaiTro: 'Nhân viên',
      Ca: newAssignment.Ca,
      Ngay: newAssignment.Ngay,
      Status: 'Scheduled'
    }]);
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý ca làm việc</h1>
          <p className="text-slate-500">Phân lịch làm việc, chấm công điểm danh và phê duyệt các đơn đổi ca.</p>
        </div>
        {activeTab === 'schedule' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} /> Phân ca làm việc
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8">
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'schedule' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'schedule' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"></span>}
          Lịch phân ca
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'requests' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'requests' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"></span>}
          Yêu cầu xin nghỉ / đổi ca
          {requests.filter(r => r.Status === 'Pending').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {requests.filter(r => r.Status === 'Pending').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'attendance' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'attendance' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"></span>}
          Lịch sử chấm công
        </button>
      </div>

      {/* Tab: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockShiftTypes.map((st) => (
              <div key={st.MaCa} className="bg-[#0f1117] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-red-500/5 text-red-500 text-[10px] font-black tracking-widest px-4 py-2 rounded-bl-2xl">
                  {st.MaCa}
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{st.TenCa}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">{st.KhungGio}</p>
                <div className="h-[1px] bg-white/5 my-4"></div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Số nhân viên trực:</span>
                  <span className="font-bold text-white">{assignments.filter(a => a.Ca === st.TenCa).length}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0f1117] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl mt-8">
            <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Danh sách phân ca hôm nay</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">
                  <th className="px-8 py-4">Nhân viên</th>
                  <th className="px-8 py-4">Vai trò</th>
                  <th className="px-8 py-4">Ca làm việc</th>
                  <th className="px-8 py-4">Ngày</th>
                  <th className="px-8 py-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-200">{item.HoTen}</td>
                    <td className="px-8 py-5 text-xs text-slate-500">{item.VaiTro}</td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">{item.Ca}</td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-mono">{item.Ngay}</td>
                    <td className="px-8 py-5 text-xs">
                      <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        item.Status === 'Present' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        item.Status === 'Absent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {item.Status === 'Present' ? 'Đã điểm danh' :
                         item.Status === 'Absent' ? 'Vắng mặt' : 'Chờ bắt đầu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0f1117] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
            <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Danh sách yêu cầu nghỉ / đổi ca</h3>
            </div>
            <div className="divide-y divide-white/5">
              {requests.map((req) => (
                <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.01] transition-colors">
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-2xl ${
                      req.Loai === 'Nghỉ phép' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {req.Loai === 'Nghỉ phép' ? <ShieldAlert size={20} /> : <ArrowLeftRight size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{req.HoTen}</span>
                        <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">{req.Loai}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{req.ChiTiet}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {req.Status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-white/5"
                        >
                          <X size={14} /> Từ chối
                        </button>
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-red-500/20"
                        >
                          <Check size={14} /> Phê duyệt
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        req.Status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15' : 'bg-white/5 text-slate-500'
                      }`}>
                        {req.Status === 'Approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0f1117] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
            <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Lịch sử chấm công hôm nay</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">
                  <th className="px-8 py-4">Nhân viên</th>
                  <th className="px-8 py-4">Ca làm</th>
                  <th className="px-8 py-4">Thời gian Check-in</th>
                  <th className="px-8 py-4">Thời gian Check-out</th>
                  <th className="px-8 py-4">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockAttendance.map((att) => (
                  <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-200">{att.HoTen}</td>
                    <td className="px-8 py-5 text-xs text-slate-400">{att.Ca}</td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-300">{att.CheckIn}</td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-300">{att.CheckOut}</td>
                    <td className="px-8 py-5 text-xs">
                      <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        att.Status === 'Đúng giờ' ? 'bg-emerald-500/10 text-emerald-500' :
                        att.Status === 'Vắng mặt' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {att.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Phân ca làm việc mới"
      >
        <form onSubmit={handleAddAssignment} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ tên nhân viên</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white font-bold" 
              placeholder="VD: Lê Văn Nam" 
              value={newAssignment.HoTen}
              onChange={e => setNewAssignment({ ...newAssignment, HoTen: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ca làm việc</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm"
                value={newAssignment.Ca}
                onChange={e => setNewAssignment({ ...newAssignment, Ca: e.target.value })}
              >
                <option value="Ca Sáng" className="bg-[#0f1117]">Ca Sáng (08:00-14:00)</option>
                <option value="Ca Chiều" className="bg-[#0f1117]">Ca Chiều (14:00-20:00)</option>
                <option value="Ca Tối" className="bg-[#0f1117]">Ca Tối (20:00-02:00)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày làm việc</label>
              <input 
                type="date" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-mono" 
                value={newAssignment.Ngay}
                onChange={e => setNewAssignment({ ...newAssignment, Ngay: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Phân ca
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Shifts;
