import { afterEach, describe, expect, it } from 'vitest';
import type { CreateBookDto } from '#/models/book.model.js';
import type { createUserDto } from '#/models/user.model.js';
import {
  checkBookExists,
  createBook,
  deleteBookById,
  findAllBooks,
  findBookById,
  updateBook,
} from '#/services/book.service.js';
import { createUser, deleteUserById } from '#/services/user.service.js';
import { createUserLibrary, deleteLibraryById } from '#/services/library.service.js';

const createdBookIds: string[] = [];
const createdLibraryIds: string[] = [];
const createdUserIds: string[] = [];

const createTestUser = async () => {
  const testUser: createUserDto = {
    email: `book-user-${crypto.randomUUID()}@test.com`,
    password_hash: 'testhash',
  };

  const user = await createUser(testUser);
  createdUserIds.push(user.id);

  return user;
};

const createTestLibrary = async () => {
  const user = await createTestUser();
  const library = await createUserLibrary(user.id, `Book Library ${crypto.randomUUID()}`);
  createdLibraryIds.push(library.id);

  return library;
};

const createTestBook = async () => {
  const library = await createTestLibrary();
  const testBook: CreateBookDto = {
    book_name: `Book ${crypto.randomUUID()}`,
    book_preview_picture: 'https://example.com/book.jpg',
    book_description: 'A test book',
    book_authors: ['Test Author'],
    number_of_pages: 250,
    estimated_read_time: '5 hours',
    publisher: 'Test Publisher',
    book_link: 'https://example.com/book',
    progress_page: 10,
    progress_percentage: 4,
    library_id: library.id,
  };

  const book = await createBook(testBook);
  createdBookIds.push(book.id);

  return { book, library };
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

describe('Book Service Operations', () => {
  it('creates a book in a library', async () => {
    const { book, library } = await createTestBook();

    expect(book).toBeDefined();
    expect(book.id).toBeDefined();
    expect(book.book_name).toContain('Book');
    expect(book.book_authors).toEqual(['Test Author']);
    expect(book.progress_page).toBe(10);
    expect(book.progress_percentage).toBe(4);
    expect(book.library_id).toBe(library.id);
  });

  it('creates a book with default progress values', async () => {
    const library = await createTestLibrary();
    const book = await createBook({
      book_name: `Default Progress ${crypto.randomUUID()}`,
      library_id: library.id,
    });
    createdBookIds.push(book.id);

    expect(book.progress_page).toBe(0);
    expect(book.progress_percentage).toBe(0);
  });

  it('finds all books', async () => {
    const { book } = await createTestBook();

    const books = await findAllBooks();

    expect(books.length).toBeGreaterThan(0);
    expect(books.some((bookValue) => bookValue.id === book.id)).toBe(true);
  });

  it('finds a book by id', async () => {
    const { book } = await createTestBook();

    const foundBook = await findBookById(book.id);

    expect(foundBook).toBeDefined();
    expect(foundBook?.id).toBe(book.id);
    expect(foundBook?.book_name).toBe(book.book_name);
  });

  it('checks whether a book exists in a library', async () => {
    const { book, library } = await createTestBook();

    await expect(checkBookExists(book.book_name, library.id)).resolves.toBe(true);
    await expect(checkBookExists(`Missing ${crypto.randomUUID()}`, library.id)).resolves.toBe(
      false
    );
  });

  it('updates a book', async () => {
    const { book } = await createTestBook();
    const updatedName = `Updated Book ${crypto.randomUUID()}`;

    const updatedBook = await updateBook(book.id, {
      book_name: updatedName,
      progress_page: 25,
      progress_percentage: 10,
    });

    expect(updatedBook).toBeDefined();
    expect(updatedBook?.id).toBe(book.id);
    expect(updatedBook?.book_name).toBe(updatedName);
    expect(updatedBook?.progress_page).toBe(25);
    expect(updatedBook?.progress_percentage).toBe(10);
  });

  it('returns null when no book update fields are provided', async () => {
    const { book } = await createTestBook();

    const updatedBook = await updateBook(book.id, {});

    expect(updatedBook).toBeNull();
  });

  it('deletes a book by id', async () => {
    const { book } = await createTestBook();

    const deletedBook = await deleteBookById(book.id);

    expect(deletedBook).toBeDefined();
    expect(deletedBook?.id).toBe(book.id);

    const foundBook = await findBookById(book.id);

    expect(foundBook).toBeNull();

    const index = createdBookIds.indexOf(book.id);

    if (index !== -1) {
      createdBookIds.splice(index, 1);
    }
  });
});
