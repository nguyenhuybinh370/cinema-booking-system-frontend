export const UPCOMING_SHOWS = [
  {
    movie: {
      id: "M1",
      title: "DUNE: PART TWO",
      genre: "Sci-Fi, Action",
      duration: 166,
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcJsV.jpg",
    },
    showtime: {
      id: "S2",
      time: "13:30",
      room: "Phòng IMAX",
      basePrice: 60000,
      roomSurcharge: 30000,
      daySurcharge: 10000,
    },
    booked: 120,
    total: 150,
  },
  {
    movie: {
      id: "M2",
      title: "KUNG FU PANDA 4",
      genre: "Animation, Comedy",
      duration: 94,
      poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    },
    showtime: {
      id: "S4",
      time: "14:00",
      room: "Phòng 3 (Standard)",
      basePrice: 50000,
      roomSurcharge: 0,
      daySurcharge: 0,
    },
    booked: 85,
    total: 100,
  },
  {
    movie: {
      id: "M3",
      title: "GODZILLA X KONG",
      genre: "Action, Sci-Fi",
      duration: 115,
      poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEtHZpALq1.jpg",
    },
    showtime: {
      id: "S6",
      time: "14:45",
      room: "Phòng IMAX",
      basePrice: 70000,
      roomSurcharge: 30000,
      daySurcharge: 15000,
    },
    booked: 40,
    total: 120,
  },
];

export const SHIFT_STATS = {
  revenue: 3450000,
  ticketsSold: 42,
  ticketsChecked: 28,
  shiftName: "Ca Sáng (08:00 - 16:00)",
};

export const RECENT_TRANSACTIONS = [
  {
    id: "PDV-8A2B3C4D",
    time: "11:42",
    type: "Bán vé tại quầy",
    amount: 255000,
    status: "Thành công",
  },
  {
    id: "PDV-9E0F1G2H",
    time: "11:38",
    type: "Bán vé tại quầy",
    amount: 180000,
    status: "Thành công",
  },
  {
    id: "SV-3I4J5K6L",
    time: "11:30",
    type: "Soát vé cửa rạp",
    amount: 0,
    status: "Hợp lệ",
  },
];
