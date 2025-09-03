import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables');
}

export function generateAccessToken(payload: object) {
  console.log('🔑 jwtTokens.ts > Generate new access token');
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: '5m' });
}

export function generateRefreshToken(payload: object) {
  console.log('🔑 jwtTokens.ts > Generate new refresh token');
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: '60m' });
}

export function verifyAccessToken(payload: string) {
  console.log('🔑 jwtTokens.ts > Verify access token');
  return jwt.verify(payload, ACCESS_TOKEN_SECRET as string);
}

export function verifyRefreshToken(payload: string) {
  console.log('🔑 jwtTokens.ts > Verify refresh token');
  return jwt.verify(payload, REFRESH_TOKEN_SECRET as string);
}
