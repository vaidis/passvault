'use client';

import Form from 'next/form';
import React from 'react';
import { Item } from './api.types';
import styles from './rowEdit.module.scss';
import { apiFetchWithRefresh } from './api';

export default function RowAdd({user, setData, closeModal}: {user: string; setData: any, closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);

  // data
  const [formData, setFormData] = React.useState({
    id: '',
    title: '',
    password: '',
    notes: '',
  });

  const URL =`http://localhost:3001/data/${user}/new`;

  // change local state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // send data to backend
  const handleSubmit = async (formData: FormData) => {
    console.log(' handleSubmit formData', formData);
    setIsPending(true);

    const formDataAsObject = Object.fromEntries(formData.entries());

    try {
      const res = await apiFetchWithRefresh(URL, {
        method: 'POST',
        body: JSON.stringify(formDataAsObject ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!res.success) {
        console.error('Failed to save changes:', res.message);
        return;
      }

      console.log(' handleSubmit res', res.data);
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
      <Form className={styles.form} action={handleSubmit}>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            disabled={isPending}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            disabled={isPending}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes</label>
          <input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.input}
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={styles.button}
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </Form>
    </div>
  );
}


