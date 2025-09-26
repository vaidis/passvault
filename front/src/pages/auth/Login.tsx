import React, { useState } from "react";
import { useNavigate } from 'react-router';
import { useAuth } from '../../AuthContext';
import './Login.scss';

type FormData = {
  username: string;
  password: string;
};

const initialFormData: FormData = {
  username: "stevaidis",
  password: "1234",
};

const Login: React.FC = () => {
  console.log('Login.tsx');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // redirect after a while, after showing the success message
  React.useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown <= 0) {
      navigate("/data");
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  // insert allowed characters into fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^[\x21-\x7E]*$/.test(value)) {
      setErrorMessage('');
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setErrorMessage('Wrong character. Only printable characters allowed')
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const ok = await login(formData.username, formData.password);
      if (ok) navigate('/data');
    } catch (error) {
      console.log('error:', error);
    }
  };




  return (
    <div className="login">
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
        <h2 className="form__title">Login</h2>
        {["username", "password"].map((field) => (
          <div key={field} className="form__field">
            <label className="form__label">{capitalize(field)}</label>
            <input
              className="form__input"
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className="form__button">
          {isSubmitting ? "Login..." : "Login"}
        </button>
        {errorMessage && <p className="form__message form__message--error">{errorMessage}</p>}
        {successMessage && (
          <p className="form__message form__message--success">
            {successMessage}
            {redirectCountdown !== null && (
              <span> Redirecting in {redirectCountdown}...</span>
            )}
          </p>
        )}
      </form>
    </div>
  );
};

// Utility to format label text
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");


export default Login;
