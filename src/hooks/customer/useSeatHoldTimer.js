import { useState, useEffect, useRef } from 'react';
import { cancelHeldSeats } from '../../api/bookingApi';

/**
 * useSeatHoldTimer
 *
 * Manages the 10-minute countdown after seats are held.
 * Automatically cancels held seats when the timer expires.
 * Also registers an unmount cleanup to release seats if the user
 * navigates away before completing payment.
 *
 * @param {Function} onExpire – callback invoked when the 10-min timer hits zero
 */
const useSeatHoldTimer = (onExpire) => {
  const [heldSeatIds, setHeldSeatIds] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // seconds

  // Stable refs so cleanup closures always have fresh values
  const hasActiveHoldRef = useRef(false);
  const heldSeatIdsRef = useRef([]);
  const maSuatChieuRef = useRef('');
  const isPaymentSuccessRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  // Keep onExpireRef current without re-triggering effects
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  // Keep heldSeatIdsRef synced
  useEffect(() => { heldSeatIdsRef.current = heldSeatIds; }, [heldSeatIds]);

  // ── Unmount cleanup ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (
        hasActiveHoldRef.current &&
        !isPaymentSuccessRef.current &&
        heldSeatIdsRef.current.length > 0 &&
        maSuatChieuRef.current
      ) {
        cancelHeldSeats(maSuatChieuRef.current, heldSeatIdsRef.current).catch((err) =>
          console.error('Unmount cleanup: Failed to release held seats:', err)
        );
      }
    };
  }, []);

  // ── 10-minute countdown ───────────────────────────────────────────────────
  useEffect(() => {
    let timerId = null;
    if (heldSeatIds.length > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            onExpireRef.current?.();
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(600);
    }
    return () => { if (timerId) clearInterval(timerId); };
  }, [heldSeatIds]);

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Call after seats are successfully held via POST /dat-ve/giu-ghe */
  const activateHold = (seatIds, maSuatChieu) => {
    heldSeatIdsRef.current = seatIds;
    maSuatChieuRef.current = maSuatChieu;
    hasActiveHoldRef.current = true;
    isPaymentSuccessRef.current = false;
    setHeldSeatIds(seatIds);
    setTimeLeft(600);
  };

  /** Call after payment completes successfully */
  const markPaymentSuccess = () => {
    isPaymentSuccessRef.current = true;
    hasActiveHoldRef.current = false;
    setHeldSeatIds([]);
  };

  /** Cancel hold explicitly (back button, timer expiry) */
  const releaseHold = async () => {
    const seatIds = heldSeatIdsRef.current;
    const maSuatChieu = maSuatChieuRef.current;
    hasActiveHoldRef.current = false;
    setHeldSeatIds([]);
    if (seatIds.length > 0 && maSuatChieu) {
      try {
        await cancelHeldSeats(maSuatChieu, seatIds);
      } catch (err) {
        console.error('Failed to release held seats:', err);
      }
    }
  };

  return {
    heldSeatIds,
    timeLeft,
    hasActiveHoldRef,
    maSuatChieuRef,
    isPaymentSuccessRef,
    activateHold,
    markPaymentSuccess,
    releaseHold,
  };
};

export default useSeatHoldTimer;
