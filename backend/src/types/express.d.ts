import type { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};