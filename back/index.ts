import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit'

import { authRouter } from './routes/authRoutes';
import { dataRouter } from './routes/dataRoutes';
import { userRouter } from './routes/userRoutes';
import { pingRouter } from './routes/pingRoutes';
import { statsRouter } from './routes/statsRoutes';

import { getClientIp } from './utils/getClientIp';

const PORT = 3001;

const limiter = rateLimit({
  windowMs: 115 * 60 * 1000,
  limit: 2100,
  standardHeaders: true,
  legacyHeaders: false,
})

const app = express();
// app.set('trust proxy', true);

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(limiter)
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(async (req, _res, next) => {
  try {
    if (req.method === 'OPTIONS') return next(); // μη λογαριάζεις preflight

    // const db = await dbPromise;
    const ip = getClientIp(req);
    if (ip) {
      const now = new Date().toISOString();
      console.log('IP:', now, ip);
      // const existing = db.data.clients[ip];

      // if (existing) {
      //   existing.lastSeen = now;
      //   existing.count += 1;
      //   if (!existing.ua && req.get?.('user-agent')) {
      //     existing.ua = req.get('user-agent') || existing.ua;
      //   }
      // } else {
      //   db.data.clients[ip] = {
      //     ip,
      //     firstSeen: now,
      //     lastSeen: now,
      //     count: 1,
      //     ua: req.get?.('user-agent') || undefined,
      //   };
      // }

      // Απλή εγγραφή. Για υψηλό traffic βάλε batching/debounce.
      // await db.write();
    }
  } catch {
    // σιωπηλά — δεν μπλοκάρουμε το request
  }
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/user', userRouter);
app.use('/ping', pingRouter);
app.use('/stats', statsRouter);

// App
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;

process.on("SIGTERM", () => {
  console.log("📦 Closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📦 Closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
