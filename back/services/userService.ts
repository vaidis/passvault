import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface Item {
  id: number;
  title: string;
  password: string;
  notes: string;
}

interface Items {
  items: Item[];
}

export type GetItemsSuccess = {
  success: true;
  items: Item[];
}

export type GetItemsFailure = {
  success: false;
  error: string;
}

export type GetItemsResult = GetItemsSuccess | GetItemsFailure;

export async function findAllData (id: string) {
  try {
    const dbPath = `db/data/${id}.db.json`;
    const defaultData: Items = { items: [] };
    const adapter = new JSONFile<Items>(dbPath);
    const db = new Low<Items>(adapter, defaultData);
    await db.read();
    db.data ||= { items: [] };
    const { items } = db.data;
    return {
      success: true,
      items: items
    };
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}
