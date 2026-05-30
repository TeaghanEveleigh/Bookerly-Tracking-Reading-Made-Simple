import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isProvided, isString } from '#/lib/typevalidators.js';
import { createUserLibrary } from '#/services/library.service.js';
import {
  checkEmailExists,
  checkPasswordCorrect,
  createAuthUser,
  findAuthUserByEmail,
} from '#/services/auth.service.js';

const DEFAULT_LIBRARY_NAMES = ['Currently Reading', 'Want to Read', 'Read'] as const;

const createToken = (id: string, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign({ id, email }, jwtSecret, { expiresIn: '1d' });
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!isProvided(email) || !isString(email) || !isProvided(password) || !isString(password)) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const passwordCorrect = await checkPasswordCorrect(email, password);

    if (!passwordCorrect) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const user = await findAuthUserByEmail(email);

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = createToken(user.id, user.email);

    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!isProvided(email) || !isString(email) || !isProvided(password) || !isString(password)) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      res.status(409).json({ success: false, error: 'Email already in use' });
      return;
    }

    const user = await createAuthUser(email, password);

    await Promise.all(
      DEFAULT_LIBRARY_NAMES.map((libraryName) => createUserLibrary(user.id, libraryName))
    );

    const token = createToken(user.id, user.email);

    res.status(201).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

const logout = (_req: Request, res: Response): void => {
  res.json({ success: true });
};

export { login, logout, signup };
