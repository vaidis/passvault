import type { DataItem } from '../api/types';
import './rowDelete.scss';

export default function RowDelete({row, user, setData, closeModal }: {
  row: DataItem;
  user: string;
  setData: ()=>void;
  closeModal: ()=>void }) {

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
      <button className={'button'} onClick={deleteHandler}>
        Delete
      </button>
    </div>
  );
}

