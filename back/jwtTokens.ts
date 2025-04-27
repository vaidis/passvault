import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'your_super_secret_access_key';
const REFRESH_TOKEN_SECRET = 'your_super_secret_refresh_key';

export function generateAccessToken(payload: object) {
  console.log('🍓 Generate new access token');
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
}

export function generateRefreshToken(payload: object) {
  console.log('🍓 Generate new refresh token');
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(payload: string) {
  console.log('🍓 Verify access token');
  return jwt.verify(payload, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(payload: string) {
  console.log('🍓 Verify refresh token');
  return jwt.verify(payload, REFRESH_TOKEN_SECRET);
}
