import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../jwtTokens';

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Middleware to check if user is authorized to access specific resources
export const isAuthorized = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🚪 authorizationMiddleware.ts > isAuthorized')
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const user = req.user;
    console.log('🚪 authorizationMiddleware.ts > isAuthorized > user: ', user)
    // const token = req.cookies.accessToken;
    // const decoded = verifyAccessToken(token) as JwtPayload;
    // console.log('🚪 authorizationMiddleware.ts > isAuthorized > token: ', token)
    // console.log('🚪 authorizationMiddleware.ts > isAuthorized > decoded: ', decoded)
    // Ensure the user is authenticated first
    // if (decoded.username != req.params.username) {
    //   res.status(401).json({
    //     success: false,
    //     message: 'Access denied: You can only access your own data'
    //   });
    //   return;
    // }

    // User is authorized, proceed to the route handler
    // next();
      setTimeout(next,2000);

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
