import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export interface Item {
  id: number;
  category: string;
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
    verifierK: string;
    challenges: string;
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
    console.log('🐞 getDatabase.ts > getDataDB:');
    const file = `db/data/${username}.db.json`;
    const defaultData: Items = { items: [] };
    const adapter = new JSONFile<Items>(file);
    const db = new Low<Items>(adapter, defaultData);
    await db.read();
    db.data ||= { items: [] };
    console.log('🐞 getDatabase.ts > getDataDB > db:', db);
    return db;
}

export async function getUserDB() {
  console.log('🐞 getDatabase.ts > getUserDB');
  const dbPath = 'db/users.db.json';
  const defaultData: Users = { users: [] };
  const adapter = new JSONFile<Users>(dbPath);
  console.log('🐞 getDatabase.ts > getUserDB > adapter :', adapter );
  const db = new Low<Users>(adapter, defaultData);
  console.log('🐞 getDatabase.ts > getUserDB > db:', db);
  await db.read();
  console.log('🐞 getDatabase.ts > getUserDB > db:', db);
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
