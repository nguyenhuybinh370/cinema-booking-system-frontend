import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShiftCard from "./ShiftCard";
import ShiftActionModal from "./ShiftActionModal";
import axiosClient from "../../../api/axiosClient";
import { generateWeek } from "../../../utils/dateHelper";

const Schedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeek = generateWeek(weekOffset);

  const startOfWeek = currentWeek[0];
  const endOfWeek = currentWeek[6];
  const weekDisplayTitle = `Tuần: ${startOfWeek.displayDate} - ${endOfWeek.displayDate}/${endOfWeek.year}`;

  const [shiftTemplates, setShiftTemplates] = useState([]);
  const [shiftDetails, setShiftDetails] = useState({});
  const [selectedShift, setSelectedShift] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeekData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const startOfWeekDateStr = currentWeek[0].dateString; // YYYY-MM-DD
      const endOfWeekDateStr = currentWeek[6].dateString; // YYYY-MM-DD

      // 1. Fetch own registered shifts for this week
      const myScheduleRes = await axiosClient.get(
        `/staff/lich-lam-viec/cua-toi?tuNgay=${startOfWeekDateStr}&denNgay=${endOfWeekDateStr}&limit=100`
      );
      const myRegs = myScheduleRes.schedules || myScheduleRes.data || [];

      // 2. Fetch available templates and counts for all 7 days of the week in parallel
      const daysDataPromises = currentWeek.map(async (day) => {
        try {
          const res = await axiosClient.get(
            `/staff/lich-lam-viec/ca-lam?ngayLamViec=${day.dateString}`
          );
          return {
            dateString: day.dateString,
            shifts: res.shifts || res.data || [],
          };
        } catch (err) {
          console.error(`Failed to load shifts for date ${day.dateString}`, err);
          return { dateString: day.dateString, shifts: [] };
        }
      });

      const allDaysData = await Promise.all(daysDataPromises);

      // 3. Aggregate all data into a client details map
      const details = {};
      let collectedTemplates = [];

      allDaysData.forEach((dayData) => {
        if (dayData.shifts.length > 0 && collectedTemplates.length === 0) {
          collectedTemplates = dayData.shifts;
        }

        dayData.shifts.forEach((shift) => {
          const key = `${dayData.dateString}_${shift.MaCa}`;

          // Find if this shift is registered by current staff member
          const myReg = myRegs.find(
            (reg) =>
              reg.CaLamViec.MaCa === shift.MaCa &&
              new Date(reg.NgayLamViec).toISOString().split("T")[0] === dayData.dateString
          );

          details[key] = {
            registeredCount: shift.SoNguoiDaDangKy || 0,
            isMyShift: !!myReg,
            registrationId: myReg ? myReg.MaChiTietCa : null,
            capacity: shift.SoNguoiToiDa,
            conTrong: shift.ConTrong,
            shiftObj: shift,
          };
        });
      });

      // If we got shift templates, save them
      if (collectedTemplates.length > 0) {
        setShiftTemplates(collectedTemplates);
      } else {
        // Fallback: fetch general templates if no counts loaded
        const fallbackRes = await axiosClient.get("/staff/lich-lam-viec/ca-lam?limit=20");
        const list = fallbackRes.shifts || fallbackRes.data || [];
        setShiftTemplates(list);
      }

      setShiftDetails(details);
    } catch (err) {
      console.error("Error loading week schedule data:", err);
      setError("Không thể tải thông tin lịch làm việc của tuần này.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeekData();
  }, [weekOffset]);

  const handleCardClick = (dateString, shiftTemplate) => {
    const shiftKey = `${dateString}_${shiftTemplate.MaCa}`;
    const shiftData = shiftDetails[shiftKey] || {
      registeredCount: 0,
      isMyShift: false,
      capacity: shiftTemplate.SoNguoiToiDa,
      conTrong: true,
    };

    setSelectedShift({
      key: shiftKey,
      dateString,
      template: shiftTemplate,
      data: shiftData,
    });
  };

  const handleToggleRegistration = async () => {
    if (!selectedShift) return;

    const { dateString, template, data } = selectedShift;
    const isCurrentlyRegistered = data.isMyShift;

    try {
      if (isCurrentlyRegistered) {
        // Soft-delete cancellation
        if (!data.registrationId) {
          alert("Lỗi hệ thống: Không tìm thấy mã định danh lịch đăng ký ca.");
          return;
        }
        await axiosClient.patch(`/staff/lich-lam-viec/${data.registrationId}/huy`);
        alert("Hủy đăng ký ca làm việc thành công!");
      } else {
        // Register shift
        await axiosClient.post("/staff/lich-lam-viec/dang-ky", {
          MaCa: template.MaCa,
          NgayLamViec: dateString,
        });
        alert("Đăng ký ca làm việc thành công!");
      }
      await loadWeekData(); // refresh data
    } catch (err) {
      console.error("Shift registration toggle error:", err);
      const msg = err.response?.data?.message || err.message || "Thao tác thất bại.";
      alert(msg);
    } finally {
      setSelectedShift(null);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 relative min-h-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--btn-neon)] font-black">Phân hệ ca trực</span>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
            Lịch Làm Việc
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Xem lịch trực cá nhân và đăng ký ca trực hàng tuần tại cụm rạp
          </p>
        </div>

        <div className="bg-[#131A2A]/80 border border-white/5 rounded-full p-1 flex items-center shrink-0 shadow-lg">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="px-5 py-1.5 flex items-center gap-2 font-bold text-xs min-w-[240px] justify-center text-white/90">
            <CalendarIcon size={14} className="text-[var(--btn-neon)] filter drop-shadow-[0_0_5px_rgba(255,176,0,0.4)]" />
            <span className="tracking-wide uppercase">{weekDisplayTitle}</span>
          </div>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 min-h-[350px] bg-[#131A2A]/40 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 font-bold uppercase tracking-wider">
          <div className="w-12 h-12 border-4 border-[var(--btn-neon)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-glow text-[var(--btn-neon)] text-sm">Đang tải lịch làm việc...</span>
        </div>
      ) : (
        <div className="bg-[#131A2A]/40 border border-white/5 rounded-3xl p-6 flex-1 overflow-x-auto min-h-[480px] shadow-2xl">
          <div className="min-w-[1000px] grid grid-cols-7 gap-4 h-full">
            {currentWeek.map((day) => {
              const isToday = day.dateString === new Date().toISOString().split("T")[0];
              
              return (
                <div key={day.dateString} className="flex flex-col gap-4">
                  <div className={`text-center pb-4 border-b shrink-0 py-3 rounded-2xl transition-all duration-300 ${
                    isToday 
                      ? "bg-[var(--btn-neon)]/10 border-[var(--btn-neon)]/30 text-[var(--btn-neon)] shadow-[0_0_15px_rgba(255,176,0,0.05)]" 
                      : "border-white/5 bg-slate-950/20"
                  }`}>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                      {day.dayName}
                    </h3>
                    <p className="text-[11px] text-[var(--btn-neon)] font-mono font-bold mt-0.5">
                      {day.displayDate}
                    </p>
                    {isToday && (
                      <span className="inline-block px-2 py-0.5 bg-[var(--btn-neon)] text-slate-950 text-[8px] font-black uppercase rounded mt-1.5 tracking-widest font-mono">
                        Hôm nay
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
                    {shiftTemplates.map((template) => (
                      <ShiftCard
                        key={template.MaCa}
                        day={day}
                        shiftTemplate={template}
                        shiftData={
                          shiftDetails[`${day.dateString}_${template.MaCa}`] || {
                            registeredCount: 0,
                            isMyShift: false,
                            capacity: template.SoNguoiToiDa,
                            conTrong: true,
                          }
                        }
                        onClick={handleCardClick}
                      />
                    ))}
                    {shiftTemplates.length === 0 && (
                      <div className="text-slate-600 text-center py-8 text-xs italic select-none">
                        Không có ca làm việc
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ShiftActionModal
        selectedShift={selectedShift}
        onClose={() => setSelectedShift(null)}
        onConfirm={handleToggleRegistration}
      />
    </div>
  );
};

export default Schedule;
