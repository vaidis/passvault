import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import Datastore from 'nedb-promises';
import path from 'path';


interface User {
  _id?: string;
  username: string;
  password?: string;
  role: string;
}

const authRouter = express.Router();

const ACCESS_TOKEN_SECRET = 'your_super_secret_access_key';
const REFRESH_TOKEN_SECRET = 'your_super_secret_refresh_key';

function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Load the admin database
const adminDbPath = path.join(__dirname, 'db', 'admin.db.json');
const adminDb = Datastore.create({ filename: adminDbPath, autoload: true });

// Ensure an admin user exists (default: admin / admin123)
(async () => {
  const existing = await adminDb.findOne({ username: 'admin' });
  if (!existing) {
    await adminDb.insert({ username: 'admin', password: 'admin123', role: 'admin' });
    console.log('Default admin user created (admin / admin123)');
  }
})();

// POST /auth/login
authRouter.post('/login', async function loginHandler(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  try {
    // find the user if any
    const user: User | null = await adminDb.findOne({ username, password });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Optionally, generate and return a token here instead of raw role
    const tokenPayload:User = {username:user.username, role:user.role}
    const response = {
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload)
    }
    res.json(response);

  } catch (error) {
    console.error('Login error:', error);
                  res.status(500).json({ success: false, error: 'Internal server error' });
                  return;
  }
});

// POST /auth/refresh
authRouter.post('/refresh', async function refreshHandler(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ success: false, error: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (typeof decoded !== 'object' || decoded === null || !('username' in decoded)) {
      res.status(403).json({ success: false, error: 'Invalid token payload' });
      return;
    }
    const payload = decoded as JwtPayload;
    //const payload:User = decoded;
    const newAccessToken = generateAccessToken({ username: payload.username, role: payload.role });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
    return;
  }
});


// GET /auth/user
authRouter.get('/user', async function loginHandler(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (accessToken == null) {
    res.sendStatus(401);
  }

  if (accessToken) {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      res.json({success: true, role:user.role});
    });
  }
});

export { authRouter };

