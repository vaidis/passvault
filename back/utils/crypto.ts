import crypto from 'crypto';

export function randomHex(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function timingSafeEqHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, 'hex');
  const b = Buffer.from(bHex, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function hmacSha256Hex(messageHex: string, keyHex: string): string {
  return crypto
    .createHmac('sha256', Buffer.from(keyHex, 'hex'))
    .update(Buffer.from(messageHex, 'hex'))
    .digest('hex');
}

