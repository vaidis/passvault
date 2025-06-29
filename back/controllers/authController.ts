import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '../jwtTokens';
import * as AuthService from '../services/authService';

//interface LoginRequest {
//  username: string;
//  password: string;
//}

//
// POST /auth/login
//
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // First, ensure we have a valid body object
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Invalid request format',
      });
      return;
    }

    // Extract and sanitize credentials
    let username: string = req.body.username;
    let password: string = req.body.password;

    // Basic type checking
    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Username and password must be strings',
      });
      return;
    }

    // Trim whitespace
    username = username.trim();
    password = password.trim();

    // Check if username and password are both provided
    if (!username || !password) {
      res.status(401).json({
        success: false,
        message: 'Username and password are required',
      });
      return;
    }

    // Sanitize username: allow only alphanumeric characters and few symbols
    const usernameRegex = /^[a-zA-Z0-9_.\-@]+$/;
    if (!usernameRegex.test(username)) {
      res.status(400).json({
        success: false,
        message: 'Username contains invalid characters',
      });
      return;
    }

    // Sanitize username: allow only alphanumeric characters and some symbols
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()]+$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        success: false,
        message: 'Password contains invalid characters',
      });
      return;
    }

    // check credentials
    const result = await AuthService.authenticateUser(username, password);

    // invalid credentials: abort
    if (!result.success) {
      res.status(401).json({
        success: false,
        message: result.error
      });
      return;
    }

    // valid credentials: place tokens into secure cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',      // Prevent CSRF
      maxAge: 60 * 60 * 1000,  // 60 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      //maxAge: 60 * 60 * 1000,  // 60 minutes
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // respond successfully
    res.json({
      success: true,
      message: `Hello ${result.user.username}`,
      data: {
        role: result.user.role,
        username: result.user.username
      }
    });
  } catch (error) {
    console.log('🐞 authController.ts > login(): error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
    return;
  }
};

//
// GET /auth/refresh
//
const refresh = async (req: Request, res: Response): Promise<void> => {
  console.log(' ⭐️ authController.ts > refresh()');

  // check if there is a refreshToken cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log(' ⭐️ authController.ts > refresh() > No refresh token provided');
    res.status(401).json({ success: false, error: 'No refresh token provided' });
    return;
  }

  try {
    // check if the refresh cookie cointains a valid refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== 'object' || decoded === null || !('username' in decoded)) {
      console.log(' ⭐️ authController.ts > refresh() > Invalid token payload');
      res.status(403).json({ success: false, error: 'Invalid token payload' });
      return;
    }

    // create new access token with the old payload
    const payload = decoded as JwtPayload;
    const newAccessToken = generateAccessToken({ username: payload.username, role: payload.role });
    const newRefreshToken = generateRefreshToken({ username: payload.username, role: payload.role });

    // place tokens into secure cookies
    res.cookie('accessToken', newAccessToken, {
      //httpOnly: true,
      //secure: true,            // Only over HTTPS
      //sameSite: 'strict',      // Prevent CSRF
      maxAge: 1 * 60 * 1000,  // 15 minutes
    });

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, role: payload.role });
  } catch (err) {
    console.log(' ⭐️ authController.ts > refresh() > Invalid or expired refresh token');
    res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
    return;
  }
};

//
// GET /auth/user
//
const user = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const decodedToken = verifyAccessToken(accessToken);

    // Check if decodedToken is a string (error case) or a JwtPayload object
    if (typeof decodedToken === 'string') {
      res.status(401).json({ success: false, error: 'Invalid token format' });
      return;
    }

    // Now TypeScript knows decodedToken is a JwtPayload
    if (!decodedToken.username || !decodedToken.role) {
      res.status(401).json({ success: false, error: 'Missing user information in token' });
      return;
    }

    res.json({
      success: true,
      username: decodedToken.username,
      role: decodedToken.role
    });
  } catch (err) {
    res.status(403).json({ error: 'No valid token' });
  }
};

//
// /auth/logout
//
const logout = async (req: Request, res: Response): Promise<void> => {
  console.log('logout req:', req)
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { login, refresh, user, logout };

