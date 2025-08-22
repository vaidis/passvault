import { apiFetchWithRefresh } from './api';
import { Item } from './api.types';
import styles from './rowDelete.scss';
import { DeleteIcon } from '../icons/deleteIcon';

export default function RowDelete({row, user, setData, closeModal }: {row: Item;  user: string; setData: any, closeModal: ()=>{} }) {

  const URL =`http://localhost:3001/data/${user}/delete/${row.id}`;

  const deleteHandler = async () => {
    const res = await apiFetchWithRefresh(URL, { method: 'POST' });
    if (!res.success) {
      console.error('Failed to load user:', res.message);
      return;
    }
    setData(res.data);
    closeModal()
  }

  return (
    <div>
      <p>Are you sure you don't need the password of {row.title}?</p>
      <button className={styles.button} onClick={deleteHandler}>
        <DeleteIcon color="#000000" />
        Delete
      </button>
    </div>
  );
}

