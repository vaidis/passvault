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
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    //console.log('🐞 authenticationMiddleware.ts > isAuthenticated > accessToken:', accessToken);
    //console.log('🐞 authenticationMiddleware.ts > isAuthenticated > refreshToken:', refreshToken);

    // token expired
    if (!accessToken && refreshToken) {
      //console.log('🐞 authenticationMiddleware.ts > isAuthenticated: jwt expired');
      res.status(499).json({
        success: false,
        message: 'jwt expired'
      });
      return;
    }

    // check if tokken missing
    if (!accessToken && !refreshToken) {
      //console.log('🐞  authenticationMiddleware.ts > isAuthenticated: jwt missing');
      res.status(499).json({
        success: false,
        message: 'jwt missing'
      });
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(accessToken);

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
