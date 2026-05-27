import { 
  SHOWTIMES, 
  ROOMS, 
  TICKET_RECEIPTS, 
  TICKET_DETAILS, 
  SHOWTIME_SEATS, 
  TRANSACTIONS, 
  ADMIN_MOVIES 
} from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const statsService = {
  getRevenueStats: async (filters = {}) => {
    await delay();
    const { startDate, endDate, maPhim, maPhongChieu } = filters;

    // Filter showtimes
    let filteredShowtimes = SHOWTIMES.filter(st => {
      if (maPhim && st.MaPhim !== maPhim) return false;
      if (maPhongChieu && st.MaPhongChieu !== maPhongChieu) return false;
      if (startDate && st.NgayChieu < startDate) return false;
      if (endDate && st.NgayChieu > endDate) return false;
      return true;
    });

    const showtimeIds = new Set(filteredShowtimes.map(st => st.MaSuatChieu));

    // Get ticket receipts that match date filter
    let filteredReceipts = TICKET_RECEIPTS.filter(r => {
      const dateStr = r.NgayDat.substring(0, 10);
      if (startDate && dateStr < startDate) return false;
      if (endDate && dateStr > endDate) return false;
      return true;
    });

    const receiptIds = new Set(filteredReceipts.map(r => r.MaPhieuDatVe));

    // Get matching details
    let matchingDetails = TICKET_DETAILS.filter(d => {
      if (!receiptIds.has(d.MaPhieuDatVe)) return false;
      
      const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === d.MaGheSuatChieu);
      if (!showtimeSeat || !showtimeIds.has(showtimeSeat.MaSuatChieu)) return false;
      
      return true;
    });

    // Calculate metrics
    let totalRevenue = 0;
    let ticketsSold = 0;

    matchingDetails.forEach(d => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === d.MaPhieuDatVe);
      if (receipt && receipt.TrangThai === 'Đã TT') {
        totalRevenue += parseFloat(d.GiaVe);
        ticketsSold += 1;
      }
    });

    // Deduct refunds
    const matchingReceiptIds = new Set(matchingDetails.map(d => d.MaPhieuDatVe));
    const refunds = TRANSACTIONS.filter(t => t.TrangThai === 'Refunded' && matchingReceiptIds.has(t.MaPhieuDatVe));
    const refundAmount = refunds.reduce((sum, r) => sum + parseFloat(r.SoTien), 0);
    totalRevenue = Math.max(0, totalRevenue - refundAmount);

    // Calculate total capacity
    let totalCapacity = 0;
    filteredShowtimes.forEach(st => {
      const room = ROOMS.find(r => r.MaPhongChieu === st.MaPhongChieu);
      totalCapacity += room ? room.SoGhe : 100;
    });

    const occupancyRate = totalCapacity > 0 ? ((ticketsSold / totalCapacity) * 100).toFixed(1) : '0.0';

    // Daily Revenue Chart Data
    const dailyMap = {};
    matchingDetails.forEach(d => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === d.MaPhieuDatVe);
      if (receipt && receipt.TrangThai === 'Đã TT') {
        const dateParts = receipt.NgayDat.substring(0, 10).split('-');
        const formattedDay = `${dateParts[2]}/${dateParts[1]}`;
        dailyMap[formattedDay] = (dailyMap[formattedDay] || 0) + parseFloat(d.GiaVe);
      }
    });
    refunds.forEach(ref => {
      const dateParts = ref.NgayGiaoDich.substring(0, 10).split('-');
      const formattedDay = `${dateParts[2]}/${dateParts[1]}`;
      dailyMap[formattedDay] = Math.max(0, (dailyMap[formattedDay] || 0) - parseFloat(ref.SoTien));
    });

    const dailyRevenueData = Object.entries(dailyMap).map(([day, revenue]) => ({
      day,
      revenue
    })).sort((a, b) => {
      const [da, ma] = a.day.split('/');
      const [db, mb] = b.day.split('/');
      return new Date(2026, ma - 1, da) - new Date(2026, mb - 1, db);
    });

    // Movie Revenue Chart Data
    const movieMap = {};
    matchingDetails.forEach(d => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === d.MaPhieuDatVe);
      if (receipt && receipt.TrangThai === 'Đã TT') {
        const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === d.MaGheSuatChieu);
        if (showtimeSeat) {
          const showtime = SHOWTIMES.find(st => st.MaSuatChieu === showtimeSeat.MaSuatChieu);
          if (showtime) {
            const movie = ADMIN_MOVIES.find(m => m.MaPhim === showtime.MaPhim);
            if (movie) {
              movieMap[movie.TenPhim] = (movieMap[movie.TenPhim] || 0) + parseFloat(d.GiaVe);
            }
          }
        }
      }
    });
    refunds.forEach(ref => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === ref.MaPhieuDatVe);
      if (receipt) {
        const detail = TICKET_DETAILS.find(d => d.MaPhieuDatVe === receipt.MaPhieuDatVe);
        if (detail) {
          const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === detail.MaGheSuatChieu);
          if (showtimeSeat) {
            const showtime = SHOWTIMES.find(st => st.MaSuatChieu === showtimeSeat.MaSuatChieu);
            if (showtime) {
              const movie = ADMIN_MOVIES.find(m => m.MaPhim === showtime.MaPhim);
              if (movie) {
                movieMap[movie.TenPhim] = Math.max(0, (movieMap[movie.TenPhim] || 0) - parseFloat(ref.SoTien));
              }
            }
          }
        }
      }
    });

    const movieRevenueData = Object.entries(movieMap).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value);

    // Room Occupancy Data
    const roomMap = {};
    ROOMS.forEach(r => {
      roomMap[r.TenPhong] = { tickets: 0, capacity: 0 };
    });

    filteredShowtimes.forEach(st => {
      const room = ROOMS.find(r => r.MaPhongChieu === st.MaPhongChieu);
      if (room) {
        roomMap[room.TenPhong].capacity += room.SoGhe;
      }
    });

    matchingDetails.forEach(d => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === d.MaPhieuDatVe);
      if (receipt && receipt.TrangThai === 'Đã TT') {
        const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === d.MaGheSuatChieu);
        if (showtimeSeat) {
          const showtime = SHOWTIMES.find(st => st.MaSuatChieu === showtimeSeat.MaSuatChieu);
          if (showtime) {
            const room = ROOMS.find(r => r.MaPhongChieu === showtime.MaPhongChieu);
            if (room) {
              roomMap[room.TenPhong].tickets += 1;
            }
          }
        }
      }
    });

    const roomOccupancyData = Object.entries(roomMap)
      .filter(([_, data]) => data.capacity > 0)
      .map(([name, data]) => ({
        name,
        value: Math.round((data.tickets / data.capacity) * 100)
      }));

    // Performance Details Table
    const performanceDetails = ADMIN_MOVIES.map(movie => {
      const showsCount = filteredShowtimes.filter(st => st.MaPhim === movie.MaPhim).length;
      let movieTickets = 0;
      let movieCapacity = 0;

      filteredShowtimes.filter(st => st.MaPhim === movie.MaPhim).forEach(st => {
        const room = ROOMS.find(r => r.MaPhongChieu === st.MaPhongChieu);
        movieCapacity += room ? room.SoGhe : 100;
      });

      matchingDetails.forEach(d => {
        const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === d.MaPhieuDatVe);
        if (receipt && receipt.TrangThai === 'Đã TT') {
          const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === d.MaGheSuatChieu);
          if (showtimeSeat) {
            const showtime = SHOWTIMES.find(st => st.MaSuatChieu === showtimeSeat.MaSuatChieu);
            if (showtime && showtime.MaPhim === movie.MaPhim) {
              movieTickets += 1;
            }
          }
        }
      });

      const fill = movieCapacity > 0 ? Math.round((movieTickets / movieCapacity) * 100) : 0;

      return {
        name: movie.TenPhim,
        shows: showsCount,
        tickets: movieTickets,
        fill: `${fill}%`
      };
    }).filter(p => p.shows > 0);

    let hotMovie = 'N/A';
    if (movieRevenueData.length > 0) {
      hotMovie = movieRevenueData[0].name;
    }

    return {
      totalRevenue,
      ticketsSold,
      occupancyRate: `${occupancyRate}%`,
      hotMovie,
      dailyRevenueData,
      movieRevenueData,
      roomOccupancyData,
      performanceDetails
    };
  },

  exportRevenueReport: async (format, filters = {}) => {
    await delay(1200);
    return {
      success: true,
      format,
      fileName: `BaoCaoDoanhThu_${new Date().toISOString().substring(0, 10)}_${Math.floor(Math.random() * 1000)}.${format === 'Excel' ? 'xlsx' : 'pdf'}`,
    };
  }
};

export default statsService;
