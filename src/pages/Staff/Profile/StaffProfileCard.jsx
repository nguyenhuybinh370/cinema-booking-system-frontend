import { Edit3, Shield, Key } from "lucide-react";

const StaffProfileCard = ({ staffInfo, onEditClick, onChangePasswordClick }) => {
  return (
    <div className="w-full lg:w-1/3 bg-[#131A2A]/80 border border-white/[0.06] shadow-2xl rounded-2xl p-8 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#FFB000]/5 to-transparent pointer-events-none"></div>
      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FFB000] to-purple-500 relative z-10 mb-6 shadow-[0_0_30px_rgba(255,176,0,0.15)]">
        <div className="w-full h-full bg-[#0B1020] rounded-full flex items-center justify-center text-5xl font-black text-white select-none">
          {staffInfo.fullName.charAt(0)}
        </div>
        <button
          onClick={onEditClick}
          className="absolute bottom-0 right-0 p-2.5 bg-[#FFB000] text-slate-950 rounded-full hover:scale-110 shadow-[0_0_10px_rgba(255,176,0,0.3)] transition-all duration-300 cursor-pointer border border-transparent"
          title="Chỉnh sửa thông tin"
        >
          <Edit3 size={15} />
        </button>
      </div>
      <h2 className="text-xl font-black text-white mb-1 text-center uppercase tracking-wide">
        {staffInfo.fullName}
      </h2>
      <p className="text-[#FFB000] font-mono font-bold tracking-widest mb-6 text-xs text-glow">
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
        onClick={onChangePasswordClick}
        className="w-full mt-8 py-3 rounded-xl border border-slate-700/60 text-slate-300 hover:text-[#FFB000] hover:border-[#FFB000] transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer"
      >
        <Key size={14} /> Đổi Mật Khẩu
      </button>
    </div>
  );
};

export default StaffProfileCard;
