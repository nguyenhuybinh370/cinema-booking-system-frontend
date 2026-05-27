import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";
import UpdateInfoModal from "./UpdateInfoModal";
import ChangePasswordModal from "./ChangePasswordModal";
import StaffProfileCard from "./StaffProfileCard";
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
          <div className="w-12 h-12 border-4 border-[#FFB000] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-glow text-[#FFB000] text-sm">Đang tải thông tin hồ sơ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 py-2">
      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#FFB000] font-black">Thông tin tài khoản</span>
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Quản lý thông tin định danh cá nhân và bảo mật mật khẩu tài khoản trực
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ID CARD */}
        <StaffProfileCard
          staffInfo={staffInfo}
          onEditClick={() => setIsUpdateModalOpen(true)}
          onChangePasswordClick={() => setIsPasswordModalOpen(true)}
        />

        {/* INFO DETAILS */}
        <div className="w-full lg:w-2/3 bg-[#131A2A]/80 border border-white/[0.06] shadow-2xl rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-[#FFB000] text-glow">
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
  <div className="bg-[#0D1321]/60 p-4 rounded-xl border border-white/5">
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">
      <span className="text-[#FFB000]/75">{icon}</span> {label}
    </label>
    <p className="font-extrabold text-sm text-slate-200 tracking-wide">{value}</p>
  </div>
);

export default Profile;
