/**
 * ProfileInfoTab — "Thông tin khách hàng" tab content.
 * Renders two forms: personal info & change password.
 * All state and handlers passed via props from Profile container.
 */
const ProfileInfoTab = ({
  profileLoading,
  profileError,
  userInfo,
  setUserInfo,
  saving,
  onSaveInfo,
  passwordData,
  setPasswordData,
  changingPassword,
  onUpdatePassword,
}) => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <h2 className="text-3xl font-black uppercase tracking-wider italic text-white">
        Thông Tin Khách Hàng
      </h2>

      {profileLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff436e]" />
          <p className="text-gray-400 ml-4">Đang tải thông tin...</p>
        </div>
      ) : profileError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-400 font-bold">{profileError}</p>
        </div>
      ) : (
        <>
          {/* KHỐI A: THÔNG TIN CÁ NHÂN */}
          <div className="bg-white p-6 rounded-2xl flex flex-col gap-6 text-slate-900 shadow-xl">
            <h3 className="text-xl font-extrabold border-b border-gray-100 pb-2 uppercase tracking-tight">
              Thông tin cá nhân
            </h3>

            <form onSubmit={onSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Ngày sinh</label>
                <input
                  type="date"
                  value={userInfo.dob}
                  onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Giới tính</label>
                <select
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                >
                  <option value="">Chưa cập nhật</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Tên đăng nhập</label>
                <input
                  type="text"
                  value={userInfo.username}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-3 text-sm font-medium cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 text-left mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>

          {/* KHỐI B: ĐỔI MẬT KHẨU */}
          <div className="bg-white p-6 rounded-2xl flex flex-col gap-6 text-slate-900 shadow-xl">
            <h3 className="text-xl font-extrabold border-b border-gray-100 pb-2 uppercase tracking-tight">
              Đổi mật khẩu
            </h3>

            <form onSubmit={onUpdatePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  Mật khẩu cũ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu cũ"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  Xác thực mật khẩu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div className="text-left mt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className={`bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {changingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfoTab;
