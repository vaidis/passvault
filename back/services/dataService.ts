import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export interface Item {
  id: number;
  title: string;
  username: string;
  password: string;
  notes: string;
  order: number;
}

export interface Items {
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

async function getDatabase(username:string) {
    const dbPath = `db/data/${username}.db.json`;
    const defaultData: Items = { items: [] };
    const adapter = new JSONFile<Items>(dbPath);
    const db = new Low<Items>(adapter, defaultData);
    return db;
}

async function getData(username:string): Promise<Item[]> {
    // get database
    const db = await getDatabase(username);
    await db.read();

    // get all data
    db.data ||= { items: [] };
    const { items } = db.data;
    const data = items.sort((a:Item, b:Item) => a.title.localeCompare(b.title))
    return data;
}

export async function findAllData (username: string) {
  try {
    const newData = await getData(username);
    const response = {
      success: true,
      data: newData
    };
    console.log(`🫐 userService.ts > findAllData > request: ${username}`);
    console.log(`🫐 userService.ts > findAllData > response: ${response}`);
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function deleteRow (username: string, row: number) {
  console.log(`🫐 userService.ts > deleteRow: ${username} ${row}`);
  try {
    // get database
    const db = await getDatabase(username);
    await db.read();

    // find the index to be deleted
    const data = db.data as Items;
    const index = data.items.findIndex((item: Item) => item.id === row);

    // If index not found, return false
    if (index === -1) {
      return false;
    }

    // if index found, remove the item
    data.items.splice(index, 1);

    // write changes
    await db.write()

    // response changes
    const newData = await getData(username);
    const response = {
      success: true,
      data: newData
    };
    console.log(`🫐 userService.ts > deleteRow < response: ${response}`);
    return response;
} catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function editRow (username: string, rowId: Number, row: Item) {
  console.log(`🫐 userService.ts > editRow > request: ${username} ${rowId} ${JSON.stringify(row)}`)

  try {
    // get database
    const db = await getDatabase(username);
    await db.read();
    db.data ||= { items: [] };

    // find the index to be changed
    const index = db.data.items.findIndex((item: Item) => item.id === rowId);

    // If index not found, return false
    if (index === -1) {
      return {
        success: false,
        error: `Item with ID ${rowId} not found`
      };
    }

    // Create the updated item
    const updatedItem = {
      ...db.data.items[index],
      title: row.title || db.data.items[index].title,
      username: row.username || db.data.items[index].username,
      password: row.password || db.data.items[index].password,
      notes: row.notes,
      order: row.order !== undefined ? row.order : db.data.items[index].order
    };

    // update
    db.data.items[index] = updatedItem;

    // write changes
    await db.write();

    // responde changes
    const newData = await getData(username);
    const response = {
      success: true,
      data: newData
    };
    console.log(`🫐 userService.ts > editRow > response: ${response.data}`)
    return response;

} catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function newRow (username: string, row: Item) {
  console.log(`🫐 userService.ts > newRow > request: ${username} ${JSON.stringify(row)}`)

  try {
    // get database
    const db = await getDatabase(username);
    await db.read();
    db.data ||= { items: [] };

    // Create the updated item
    const newItem = {
      id: row.id || Date.now(),
      title: row.title,
      username: row.username,
      password: row.password,
      notes: row.notes || '',
      order: row.order || 0
    };

    // update
    db.data.items.push(newItem);

    // Write changes using LowDB's mechanism
    await db.write();

    // responde changes
    const newData = await getData(username);
    const response = {
      success: true,
      data: newData
    };
    console.log(`🫐 userService.ts > addRow > response: ${response.data}`)
    return response;
} catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}
