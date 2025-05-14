import { apiFetchWithRefresh } from './api';
import { Item } from './api.types';

export default function RowDelete({row, user, setData}: {row: Item;  user: string; setData: any}) {

  const URL =`http://localhost:3001/data/${user}/delete/${row.id}`;

  const deleteHandler = async () => {
    const res = await apiFetchWithRefresh(URL, { method: 'POST' });
    if (!res.success) {
      console.error('Failed to load user:', res.message);
      return;
    }
    setData(res);
  }

  return (
    <div>
      <p>Are you sure you don't need the password of {row.title}?</p>
      <button onClick={deleteHandler}>Delete it{row.id}</button>
    </div>
  );
}

