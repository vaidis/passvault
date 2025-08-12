import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export type UserRow = {
  id: string;
  username: string;     // from registration
  authSalt: string;     // from registration
  verifierK: string;    // PBKDF2(password, authSalt) => hex (from registration)
  encryptSalt?: string;
};

type ChallengeRecord = {
  id: string;             // challengeId (uuid)
  username: string;       //
  challengeHex: string;   // random hex (32 bytes)
  expiresAt: number;      // Date.now() + TTL
  used: boolean;
};

export type AuthDB = {
  users: UserRow[];
  challenges: ChallengeRecord[];
};

let db: Low<AuthDB> | null = null;

export async function getAuthDB() {
  if (!db) {
    const dbPath = 'db/authDb.json';
    const adapter = new JSONFile<AuthDB>(dbPath);
    db = new Low<AuthDB>(adapter, { users: [], challenges: [] });
    await db.read();
    db.data ||= { users: [], challenges: [] };
    await db.write();
  }
  return db;
}

