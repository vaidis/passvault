'use client'

import React from 'react';
import { useParams } from 'next/navigation'
import styles from "./page.module.scss";
import Image from 'next/image'

import menuIcon from 'public/menu.svg';
import  { CopyIcon } from '../../utils/copyIcon';
import  { DeleteIcon } from '../../utils/deleteIcon';
import  { EditIcon } from '../../utils/editIcon';

import { apiFetchWithRefresh } from '../../utils/api';

interface Item {
  id: number;
  title: string;
  password: string;
  notes: string;
}

interface Items {
  items: Item[];
}

export default function Page() {
  const params = useParams<{ slug: string}>()
  const [data, setData] = React.useState<any>(null)
  const [isLoading, setLoading] = React.useState<any>(true)
  const [actionsIndex, setActionsIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    console.log('params', params)

    const fetchUser = async () => {
      const res = await apiFetchWithRefresh(`http://localhost:3001/user/${params.slug}`);

      if (!res.success) {
        console.error('Failed to load user:', res.message);
        setLoading(false);
        return;
      }

      setData(res);
      setLoading(false);
      console.log('🐞 /user/[slug] > data:', res.data);
    };
    fetchUser();
  },[])

  const toggleActions = (index: number) => {
    setActionsIndex(prev => (prev === index ? null : index))
  }

  const editHandler = (index: number) => {
    console.log('edit', index);
  }

  const deleteHandler = (index: number) => {
    console.log('delete', index);
  }

  const copyHandler = (index: number) => {
    console.log('copy', index);
  }

  if (isLoading) return <p>Loading...</p>

  if (!data.data) return <p>No profile data</p>

  return (
    <div>
      <h2 className={styles.title}>Passwords</h2>
      <div className={styles.passwords}>
        {
          data.data.map((row:any, index:number) => (
            <div className={styles.row} key={index}>

              <div className={styles.main}>
                <div className={styles.data}>
                  <div className={styles.label}>{row.title}</div>
                  <div className={styles.notes}>{row.notes}</div>
                  <div className={styles.password}>{row.password}</div>
                </div>
                <div className={styles.menu} onClick={() => toggleActions(index)} style={{ cursor: 'pointer' }}>
                  <Image src={menuIcon} width={32} height={32} alt='button that reveals the actions' />
                </div>
              </div>

              <div className={`${styles.actions} ${actionsIndex === index ? styles.show : ''}`}>
                <div className={styles.copy} onClick={() => copyHandler(index)} >
                  <CopyIcon color="#66cc66"/>
                  <div className={styles.actionLabel}>
                    Copy
                  </div>
                </div>
                <div className={styles.edit} onClick={() => editHandler(index)} >
                  <EditIcon color="#7abaff" />
                  <div className={styles.actionLabel}>
                    Edit
                  </div>
                </div>
                <div className={styles.delete} onClick={() => deleteHandler(index)} >
                  <DeleteIcon color="#ff6688" />
                  <div className={styles.actionLabel}>
                    Delete
                  </div>
                </div>
              </div>

            </div>
          ))
        }
      </div>
    </div>
  )
}
