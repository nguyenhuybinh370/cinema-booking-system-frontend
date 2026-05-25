import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Shield, Key, Edit3 } from "lucide-react";
import UpdateInfoModal from "./UpdateInfoModal";
import ChangePasswordModal from "./ChangePasswordModal";
import axiosClient from "../../../api/axiosClient";

const Profile = () => {
  const [staffInfo, setStaffInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get("/staff/ho-so");
      const mapped = {
        id: data.MaNhanVien,
        fullName: data.HoTen,
        email: data.Email,
        phone: data.SoDienThoai,
        gender: data.GioiTinh === true ? "Nam" : data.GioiTinh === false ? "Nữ" : "Chưa cập nhật",
        dob: data.NgaySinh ? new Date(data.NgaySinh).toISOString().split("T")[0] : "",
        role: data.ChucVu,
        joinDate: data.NgayTao ? new Date(data.NgayTao).toLocaleDateString("vi-VN") : "",
        status: data.KhaDung ? "Đang hoạt động" : "Bị vô hiệu hóa",
      };
      setStaffInfo(mapped);
      setEditForm(mapped);
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        HoTen: editForm.fullName,
        Email: editForm.email,
        SoDienThoai: editForm.phone,
        GioiTinh: editForm.gender === "Nam" ? true : editForm.gender === "Nữ" ? false : null,
        NgaySinh: editForm.dob ? new Date(editForm.dob).toISOString() : null,
      };

      await axiosClient.put("/staff/ho-so", payload);
      alert("Cập nhật thông tin cá nhân thành công!");
      await loadProfile();
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.response?.data?.message || err.message || "Cập nhật thông tin thất bại.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Xác nhận mật khẩu mới không khớp!");
      return;
    }

    try {
      const payload = {
        MatKhauCu: passwordForm.oldPassword,
        MatKhauMoi: passwordForm.newPassword,
        XacNhanMatKhauMoi: passwordForm.confirmPassword,
      };

      await axiosClient.put("/staff/doi-mat-khau", payload);
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setIsPasswordModalOpen(false);

      // Clean tokens and force log in again
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      window.location.href = "/login";
    } catch (err) {
      console.error("Change password error:", err);
      alert(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại.");
    }
  };

  const formatDOB = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  if (isLoading || !staffInfo) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--btn-neon)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-glow text-[var(--btn-neon)] text-sm">Đang tải thông tin hồ sơ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8">
      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--btn-neon)] font-black">Thông tin tài khoản</span>
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Quản lý thông tin định danh cá nhân và bảo mật mật khẩu tài khoản trực
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ID CARD */}
        <div className="w-full lg:w-1/3 bg-[#131A2A]/40 border border-white/5 shadow-2xl rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[var(--btn-neon)]/5 to-transparent pointer-events-none"></div>
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[var(--btn-neon)] to-violet-500 relative z-10 mb-6 shadow-[0_0_30px_rgba(255,176,0,0.15)]">
            <div className="w-full h-full bg-[#0B1020] rounded-full flex items-center justify-center text-5xl font-black text-white select-none">
              {staffInfo.fullName.charAt(0)}
            </div>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="absolute bottom-0 right-0 p-2.5 bg-[var(--btn-neon)] text-slate-950 rounded-full hover:scale-110 shadow-[0_0_10px_rgba(255,176,0,0.3)] transition-all duration-300 cursor-pointer border border-transparent"
              title="Chỉnh sửa thông tin"
            >
              <Edit3 size={15} />
            </button>
          </div>
          <h2 className="text-2xl font-black text-white mb-1 text-center uppercase tracking-wide">
            {staffInfo.fullName}
          </h2>
          <p className="text-[var(--btn-neon)] font-mono font-bold tracking-widest mb-6 text-xs text-glow">
            ID: {staffInfo.id}
          </p>

          <div className="w-full space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-950/30 rounded-xl border border-white/5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Chức vụ</span>
              <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <Shield size={14} className="text-blue-400" />
                {staffInfo.role}
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-950/30 rounded-xl border border-white/5">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Trạng thái</span>
              <span className="font-extrabold text-xs text-green-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                {staffInfo.status}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full mt-8 py-3 rounded-xl border border-slate-700/60 text-slate-300 hover:text-[var(--btn-neon)] hover:border-[var(--btn-neon)] transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <Key size={14} /> Đổi Mật Khẩu
          </button>
        </div>

        {/* INFO DETAILS */}
        <div className="w-full lg:w-2/3 bg-[#131A2A]/40 border border-white/5 shadow-2xl rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-[var(--btn-neon)] text-glow">
              📋 Thông tin chi tiết
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InfoItem
                label="Họ và Tên"
                value={staffInfo.fullName}
                icon={<User size={14} />}
              />
              <InfoItem
                label="Email"
                value={staffInfo.email}
                icon={<Mail size={14} />}
              />
              <InfoItem
                label="Số điện thoại"
                value={staffInfo.phone}
                icon={<Phone size={14} />}
              />
            </div>
            <div className="space-y-6">
              <InfoItem
                label="Giới tính"
                value={staffInfo.gender}
                icon={<User size={14} />}
              />
              <InfoItem
                label="Ngày sinh"
                value={formatDOB(staffInfo.dob)}
                icon={<Calendar size={14} />}
              />
              <InfoItem
                label="Ngày vào làm"
                value={staffInfo.joinDate}
                icon={<Calendar size={14} />}
              />
            </div>
          </div>
        </div>
      </div>

      <UpdateInfoModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        formData={editForm}
        setFormData={setEditForm}
        onSave={handleUpdateSubmit}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        formData={passwordForm}
        setFormData={setPasswordForm}
        onSave={handlePasswordSubmit}
      />
    </div>
  );
};

// Helper component
const InfoItem = ({ label, value, icon }) => (
  <div className="bg-slate-950/20 p-4 rounded-2xl border border-white/5">
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1.5">
      <span className="text-[var(--btn-neon)]/75">{icon}</span> {label}
    </label>
    <p className="font-extrabold text-base text-slate-200 tracking-wide">{value}</p>
  </div>
);

export default Profile;
