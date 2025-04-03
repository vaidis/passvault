import express from 'express';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Datastore from 'nedb-promises';
import path from 'path';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} from './jwtTokens';
import { log } from "console";
import bcrypt from "bcrypt";

interface User {
  _id?: string;
  username: string;
  password: string;
  role: string;
}

const authRouter = express.Router();

// Load the admin database
const adminDbPath = path.join(__dirname, 'db', 'admin.db.json');
const adminDb = Datastore.create({ filename: adminDbPath, autoload: true });

// Ensure an admin user exists (default: admin / admin123)
(async () => {
  const existing = await adminDb.findOne({ username: 'admin' });
  if (!existing) {
    await adminDb.insert({ username: 'admin', password: 'admin123', role: 'admin' });
    log('Default admin user created (admin / admin123)');
  }
})();

//
// POST /auth/login
//
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    log(' 🐞 auth.ts /login req.body:', req.body);
    
    // Basic validation
    if (!username || !password) {
      log(' 🐞 auth.ts /login 401 credentials required');
      res.status(401).json({ message: 'Email and password are required.' });
      return;
    }

    // check the user
    // refactor the code and type declerations
    const user: User | null = await adminDb.findOne({ username });
    if (user == null) {
      log(' 🐞 auth.ts /login 401 invalid credentials');
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // check the password
    if (password !== user.password) {
      log(' 🐞 auth.ts /login 401 auth fail');
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    // create tokens
    const accessToken = generateAccessToken({ username: user.username, role: user.role });
    const refreshToken = generateRefreshToken({ username: user.username, role: user.role });

    // place tokens into secure cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,            // Only over HTTPS
      sameSite: 'strict',      // Prevent CSRF
      maxAge: 15 * 60 * 1000,  // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, role: user.role });

  } catch (error) {
    log('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
    return;
  }
});


// POST /auth/refresh
authRouter.post('/refresh', async function refreshHandler(req: Request, res: Response): Promise<void> {

  // check if there is a refreshToken cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, error: 'No refresh token provided' });
    return;
  }

  try {
    // check if the refresh cookie cointains a valid refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== 'object' || decoded === null || !('username' in decoded)) {
      res.status(403).json({ success: false, error: 'Invalid token payload' });
      return;
    }

    console.log(' 🐞 auth.ts /refresh decoded', decoded);

    // create new access token with the old payload
    const payload = decoded as JwtPayload;
    const newAccessToken = generateAccessToken({ username: payload.username, role: payload.role });
    const newRefreshToken = generateRefreshToken({ username: payload.username, role: payload.role });

    // place tokens into secure cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,            // Only over HTTPS
      sameSite: 'strict',      // Prevent CSRF
      maxAge: 15 * 60 * 1000,  // 15 minutes
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, role: payload.role });
  } catch (err) {
    res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
    return;
  }
});


// GET /auth/user
authRouter.get('/user', async function loginHandler(req: Request, res: Response): Promise<void> {
  const accessToken = req.cookies.accessToken;
  log('AUTH accessToken', accessToken);

  if (!accessToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const user = verifyAccessToken(accessToken);
    res.json({ success: true, role: (user as any).role });
  } catch (err) {
    res.status(403).json({ error: 'No valid token' });
  }
});

export { authRouter };

