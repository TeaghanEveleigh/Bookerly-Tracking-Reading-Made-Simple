import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface AuthPayload extends JwtPayload {
  id: number;
  email: string;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'No token provided',
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({
      success: false,
      error: 'JWT secret is not configured',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }
};