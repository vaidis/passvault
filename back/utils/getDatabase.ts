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

export interface User {
    email: string;
    username: string;
    encryptSalt: string;
    authSalt: string;
    authProof: string;
}

export interface Users {
  users: User[];
}

export interface Db {
  write: () => {};
  read: () => {};
  data: Users;
}

export interface RegisterIds {
  id: string[]
}

export async function getDataDB(username:string) {
    const file = `db/data/${username}.db.json`;
    const defaultData: Items = { items: [] };
    const adapter = new JSONFile<Items>(file);
    const db = new Low<Items>(adapter, defaultData);
    await db.read();
    db.data ||= { items: [] };
    return db;
}

export async function getUserDB() {
  const dbPath = 'db/users.db.json';
  const defaultData: Users = { users: [] };
  const adapter = new JSONFile<Users>(dbPath);
  const db = new Low<Users>(adapter, defaultData);
  await db.read();
  return db;
}

export async function getRegisterDB() {
  const dbPath = 'db/register.db.json';
  const defaultData: RegisterIds = { id: [] };
  const adapter = new JSONFile<RegisterIds>(dbPath);
  const db = new Low<RegisterIds>(adapter, defaultData);
  await db.read();
  return db;
}
