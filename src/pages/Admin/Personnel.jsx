import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { Search, ShieldCheck, UserX, UserCheck, Edit2, X } from 'lucide-react';

const Personnel = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals / Panels state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermPanelOpen, setIsPermPanelOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Form state
  const [formData, setFormData] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    ChucVu: '',
    Role: 'Staff',
    Status: 'Active'
  });

  const [staffPermissions, setStaffPermissions] = useState([]);

  const permissionsList = [
    'Quản lý phòng chiếu', 'Quản lý phim', 'Cấu hình sơ đồ ghế',
    'Cấu hình bảng giá', 'Quản lý Nhân viên', 'Quản lý suất chiếu', 'Xem thống kê'
  ];

  const loadStaff = async () => {
    const data = await adminService.getStaff();
    setStaff(data);
  };

  useEffect(() => {
    let ignore = false;
    const fetchStaff = async () => {
      const data = await adminService.getStaff();
      if (!ignore) {
        setStaff(data);
        setLoading(false);
      }
    };
    fetchStaff();
    return () => { ignore = true; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      HoTen: '',
      SoDienThoai: '',
      Email: '',
      ChucVu: '',
      Role: 'Staff',
      Status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person) => {
    setEditingStaff(person);
    setFormData({
      HoTen: person.HoTen,
      SoDienThoai: person.SoDienThoai,
      Email: person.Email,
      ChucVu: person.ChucVu,
      Role: person.Role,
      Status: person.Status
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (person) => {
    const newStatus = person.Status === 'Active' ? 'Inactive' : 'Active';
    setLoading(true);
    try {
      await adminService.updateStaff(person.MaNhanVien, { Status: newStatus });
      await loadStaff();
    } catch (e) {
      alert("Lỗi: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingStaff) {
        await adminService.updateStaff(editingStaff.MaNhanVien, formData);
      } else {
        const newCode = Math.floor(1000 + Math.random() * 9000);
        await adminService.addStaff({
          MaNhanVien: `NV-${newCode}`,
          ...formData,
          KhaDung: 1
        });
      }
      await loadStaff();
      setIsModalOpen(false);
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPermissions = (person) => {
    setSelectedStaff(person);
    // Mock user permissions - say they have the first 3 if they are Staff, or all if Admin
    const initialPerms = person.Role === 'Admin'
      ? [...permissionsList]
      : person.Role === 'Manager'
        ? [permissionsList[0], permissionsList[1], permissionsList[2], permissionsList[5], permissionsList[6]]
        : [permissionsList[0], permissionsList[1]];
    setStaffPermissions(initialPerms);
    setIsPermPanelOpen(true);
  };

  const handleTogglePermissionCheckbox = (perm) => {
    if (staffPermissions.includes(perm)) {
      setStaffPermissions(staffPermissions.filter(p => p !== perm));
    } else {
      setStaffPermissions([...staffPermissions, perm]);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedStaff) return;
    setLoading(true);
    try {
      // In a real app, save permissions mapping. For now, show alert.
      await adminService.updateStaff(selectedStaff.MaNhanVien, {
        Permissions: staffPermissions
      });
      alert(`Đã cập nhật quyền hạn cho ${selectedStaff.HoTen} thành công!`);
      setIsPermPanelOpen(false);
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter staff list
  const filteredStaff = staff.filter(person => {
    const matchesSearch =
      person.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.SoDienThoai.includes(searchQuery);

    const matchesRole = roleFilter === 'All' || person.Role === roleFilter;

    return matchesSearch && matchesRole && person.KhaDung !== 0;
  });

  const columns = [
    {
      header: 'Nhân viên',
      render: (person) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
            {person.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{person.HoTen}</span>
            <span className="text-xs text-slate-500">{person.Email}</span>
          </div>
        </div>
      )
    },
    { header: 'Chức vụ', accessor: 'ChucVu', className: 'text-sm text-slate-400 font-medium' },
    {
      header: 'Vai trò',
      render: (person) => <StatusBadge status={person.Role} />
    },
    {
      header: 'Trạng thái',
      render: (person) => <StatusBadge status={person.Status} />
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (person) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenPermissions(person)}
            className="p-2 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 rounded-xl transition-all cursor-pointer"
            title="Phân quyền"
          >
            <ShieldCheck size={18} />
          </button>
          <button
            onClick={() => handleOpenEdit(person)}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => handleToggleStatus(person)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${person.Status === 'Active'
                ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500'
                : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'
              }`}
            title={person.Status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {person.Status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý Nhân viên</h1>
          <p className="text-slate-500">Quản lý hồ sơ và phân quyền truy cập cho nhân viên.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="All" className="bg-[#0f1117]">Tất cả vai trò</option>
          <option value="Admin" className="bg-[#0f1117]">Admin</option>
          <option value="Manager" className="bg-[#0f1117]">Quản lý</option>
          <option value="Staff" className="bg-[#0f1117]">Nhân viên</option>
        </select>
      </div>

      {/* Table */}
      {loading && staff.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : (
        <AdminTable columns={columns} data={filteredStaff} rowKey="MaNhanVien" />
      )}

      {/* Permission Panel (Slide-in) */}
      {isPermPanelOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPermPanelOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0f1117] h-screen shadow-2xl border-l border-white/10 p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Phân quyền hệ thống</h3>
              <button onClick={() => setIsPermPanelOpen(false)} className="p-2 hover:bg-white/5 rounded-xl cursor-pointer"><X size={20} /></button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl mb-8 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-xl">
                {selectedStaff?.HoTen.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white">{selectedStaff?.HoTen}</h4>
                <p className="text-xs text-slate-500">{selectedStaff?.Role} • {selectedStaff?.ChucVu}</p>
              </div>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto pr-1 no-scrollbar">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Danh sách quyền hạn</p>
              {permissionsList.map((perm, idx) => (
                <label key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] cursor-pointer border border-transparent hover:border-white/5 transition-all group">
                  <span className="text-sm text-slate-300 group-hover:text-white">{perm}</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-white/10 bg-white/5 accent-red-500 cursor-pointer"
                    checked={staffPermissions.includes(perm)}
                    onChange={() => handleTogglePermissionCheckbox(perm)}
                  />
                </label>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 mt-4">
              <button
                onClick={handleSavePermissions}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all uppercase tracking-widest text-xs cursor-pointer"
              >
                Cập nhật quyền hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? "Cập nhật hồ sơ nhân viên" : "Thêm nhân viên mới"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ tên</label>
              <input
                type="text"
                name="HoTen"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white font-bold"
                placeholder="Nguyễn Văn A"
                value={formData.HoTen}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
              <input
                type="text"
                name="SoDienThoai"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white font-mono"
                placeholder="0987654321"
                value={formData.SoDienThoai}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email đăng nhập</label>
            <input
              type="email"
              name="Email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white"
              placeholder="email@cinema.com"
              value={formData.Email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chức vụ</label>
              <input
                type="text"
                name="ChucVu"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-white"
                placeholder="VD: Quản lý ca"
                value={formData.ChucVu}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò hệ thống</label>
              <select
                name="Role"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-slate-300 text-sm"
                value={formData.Role}
                onChange={handleInputChange}
              >
                <option className="bg-[#0f1117]" value="Staff">Staff (Nhân viên)</option>
                <option className="bg-[#0f1117]" value="Manager">Manager (Quản lý)</option>
                <option className="bg-[#0f1117]" value="Admin">Admin (Quản trị viên)</option>
              </select>
            </div>
          </div>

          {!editingStaff && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu ban đầu</label>
              <input type="password" disabled className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500" value="CinemaPlus@2026" />
              <p className="text-[10px] text-slate-600 italic">Mật khẩu mặc định sẽ được gửi qua email nhân viên.</p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-grow py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-grow py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer"
            >
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Personnel;
