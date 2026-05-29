import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import ShiftTable from '../../components/Admin/Shifts/ShiftTable';
import ShiftDetailTable from '../../components/Admin/Shifts/ShiftDetailTable';
import ShiftModal from '../../components/Admin/Shifts/ShiftModal';
import ShiftRegistrationModal from '../../components/Admin/Shifts/ShiftRegistrationModal';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';

const Shifts = () => {
  const [activeTab, setActiveTab] = useState('shifts');
  const [shifts, setShifts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const shiftPagination = useClientPagination(
    shifts,
    ['TenCa', 'MaCaLamViec'],
    (s, f) => {
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || s.KhaDung === Number(f.activeStatus);
      return matchKhaDung;
    }
  );

  const regPagination = useClientPagination(
    registrations,
    ['HoTen', 'TenCa', 'MaChiTietCa', 'GhiChu'],
    (r, f) => {
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || r.KhaDung === Number(f.activeStatus);
      const matchDate = !f.date || r.NgayLam === f.date;
      return matchKhaDung && matchDate;
    }
  );

  const cancelledCount = registrations.filter(r => r.KhaDung === 0).length;
  const tabs = [
    { id: 'shifts', label: 'Danh sách Ca làm việc (CALAMVIEC)' },
    { id: 'registrations', label: 'Đăng ký của Nhân viên (CHITIETCALAMVIEC)', badge: cancelledCount > 0 ? `Hủy: ${cancelledCount}` : null },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý Ca làm việc"
        subtitle="Quản lý thời gian, số người của các ca và danh sách phân ca của nhân viên."
      />

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8 gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-6 font-bold text-sm transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full" />}
            {tab.label}
            {tab.badge && <span className="ml-2 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Filters and search using AdminToolbar */}
      {activeTab === 'shifts' ? (
        <AdminToolbar
          searchPlaceholder="Tìm theo tên ca, mã ca làm việc..."
          searchValue={shiftPagination.searchQuery}
          onSearchChange={shiftPagination.setSearchQuery}
          filterSlot={
            <select
              value={shiftPagination.filters.activeStatus || 'All'}
              onChange={e => shiftPagination.setFilterVal('activeStatus', e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value={1}>Khả dụng</option>
              <option value={0}>Không khả dụng</option>
            </select>
          }
        />
      ) : (
        <AdminToolbar
          searchPlaceholder="Tìm theo tên nhân viên, ca, ghi chú..."
          searchValue={regPagination.searchQuery}
          onSearchChange={regPagination.setSearchQuery}
          filterSlot={
            <>
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-semibold">Ngày làm:</span>
                <input
                  type="date"
                  value={regPagination.filters.date || ''}
                  onChange={e => regPagination.setFilterVal('date', e.target.value || '')}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
                />
                {regPagination.filters.date && (
                  <button
                    type="button"
                    onClick={() => regPagination.setFilterVal('date', '')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold transition-all"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={regPagination.filters.activeStatus || 'All'}
                onChange={e => regPagination.setFilterVal('activeStatus', e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value={1}>Hoạt động (Đăng ký)</option>
                <option value={0}>Đã hủy</option>
              </select>
            </>
          }
        />
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : activeTab === 'shifts' ? (
        shiftPagination.paginatedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
            Không tìm thấy dữ liệu phù hợp
          </div>
        ) : (
          <>
            <ShiftTable
              shifts={shiftPagination.paginatedItems}
              onEdit={openEditShift}
              onDelete={handleDeleteShift}
              onToggleStatus={handleToggleShift}
            />
            <AdminPagination
              page={shiftPagination.page}
              pageSize={shiftPagination.pageSize}
              total={shiftPagination.totalItems}
              onPageChange={shiftPagination.setPage}
              onPageSizeChange={shiftPagination.setPageSize}
            />
          </>
        )
      ) : (
        regPagination.paginatedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
            Không tìm thấy dữ liệu phù hợp
          </div>
        ) : (
          <>
            <ShiftDetailTable
              registrations={regPagination.paginatedItems}
              onToggleStatus={handleToggleReg}
              onDelete={handleDeleteReg}
            />
            <AdminPagination
              page={regPagination.page}
              pageSize={regPagination.pageSize}
              total={regPagination.totalItems}
              onPageChange={regPagination.setPage}
              onPageSizeChange={regPagination.setPageSize}
            />
          </>
        )
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
