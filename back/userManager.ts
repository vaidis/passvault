import express from 'express';
import fs from 'fs';
import path from 'path';
import Datastore from 'nedb-promises';
import { Request, Response } from 'express';

const userManagerRouter = express.Router();
const USERS_DIR = path.join(__dirname, 'db', 'users');

// Ensure the users directory exists
fs.mkdirSync(USERS_DIR, { recursive: true });

// POST /users/create
userManagerRouter.post('/create', async function(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, error: 'Username and password are required' });
    return
  }

  const userDbPath = path.join(USERS_DIR, `${username}.db.json`);

  if (fs.existsSync(userDbPath)) {
    res.status(400).json({ success: false, error: 'User already exists' });
    return
  }

  try {
    const userDb = Datastore.create({ filename: userDbPath, autoload: true });
    await userDb.insert({ username, password, role: 'user', createdAt: new Date() });

    res.json({ success: true, message: `User '${username}' created` });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// GET /users/list
userManagerRouter.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(USERS_DIR);
    const usernames = files
      .filter(file => file.endsWith('.db.json'))
      .map(file => path.basename(file, '.db.json'));

    res.json({ success: true, users: usernames });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ success: false, error: 'Failed to list users' });
  }
});

export { userManagerRouter };

