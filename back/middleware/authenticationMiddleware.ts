import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtTokens';

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Ensure the user is logged in
export const isAuthenticated = (req: Request, res: Response, next: NextFunction ): void => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const token = req.cookies.accessToken;

    // check if tokken missing
    if (!token) {
      console.log(' 🐞 Authentication required. Please log in.');
      res.status(401).json({
        success: false,
        message: ' 🐞 Authentication required. Please log in.'
      });
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Add user data to the request object
    req.user = decoded as JwtPayload;

    // Proceed to the next middleware/route handler
    next();

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(402).json({
        success: false,
        message: error.message,
        name: error.name
      });
      return;
    }
  }
};
