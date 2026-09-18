import { useCallback, useState, useEffect, useRef } from 'react';
import adminService from '../../../services/adminService';
import { showSuccess, showError } from '../../../utils/toastHelper';

export default function useRefundRequests(activeTab) {
  const requestVersion = useRef(0);
  const detailVersion = useRef(0);
  const submitting = useRef(false);
  const [refundRequests, setRefundRequests] = useState([]);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundPagination, setRefundPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [refundFilters, setRefundFilters] = useState({
    trangThai: '',
    keyword: ''
  });
  const [keywordInput, setKeywordInput] = useState('');

  // Approve / Reject modal states
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [activeRefund, setActiveRefund] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setRefundFilters(prev => ({ ...prev, keyword: keywordInput }));
      setRefundPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [keywordInput]);

  const loadRefundRequests = useCallback(async () => {
    const version = ++requestVersion.current;
    setRefundLoading(true);
    try {
      const res = await adminService.getRefundRequests({
        page: refundPagination.page,
        limit: refundPagination.limit,
        trangThai: refundFilters.trangThai || undefined,
        keyword: refundFilters.keyword || undefined
      });
      if (version !== requestVersion.current) return;
      setRefundRequests(res.data || []);
      setRefundPagination(prev => ({
        ...prev,
        total: res.pagination?.total || 0,
        totalPages: res.pagination?.totalPages || 1
      }));
    } catch (error) {
      if (version !== requestVersion.current) return;
      console.error("Failed to load refund requests:", error);
      showError("Lỗi khi tải danh sách yêu cầu hoàn tiền!");
    } finally {
      if (version === requestVersion.current) setRefundLoading(false);
    }
  }, [refundPagination.page, refundPagination.limit, refundFilters.trangThai, refundFilters.keyword]);

  useEffect(() => {
    if (activeTab !== 'refunds') return undefined;
    const timeoutId = window.setTimeout(loadRefundRequests, 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestVersion.current += 1;
    };
  }, [activeTab, loadRefundRequests]);

  const handleOpenDetail = async (refund) => {
    const version = ++detailVersion.current;
    setActiveRefund(refund);
    setIsDetailModalOpen(true);
    try {
      const freshData = await adminService.getRefundRequestDetail(refund.MaHoanTien);
      if (freshData && version === detailVersion.current) {
        setActiveRefund(freshData);
      }
    } catch (error) {
      console.error("Failed to load refund details:", error);
    }
  };

  const handleOpenApproveConfirm = (refund) => {
    detailVersion.current += 1;
    setActiveRefund(refund);
    setIsConfirmApproveOpen(true);
  };

  const handleApproveSubmit = async () => {
    if (!activeRefund || submitting.current) return;
    submitting.current = true;
    setIsActionLoading(true);
    try {
      await adminService.approveRefundRequest(activeRefund.MaHoanTien, { GhiChu: "Đã duyệt hoàn tiền." });
      showSuccess("Đã duyệt yêu cầu hoàn tiền thành công!");
      setIsConfirmApproveOpen(false);
      await loadRefundRequests();
      if (isDetailModalOpen && activeRefund) {
        handleOpenDetail(activeRefund);
      }
    } catch (error) {
      console.error("Failed to approve refund:", error);
      showError(error.message || "Lỗi khi duyệt yêu cầu hoàn tiền!");
    } finally {
      submitting.current = false;
      setIsActionLoading(false);
    }
  };

  const handleOpenRejectModal = (refund) => {
    detailVersion.current += 1;
    setActiveRefund(refund);
    setRejectReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!activeRefund || !rejectReasonInput.trim() || submitting.current) return;
    submitting.current = true;
    setIsActionLoading(true);
    try {
      await adminService.rejectRefundRequest(activeRefund.MaHoanTien, { LyDoTuChoi: rejectReasonInput });
      showSuccess("Đã từ chối yêu cầu hoàn tiền thành công!");
      setIsRejectModalOpen(false);
      await loadRefundRequests();
      if (isDetailModalOpen && activeRefund) {
        handleOpenDetail(activeRefund);
      }
    } catch (error) {
      console.error("Failed to reject refund:", error);
      showError(error.message || "Lỗi khi từ chối yêu cầu hoàn tiền!");
    } finally {
      submitting.current = false;
      setIsActionLoading(false);
    }
  };


  return { refundRequests, refundLoading, refundPagination, setRefundPagination, refundFilters, setRefundFilters, keywordInput, setKeywordInput, isConfirmApproveOpen, setIsConfirmApproveOpen, isRejectModalOpen, setIsRejectModalOpen, activeRefund, rejectReasonInput, setRejectReasonInput, isActionLoading, isDetailModalOpen, setIsDetailModalOpen, handleOpenDetail, handleOpenApproveConfirm, handleApproveSubmit, handleOpenRejectModal, handleRejectSubmit };
}
