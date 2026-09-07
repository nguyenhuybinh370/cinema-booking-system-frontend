const FormField = ({ label, required = false, helperText, error, children, className = '' }) => (
  <div className={`admin-form-field ${className}`}>
    <label>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </label>
    {children}
    {error ? <p className="admin-field-error" role="alert">{error}</p> : helperText && <p>{helperText}</p>}
  </div>
);

export default FormField;
