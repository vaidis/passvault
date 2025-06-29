import { JwtPayload } from 'jsonwebtoken';
import { getUserDB } from '../utils/getDatabase';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '../jwtTokens';

interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

interface Users {
  users: User[]
}

export type AuthSuccess = {
  success: true;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type AuthFailure = {
  success: false;
  error: string;
}

export type AuthResult = AuthSuccess | AuthFailure;

export type TokenRefreshSuccess = {
  success: true;
  accessToken: string;
  refreshToken: string;
  role: string;
}

export type TokenRefreshFailure = {
  success: false;
  error: string;
}

export type TokenRefreshResult = TokenRefreshSuccess | TokenRefreshFailure;

export type UserInfoSuccess = {
  success: true;
  username: string;
  role: string;
}

export type UserInfoFailure = {
  success: false;
  error: string;
}

export type UserInfoResult = UserInfoSuccess | UserInfoFailure;

/**
 * Authenticates a user with username and password
 */
export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    // get the user
    const db = await getUserDB();
    const user = db.data.users.find((u: User) => u.username === username);

    // Check if the user exists
    if (!user) {
      console.log('🐞 authService.ts > authenticateUser(): user not found');
      return { success: false, error: 'user not found' };
    }

    // check the password
    if (password !== user.password) {
      console.log('🐞 authService.ts > authenticateUser(): password not found');
      return { success: false, error: 'Authentication failed' };
    }

    // create tokens
    const accessToken = generateAccessToken({ username: user.username, role: user.role });
    const refreshToken = generateRefreshToken({ username: user.username, role: user.role });

    return {
      success: true,
      user,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.log('🐞 authService.ts > authenticateUser(): service error');
    return { success: false, error: 'Internal service error' };
  }
}

/**
 * Refreshes access and refresh tokens
 */
export async function refreshTokens(refreshToken: string): Promise<TokenRefreshResult> {
  try {
    // check if the refresh cookie contains a valid refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== 'object' || decoded === null || !('username' in decoded)) {
      return { success: false, error: 'Invalid token payload' };
    }

    // create new tokens with the old payload
    const payload = decoded as JwtPayload;
    const newAccessToken = generateAccessToken({
      username: payload.username,
      role: payload.role
    });

    const newRefreshToken = generateRefreshToken({
      username: payload.username,
      role: payload.role
    });

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      role: payload.role
    };
  } catch (error) {
    return { success: false, error: 'Invalid or expired refresh token' };
  }
}

/**
 * Gets user information from access token
 */
export async function getUserFromToken(accessToken: string): Promise<UserInfoResult> {
  try {
    const decodedToken = verifyAccessToken(accessToken);

    // Check if decodedToken is a string (error case) or a JwtPayload object
    if (typeof decodedToken === 'string') {
      return { success: false, error: 'Invalid token format' };
    }

    // Validate token contents
    if (!decodedToken.username || !decodedToken.role) {
      return { success: false, error: 'Missing user information in token' };
    }

    return {
      success: true,
      username: decodedToken.username,
      role: decodedToken.role
    };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}
