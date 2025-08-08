import React, { useState } from "react";
import * as CryptoJS from "crypto-js";
import {useParams, useNavigate } from 'react-router';
import {authApi} from '../../api/auth'

type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type RegisterResponse = {
  message: string;
};

const initialFormData: FormData = {
    email: "ste.vaidis@gmail.com",
    username: "stevaidis",
    password: "1234",
    confirmPassword: "1234",
};

const Register: React.FC = () => {
  const { registerId } = useParams<{ registerId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // redirect after a while after showing the success message
  React.useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      navigate("/auth/login");
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const { email, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const authSalt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const encryptSalt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const authProof = CryptoJS.PBKDF2("Secret Passphrase", authSalt, {
      keySize: 512 / 32,
      iterations: 10000
    }).toString(CryptoJS.enc.Hex);

    const body = {
      email,
      username,
      encryptSalt,
      authSalt,
      authProof,
    };

    try {
      const response = await authApi.register(body);
      console.log('register response:', response)

      if (!response.success) {
        throw new Error(response.message || "Registration failed.");
      }

      setSuccessMessage("Registration successful!");
      setFormData(initialFormData);
      setRedirectCountdown(3);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>User Registration</h2>

      {["email", "username", "password", "confirmPassword"].map((field) => (
        <div key={field} style={{ marginBottom: "1em" }}>
          <label>
            {field === "confirmPassword"
              ? "Confirm Password"
              : capitalize(field)}
            :
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
        {isSubmitting ? "Registering..." : "Register"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

export default Register;

// Utility to format label text
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");

