import { getDataDB } from '../utils/getDatabase';

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

async function getData(username:string): Promise<Item[]> {
  // get database
  const db = await getDataDB(username);

  // send all data
  const { items } = db.data;
  const data = items.sort((a:Item, b:Item) => a.title.localeCompare(b.title))
  return data;
}

export async function findData (username: string) {
  try {
    const newData = await getData(username);
    const response = {
      success: true,
      data: newData
    };
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function deleteRow (username: string, row: number) {
  try {
    // get database
    const db = await getDataDB(username);

    // find the row
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
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function editRow (username: string, rowId: Number, row: Item) {
  try {
    // get database
    const db = await getDataDB(username);

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
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function newRow (username: string, row: Item) {
  try {
    // get database
    const db = await getDataDB(username);

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
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}
