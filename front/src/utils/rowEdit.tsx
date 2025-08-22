import React from 'react';

import { Item } from './api.types';
import styles from './rowEdit.scss';
import { apiFetchWithRefresh } from './api';
import { SaveIcon } from '../icons/saveIcon';

export default function RowEdit({row, user, setData, closeModal}: {row: Item;  user: string; setData: any, closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const initialValues = {
    id: row.id,
    title: row.title,
    username: row.username,
    password: row.password,
    notes: row.notes,
    order: row.order
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    notes: Yup.string()
  });

  const URL =`http://localhost:3001/data/${user}/edit/${row.id}`;

  // send data to backend
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);

    try {
      const res = await apiFetchWithRefresh(URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (!res.success) {
        console.error('Failed to save changes:', res.message);
        return;
      }
      setData(res.data);
      closeModal();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>

            <div className={styles.formGroup}>
              <label>Title</label>
              <Field type="text" name="title" className={styles.input} autoFocus={true} />
              <div className={styles.error}>
                <ErrorMessage name="title" component="div" />
              </div>
            </div>

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

            <div className={styles.formGroup}>
              <label>Notes</label>
              <Field type="text" name="notes" className={styles.input} />
              <div className={styles.error}>
                <ErrorMessage name="notes" component="div" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
            >
              <SaveIcon color="#FFFFFF" />
              <div className={styles.buttonLabel}>
                {isPending ? 'Saving...' : 'Save'}
              </div>
            </button>

            {loginError && (
              <div className={styles.error}>
                {loginError}
              </div>
            )}

          </Form>
        )}
      </Formik>
    </div>
  );
}

