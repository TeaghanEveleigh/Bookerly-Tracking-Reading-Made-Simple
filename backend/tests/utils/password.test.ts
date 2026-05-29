import { describe, expect, it } from 'vitest';
import { comparePasswords , hashPassword } from '#/lib/password.js';

describe('password utils', () => {
  it('hashes a password to 60 characters long (Bcrypt Standard)', async () => {
    const password = 'Password123!';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toMatch(/^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/);
  });

  it('returns true when the password matches the hash', async () => {
    const password = 'Password123!';
    const hashedPassword = await hashPassword(password);

    const result = await comparePasswords(password, hashedPassword);

    expect(result).toBe(true);
  });

  it('returns false when the password does not match the hash', async () => {
    const password = 'Password123!';
    const hashedPassword = await hashPassword(password);

    const result = await comparePasswords('WrongPassword123!', hashedPassword);

    expect(result).toBe(false);
  });
});