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
    <div className="flex flex-col h-full space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
            Lịch Làm Việc
          </h1>
          <p className="text-white/50 mt-2">
            Xem lịch và đăng ký ca làm việc hàng tuần
          </p>
        </div>

        <div className="staff-card-flat rounded-full p-1 flex items-center shrink-0">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 py-2 flex items-center gap-2 font-bold text-sm min-w-[220px] justify-center">
            <CalendarIcon size={16} className="text-[var(--btn-neon)]" />
            <span>{weekDisplayTitle}</span>
          </div>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-semibold text-center">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 staff-card-flat rounded-3xl p-12 flex items-center justify-center text-white/50 font-bold uppercase tracking-wider">
          Đang tải lịch làm việc...
        </div>
      ) : (
        <div className="staff-card-flat rounded-3xl p-6 flex-1 overflow-x-auto min-h-[450px]">
          <div className="min-w-[1000px] grid grid-cols-7 gap-4 h-full">
            {currentWeek.map((day) => (
              <div key={day.dateString} className="flex flex-col gap-4">
                <div className="text-center pb-4 border-b border-white/10 shrink-0">
                  <h3 className="font-bold text-lg text-white">{day.dayName}</h3>
                  <p className="text-xs text-[var(--btn-neon)] font-mono mt-1">
                    {day.displayDate}
                  </p>
                </div>
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
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
                    <div className="text-white/20 text-center py-8 text-xs italic">
                      Không có ca làm
                    </div>
                  )}
                </div>
              </div>
            ))}
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
