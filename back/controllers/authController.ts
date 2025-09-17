import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '../jwtTokens';
import * as AuthService from '../services/authService';
import { getAuthDB } from '../db/authDb';
import { timingSafeEqHex, hmacSha256Hex, randomHex } from '../utils/crypto';
import { getChallenge, isExpired, consumeChallenge } from '../utils/challenge';

import type { UserRow } from '../db/authDb';


//
// POST /auth/register
//
const register = async (req: Request, res: Response): Promise<void> => {
  console.log('⚙️ authController.ts > register() req.body:', req.body);
  const registerId = req.params.registerId;

  // check the register url
  try {
    const isRegisterIdExist = await AuthService.getRegisterId(registerId);

    if (!isRegisterIdExist) {
      console.log('⚙️ authController.ts > register() isRegisterIdExist:', isRegisterIdExist);
      res.status(500).json({
        success: false,
        message: 'Register ID not found'
      });
      return;
    }
  } catch (error){
    res.status(500).json({
      success: false,
      message: 'Register server error'
    });
    return;
  }

  // Validation
  try {
    // Check: object body
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Invalid request format',
      });
      return;
    }

    // Extract and sanitize credentials
    let email: string = req.body.email;
    let username: string = req.body.username;
    let encryptSalt: string = req.body.encryptSalt;
    let authSalt: string = req.body.authSalt;
    let verifierK: string = req.body.verifierK;

    // Check: String mail type
    if ( typeof email !== 'string' ) {
      res.status(400).json({
        success: false,
        message: 'Registration email must be type of string',
      });
      return;
    }

    // Check: String username type
    if ( typeof username !== 'string' ) {
      res.status(400).json({
        success: false,
        message: 'Registration username must be type of string',
      });
      return;
    }

    // Check: String salts type
    if (
      typeof encryptSalt !== 'string' ||
        typeof authSalt !== 'string' ||
        typeof verifierK !== 'string'
    ) {
      res.status(400).json({
        success: false,
        message: 'All registration data must be strings',
      });
      return;
    }

    // Trim whitespace
    email = email.trim();
    username = username.trim();
    encryptSalt = encryptSalt.trim();
    authSalt = authSalt.trim();
    verifierK = verifierK.trim();

    // check if username exist
    const userExist = await AuthService.isUserExist(username)
    if (userExist) {
      res.status(500).json({
        success: false,
        message: 'Username already exist'
      });
      return;
    }

    // Register the new user
    const registerData = {email, username, encryptSalt, authSalt, verifierK};
    const uid = await AuthService.registerUser(registerData);

    // delete used register id
    const isRegisterIdDeleted = await AuthService.deleteRegisterId(registerId);
    if (isRegisterIdDeleted) {
      console.log('⚙️ authController.ts > register > isRegisterIdDeleted:', isRegisterIdDeleted);
    }
    // respond successfully
    res.status(200).json({
      success: true,
      message: `User ${username} with ${uid} has been registered.`,
    });
  } catch (error) {
    console.log('⚙️ authController.ts > register(): error:', error);
    res.status(500).json({
      success: false,
      message: 'Register server error'
    });
    return;
  }
}






const TTL_MS = 2 * 60 * 1000; // 2 λεπτά

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







//
// POST /auth/login/start
//
const loginStart = async (  req: Request, res: Response): Promise<void> => {
  const username = req.body.username;
  console.log('⚙️ authService.ts > loginStart > req.body.username:', req.body.username);

  // get the user data
  const db = await getAuthDB();
  const userData = db.data.users.find((u) => u.username === username);
  console.log('⚙️ authService.ts > loginStart > userData', userData);

  // Check if the user exists
  if (!userData || !userData.authSalt) {
    console.log('⚙️ authService.ts > loginStart > user not found');
    res.json({
      success: false,
      error: {
        message: 'Error: Username does not exist'
      }
    });
    return;
  }

  const { challengeId, challengeHex } = await createChallenge(username);
  const authSalt = userData.authSalt;
  const response = {
    authSalt: authSalt,
    challengeId: challengeId,
    challenge: challengeHex
  };

  console.log('⚙️ authService.ts > loginStart > response:', response);

  res.json({
    success: true,
    data: response
  });
}

async function getUserByUsername(username: string): Promise<UserRow | undefined> {
  const db = await getAuthDB();
  const userData = db.data!.users.find((u) => u.username === username);
  console.log(' 🍒 authController.ts > getUserByUsername > userData:', userData)
  return userData;
}





//
// POST /auth/login/finish
//
const loginFinish = async (req: Request, res: Response): Promise<void> => {
  console.log('🍒 authController.ts > loginFinish > req.body:', req.body);
  const { challengeId, proof, username } = req.body ?? {};

  // check if fields exist
  if (!challengeId || !proof) {
    res.status(400).json({ success: false, error: { message: 'Missing challengeId or proof' } });
    return;
  }

  // get challenge { id, username, challengeHex, expiredAt, used}
  const rec = await getChallenge(challengeId);
  if (!rec || rec.used || isExpired(rec.expiresAt)) {
    res.status(400).json({ success: false, error: { message: 'Invalid or expired challenge' } });
    return;
  }

  // get user data {email, createdAt, username, encryptSalt, authSalt, verifierK}
  const user = await getUserByUsername(rec.username);
  if (!user) {
    res.status(404).json({ success: false, error: { message: 'User not found' } });
    return;
  }

  // verifierK = K = PBKDF2(password, authSalt) (hex) from registration
  const expected = hmacSha256Hex(rec.challengeHex, user.verifierK);

  console.log('🍒 authController.ts > loginFinish > expected', expected);

  if (!timingSafeEqHex(expected, proof)) {
    res.status(401).json({ success: false, error: { message: "Invalid credentials" } });
    return;
  }

  consumeChallenge(challengeId);

  // create tokens
  const accessToken = generateAccessToken({ username: user.username});
  const refreshToken = generateRefreshToken({ username: user.username});

  // place tokens into secure cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,  // 60 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // respond successfully
  res.json({
    success: true,
    message: `Hello ${username}`,
    data: {
      encryptSalt: user.encryptSalt,
    }
  });

}









    // Sanitize username: allow only alphanumeric characters and few symbols
    //const usernameRegex = /^[a-zA-Z0-9_.\-@]+$/;
    //if (!usernameRegex.test(username)) {
    //  res.status(400).json({
    //    success: false,
    //    message: 'Username contains invalid characters',
    //  });
    //  return;
    //}

    // Sanitize username: allow only alphanumeric characters and some symbols
    //const passwordregex = /^[a-za-z0-9!@#$%^&*()]+$/;
    //if (!passwordregex.test(password)) {
    //  res.status(400).json({
    //    success: false,
    //    message: 'password contains invalid characters',
    //  });
    //  return;
    //}

//
// GET /auth/refresh
//
const refresh = async (req: Request, res: Response): Promise<void> => {
  console.log('⚙️  authController.ts > refresh()');

  // check if there is a refreshToken cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log('⚙️  authController.ts > refresh() > No refresh token provided');
    res.status(401).json({ success: false, message: 'No refresh token provided' });
    return;
  }

  try {
    // check if the refresh cookie cointains a valid refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== 'object' || decoded === null || !('username' in decoded)) {
      console.log('⚙️  authController.ts > refresh() > Invalid token payload');
      res.status(403).json({ success: false, message: 'Invalid token payload' });
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
    console.log('⚙️  authController.ts > refresh() > Invalid or expired refresh token');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(403).json({ success: false, message: 'Token expired' });
    return;
  }
};




//
// GET /auth/user
//
const user = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ success: false, error: 'Token missing' });
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
    if (!decodedToken.username) {
      res.status(401).json({ success: false, error: 'Missing user information in token' });
      return;
    }

    res.json({
      success: true,
      data: {
        username: decodedToken.username
      }
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
    res.status(500).json({ success: false, message: 'Logout failed', error: 'Internal server error' });
  }
}

//
// /auth/user
//
//const user = async (res: Response): Promise<void> => {
//  console.log('user:')
//  try {
//    res.status(200).json({ success: true, message: 'User function executed' });
//  } catch (error) {
//    res.status(500).json({ error: 'Internal server error' });
//  }
//}

export { loginStart, loginFinish, refresh, register, logout, user };
