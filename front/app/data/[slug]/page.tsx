'use client'

import React from 'react';
import { useParams, redirect } from 'next/navigation'
import styles from "./page.module.scss";

import { MenuIcon } from '../../icons/menuIcon';
import { CopyIcon } from '../../icons/copyIcon';
import { DeleteIcon } from '../../icons/deleteIcon';
import { EditIcon } from '../../icons/editIcon';
import { KeyIcon } from '../../icons/keyIcon';

import Modal from '../../utils/modal';
import RowAdd from '../../utils/rowAdd';
import RowEdit from '../../utils/rowEdit';
import RowDelete from '../../utils/rowDelete';
import UserForm from '../../utils/userForm';

import { apiFetchWithRefresh } from '../../utils/api';
import { ApiResponse } from '../../utils/api.types';
//import { redirect } from 'next/dist/server/api-utils';

interface Item {
  id: number;
  title: string;
  username: string;
  password: string;
  notes: string;
  order: number;
}

interface Items {
  items: Item[];
}

export default function Page() {
  const params = useParams<{ slug: string}>();
  const [data, setData] = React.useState<Item[] | null>(null);
  const [isLoading, setLoading] = React.useState<Boolean>(true);
  const [isCopied, setCopied] = React.useState<Boolean>(false);
  const [actionsIndex, setActionsIndex] = React.useState<number | null>(null);

  // modal
  const [modalContent, setModalContent] = React.useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    function checkTimeout() {
      console.log('Check JWT timeout')
      return null;
    }
    let interval = setInterval(checkTimeout, 1000)
    return (() => {
     clearInterval(interval)
    })
  },[])

  // get rows
  React.useEffect(() => {
    const fetchUser = async () => {
      const res = await apiFetchWithRefresh(`http://localhost:3001/data/${params.slug}`) as ApiResponse<Item[]>;

      if (!res.success) {
        console.error('Failed to load user:', res.message);
        setData(null);
        setLoading(false);
        return;
      }

      setData(res.data);
      setLoading(false);
    };
    fetchUser();
  },[])

  // show actions area (copy, edit, delete)
  const toggleActions = (index: number) => {
    setActionsIndex(prev => (prev === index ? null : index))
  }

  // show modal
  const addHandler = () => {
    setModalTitle('Add Password');
    setModalContent(<RowAdd user={params.slug} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const profileHandler = () => {
    setModalTitle('User Profile');
    setModalContent(<UserForm user={params.slug} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const editHandler = (row: Item) => {
    setModalTitle('Edit Password');
    setModalContent(<RowEdit row={row} user={params.slug} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  const deleteHandler = async (row:Item) => {
    setModalTitle('Delete Password');
    setModalContent(<RowDelete row={row} user={params.slug} setData={setData} closeModal={closeModal} />);
    openModal();
  }

  // send password to clipboard
  const copyHandler = (event: any, password: string) => {
    event.stopPropagation()
    setCopied(true);
    navigator.clipboard.writeText(password);
    setTimeout(function() {
      setCopied(false)
    }, 500);
  }

  const logoutHandler = async () => {
    try {
      const URL ='http://localhost:3001/auth/logout';
      apiFetchWithRefresh(URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      console.log('logout error ', error);
    } finally {
      redirect('/login');
    }
  }

  // show loading while waiting the api response
  if (isLoading) return <p>Loading...</p>

  return (
    <div className={styles.content}>
      {
        /* add / edit modal */
      }
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        {modalContent}
      </Modal>

      {
        /* Add new password button */
      }
      <header className={styles.header}>
        <div className={styles.brand}>
          <KeyIcon color="#000000"/>
          <div className={styles.title}>PassVault</div>
        </div>
        <div className={styles.menu}>
          <div className={styles.add} onClick={() => addHandler()}>
            A
          </div>
          <div className={styles.profile} onClick={() => profileHandler()}>
            U
          </div>
          <div className={styles.logout} onClick={() => logoutHandler()}>
            X
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {
          /* show actions */
        }
        {
          data && data.map((row:any, index:number) => (
            <div className={styles.row} key={index} onClick={() => toggleActions(index)} >

              <div className={styles.card}>
                <div className={styles.data}>
                  <div className={styles.label}>{row.title}</div>
                  <div className={styles.credentials}>
                     {row.username} <span className={styles.seperator}>&nbsp;/&nbsp;</span> {row.password}
                  </div>
                  {
                    row.notes && <div className={styles.notes}>{row.notes}</div>
                  }
                </div>
                <div className={styles.menu} style={{ cursor: 'pointer' }}>
                  <MenuIcon color="#7788ff" />
                </div>
              </div>

              {
                /* show actions */
              }
              <div className={`${styles.actions} ${actionsIndex === index ? styles.show : ''}`}>
                <div className={styles.copy} onClick={(event) => copyHandler(event, row.password)} >
                  <CopyIcon color="#66cc66"/>
                  <div className={styles.actionLabel}>
                    {isCopied ? 'Copied!' : 'Copy'}
                  </div>
                </div>

                <div className={styles.edit} onClick={() => editHandler(row)} >
                  <EditIcon color="#7abaff" />
                  <div className={styles.actionLabel}>
                    Edit
                  </div>
                </div>

                <div className={styles.delete} onClick={() => deleteHandler(row)} >
                  <DeleteIcon color="#ff6688" />
                  <div className={styles.actionLabel}>
                    Delete
                  </div>
                </div>
              </div>

            </div>
          ))}
        {
          !data && <div className={styles.empty}>You don't have any passwords stored.</div>
        }
      </main>
    </div>
  )
}
