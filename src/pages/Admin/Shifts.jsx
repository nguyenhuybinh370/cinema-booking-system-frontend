import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import adminService from '../../services/adminService';
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  AlertTriangle,
  RotateCcw,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

const Shifts = () => {
  const [activeTab, setActiveTab] = useState('shifts'); // 'shifts', 'registrations'
  const [shifts, setShifts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search queries
  const [shiftSearch, setShiftSearch] = useState('');
  const [regSearch, setRegSearch] = useState('');

  // Modals state
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const [editingShift, setEditingShift] = useState(null);

  // Form states
  const [shiftFormData, setShiftFormData] = useState({
    TenCa: '',
    GioBatDau: '',
    GioKetThuc: '',
    SoNguoiToiDa: 5,
    KhaDung: 1
  });

  const [regFormData, setRegFormData] = useState({
    MaNhanVien: '',
    MaCaLamViec: '',
    NgayLam: '',
    GhiChu: '',
    KieuLap: '', // null/1/2 mapping
    NgayLap: ''
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [shiftsData, regsData, staffData] = await Promise.all([
        adminService.getShifts(),
        adminService.getShiftDetails(),
        adminService.getStaff()
      ]);
      setShifts(shiftsData);
      setRegistrations(regsData);
      setStaffList(staffData.filter(s => s.KhaDung === 1)); // Only active staff can register shifts
    } catch (error) {
      alert('Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Shift handlers
  const handleOpenAddShift = () => {
    setEditingShift(null);
    setShiftFormData({
      TenCa: '',
      GioBatDau: '',
      GioKetThuc: '',
      SoNguoiToiDa: 5,
      KhaDung: 1
    });
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift) => {
    setEditingShift(shift);
    setShiftFormData({
      TenCa: shift.TenCa || '',
      GioBatDau: shift.GioBatDau ? shift.GioBatDau.substring(0, 5) : '',
      GioKetThuc: shift.GioKetThuc ? shift.GioKetThuc.substring(0, 5) : '',
      SoNguoiToiDa: shift.SoNguoiToiDa || 5,
      KhaDung: shift.KhaDung !== undefined ? shift.KhaDung : 1
    });
    setIsShiftModalOpen(true);
  };

  const handleShiftFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingShift) {
        await adminService.updateShift(editingShift.MaCaLamViec, shiftFormData);
        alert('Cập nhật ca làm việc thành công!');
      } else {
        await adminService.addShift(shiftFormData);
        alert('Thêm ca làm việc mới thành công!');
      }
      await fetchData();
      setIsShiftModalOpen(false);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shift) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ca làm việc "${shift.TenCa}"?`)) return;
    setLoading(true);
    try {
      await adminService.deleteShift(shift.MaCaLamViec);
      alert('Xóa ca làm việc thành công!');
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShiftStatus = async (shift) => {
    const newKhaDung = shift.KhaDung === 1 ? 0 : 1;
    const action = newKhaDung === 1 ? 'Kích hoạt' : 'Vô hiệu hóa';
    try {
      await adminService.updateShift(shift.MaCaLamViec, { KhaDung: newKhaDung });
      alert(`${action} ca làm việc thành công!`);
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // CRUD Shift Detail handlers
  const handleOpenAddReg = () => {
    setRegFormData({
      MaNhanVien: staffList[0]?.MaNhanVien || '',
      MaCaLamViec: shifts.filter(s => s.KhaDung === 1)[0]?.MaCaLamViec || '',
      NgayLam: new Date().toISOString().substring(0, 10),
      GhiChu: '',
      KieuLap: '',
      NgayLap: ''
    });
    setIsRegModalOpen(true);
  };

  const handleRegFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...regFormData,
        KieuLap: regFormData.KieuLap === '' ? null : parseInt(regFormData.KieuLap, 10),
        NgayLap: regFormData.KieuLap === '' ? null : regFormData.NgayLap || null
      };
      await adminService.addShiftDetail(payload);
      alert('Phân ca/Đăng ký ca mới thành công!');
      await fetchData();
      setIsRegModalOpen(false);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegStatus = async (reg) => {
    const action = reg.KhaDung === 1 ? 'Hủy đăng ký' : 'Đăng ký lại';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action.toLowerCase()} ca làm việc này?`)) return;
    setLoading(true);
    try {
      await adminService.toggleShiftDetailStatus(reg.MaChiTietCa);
      alert(`${action} ca làm việc thành công!`);
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReg = async (reg) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi đăng ký ca này?')) return;
    setLoading(true);
    try {
      await adminService.deleteShiftDetail(reg.MaChiTietCa);
      alert('Xóa bản đăng ký ca thành công!');
      await fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filters mapping
  const filteredShifts = shifts.filter(s => 
    s.TenCa.toLowerCase().includes(shiftSearch.toLowerCase()) ||
    s.MaCaLamViec.toLowerCase().includes(shiftSearch.toLowerCase())
  );

  const filteredRegs = registrations.filter(r => 
    r.HoTen.toLowerCase().includes(regSearch.toLowerCase()) ||
    r.ChucVu.toLowerCase().includes(regSearch.toLowerCase()) ||
    r.TenCa.toLowerCase().includes(regSearch.toLowerCase()) ||
    r.MaChiTietCa.toLowerCase().includes(regSearch.toLowerCase())
  );

  // Tab 1 (Shifts) Columns
  const shiftColumns = [
    {
      header: 'Mã Ca',
      accessor: 'MaCaLamViec',
      className: 'text-xs font-mono font-bold text-slate-500'
    },
    {
      header: 'Tên Ca làm việc',
      render: (shift) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10 shrink-0">
            <Clock size={16} />
          </div>
          <span className="font-bold text-white text-sm">{shift.TenCa}</span>
        </div>
      )
    },
    {
      header: 'Khung giờ',
      render: (shift) => (
        <span className="font-mono text-sm text-slate-300 font-semibold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
          {shift.GioBatDau.substring(0, 5)} - {shift.GioKetThuc.substring(0, 5)}
        </span>
      )
    },
    {
      header: 'Số người tối đa',
      render: (shift) => (
        <span className="text-sm text-slate-400 font-bold font-mono">
          {shift.SoNguoiToiDa} người
        </span>
      )
    },
    {
      header: 'Trạng thái khả dụng',
      render: (shift) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
          shift.KhaDung === 0 
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {shift.KhaDung === 0 ? '0 (Vô hiệu)' : '1 (Khả dụng)'}
        </span>
      )
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (shift) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleToggleShiftStatus(shift)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              shift.KhaDung === 1
                ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500'
                : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'
            }`}
            title={shift.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {shift.KhaDung === 1 ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
          </button>
          <button
            onClick={() => handleOpenEditShift(shift)}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Sửa ca"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteShift(shift)}
            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer"
            title="Xóa ca"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  // Tab 2 (Registrations) Columns
  const regColumns = [
    {
      header: 'Mã Đăng Ký',
      accessor: 'MaChiTietCa',
      className: 'text-xs font-mono font-bold text-slate-500'
    },
    {
      header: 'Nhân viên',
      render: (reg) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold font-mono">
            {reg.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{reg.HoTen}</span>
            <span className="text-[10px] text-slate-500 font-medium">{reg.ChucVu}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Ca đăng ký',
      render: (reg) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-300">{reg.TenCa}</span>
          <span className="text-xs text-slate-500 font-mono">({reg.GioBatDau.substring(0, 5)} - {reg.GioKetThuc.substring(0, 5)})</span>
        </div>
      )
    },
    {
      header: 'Ngày làm việc',
      render: (reg) => (
        <span className="text-sm text-slate-300 font-mono font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
          {reg.NgayLam}
        </span>
      )
    },
    {
      header: 'Lặp lại',
      render: (reg) => {
        if (reg.KieuLap === 1) return <span className="text-xs text-emerald-400">Hàng tuần (đến {reg.NgayLap})</span>;
        if (reg.KieuLap === 2) return <span className="text-xs text-blue-400">Hàng ngày (đến {reg.NgayLap})</span>;
        return <span className="text-xs text-slate-500">Không lặp</span>;
      }
    },
    {
      header: 'Ghi chú',
      accessor: 'GhiChu',
      className: 'text-xs text-slate-400 max-w-[150px] truncate'
    },
    {
      header: 'Trạng thái',
      render: (reg) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
          reg.KhaDung === 0 
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {reg.KhaDung === 0 ? 'Đã hủy' : 'Đăng ký'}
        </span>
      )
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (reg) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleToggleRegStatus(reg)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              reg.KhaDung === 1
                ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500'
                : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'
            }`}
            title={reg.KhaDung === 1 ? 'Hủy đăng ký' : 'Đăng ký lại'}
          >
            {reg.KhaDung === 1 ? <X size={16} className="text-red-400" /> : <RotateCcw size={16} className="text-emerald-400" />}
          </button>
          <button
            onClick={() => handleDeleteReg(reg)}
            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer"
            title="Xóa vĩnh viễn"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý Ca làm việc</h1>
          <p className="text-slate-500">Thêm xóa sửa ca làm việc và quản lý danh sách ca do nhân viên đăng ký hoặc hủy.</p>
        </div>
        {activeTab === 'shifts' ? (
          <button 
            onClick={handleOpenAddShift}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} /> Thêm ca làm việc
          </button>
        ) : (
          <button 
            onClick={handleOpenAddReg}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} /> Phân ca/Đăng ký ca
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8">
        <button 
          onClick={() => setActiveTab('shifts')}
          className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'shifts' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'shifts' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"></span>}
          Danh sách Ca làm việc (CALAMVIEC)
        </button>
        <button 
          onClick={() => setActiveTab('registrations')}
          className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${
            activeTab === 'registrations' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeTab === 'registrations' && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"></span>}
          Đăng ký của Nhân viên (CHITIETCALAMVIEC)
          {registrations.filter(r => r.KhaDung === 0).length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              Hủy: {registrations.filter(r => r.KhaDung === 0).length}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        {activeTab === 'shifts' ? (
          <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo tên ca hoặc mã ca..."
              className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
              value={shiftSearch}
              onChange={e => setShiftSearch(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo tên nhân viên, chức vụ, ca làm việc..."
              className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
              value={regSearch}
              onChange={e => setRegSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Loading & Tables */}
      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : activeTab === 'shifts' ? (
        <div className="overflow-x-auto no-scrollbar">
          <AdminTable columns={shiftColumns} data={filteredShifts} rowKey="MaCaLamViec" />
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <AdminTable columns={regColumns} data={filteredRegs} rowKey="MaChiTietCa" />
        </div>
      )}

      {/* Modal 1: Shift Template Add/Edit */}
      <Modal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        title={editingShift ? "Sửa thông tin ca làm việc" : "Thêm ca làm việc mới"}
      >
        <form onSubmit={handleShiftFormSubmit} className="space-y-6">
          {editingShift && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mã ca làm việc (Không thể sửa)</label>
              <input
                type="text"
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-mono text-sm font-bold"
                value={editingShift.MaCaLamViec}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên ca làm việc</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white font-bold text-sm"
              placeholder="VD: Ca Sáng, Ca Chiều, Ca Tối, Ca Đêm"
              value={shiftFormData.TenCa}
              onChange={e => setShiftFormData({ ...shiftFormData, TenCa: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giờ bắt đầu</label>
              <input
                type="time"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-mono"
                value={shiftFormData.GioBatDau}
                onChange={e => setShiftFormData({ ...shiftFormData, GioBatDau: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giờ kết thúc</label>
              <input
                type="time"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-mono"
                value={shiftFormData.GioKetThuc}
                onChange={e => setShiftFormData({ ...shiftFormData, GioKetThuc: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số nhân viên tối đa</label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white font-bold font-mono text-sm"
                value={shiftFormData.SoNguoiToiDa}
                onChange={e => setShiftFormData({ ...shiftFormData, SoNguoiToiDa: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái khả dụng</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm"
                value={shiftFormData.KhaDung}
                onChange={e => setShiftFormData({ ...shiftFormData, KhaDung: parseInt(e.target.value, 10) })}
              >
                <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
                <option value={0} className="bg-[#0f1117]">0 (Vô hiệu)</option>
              </select>
            </div>
          </div>

          {editingShift && (
            <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
              <div>Ngày tạo: {editingShift.NgayTao || '--:--'}</div>
              <div>Ngày cập nhật: {editingShift.NgayCapNhat || 'Chưa cập nhật'}</div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsShiftModalOpen(false)}
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Shift Registration */}
      <Modal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        title="Đăng ký ca làm việc mới"
      >
        {staffList.length === 0 || shifts.filter(s => s.KhaDung === 1).length === 0 ? (
          <div className="space-y-4 text-center py-6">
            <AlertTriangle className="text-amber-500 mx-auto" size={48} />
            <p className="text-slate-400 text-sm">Cần có ít nhất 1 nhân sự đang hoạt động và 1 ca làm việc khả dụng để phân ca.</p>
            <button 
              onClick={() => setIsRegModalOpen(false)}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all text-xs uppercase tracking-widest border border-white/5 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn Nhân viên</label>
              <select
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-bold"
                value={regFormData.MaNhanVien}
                onChange={e => setRegFormData({ ...regFormData, MaNhanVien: e.target.value })}
              >
                {staffList.map(s => (
                  <option key={s.MaNhanVien} value={s.MaNhanVien} className="bg-[#0f1117]">
                    {s.HoTen} ({s.ChucVu}) - {s.MaNhanVien}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn Ca làm việc</label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-bold"
                  value={regFormData.MaCaLamViec}
                  onChange={e => setRegFormData({ ...regFormData, MaCaLamViec: e.target.value })}
                >
                  {shifts.filter(s => s.KhaDung === 1).map(s => (
                    <option key={s.MaCaLamViec} value={s.MaCaLamViec} className="bg-[#0f1117]">
                      {s.TenCa} ({s.GioBatDau.substring(0, 5)} - {s.GioKetThuc.substring(0, 5)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày làm việc</label>
                <input
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-mono"
                  value={regFormData.NgayLam}
                  onChange={e => setRegFormData({ ...regFormData, NgayLam: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kiểu lặp lại</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm"
                  value={regFormData.KieuLap}
                  onChange={e => setRegFormData({ ...regFormData, KieuLap: e.target.value })}
                >
                  <option value="" className="bg-[#0f1117]">Không lặp (Chỉ ngày đã chọn)</option>
                  <option value={1} className="bg-[#0f1117]">Lặp lại hàng tuần</option>
                  <option value={2} className="bg-[#0f1117]">Lặp lại hàng ngày</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày lặp lại cuối</label>
                <input
                  type="date"
                  disabled={regFormData.KieuLap === ''}
                  required={regFormData.KieuLap !== ''}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                  value={regFormData.NgayLap}
                  onChange={e => setRegFormData({ ...regFormData, NgayLap: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ghi chú</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white text-sm"
                rows="2"
                placeholder="VD: Trực quầy vé, hỗ trợ soát vé chính..."
                value={regFormData.GhiChu}
                onChange={e => setRegFormData({ ...regFormData, GhiChu: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsRegModalOpen(false)}
                className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
              >
                Đăng ký ca
              </button>
            </div>
          </form>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Shifts;
