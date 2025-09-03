import type { Dispatch, SetStateAction } from 'react';
import { dataApi } from '../api/data';
import type { ApiResponse, DataItem, DataItems } from '../api/types';
import './rowDelete.scss';

export default function RowDelete({ row, setData, closeModal }: {
  row: DataItem;
  setData: Dispatch<SetStateAction<DataItems | null>>;
  closeModal: () => void
}) {

  const deleteHandler = async () => {
    const response: ApiResponse<DataItems> = await dataApi.delete(row.id);
    if (response.success) {
      const data = response.data;
      if (data !== undefined) {
        setData(data);
      }
    }
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

