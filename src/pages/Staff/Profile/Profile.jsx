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
      <div className="flex items-center justify-center h-64 text-white/50 font-bold uppercase tracking-wider">
        Đang tải thông tin hồ sơ...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-white/50 mt-2">
          Quản lý thông tin định danh và bảo mật tài khoản
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ID CARD */}
        <div className="w-full lg:w-1/3 glass-effect rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[var(--purple-glow)] to-transparent opacity-20"></div>
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[var(--btn-neon)] to-[var(--purple-glow)] relative z-10 mb-6 shadow-[0_0_30px_rgba(253,224,71,0.2)]">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-5xl font-black text-white">
              {staffInfo.fullName.charAt(0)}
            </div>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 bg-[var(--btn-neon)] text-slate-900 rounded-full hover:scale-110 transition-transform cursor-pointer"
            >
              <Edit3 size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 text-center">
            {staffInfo.fullName}
          </h2>
          <p className="text-[var(--btn-neon)] font-mono tracking-widest mb-6">
            {staffInfo.id}
          </p>

          <div className="w-full space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/50 text-sm">Chức vụ</span>
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Shield size={14} className="text-blue-400" />
                {staffInfo.role}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/50 text-sm">Trạng thái</span>
              <span className="font-bold text-sm text-green-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                {staffInfo.status}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full mt-8 py-3 rounded-xl border border-white/20 text-white/70 hover:text-[var(--btn-neon)] hover:border-[var(--btn-neon)] transition-colors flex items-center justify-center gap-2 font-bold text-sm uppercase cursor-pointer"
          >
            <Key size={16} /> Đổi Mật Khẩu
          </button>
        </div>

        {/* INFO DETAILS */}
        <div className="w-full lg:w-2/3 glass-effect rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold uppercase tracking-widest text-glow">
              Thông tin chi tiết
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
  <div>
    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50 mb-2">
      {icon} {label}
    </label>
    <p className="font-bold text-lg text-white">{value}</p>
  </div>
);

export default Profile;
