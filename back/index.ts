import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';

const PORT = 3001;

// limit 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 115 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(limiter)
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);

// App
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
export default app;

