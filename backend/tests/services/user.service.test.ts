import { afterEach, describe, expect, it } from 'vitest';

import {
  createUser,
  deleteUserById,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUser,
} from '#/services/user.service.js';

import type { createUserDto, User } from '#/models/user.model.js';

const createdUserIds: string[] = [];

const createUniqueEmail = (): string => {
  return `test-${crypto.randomUUID()}@example.com`;
};

const trackCreatedUser = (id: string): void => {
  createdUserIds.push(id);
};

const untrackCreatedUser = (id: string): void => {
  const index = createdUserIds.findIndex((createdUserId) => createdUserId === id);

  if (index !== -1) {
    createdUserIds.splice(index, 1);
  }
};

const createTestUser = async (
  overrides: Partial<createUserDto> = {}
): Promise<User> => {
  const userToCreate: createUserDto = {
    email: createUniqueEmail(),
    password_hash: 'test-password-hash',
    ...overrides,
  };

  const createdUser = await createUser(userToCreate);

  trackCreatedUser(createdUser.id);

  return createdUser;
};

afterEach(async () => {
  for (const id of createdUserIds) {
    await deleteUserById(id);
  }

  createdUserIds.length = 0;
});

describe('User Service Operations', () => {
  it('creates a user in the database', async () => {
    const userToCreate: createUserDto = {
      email: createUniqueEmail(),
      password_hash: 'testhash',
    };

    const createdUser = await createUser(userToCreate);

    trackCreatedUser(createdUser.id);

    expect(createdUser).toMatchObject({
      email: userToCreate.email,
      password_hash: userToCreate.password_hash,
    });

    expect(createdUser.id).toEqual(expect.any(String));
  });

  it('finds a user by id', async () => {
    const createdUser = await createTestUser();

    const foundUser = await findUserById(createdUser.id);

    expect(foundUser).not.toBeNull();

    expect(foundUser).toMatchObject({
      id: createdUser.id,
      email: createdUser.email,
      password_hash: createdUser.password_hash,
    });
  });

  it('returns null when finding a user by an id that does not exist', async () => {
    const foundUser = await findUserById('999999999');

    expect(foundUser).toBeNull();
  });

  it('finds a user by email', async () => {
    const createdUser = await createTestUser();

    const foundUser = await findUserByEmail(createdUser.email);

    expect(foundUser).not.toBeNull();

    expect(foundUser).toMatchObject({
      id: createdUser.id,
      email: createdUser.email,
      password_hash: createdUser.password_hash,
    });
  });

  it('returns null when finding a user by an email that does not exist', async () => {
    const foundUser = await findUserByEmail(createUniqueEmail());

    expect(foundUser).toBeNull();
  });

  it('finds all users and includes the created test user', async () => {
    const createdUser = await createTestUser();

    const users = await findAllUsers();

    expect(Array.isArray(users)).toBe(true);

    expect(users.some((user : User) => user.id === createdUser.id)).toBe(true);
  });

  it('updates a user email', async () => {
    const createdUser = await createTestUser();
    const updatedEmail = createUniqueEmail();

    const updatedUser = await updateUser(createdUser.id, {
      email: updatedEmail,
    });

    expect(updatedUser).not.toBeNull();

    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      email: updatedEmail,
    });

    const foundUser = await findUserById(createdUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(updatedEmail);
  });

  it('updates a user password hash', async () => {
    const createdUser = await createTestUser();
    const updatedPasswordHash = 'updated-test-password-hash';

    const updatedUser = await updateUser(createdUser.id, {
      password_hash: updatedPasswordHash,
    });

    expect(updatedUser).not.toBeNull();

    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      password_hash: updatedPasswordHash,
    });

    const foundUser = await findUserById(createdUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.password_hash).toBe(updatedPasswordHash);
  });

  it('updates user dark mode', async () => {
    const createdUser = await createTestUser();

    const updatedUser = await updateUser(createdUser.id, {
      dark_mode: true,
    });

    expect(updatedUser).not.toBeNull();

    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      dark_mode: true,
    });

    const foundUser = await findUserById(createdUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.dark_mode).toBe(true);
  });

  it('updates multiple user fields at once', async () => {
    const createdUser = await createTestUser();

    const updatedEmail = createUniqueEmail();
    const updatedPasswordHash = 'updated-hash-multiple-fields';

    const updatedUser = await updateUser(createdUser.id, {
      email: updatedEmail,
      password_hash: updatedPasswordHash,
      dark_mode: true,
    });

    expect(updatedUser).not.toBeNull();

    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      email: updatedEmail,
      password_hash: updatedPasswordHash,
      dark_mode: true,
    });
  });

  it('returns null when updating with no fields', async () => {
    const createdUser = await createTestUser();

    const updatedUser = await updateUser(createdUser.id, {});

    expect(updatedUser).toBeNull();
  });

  it('returns null when updating a user that does not exist', async () => {
    const updatedUser = await updateUser('999999999', {
      email: createUniqueEmail(),
    });

    expect(updatedUser).toBeNull();
  });

  it('deletes a user by id', async () => {
    const createdUser = await createTestUser();

    const deletedUser = await deleteUserById(createdUser.id);

    untrackCreatedUser(createdUser.id);

    expect(deletedUser).not.toBeNull();

    expect(deletedUser).toMatchObject({
      id: createdUser.id,
      email: createdUser.email,
    });

    const foundUser = await findUserById(createdUser.id);

    expect(foundUser).toBeNull();
  });

  it('returns null when deleting a user that does not exist', async () => {
    const deletedUser = await deleteUserById('999999999');

    expect(deletedUser).toBeNull();
  });
});