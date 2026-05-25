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
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#FFB000] font-black">
            PREMIUM STAFF OPERATIONS SCHEDULE
          </span>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
            Lịch Làm Việc Tuần
          </h1>
        </div>

        <div className="bg-[#131A2A] border border-white/[0.08] rounded-lg px-2 py-1 flex items-center shrink-0 shadow-lg">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-2 hover:bg-white/5 rounded transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="px-4 py-1.5 flex items-center gap-2 font-bold text-xs min-w-[220px] justify-center text-[#FFB000]">
            <CalendarIcon size={14} className="filter drop-shadow-[0_0_5px_rgba(255,176,0,0.4)]" />
            <span className="tracking-widest uppercase font-mono">{weekDisplayTitle.replace("Tuần:", "TUẦN:")}</span>
          </div>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-2 hover:bg-white/5 rounded transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <ChevronRight size={16} />
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
          <div className="w-12 h-12 border-4 border-[#FFB000] border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-glow text-[#FFB000] text-sm">Đang tải lịch làm việc...</span>
        </div>
      ) : (
        <div className="bg-[#131A2A]/60 border border-white/[0.06] rounded-2xl p-4 flex-1 overflow-x-auto min-h-[480px] shadow-2xl">
          <div className="min-w-[1000px] grid grid-cols-7 divide-x divide-white/[0.06] h-full">
            {currentWeek.map((day) => {
              const isToday = day.dateString === new Date().toISOString().split("T")[0];
              
              return (
                <div key={day.dateString} className={`flex flex-col gap-4 px-3 pb-2 ${isToday ? "bg-white/[0.01]" : ""}`}>
                  {/* Header Cell */}
                  <div className="text-center pb-3 pt-2 relative min-h-[64px] flex flex-col items-center justify-center">
                    <h3 className={`font-black text-[11px] uppercase tracking-wider ${isToday ? "text-[#FFB000]" : "text-slate-300"}`}>
                      {day.dayName} ({day.displayDate})
                    </h3>
                    {isToday && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFB000] text-slate-950 text-[8px] font-black uppercase rounded tracking-widest font-mono scale-90">
                        Hôm nay
                      </span>
                    )}
                    {/* Horizontal Line under Header */}
                    <div className={`absolute bottom-0 inset-x-0 h-[2px] ${isToday ? "bg-[#FFB000] shadow-[0_0_8px_rgba(255,176,0,0.8)]" : "bg-white/5"}`}></div>
                  </div>

                  {/* Cards List */}
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0 pt-2">
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
