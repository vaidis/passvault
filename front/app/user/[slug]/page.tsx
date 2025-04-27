'use client'

import React from 'react';
import { useParams } from 'next/navigation'
import styles from "./page.module.scss";

export default function Page() {
  const params = useParams<{ slug: string}>()
  const [data, setData] = React.useState<any>(null)
  const [isLoading, setLoading] = React.useState<any>(true)

  React.useEffect(() => {
    console.log('params', params)
    fetch(`http://localhost:3001/user/${params.slug}`, {credentials:'include'})
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setData(data);
        console.log('🐞 /user/[slug] > data:', data)
      })
  },[])

  if (isLoading) return <p>Loading...</p>

  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h2 className={styles.title}>Passwords</h2>
      <div className={styles.passwords}>
        {
          data.data.map((row:any, index:number) => (
            <div className={styles.password} key={index}>
              <div className={styles.label}>{row.title}</div>
              <div className={styles.password}>{row.password}</div>
              <div className={styles.edit}></div>
              <div className={styles.delete}></div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
