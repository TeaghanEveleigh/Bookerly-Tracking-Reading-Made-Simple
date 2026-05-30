import pool from '#/config/db.js';
import type { Book } from '#/models/book.model.js';
import type { Library, UpdateLibraryDto } from '#/models/library.model.js';

const LIBRARY_FIELDS = ['id', 'library_name', 'library_photo_url', 'user_id'] as const;
const LIBRARY_SELECT_FIELDS = LIBRARY_FIELDS.join(', ');
const UPDATABLE_LIBRARY_FIELDS = ['library_name', 'library_photo_url'] as const;

const createUserLibrary = async (id: string, libraryName: string): Promise<Library> => {
  const result = await pool.query<Library>(
    `INSERT INTO libraries (user_id, library_name)
     VALUES ($1, $2)
     RETURNING ${LIBRARY_SELECT_FIELDS}`,
    [id, libraryName]
  );

  return result.rows[0];
};

const findAllLibraries = async (): Promise<Library[]> => {
  const result = await pool.query<Library>(`SELECT ${LIBRARY_SELECT_FIELDS} FROM libraries`);

  return result.rows;
};

const findLibraryById = async (id: string): Promise<Library | null> => {
  const result = await pool.query<Library>(
    `SELECT ${LIBRARY_SELECT_FIELDS} FROM libraries WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
};

const getUserLibraries = async (id: string): Promise<Library[]> => {
  const result = await pool.query<Library>(
    `SELECT ${LIBRARY_SELECT_FIELDS} FROM libraries WHERE user_id = $1`,
    [id]
  );

  return result.rows;
};

const getLibraryBooks = async (id: string): Promise<Book[]> => {
  const result = await pool.query<Book>('SELECT * FROM books WHERE library_id = $1', [id]);

  return result.rows;
};

const getFirstFiveBooks = async (id: string): Promise<Book[]> => {
  const result = await pool.query<Book>('SELECT * FROM books WHERE library_id = $1 LIMIT 5', [id]);

  return result.rows;
};

const updateLibrary = async (id: string, changes: UpdateLibraryDto): Promise<Library | null> => {
  const entries = Object.entries(changes).filter(
    ([field, value]) =>
      UPDATABLE_LIBRARY_FIELDS.includes(field as (typeof UPDATABLE_LIBRARY_FIELDS)[number]) &&
      value !== undefined
  );

  if (entries.length === 0) return null;

  const setClause = entries.map(([field], index) => `${field} = $${index + 2}`).join(', ');
  const values = entries.map(([, value]) => value);

  const result = await pool.query<Library>(
    `UPDATE libraries
     SET ${setClause}
     WHERE id = $1
     RETURNING ${LIBRARY_SELECT_FIELDS}`,
    [id, ...values]
  );

  return result.rows[0] ?? null;
};

const deleteLibraryById = async (id: string): Promise<Library | null> => {
  const result = await pool.query<Library>(
    `DELETE FROM libraries WHERE id = $1 RETURNING ${LIBRARY_SELECT_FIELDS}`,
    [id]
  );

  return result.rows[0] ?? null;
};

export {
  createUserLibrary,
  deleteLibraryById,
  findAllLibraries,
  findLibraryById,
  getFirstFiveBooks,
  getLibraryBooks,
  getUserLibraries,
  updateLibrary,
};
