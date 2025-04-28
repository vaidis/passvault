import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { JSONFilePreset } from 'lowdb/node'

interface Item {
  id: number;
  title: string;
  password: string;
  notes: string;
  order: number;
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
    // get the users database
    const dbPath = `db/data/${id}.db.json`;
    const defaultData: Items = { items: [] };
    const adapter = new JSONFile<Items>(dbPath);
    const db = new Low<Items>(adapter, defaultData);

    // prepare database for changes
    await db.read();

    // get all data
    db.data ||= { items: [] };
    const { items } = db.data;

    // send data to user
    // send changes to frontend
    const response = {
      success: true,
      data: items
    };
    console.log('🫐 userService.ts > findAllData > response:', response)
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function deleteRow (id: string, row: number) {
  console.log(`deleteRow ${id} ${row}`)
  try {
    // get the users database
    const dbPath = `db/data/${id}.db.json`;
    const defaultData: Items = { items: [] };
    const db = await JSONFilePreset<Items>(dbPath, defaultData);

    // prepare database for changes
    db.read()

    // find the index to be deleted
    const data = db.data as Items;
    const index = data.items.findIndex((item: Item) => item.id === row);

    // If index not found, return false
    if (index === -1) {
      console.error(`No item found with id ${row}`);
      return false;
    }

    // if index found, remove the item
    data.items.splice(index, 1);

    // write changes
    db.write()

    // send changes to frontend
    const response = {
      success: true,
      data: data.items
    };
    console.log('🫐 userService.ts > deleteRow > response:', JSON.stringify(response))
    return response;
} catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}
