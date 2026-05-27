import { useState, useEffect } from "react";
import ScheduleHeader from "./ScheduleHeader";
import ShiftCalendar from "./ShiftCalendar";
import ShiftActionModal from "./ShiftActionModal";
import axiosClient from "../../../api/axiosClient";
import { generateWeek } from "../../../utils/dateHelper";
import { showSuccess, showError, getErrorMessage } from "../../../utils/toastHelper";

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
          showError("Lỗi hệ thống: Không tìm thấy mã định danh lịch đăng ký ca.");
          return;
        }
        await axiosClient.patch(`/staff/lich-lam-viec/${data.registrationId}/huy`);
        showSuccess("Hủy đăng ký ca làm việc thành công!");
      } else {
        // Register shift
        await axiosClient.post("/staff/lich-lam-viec/dang-ky", {
          MaCa: template.MaCa,
          NgayLamViec: dateString,
        });
        showSuccess("Đăng ký ca làm việc thành công!");
      }
      await loadWeekData(); // refresh data
    } catch (err) {
      console.error("Shift registration toggle error:", err);
      const msg = getErrorMessage(err, "Thao tác thất bại.");
      showError(msg);
    } finally {
      setSelectedShift(null);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 relative min-h-0">
      <ScheduleHeader
        setWeekOffset={setWeekOffset}
        weekDisplayTitle={weekDisplayTitle}
      />

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
        <ShiftCalendar
          currentWeek={currentWeek}
          shiftTemplates={shiftTemplates}
          shiftDetails={shiftDetails}
          onClick={handleCardClick}
        />
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
