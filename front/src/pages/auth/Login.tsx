import React, { useState } from "react";
import {useNavigate } from 'react-router';
import {authApi} from '../../api/auth'
import type { ApiResponse, LoginFinishResponse } from "../../api/types";

type FormData = {
  username: string;
  password: string;
};

const initialFormData: FormData = {
  username: "stevaidis",
  password: "1234",
};

const Login: React.FC = () => {
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
      const response: ApiResponse<LoginFinishResponse> = await authApi.login(formData);
      if (response.success && response.data) {
        const encryptSalt = response.data.encryptSalt;
        console.log("encryptSalt", encryptSalt);
        setSuccessMessage("Registration successful!");
        setFormData(initialFormData);
        setRedirectCountdown(3);
        // redirect / UI update...
      } else {
        setErrorMessage(response.error.message);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      {["username", "password"].map((field) => (
        <div key={field} style={{ marginBottom: "1em" }}>
          <label>{capitalize(field)}
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      ))}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Login..." : "Login"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && (
        <p style={{ color: "green" }}>
          {successMessage}
          {redirectCountdown !== null && (
            <span> Redirecting in {redirectCountdown}...</span>
          )}
        </p>
      )}
    </form>
  );
};

// Utility to format label text
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");


export default Login;
