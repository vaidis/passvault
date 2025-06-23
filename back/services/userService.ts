import { getUserDB } from '../utils/getDatabase';

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

//
// GET profile
//
export async function getProfileData(username: string) {
  try {
    const db = await getUserDB();
    const profile = db.data.users.find((user: User) => user.username === username);

    if (!profile) {
      return {
        success: false,
      }
    }

    const response = {
      success: true,
      data: profile
    };

    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

//
// SET profile
//
export async function setProfileData(username: string, newProfile: User) {
  try {
    const db = await getUserDB();
    const profile = db.data.users.find((user: User) => user.username === username);

    if (profile) {
      profile.email = newProfile.email;
      profile.password = newProfile.password;
    }

    db.write();

    const response = {
      success: true,
      data: profile
    };

    return response;
  } catch (error){
    return {
      success: false,
      error: 'Failed to retrieve item from database'
    };
  }
}

