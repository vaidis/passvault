'use client';

import Form from 'next/form';
import React from 'react';
import { Item } from './api.types';
import styles from './rowEdit.module.scss';
import { apiFetchWithRefresh } from './api';
import { SaveIcon } from '../icons/saveIcon';

export default function RowEdit({row, user, setData, closeModal}: {row: Item;  user: string; setData: any, closeModal: any}) {
  const [isPending, setIsPending] = React.useState(false);

  // load data
  const [formData, setFormData] = React.useState({
    id: row.id,
    title: row.title,
    username: row.username,
    password: row.password,
    notes: row.notes || '',
    order: row.order
  });

  const URL =`http://localhost:3001/data/${user}/edit/${row.id}`;

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

        <input id="id" type="hidden" name="id" value={formData.id} />
        <input id="order" type="hidden" name="order" value={formData.order || 0} />

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
          <label className={styles.label}>Username</label>
          <input
            id="username"
            name="username"
            value={formData.username}
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
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={styles.button}
        >
          <SaveIcon color="#FFFFFF" />
          <div className={styles.buttonLabel}>
            {isPending ? 'Saving...' : 'Save'}
          </div>
        </button>
      </Form>
    </div>
  );
}

