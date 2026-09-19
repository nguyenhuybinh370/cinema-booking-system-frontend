import { useState, useEffect, useRef } from 'react';
import adminService from '../../../services/adminService';
import { showSuccess, showError } from '../../../utils/toastHelper';
import { useClientPagination } from '../../../hooks/useClientPagination';
import { normalizePaymentMethod } from '../../../utils/paymentMethodHelper';

export default function useBookingTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  // Direct transaction refund states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const loadTransactions = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminService.getTransactions();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setLoadError('Không thể tải giao dịch. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadTransactions, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleOpenRefund = (tx) => {
    setSelectedTx(tx);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!selectedTx || !refundReason.trim() || submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    try {
      await adminService.refundTransaction(selectedTx.MaGiaoDich, refundReason);
      await loadTransactions();
      setIsRefundModalOpen(false);
      showSuccess('Đã ghi nhận hoàn tiền và hủy vé trong hệ thống.');
    } catch (error) {
      console.error("Failed to refund transaction:", error);
      showError(error.message || 'Đã xảy ra lỗi khi ghi nhận hoàn tiền.');
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = useClientPagination(
    transactions,
    ['MaGiaoDich', 'MaPhieuDatVe', 'MaThamChieuDoiTac', 'KhachHang', 'Phim'],
    (t, f) => {
      const matchStatus = !f.status || f.status === 'All' || t.TrangThai === f.status;
      const transactionMethod = normalizePaymentMethod(t.PhuongThucThanhToan || t.PhuongThuc);
      const filterMethod = normalizePaymentMethod(f.method);
      const matchMethod = !f.method || f.method === 'All' || transactionMethod === filterMethod;
      return matchStatus && matchMethod;
    }
  );


  return { loading, loadError, loadTransactions, isSubmitting, isRefundModalOpen, setIsRefundModalOpen, selectedTx, refundReason, setRefundReason, handleOpenRefund, handleRefundSubmit, searchQuery, setSearchQuery, filters, setFilterVal, page, setPage, pageSize, setPageSize, totalItems, paginatedItems };
}
