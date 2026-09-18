import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let RefundDetail;
let DirectRefund;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  RefundDetail = (await server.ssrLoadModule('/src/pages/Admin/Transactions/RefundDetailModal.jsx')).default;
  DirectRefund = (await server.ssrLoadModule('/src/pages/Admin/Transactions/TransactionRefundModal.jsx')).default;
});
after(async () => { await server?.close(); });
const noop = () => {};
const detailProps = {
  isDetailModalOpen: true, setIsDetailModalOpen: noop,
  handleOpenApproveConfirm: noop, handleOpenRejectModal: noop,
};
const refund = { MaHoanTien: 'refund-test', SoTienHoan: 50000, LyDo: 'Đổi lịch', TrangThai: 'CHO_XU_LY' };

test('pending refund retains detail and both decision actions', () => {
  const html = renderToStaticMarkup(createElement(RefundDetail, { ...detailProps, activeRefund: refund }));
  assert.match(html, /refund-test/);
  assert.match(html, /Đổi lịch/);
  assert.match(html, /Duyệt hoàn tiền/);
  assert.match(html, /Từ chối/);
});

test('processed refund has no approval button', () => {
  const html = renderToStaticMarkup(createElement(RefundDetail, { ...detailProps, activeRefund: { ...refund, TrangThai: 'DA_HOAN' } }));
  assert.doesNotMatch(html, /Duyệt hoàn tiền/);
});

test('closed detail renders no dialog', () => {
  assert.equal(renderToStaticMarkup(createElement(RefundDetail, { ...detailProps, isDetailModalOpen: false, activeRefund: refund })), '');
});

function renderDirect(overrides = {}) {
  return renderToStaticMarkup(createElement(DirectRefund, {
    isRefundModalOpen: true, setIsRefundModalOpen: noop,
    selectedTx: { MaGiaoDich: 'tx-test', SoTien: 50000, KhachHang: 'Khách thử nghiệm' },
    refundReason: 'Đổi lịch', setRefundReason: noop, handleRefundSubmit: noop,
    ...overrides,
  }));
}

test('direct refund describes manual recording rather than a provider transfer', () => {
  assert.match(renderDirect(), /không tự chuyển tiền/);
  assert.match(renderDirect(), /Khách thử nghiệm/);
});

test('direct refund cannot submit while sending or without a reason', () => {
  assert.match(renderDirect({ isSubmitting: true }), /disabled=""[^>]*>Đang ghi nhận/);
  assert.match(renderDirect({ refundReason: '  ' }), /disabled=""[^>]*>Xác nhận đã hoàn tiền/);
  assert.doesNotMatch(renderDirect(), /disabled=""/);
});
