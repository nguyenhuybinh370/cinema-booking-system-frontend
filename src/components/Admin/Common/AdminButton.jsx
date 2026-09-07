const variants = {
  primary: 'admin-button admin-button--primary',
  secondary: 'admin-button admin-button--secondary',
  outline: 'admin-button admin-button--outline',
  danger: 'admin-button admin-button--danger',
  ghost: 'admin-button admin-button--ghost',
};

const AdminButton = ({ children, variant = 'primary', icon: Icon, type = 'button', className = '', ...props }) => (
  <button type={type} className={`${variants[variant] || variants.primary} ${className}`} {...props}>
    {Icon && <Icon size={17} strokeWidth={1.8} aria-hidden="true" />}
    <span>{children}</span>
  </button>
);

export default AdminButton;
