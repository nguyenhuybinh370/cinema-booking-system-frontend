import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import ShiftTable from '../../components/Admin/Shifts/ShiftTable';
import ShiftDetailTable from '../../components/Admin/Shifts/ShiftDetailTable';
import ShiftModal from '../../components/Admin/Shifts/ShiftModal';
import ShiftRegistrationModal from '../../components/Admin/Shifts/ShiftRegistrationModal';
import { Plus, Search } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

const Shifts = () => {
  const [activeTab, setActiveTab] = useState('shifts');
  const [shifts, setShifts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftSearch, setShiftSearch] = useState('');
  const [regSearch, setRegSearch] = useState('');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, type: '', data: null });

  const [shiftForm, setShiftForm] = useState({ TenCa: '', GioBatDau: '', GioKetThuc: '', SoNguoiToiDa: 5, KhaDung: 1 });
  const [regForm, setRegForm] = useState({ MaNhanVien: '', MaCaLamViec: '', NgayLam: '', GhiChu: '', KieuLap: '', NgayLap: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, r, staff] = await Promise.all([adminService.getShifts(), adminService.getShiftDetails(), adminService.getStaff()]);
      setShifts(s);
      setRegistrations(r);
      setStaffList(staff.filter(x => x.KhaDung === 1));
    } catch (err) { showError('Lỗi tải dữ liệu: ' + err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Shift CRUD
  const openAddShift = () => {
    setEditingShift(null);
    setShiftForm({ TenCa: '', GioBatDau: '', GioKetThuc: '', SoNguoiToiDa: 5, KhaDung: 1 });
    setIsShiftModalOpen(true);
  };
  const openEditShift = (shift) => {
    setEditingShift(shift);
    setShiftForm({ TenCa: shift.TenCa || '', GioBatDau: shift.GioBatDau?.substring(0, 5) || '', GioKetThuc: shift.GioKetThuc?.substring(0, 5) || '', SoNguoiToiDa: shift.SoNguoiToiDa || 5, KhaDung: shift.KhaDung ?? 1 });
    setIsShiftModalOpen(true);
  };
  const handleShiftSubmit = async (e) => {
    try {
      if (editingShift) { await adminService.updateShift(editingShift.MaCaLamViec, shiftForm); showSuccess('Cập nhật ca thành công!'); }
      else { await adminService.addShift(shiftForm); showSuccess('Thêm ca làm việc thành công!'); }
      await fetchData(); setIsShiftModalOpen(false);
    } catch (err) { showError('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };
  const handleDeleteShift = (shift) => {
    setConfirmState({ isOpen: true, type: 'deleteShift', data: shift });
  };
  const handleToggleShift = async (shift) => {
    const newKD = shift.KhaDung === 1 ? 0 : 1;
    try { await adminService.updateShift(shift.MaCaLamViec, { KhaDung: newKD }); showSuccess(`${newKD === 1 ? 'Kích hoạt' : 'Vô hiệu hóa'} ca thành công!`); await fetchData(); }
    catch (err) { showError('Lỗi: ' + err.message); }
  };

  // Registration CRUD
  const openAddReg = () => {
    setRegForm({ MaNhanVien: staffList[0]?.MaNhanVien || '', MaCaLamViec: shifts.filter(s => s.KhaDung === 1)[0]?.MaCaLamViec || '', NgayLam: new Date().toISOString().substring(0, 10), GhiChu: '', KieuLap: '', NgayLap: '' });
    setIsRegModalOpen(true);
  };
  const handleRegSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...regForm, KieuLap: regForm.KieuLap === '' ? null : parseInt(regForm.KieuLap, 10), NgayLap: regForm.KieuLap === '' ? null : regForm.NgayLap || null };
      await adminService.addShiftDetail(payload); showSuccess('Đăng ký ca thành công!'); await fetchData(); setIsRegModalOpen(false);
    } catch (err) { showError('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };
  const handleToggleReg = (reg) => {
    setConfirmState({ isOpen: true, type: 'toggleReg', data: reg });
  };
  const handleDeleteReg = (reg) => {
    setConfirmState({ isOpen: true, type: 'deleteReg', data: reg });
  };

  const handleConfirmAction = async () => {
    const { type, data } = confirmState;
    setConfirmState({ isOpen: false, type: '', data: null });
    setLoading(true);
    try {
      if (type === 'deleteShift') {
        await adminService.deleteShift(data.MaCaLamViec);
        showSuccess('Xóa ca thành công!');
      } else if (type === 'toggleReg') {
        const action = data.KhaDung === 1 ? 'Hủy đăng ký' : 'Đăng ký lại';
        await adminService.toggleShiftDetailStatus(data.MaChiTietCa);
        showSuccess(`${action} thành công!`);
      } else if (type === 'deleteReg') {
        await adminService.deleteShiftDetail(data.MaChiTietCa);
        showSuccess('Xóa thành công!');
      }
      await fetchData();
    } catch (err) {
      showError('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredShifts = shifts.filter(s => s.TenCa.toLowerCase().includes(shiftSearch.toLowerCase()) || s.MaCaLamViec.toLowerCase().includes(shiftSearch.toLowerCase()));
  const filteredRegs = registrations.filter(r => r.HoTen.toLowerCase().includes(regSearch.toLowerCase()) || r.TenCa.toLowerCase().includes(regSearch.toLowerCase()) || r.MaChiTietCa.toLowerCase().includes(regSearch.toLowerCase()));
  const cancelledCount = registrations.filter(r => r.KhaDung === 0).length;
  const tabs = [
    { id: 'shifts', label: 'Danh sách Ca làm việc (CALAMVIEC)' },
    { id: 'registrations', label: 'Đăng ký của Nhân viên (CHITIETCALAMVIEC)', badge: cancelledCount > 0 ? `Hủy: ${cancelledCount}` : null },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý Ca làm việc</h1>
          <p className="text-slate-500">Thêm xóa sửa ca làm việc và quản lý danh sách phân ca nhân viên.</p>
        </div>
        <button onClick={activeTab === 'shifts' ? openAddShift : openAddReg}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-sm">
          <Plus size={18} /> {activeTab === 'shifts' ? 'Thêm ca làm việc' : 'Phân ca / Đăng ký ca'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full" />}
            {tab.label}
            {tab.badge && <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input type="text" placeholder={activeTab === 'shifts' ? 'Tìm theo tên ca...' : 'Tìm theo tên nhân viên, ca...'}
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
            value={activeTab === 'shifts' ? shiftSearch : regSearch}
            onChange={e => activeTab === 'shifts' ? setShiftSearch(e.target.value) : setRegSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : activeTab === 'shifts' ? (
        <ShiftTable shifts={filteredShifts} onEdit={openEditShift} onDelete={handleDeleteShift} onToggleStatus={handleToggleShift} />
      ) : (
        <ShiftDetailTable registrations={filteredRegs} onToggleStatus={handleToggleReg} onDelete={handleDeleteReg} />
      )}

      {/* Modals */}
      <ShiftModal
        isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)}
        editingShift={editingShift} formData={shiftForm}
        onChange={(f, v) => setShiftForm(prev => ({ ...prev, [f]: v }))}
        onSubmit={handleShiftSubmit}
      />
      <ShiftRegistrationModal
        isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)}
        formData={regForm} onChange={(f, v) => setRegForm(prev => ({ ...prev, [f]: v }))}
        onSubmit={handleRegSubmit} staffList={staffList} shifts={shifts}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={
          confirmState.type === 'deleteShift' ? 'Xóa ca làm việc' :
          confirmState.type === 'toggleReg' ? (confirmState.data?.KhaDung === 1 ? 'Hủy đăng ký ca' : 'Đăng ký lại ca') : 'Xóa đăng ký ca'
        }
        message={
          confirmState.type === 'deleteShift' ? `Bạn có chắc chắn muốn xóa ca "${confirmState.data?.TenCa}"?` :
          confirmState.type === 'toggleReg' ? `Bạn có chắc chắn muốn ${confirmState.data?.KhaDung === 1 ? 'hủy đăng ký' : 'đăng ký lại'} ca này?` :
          'Bạn có chắc chắn muốn xóa bản ghi đăng ký ca này?'
        }
        confirmText="Xác nhận"
        cancelText="Hủy"
        variant={confirmState.type === 'deleteShift' || confirmState.type === 'deleteReg' || (confirmState.type === 'toggleReg' && confirmState.data?.KhaDung === 1) ? 'danger' : 'default'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState({ isOpen: false, type: '', data: null })}
      />
    </AdminLayout>
  );
};

export default Shifts;
