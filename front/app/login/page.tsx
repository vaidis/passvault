"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import styles from "./page.module.scss";

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  data?: never;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const Login = () => {
  const router = useRouter();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  interface Credentials {
    username: string;
    password: string;
  }

  interface Login {
    role: string;
  }
  const handleSubmit = async (values: Credentials) => {
    console.log('login values', values);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      })
      const json = (await response.json()) as ApiResponse<Login>;

      console.log('login response status', response.status);
      console.log('login response json', json);

      if (json.success) {
        router.push('/user/ste')
      } else {
        console.log('login response error')
      }
    } catch (error) {
      console.log('login POST error', error);
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
            <Field type="text" name="username" className={styles.input} />
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
        </Form>
      )}
    </Formik>
  );
};

export default Login;
