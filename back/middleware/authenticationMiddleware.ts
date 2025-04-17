import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { log } from "console";

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
    log(' 🐞 isAuthenticated is not defined:')
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const token = req.cookies.accessToken;

    // check if tokken missing
    if (!token) {
      res.status(401).json({
        success: false,
        message: ' 🐞 Authentication required. Please log in.'
      });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Add the user data to the request object
    req.user = decoded as JwtPayload;

    // Proceed to the next middleware/route handler
    next();

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(402).json({
          success: false,
          message: ' 🐞 Session expired. Please log in again.'
        });
        return;
      }

      res.status(402).json({
        success: false,
        message: ' 🐞 Invalid authentication token.'
      });
      return;
    }
  }
};
