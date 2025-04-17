import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { log } from "console";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Middleware to check if user is authorized to access specific resources
export const isAuthorized = (req: Request, res: Response, next: NextFunction): void => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const decoded = jwt.verify(req.cookies.accessToken, JWT_SECRET) as JwtPayload;

    // Ensure the user is authenticated first
    if (decoded.username != req.params.id) {
      res.status(401).json({
        success: false,
        message: 'Access denied: You can only access your own data'
      });
      return;
    }

    // User is authorized, proceed to the route handler
    next();

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: `Authorization error: ${error.message}`
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Unknown authorization error occurred'
    });
  }
};
