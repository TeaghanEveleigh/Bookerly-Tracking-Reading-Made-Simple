// tests/user.service.test.ts

import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import {
  createUser,
  deleteUserById,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUser,
} from '#/services/user.service.js';
import type { createUserDto, User } from '#/models/user.model.js';
import pool from '#/config/db.js';

const createdUserIds: string[] = [];

const createTestUser = async () => {
  const testUser: createUserDto = {
    email: `test-${crypto.randomUUID()}@test.com`,
    password_hash: 'testhash',
  };

  const user = await createUser(testUser);
  console.log("USER IS" , user)
  createdUserIds.push(user?.id);

  return user;
};

afterEach(async () => {
  for (const id of createdUserIds) {
    await deleteUserById(id);
  }

  createdUserIds.length = 0;
});

describe('User Service Operations', () => {
  it('creates a user in the database', async () => {
    const user = await createTestUser();

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toContain('@test.com');
    expect(user.password_hash).toBe('testhash');
  });

  it('finds all users', async () => {
    const user = await createTestUser();

    const users = await findAllUsers();

    expect(users.length).toBeGreaterThan(0);
    expect(users.some((uservalue : User) => uservalue.id === user.id)).toBe(true);
  });

  it('finds a user by id', async () => {
    const user = await createTestUser();

    const foundUser = await findUserById(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(user.id);
    expect(foundUser?.email).toBe(user.email);
  });

  it('finds a user by email', async () => {
    const user = await createTestUser();

    const foundUser = await findUserByEmail(user.email);

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(user.id);
    expect(foundUser?.email).toBe(user.email);
  });

  it('updates a user', async () => {
    const user = await createTestUser();

    const updatedEmail = `updated-${crypto.randomUUID()}@test.com`;

    const updatedUser = await updateUser(user.id, {
      email: updatedEmail,
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.id).toBe(user.id);
    expect(updatedUser?.email).toBe(updatedEmail);
  });

  it('deletes a user by id', async () => {
    const user = await createTestUser();

    const deletedUser = await deleteUserById(user.id);

    expect(deletedUser).toBeDefined();
    expect(deletedUser?.id).toBe(user.id);

    const foundUser = await findUserById(user.id);

    expect(foundUser).toBeNull();

    const index = createdUserIds.indexOf(user.id);

    if (index !== -1) {
      createdUserIds.splice(index, 1);
    }
  });
});