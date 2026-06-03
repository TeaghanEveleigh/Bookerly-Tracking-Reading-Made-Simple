import pool from '#/config/db.js';
import { comparePasswords, hashPassword } from '#/lib/password.js';
import type { AuthUser } from '#/models/auth.models.js';

const USER_SELECT_FIELDS = 'id, email, password_hash';

const findAuthUserByEmail = async (email: string): Promise<AuthUser | null> => {
  const result = await pool.query<AuthUser>(
    `SELECT ${USER_SELECT_FIELDS} FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0] ?? null;
};

const checkEmailExists = async (email: string): Promise<boolean> => {
  const user = await findAuthUserByEmail(email);

  return user !== null;
};

const createAuthUser = async (email: string, password: string): Promise<AuthUser> => {
  const passwordHash = await hashPassword(password);
  const result = await pool.query<AuthUser>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING ${USER_SELECT_FIELDS}`,
    [email, passwordHash]
  );

  return result.rows[0];
};

const checkPasswordCorrect = async (email: string, password: string): Promise<boolean> => {
  const user = await findAuthUserByEmail(email);

  if (!user) return false;

  return comparePasswords(password, user.password_hash);
};

export { checkEmailExists, checkPasswordCorrect, createAuthUser, findAuthUserByEmail };
