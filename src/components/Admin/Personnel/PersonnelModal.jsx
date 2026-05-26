import Modal from '../Common/Modal';

const PersonnelModal = ({ isOpen, onClose, editingStaff, formData, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingStaff ? 'Cập nhật hồ sơ nhân viên' : 'Thêm nhân viên mới'}>
    <form onSubmit={onSubmit} className="space-y-6">
      {editingStaff && (
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Mã nhân viên (Không thể sửa)', value: editingStaff.MaNhanVien },
            { label: 'Mã tài khoản (Không thể sửa)', value: editingStaff.MaTaiKhoan || 'Chưa liên kết' },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
              <input disabled readOnly value={value} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-mono text-sm font-bold" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ tên</label>
          <input type="text" name="HoTen" required placeholder="Nguyễn Văn A"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-bold text-sm"
            value={formData.HoTen} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
          <input type="text" name="SoDienThoai" required placeholder="0987654321"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-mono text-sm"
            value={formData.SoDienThoai} onChange={onChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email đăng nhập</label>
          <input type="email" name="Email" required placeholder="email@cinema.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white text-sm font-mono"
            value={formData.Email} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu</label>
          <input type="password" name="MatKhau" required placeholder="CinemaPlus@2026"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white text-sm"
            value={formData.MatKhau} onChange={onChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày sinh</label>
          <input type="date" name="NgaySinh" required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm font-mono"
            value={formData.NgaySinh} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giới tính</label>
          <select name="GioiTinh" value={formData.GioiTinh} onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm">
            <option value={1} className="bg-[#0f1117]">Nam</option>
            <option value={0} className="bg-[#0f1117]">Nữ</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chức vụ</label>
          <input type="text" name="ChucVu" required placeholder="VD: Quản lý ca"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white text-sm"
            value={formData.ChucVu} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò hệ thống</label>
          <select name="Role" value={formData.Role} onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm">
            <option value="Staff" className="bg-[#0f1117]">Staff (Nhân viên)</option>
            <option value="Manager" className="bg-[#0f1117]">Manager (Quản lý)</option>
            <option value="Admin" className="bg-[#0f1117]">Admin (Quản trị viên)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái khả dụng</label>
        <select name="KhaDung" value={formData.KhaDung} onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm">
          <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
          <option value={0} className="bg-[#0f1117]">0 (Chưa khả dụng)</option>
        </select>
      </div>

      {editingStaff && (
        <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
          <div>Ngày tạo: {editingStaff.NgayTao || '--:--'}</div>
          <div>Ngày cập nhật: {editingStaff.NgayCapNhat || 'Chưa cập nhật'}</div>
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose}
          className="flex-grow py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 text-xs uppercase tracking-widest cursor-pointer text-slate-400">
          Hủy
        </button>
        <button type="submit"
          className="flex-grow py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer">
          Lưu hồ sơ
        </button>
      </div>
    </form>
  </Modal>
);

export default PersonnelModal;
