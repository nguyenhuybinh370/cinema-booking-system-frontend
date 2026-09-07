import { cloneElement, isValidElement, useId } from 'react';

const FormField = ({ label, required = false, helperText, error, children, className = '' }) => {
  const generatedId = useId();
  const controlId = isValidElement(children) ? (children.props.id || generatedId) : generatedId;
  const control = isValidElement(children) ? cloneElement(children, { id: controlId, 'aria-invalid': Boolean(error) }) : children;

  return (
    <div className={`admin-form-field ${className}`}>
      <label htmlFor={controlId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {error ? <p className="admin-field-error" role="alert">{error}</p> : helperText && <p>{helperText}</p>}
    </div>
  );
};

export default FormField;
