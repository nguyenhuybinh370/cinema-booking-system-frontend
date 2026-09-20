import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clientService from '../../services/clientService';

const BookingEntry = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const enterBookingFlow = async () => {
      const isCustomer = localStorage.getItem('accessToken') && localStorage.getItem('userRole') === 'CUSTOMER';
      if (!isCustomer) {
        navigate('/login', { replace: true, state: { from: `/booking/${showtimeId}` } });
        return;
      }

      try {
        const showtime = await clientService.getShowtimeById(showtimeId);
        if (!cancelled && showtime.MaPhim) {
          navigate(`/movie/${showtime.MaPhim}`, {
            replace: true,
            state: { preferredShowtimeId: showtimeId, startBooking: true },
          });
          return;
        }
        if (!cancelled) navigate('/404', { replace: true });
      } catch {
        if (!cancelled) navigate('/404', { replace: true });
      }
    };

    enterBookingFlow();
    return () => { cancelled = true; };
  }, [navigate, showtimeId]);

  return <div className="client-page-state"><span className="client-loader" /><p>Đang mở sơ đồ ghế...</p></div>;
};

export default BookingEntry;
