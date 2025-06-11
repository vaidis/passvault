import { warn } from 'console';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface Users {
  users: User[];
}

export interface Db {
  write: () => {};
  read: () => {};
  data: Users;
}

export type GetProfileSuccess = {
  success: true;
  users: User[];
}

export type GetProfileFailure = {
  success: false;
  error: string;
}

export type GetProfileResult = GetProfileSuccess | GetProfileFailure;

async function getDatabase() {
  const dbPath = '/home/ste/Documents/Dev/passvault/back/db/users.db.json';
  const defaultData: Users = { users: [] };
  const adapter = new JSONFile<Users>(dbPath);
  const db = new Low<Users>(adapter, defaultData);
  await db.read();
  return db;
}

async function getDatabaseProfile(db: Db, username:string): Promise<User | null> {
  const user = db.data.users.find((user: User) => user.username === username);
  if (!user) {
    return null;
  }
  return user;
}

async function setDatabaseProfile(db: Db, newProfile: User): Promise<User | null> {
  const profile = await getDatabaseProfile(db, newProfile.username);
  if (profile) {
    profile.email = newProfile.email;
    profile.password = newProfile.password;
  }
  db.write();
  return profile;
}

export async function getProfileData(username: string) {
  try {
    const db = await getDatabase();
    const user = await getDatabaseProfile(db, username);
    if (!user) {
      return {
        success: false,
      }
    }
    const response = {
      success: true,
      data: user
    };
    console.log(`🫐 userService.ts > getProfileData > response: ${response}`);
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

export async function setProfileData(username: string, newProfile: User) {
  console.log('🫐 userService.ts > setProfileData > profile:', newProfile);
  try {
    const db = await getDatabase();
    const profile = await setDatabaseProfile(db, newProfile);
    console.log('🫐 userService.ts > setProfileData > profile:', profile);
    const response = {
      success: true,
      data: profile
    };
    console.log(`🫐 userService.ts > setProfileData > response: ${response}`);
    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

