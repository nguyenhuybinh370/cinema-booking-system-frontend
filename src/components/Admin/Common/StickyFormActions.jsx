const StickyFormActions = ({ children, statusText = 'Các thay đổi chưa được lưu' }) => (
  <div className="admin-sticky-actions">
    <span>{statusText}</span>
    <div>{children}</div>
  </div>
);

export default StickyFormActions;
