import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import PersonnelTable from '../../components/Admin/Personnel/PersonnelTable';
import PersonnelModal from '../../components/Admin/Personnel/PersonnelModal';
import PermissionPanel, { PERMISSIONS } from '../../components/Admin/Personnel/PermissionPanel';
import { Search } from 'lucide-react';

const defaultForm = {
  HoTen: '', SoDienThoai: '', Email: '', ChucVu: '', Role: 'Staff',
  KhaDung: 1, NgaySinh: '', GioiTinh: 1, MatKhau: 'CinemaPlus@2026',
};

const Personnel = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermPanelOpen, setIsPermPanelOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [formData, setFormData] = useState(defaultForm);
  const [staffPermissions, setStaffPermissions] = useState([]);

  const loadStaff = async () => {
    try {
      const data = await adminService.getStaff();
      setStaff(data);
    } catch (err) { alert('Lỗi tải dữ liệu: ' + err.message); }
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

  const handleToggleStatus = async (person) => {
    const newKhaDung = person.KhaDung === 1 ? 0 : 1;
    const actionName = newKhaDung === 0 ? 'Vô hiệu hóa' : 'Kích hoạt';
    if (!window.confirm(`${actionName} nhân viên ${person.HoTen}?`)) return;
    setLoading(true);
    try {
      await adminService.updateStaff(person.MaNhanVien, { KhaDung: newKhaDung });
      await loadStaff(); alert(`${actionName} thành công!`);
    } catch (e) { alert('Lỗi: ' + e.message); }
    finally { setLoading(false); }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingStaff) { await adminService.updateStaff(editingStaff.MaNhanVien, formData); alert('Cập nhật hồ sơ thành công!'); }
      else { await adminService.addStaff(formData); alert('Thêm nhân viên thành công!'); }
      await loadStaff(); setIsModalOpen(false);
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };

  const openPermissions = (person) => {
    setSelectedStaff(person);
    const perms = person.Role === 'Admin' ? [...PERMISSIONS] : person.Role === 'Manager'
      ? [PERMISSIONS[0], PERMISSIONS[1], PERMISSIONS[2], PERMISSIONS[5], PERMISSIONS[6]]
      : [PERMISSIONS[0], PERMISSIONS[1]];
    setStaffPermissions(perms);
    setIsPermPanelOpen(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedStaff) return;
    setLoading(true);
    try {
      await adminService.updateStaff(selectedStaff.MaNhanVien, { Permissions: staffPermissions });
      alert(`Cập nhật quyền hạn cho ${selectedStaff.HoTen} thành công!`);
      setIsPermPanelOpen(false);
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };

  const filteredStaff = staff.filter(p => {
    const matchSearch = p.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.SoDienThoai.includes(searchQuery);
    return matchSearch && (roleFilter === 'All' || p.Role === roleFilter);
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý Nhân viên</h1>
          <p className="text-slate-500">Quản lý hồ sơ và phân quyền truy cập cho nhân viên.</p>
        </div>
        <button onClick={openAdd} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer">
          + Thêm nhân viên
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input type="text" placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer">
          <option value="All" className="bg-[#0f1117]">Tất cả vai trò</option>
          <option value="Admin" className="bg-[#0f1117]">Admin</option>
          <option value="Manager" className="bg-[#0f1117]">Quản lý</option>
          <option value="Staff" className="bg-[#0f1117]">Nhân viên</option>
        </select>
      </div>

      {/* Table */}
      {loading && staff.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <PersonnelTable staff={filteredStaff} onEdit={openEdit} onToggleStatus={handleToggleStatus} onOpenPermissions={openPermissions} />
        </div>
      )}

      <PersonnelModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff} formData={formData}
        onChange={handleInputChange} onSubmit={handleFormSubmit}
      />
      <PermissionPanel
        isOpen={isPermPanelOpen} onClose={() => setIsPermPanelOpen(false)}
        selectedStaff={selectedStaff} staffPermissions={staffPermissions}
        onToggle={(perm) => setStaffPermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])}
        onSave={handleSavePermissions}
      />
    </AdminLayout>
  );
};

export default Personnel;
