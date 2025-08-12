import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/authRoutes';
import { dataRouter } from './routes/dataRoutes';
import { userRouter } from './routes/userRoutes';

const PORT = 3001;

// limit 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 115 * 60 * 1000,
  limit: 2100,
  standardHeaders: true,
  legacyHeaders: false,
})

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(limiter)
app.use(helmet());
app.use(cookieParser());
//app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/user', userRouter);

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
