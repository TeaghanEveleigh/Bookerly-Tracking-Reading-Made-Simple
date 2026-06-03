import { afterEach, describe, expect, it } from 'vitest';
import {
  checkEmailExists,
  checkPasswordCorrect,
  createAuthUser,
  findAuthUserByEmail,
} from '#/services/auth.service.js';
import pool from '#/config/db.js';

const createdUserIds: string[] = [];

const createTestAuthUser = async () => {
  const email = `auth-${crypto.randomUUID()}@test.com`;
  const password = 'Password123!';

  const user = await createAuthUser(email, password);
  createdUserIds.push(user.id);

  return { email, password, user };
};

afterEach(async () => {
  for (const id of createdUserIds) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  createdUserIds.length = 0;
});

describe('Auth Service Operations', () => {
  it('creates an auth user with a hashed password', async () => {
    const { email, password, user } = await createTestAuthUser();

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.password_hash).not.toBe(password);
    expect(user.password_hash).toMatch(/^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/);
  });

  it('finds an auth user by email', async () => {
    const { email, user } = await createTestAuthUser();

    const foundUser = await findAuthUserByEmail(email);

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(user.id);
    expect(foundUser?.email).toBe(email);
    expect(foundUser?.password_hash).toBe(user.password_hash);
  });

  it('checks whether an email exists', async () => {
    const { email } = await createTestAuthUser();

    await expect(checkEmailExists(email)).resolves.toBe(true);
    await expect(checkEmailExists(`missing-${crypto.randomUUID()}@test.com`)).resolves.toBe(false);
  });

  it('checks whether a password is correct', async () => {
    const { email, password } = await createTestAuthUser();

    await expect(checkPasswordCorrect(email, password)).resolves.toBe(true);
    await expect(checkPasswordCorrect(email, 'WrongPassword123!')).resolves.toBe(false);
    await expect(
      checkPasswordCorrect(`missing-${crypto.randomUUID()}@test.com`, password)
    ).resolves.toBe(false);
  });
});
