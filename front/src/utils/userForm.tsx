import React from 'react';
import styles from "./userForm.scss";
import { SaveIcon } from '../icons/saveIcon';
import { apiFetchWithRefresh } from './api';
import { ApiResponse } from './api.types';

interface Profile {
  id: string;
  username: string;
  password: string;
  email: string;
}

export default function UserForm({user, closeModal}: {user: string; closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [isLoading, setLoading] = React.useState<Boolean>(true);
  const [data, setData] = React.useState<Profile>({
    id: '',
    username: '',
    password: '',
    email: '',
  })

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    email: Yup.string().required("Email is required"),
  });

  const URL =`http://localhost:3001/user/${user}/profile`;

  // get profile data
  React.useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const res = await apiFetchWithRefresh(URL) as ApiResponse<Profile>;
      if (!res.success) {
        console.error('Failed to load user:', res.message);
        setLoading(false);
        return;
      }
      setData(res.data);
      setLoading(false);
    };
    fetchUser();
  },[])

  // save profile data
  const handleSubmit = async (formData: FormData) => {
    setSaveError(null);
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
      closeModal();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsPending(false);
    }
  };

  //const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //  setData(prev => ({
  //    ...prev, [event.target.name]: event.target.value
  //  }));
  //}

  return (
    <div>
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <Field
                type="text"
                name="username"
                className={styles.input}
              />
              <div className={styles.error}>
                <ErrorMessage
                  name="username"
                  component="div"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <Field
                type="text"
                name="password"
                className={styles.input}
              />
              <div className={styles.error}>
                <ErrorMessage
                  name="password"
                  component="div"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <Field
                type="text"
                name="email"
                className={styles.input}
              />
              <div className={styles.error}>
                <ErrorMessage
                  name="email"
                  component="div"
                />
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

            {saveError && (
              <div className={styles.error}>
                {saveError}
              </div>
            )}

          </Form>
        )}
      </Formik>
      {JSON.stringify((data))}
    </div>


  )
  }
