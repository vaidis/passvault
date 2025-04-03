import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit'
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import { authRouter } from './auth';
import { userManagerRouter } from './userManager';

const PORT = 3001;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express();
app.use(cors());
app.use(limiter)
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// Ensure user DB directory exists
const usersDir = path.join(__dirname, 'db', 'users');
fs.mkdirSync(usersDir, { recursive: true });

app.use('/auth', authRouter);
app.use('/users', userManagerRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
