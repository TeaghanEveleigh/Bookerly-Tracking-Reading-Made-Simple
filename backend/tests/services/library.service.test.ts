import { afterEach, describe, expect, it } from 'vitest';
import type { Library } from '#/models/library.model.js';
import type { createUserDto } from '#/models/user.model.js';
import type { CreateBookDto } from '#/models/book.model.js';
import {
  createUserLibrary,
  deleteLibraryById,
  findAllLibraries,
  findLibraryById,
  getFirstFiveBooks,
  getLibraryBooks,
  getUserLibraries,
  updateLibrary,
} from '#/services/library.service.js';
import { createUser, deleteUserById } from '#/services/user.service.js';
import { createBook, deleteBookById } from '#/services/book.service.js';

const createdBookIds: string[] = [];
const createdLibraryIds: string[] = [];
const createdUserIds: string[] = [];

const createTestUser = async () => {
  const testUser: createUserDto = {
    email: `library-user-${crypto.randomUUID()}@test.com`,
    password_hash: 'testhash',
  };

  const user = await createUser(testUser);
  createdUserIds.push(user.id);

  return user;
};

const createTestLibrary = async () => {
  const user = await createTestUser();
  const library = await createUserLibrary(user.id, `Library ${crypto.randomUUID()}`);
  createdLibraryIds.push(library.id);

  return { library, user };
};

const createTestLibraryForUser = async (userId: string, libraryName: string) => {
  const library = await createUserLibrary(userId, libraryName);
  createdLibraryIds.push(library.id);

  return library;
};

const createTestBook = async (libraryId: string, index = 0) => {
  const testBook: CreateBookDto = {
    book_name: `Book ${index} ${crypto.randomUUID()}`,
    book_preview_picture: 'https://example.com/book.jpg',
    book_description: 'A test book',
    book_authors: ['Test Author'],
    number_of_pages: 250 + index,
    estimated_read_time: '5 hours',
    publisher: 'Test Publisher',
    book_link: 'https://example.com/book',
    library_id: libraryId,
  };

  const book = await createBook(testBook);
  createdBookIds.push(book.id);

  return book;
};

afterEach(async () => {
  for (const id of createdBookIds) {
    await deleteBookById(id);
  }

  for (const id of createdLibraryIds) {
    await deleteLibraryById(id);
  }

  for (const id of createdUserIds) {
    await deleteUserById(id);
  }

  createdBookIds.length = 0;
  createdLibraryIds.length = 0;
  createdUserIds.length = 0;
});

describe('Library Service Operations', () => {
  it('creates a library for a user', async () => {
    const { library, user } = await createTestLibrary();

    expect(library).toBeDefined();
    expect(library.id).toBeDefined();
    expect(library.library_name).toContain('Library');
    expect(library.user_id).toBe(user.id);
  });

  it('finds all libraries', async () => {
    const { library } = await createTestLibrary();

    const libraries = await findAllLibraries();

    expect(libraries.length).toBeGreaterThan(0);
    expect(libraries.some((libraryValue) => libraryValue.id === library.id)).toBe(true);
  });

  it('finds a library by id', async () => {
    const { library } = await createTestLibrary();

    const foundLibrary = await findLibraryById(library.id);

    expect(foundLibrary).toBeDefined();
    expect(foundLibrary?.id).toBe(library.id);
    expect(foundLibrary?.library_name).toBe(library.library_name);
  });

  it('finds libraries for a user using page and size', async () => {
    const user = await createTestUser();
    const createdLibraries: Library[] = [];

    for (let index = 0; index < 12; index += 1) {
      const library = await createTestLibraryForUser(
        user.id,
        `Paginated Library ${index} ${crypto.randomUUID()}`
      );
      createdLibraries.push(library);
    }

    const libraries = await getUserLibraries(user.id, '2', '10');

    expect(libraries).toHaveLength(2);
    expect(libraries.map((libraryValue) => libraryValue.id)).toEqual(
      createdLibraries.slice(10).map((libraryValue) => libraryValue.id)
    );
    expect(libraries.every((libraryValue) => libraryValue.user_id === user.id)).toBe(true);
  });

  it('finds books in a library', async () => {
    const { library } = await createTestLibrary();
    const book = await createTestBook(library.id);

    const books = await getLibraryBooks(library.id);

    expect(books.some((bookValue) => bookValue.id === book.id)).toBe(true);
  });

  it('finds only the first five books in a library', async () => {
    const { library } = await createTestLibrary();

    for (let index = 0; index < 6; index += 1) {
      await createTestBook(library.id, index);
    }

    const books = await getFirstFiveBooks(library.id);

    expect(books).toHaveLength(5);
    expect(books.every((bookValue) => bookValue.library_id === library.id)).toBe(true);
  });

  it('updates a library', async () => {
    const { library } = await createTestLibrary();
    const updatedName = `Updated Library ${crypto.randomUUID()}`;
    const updatedPhotoUrl = 'https://example.com/library.jpg';

    const updatedLibrary = await updateLibrary(library.id, {
      library_name: updatedName,
      library_photo_url: updatedPhotoUrl,
    });

    expect(updatedLibrary).toBeDefined();
    expect(updatedLibrary?.id).toBe(library.id);
    expect(updatedLibrary?.library_name).toBe(updatedName);
    expect(updatedLibrary?.library_photo_url).toBe(updatedPhotoUrl);
  });

  it('deletes a library by id', async () => {
    const { library } = await createTestLibrary();

    const deletedLibrary = await deleteLibraryById(library.id);

    expect(deletedLibrary).toBeDefined();
    expect(deletedLibrary?.id).toBe(library.id);

    const foundLibrary = await findLibraryById(library.id);

    expect(foundLibrary).toBeNull();

    const index = createdLibraryIds.indexOf(library.id);

    if (index !== -1) {
      createdLibraryIds.splice(index, 1);
    }
  });
});
