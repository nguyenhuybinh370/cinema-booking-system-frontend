import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import PersonnelTable from '../../components/Admin/Personnel/PersonnelTable';
import PersonnelModal from '../../components/Admin/Personnel/PersonnelModal';
import { Search } from 'lucide-react';

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

  const filteredStaff = staff.filter(p => {
    return p.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.SoDienThoai.includes(searchQuery);
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý Nhân viên</h1>
          <p className="text-slate-500">Quản lý hồ sơ nhân viên rạp chiếu phim.</p>
        </div>
        <button onClick={openAdd} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer">
          + Thêm nhân viên
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input type="text" placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      {loading && staff.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <PersonnelTable staff={filteredStaff} onEdit={openEdit} onToggleStatus={handleToggleStatus} />
        </div>
      )}

      <PersonnelModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff} formData={formData}
        onChange={handleInputChange} onSubmit={handleFormSubmit}
      />
    </AdminLayout>
  );
};

export default Personnel;
