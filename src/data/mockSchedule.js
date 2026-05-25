export const SHIFT_TEMPLATES = [
  {
    id: "CA_SANG",
    name: "Ca Sáng",
    startTime: "08:00",
    endTime: "16:00",
    maxStaff: 5,
  },
  {
    id: "CA_CHIEU",
    name: "Ca Chiều",
    startTime: "16:00",
    endTime: "00:00",
    maxStaff: 6,
  },
];

export const INITIAL_SHIFT_DETAILS = {
  "2026-05-14_CA_SANG": { registeredCount: 5, isMyShift: false },
  "2026-05-14_CA_CHIEU": { registeredCount: 3, isMyShift: true },
  "2026-05-15_CA_SANG": { registeredCount: 2, isMyShift: false },
  "2026-05-16_CA_CHIEU": { registeredCount: 4, isMyShift: true },
};
