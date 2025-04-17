import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';

const PORT = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express();

// Middlewares
app.use(cors());
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






//app.listen(PORT, () => {
//  console.log(`🚀 Server running at http://localhost:${PORT}`);
//});
//if (require.main === module) {
//  app.listen(PORT, () => {
//    console.log(`🚀 Server running at http://localhost:${PORT}`);
//  });
//}

