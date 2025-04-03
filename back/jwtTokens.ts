import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'your_super_secret_access_key';
const REFRESH_TOKEN_SECRET = 'your_super_secret_refresh_key';

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(payload: string) {
  return jwt.verify(payload, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(payload: string) {
  return jwt.verify(payload, REFRESH_TOKEN_SECRET);
}
