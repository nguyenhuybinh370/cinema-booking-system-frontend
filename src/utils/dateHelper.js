export const generateWeek = (offset = 0) => {
  const week = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + offset * 7);

  const currentDay = baseDate.getDay();
  const firstDay = new Date(baseDate);
  firstDay.setDate(
    baseDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
  );

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    week.push({
      dateString: date.toISOString().split("T")[0],
      dayName: i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`,
      displayDate: `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`,
      year: date.getFullYear(),
    });
  }
  return week;
};
