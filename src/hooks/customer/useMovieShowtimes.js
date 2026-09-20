import { useMemo, useState } from 'react';

const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const toDateId = (value) => new Date(value).toISOString().slice(0, 10);

/** Gom suất chiếu theo ngày và quản lý lựa chọn hiện tại. */
const useMovieShowtimes = (showtimes = [], preferredShowtimeId) => {
  const [selection, setSelection] = useState({ dateId: '', slotIndex: 0 });

  const groupedShowtimes = useMemo(() => showtimes.reduce((groups, showtime) => {
    const dateId = toDateId(showtime.NgayChieu);
    groups[dateId] ??= [];
    groups[dateId].push(showtime);
    return groups;
  }, {}), [showtimes]);

  const realDates = useMemo(() => Object.keys(groupedShowtimes).sort().map((dateId) => {
    const date = new Date(dateId);
    return { id: dateId, dayName: DAYS_OF_WEEK[date.getDay()], dateNum: date.getDate() };
  }), [groupedShowtimes]);

  const preferred = useMemo(() => {
    const showtime = showtimes.find((item) => item.MaSuatChieu === preferredShowtimeId);
    if (!showtime) return null;
    const dateId = toDateId(showtime.NgayChieu);
    const slotIndex = (groupedShowtimes[dateId] || []).findIndex((item) => item.MaSuatChieu === preferredShowtimeId);
    return { dateId, slotIndex: Math.max(0, slotIndex) };
  }, [groupedShowtimes, preferredShowtimeId, showtimes]);

  const selectedDateId = groupedShowtimes[selection.dateId]
    ? selection.dateId
    : (preferred?.dateId || realDates[0]?.id || '');
  const availableSlots = useMemo(() => (groupedShowtimes[selectedDateId] || []).map((showtime) => ({
    ...showtime,
    time: showtime.GioChieu,
    showId: showtime.MaSuatChieu,
  })), [groupedShowtimes, selectedDateId]);
  const selectedSlotIndex = selection.dateId
    ? Math.min(selection.slotIndex, Math.max(0, availableSlots.length - 1))
    : (preferred?.slotIndex || 0);

  const handleSelectDate = (dateId) => setSelection({ dateId, slotIndex: 0 });
  const setSelectedSlotIndex = (slotIndex) => setSelection((current) => ({
    dateId: selectedDateId || current.dateId,
    slotIndex,
  }));

  return {
    realDates,
    selectedDateId,
    availableSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    handleSelectDate,
    hasShowtimes: showtimes.length > 0,
  };
};

export default useMovieShowtimes;
