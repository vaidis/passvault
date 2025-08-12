// challengeRepo.ts
import { getAuthDB, AuthDB } from '../db/authDb';
import { randomHex } from './crypto';
import crypto from 'crypto';

const TTL_MS = 2 * 60 * 1000; // 2 min

export async function createChallenge(username: string) {
  const db = await getAuthDB();
  const id = crypto.randomUUID();
  const challengeHex = randomHex(32);

  db.data!.challenges.push({
    id,
    username,
    challengeHex,
    expiresAt: Date.now() + TTL_MS,
    used: false,
  });
  await db.write();

  return { challengeId: id, challengeHex };
}

export async function getChallenge(id: string) {
  const db = await getAuthDB();
  return db.data!.challenges.find((c) => c.id === id);
}

export async function consumeChallenge(id: string) {
  const db = await getAuthDB();
  const rec = db.data!.challenges.find((c) => c.id === id);
  if (rec) {
    rec.used = true;
    await db.write();
  }
}

export function isExpired(expiresAt: number) {
  return Date.now() > expiresAt;
}

// optional: καθάρισμα παλιών challenges (κάλεσέ το περιοδικά)
export async function cleanupChallenges() {
  const db = await getAuthDB();
  const before = db.data!.challenges.length;
  db.data!.challenges = db.data!.challenges.filter(
    (c) => !c.used && !isExpired(c.expiresAt)
  );
  if (db.data!.challenges.length !== before) await db.write();
}

