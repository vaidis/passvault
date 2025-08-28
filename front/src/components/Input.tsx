import React from 'react';
import './Input.scss';

export type Validator = (value: string) => string | null;

export type InputFieldProps = {
  id: string;
  name?: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (name: string, value: string) => void;
  onValidityChange: (name: string, isValid: boolean)=>void;
  validateLegalChars?: boolean;
  validateMinChars?: number;
  autoFocus?: boolean;
};

export default function InputField({
  id,
  name = id,
  label,
  type = 'text',
  value,
  onChange,
  onValidityChange,
  autoFocus = false,
  validateLegalChars = true,
  validateMinChars = 8,
}: InputFieldProps) {
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const prevValidityRef = React.useRef<boolean | null>(null);
  const prevErrorRef = React.useRef<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  const handleBlur = () => setTouched(true);

  const computeError = React.useCallback((val: string): string | null => {
    const required = validateMinChars > 0;
    const ILLEGAL = /[^a-zA-Z0-9\s.,!?@_-]/;
    // Validate: required and empty
    if (required && !val.trim()) return 'Empty field!';
    // Validate: illegal chars
    if (validateLegalChars && val && ILLEGAL.test(val)) return 'Illegal characters!';
    // Validate: required and min length
    if (required && val.length < validateMinChars) {
      return `Minimum characters: ${validateMinChars}`;
    }
    return null;
  }, [validateLegalChars, validateMinChars]);

  // Validate fields on every value change
  React.useEffect(() => {
    const hasValue = value.trim() !== '';

    // Don't validate on initial empty fields
    // to help parrent component to not show error messages on startup
    const isInteractive = touched || hasValue;
    if (!isInteractive) return;

    // Start validation
    const msg = computeError(value);
    const isValid = msg === null;

    if (msg !== prevErrorRef.current) {
      prevErrorRef.current = msg;
      setError(msg);
    }
    if (isValid !== prevValidityRef.current) {
      prevValidityRef.current = isValid;
      onValidityChange(name, isValid);
    }
  }, [value, touched, computeError, name, onValidityChange]);

  const rootClass = [
    'form-field',
    validateMinChars > 0 ? 'form-field--mandatory' : '',
    error ? 'form-field--invalid' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="form-field__input"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div id={`${id}-error`} className="form-field__error">
        {error && error}
      </div>
    </div>
  );
}
