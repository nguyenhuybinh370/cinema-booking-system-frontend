import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import PersonnelTable from '../../components/Admin/Personnel/PersonnelTable';
import PersonnelModal from '../../components/Admin/Personnel/PersonnelModal';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { Search } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

const defaultForm = {
  HoTen: '', SoDienThoai: '', Email: '', ChucVu: '', Role: 'Staff',
  KhaDung: 1, NgaySinh: '', GioiTinh: 1, MatKhau: 'CinemaPlus@2026',
};

const Personnel = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(defaultForm);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isToggling, setIsToggling] = useState(false);

  const loadStaff = async () => {
    try {
      const data = await adminService.getStaff();
      setStaff(data);
    } catch (err) { showError('Lỗi tải dữ liệu: ' + err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadStaff(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'GioiTinh' || name === 'KhaDung' ? parseInt(value, 10) : value,
    }));
  };

  const openAdd = () => { setEditingStaff(null); setFormData(defaultForm); setIsModalOpen(true); };
  const openEdit = (person) => {
    setEditingStaff(person);
    setFormData({ HoTen: person.HoTen || '', SoDienThoai: person.SoDienThoai || '', Email: person.Email || '', ChucVu: person.ChucVu || '', Role: person.Role || 'Staff', KhaDung: person.KhaDung ?? 1, NgaySinh: person.NgaySinh || '', GioiTinh: person.GioiTinh ?? 1, MatKhau: 'CinemaPlus@2026' });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (person) => {
    setConfirmState({ isOpen: true, data: person });
  };

  const handleConfirmToggle = async () => {
    const person = confirmState.data;
    const newKhaDung = person.KhaDung === 1 ? 0 : 1;
    const actionName = newKhaDung === 0 ? 'Vô hiệu hóa' : 'Kích hoạt';
    setIsToggling(true);
    try {
      await adminService.updateStaff(person.MaNhanVien, { KhaDung: newKhaDung });
      await loadStaff();
      showSuccess(`${actionName} thành công!`);
    } catch (e) {
      showError('Lỗi: ' + e.message);
    } finally {
      setIsToggling(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingStaff) { await adminService.updateStaff(editingStaff.MaNhanVien, formData); showSuccess('Cập nhật hồ sơ thành công!'); }
      else { await adminService.addStaff(formData); showSuccess('Thêm nhân viên thành công!'); }
      await loadStaff(); setIsModalOpen(false);
    } catch (err) { showError('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };

  const filteredStaff = staff.filter(p => {
    return p.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.SoDienThoai.includes(searchQuery);
  });

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý Nhân viên"
        subtitle="Quản lý hồ sơ nhân viên rạp chiếu phim."
        action={
          <button 
            onClick={openAdd} 
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            + Thêm nhân viên
          </button>
        }
      />

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
          <Search size={18} className="text-slate-500" />
          <input type="text" placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-500 w-full font-bold"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      {loading && staff.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : (
        <PersonnelTable staff={filteredStaff} onEdit={openEdit} onToggleStatus={handleToggleStatus} />
      )}

      <PersonnelModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff} formData={formData}
        onChange={handleInputChange} onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.data?.KhaDung === 1 ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
        message={confirmState.data ? `Bạn có chắc chắn muốn ${confirmState.data.KhaDung === 1 ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản nhân viên ${confirmState.data.HoTen}?` : ''}
        confirmText="Xác nhận"
        cancelText="Quay lại"
        variant={confirmState.data?.KhaDung === 1 ? "danger" : "default"}
        isLoading={isToggling}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Personnel;
