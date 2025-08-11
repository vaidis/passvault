import React, { useState } from "react";
// import * as CryptoJS from "crypto-js";
// import {useNavigate } from 'react-router';
import {authApi} from '../../api/auth'
import type { ApiResponse, LoginFinalResponse } from "../../api/types";

type FormData = {
  username: string;
  password: string;
};

const initialFormData: FormData = {
    username: "stevaidis",
    password: "1234",
};

const Login: React.FC = () => {
  // const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  
  // redirect after a while, after showing the success message
  //React.useEffect(() => {
  //  if (redirectCountdown === null) return;
  //
  //  if (redirectCountdown <= 0) {
  //    navigate("/data");
  //    return;
  //  }
  //
  //  const timer = setTimeout(() => {
  //    setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
  //  }, 1000);
  //
  //  return () => clearTimeout(timer);
  //}, [redirectCountdown, navigate]);

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


  // send authProof - get encrypted data


  // 1. send username
  // 2. get encryptSalt & authSalt
  // 3. user password & authSalt to create authProof
  // 4. send authProof
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    //const { username, password } = formData;

    try {
      // const response =  await authApi.login(formData);
      const response: ApiResponse<LoginFinalResponse> = await authApi.login(formData);

      if (response.success) {
        const encryptSalt: string = response.data.encryptSalt;
        console.log('authSalt', encryptSalt);
      } else {
        setErrorMessage(response.error.message);
      }
    } catch (error) {
      console.log('error:', error);
    }

    // use password only to create authProof string
    //const authProof = CryptoJS.PBKDF2(password, authSalt, {
    //  keySize: 512 / 32,
    //  iterations: 10000
    //}).toString(CryptoJS.enc.Hex);

    //const body = {
    //  username,
    //  authProof,
    //};

    //try {
    //  const response = await authApi.register(body);
    //  console.log('register response:', response)
    //  if (!response.success) {
    //    throw new Error(response.message || "Registration failed.");
    //  }
    //  setSuccessMessage("Registration successful!");
    //  setFormData(initialFormData);
    //  setRedirectCountdown(3);
    //} catch (err: any) {
    //  setErrorMessage(err.message);
    //} finally {
    //  setIsSubmitting(false);
    //}
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
        {isSubmitting ? "Registering..." : "Register"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && (
        <p style={{ color: "green" }}>
          {successMessage}
        </p>
      )}
    </form>
  );
};

// Utility to format label text
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, " $1");


export default Login;
