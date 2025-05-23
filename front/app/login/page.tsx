"use client"

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import styles from "./page.module.scss";

export interface Credentials {
  username: string;
  password: string;
}

export interface SuccessData {
  role: string;
  username: string;
}

export interface ApiResponseSuccess<Data> {
  success: true;
  message: string;
  data: Data;
}

export interface ApiResponseError {
  success: false;
  message: string;
  data?: never;
}

export type ApiResponse<SuccessData> = ApiResponseSuccess<SuccessData> | ApiResponseError;

const Login = () => {
  const router = useRouter();
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: Credentials) => {
    setLoginError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      })

      if (!response.status) {
        setLoginError('!response.ok');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = (await response.json()) as ApiResponse<SuccessData>;

      if (json.success) {
        router.push(`/data/${json.data.username}`)
      } else {
        setLoginError(json.message);
        console.log('login response error')
      }
    } catch (error) {
      setLoginError(String(error));
      console.log('login catch error', error);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <h2 className={styles.title}>Login</h2>

          <div className={styles.formGroup}>
            <label>Username</label>
            <Field type="text" name="username" className={styles.input} autoFocus={true} />
            <div className={styles.error}>
              <ErrorMessage name="username" component="div" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <Field type="text" name="password" className={styles.input} />
            <div className={styles.error}>
              <ErrorMessage name="password" component="div" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? "Submitting..." : "Login"}
          </button>

          {loginError && (
            <div className={styles.error}>
              {loginError}
            </div>
          )}

        </Form>
      )}
    </Formik>
  );
};

export default Login;
