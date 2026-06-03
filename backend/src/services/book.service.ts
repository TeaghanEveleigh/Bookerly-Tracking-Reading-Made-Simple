import pool from '#/config/db.js';
import type { Book, CreateBookDto, UpdateBookDto } from '#/models/book.model.js';

const BOOK_FIELDS = [
  'id',
  'book_name',
  'book_preview_picture',
  'book_description',
  'book_authors',
  'number_of_pages',
  'estimated_read_time',
  'publisher',
  'book_link',
  'progress_page',
  'progress_percentage',
  'library_id',
] as const;

const BOOK_SELECT_FIELDS = BOOK_FIELDS.join(', ');
const UPDATABLE_BOOK_FIELDS = BOOK_FIELDS.filter(
  (field) => field !== 'id' && field !== 'library_id'
);

const createBook = async (book: CreateBookDto): Promise<Book> => {
  const result = await pool.query<Book>(
    `INSERT INTO books (
      book_name,
      book_preview_picture,
      book_description,
      book_authors,
      number_of_pages,
      estimated_read_time,
      publisher,
      book_link,
      progress_page,
      progress_percentage,
      library_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING ${BOOK_SELECT_FIELDS}`,
    [
      book.book_name,
      book.book_preview_picture,
      book.book_description,
      book.book_authors,
      book.number_of_pages,
      book.estimated_read_time,
      book.publisher,
      book.book_link,
      book.progress_page ?? 0,
      book.progress_percentage ?? 0,
      book.library_id,
    ]
  );

  return result.rows[0];
};

const findAllBooks = async (): Promise<Book[]> => {
  const result = await pool.query<Book>(`SELECT ${BOOK_SELECT_FIELDS} FROM books`);

  return result.rows;
};

const findBookById = async (id: string): Promise<Book | null> => {
  const result = await pool.query<Book>(`SELECT ${BOOK_SELECT_FIELDS} FROM books WHERE id = $1`, [
    id,
  ]);

  return result.rows[0] ?? null;
};

const checkBookExists = async (bookName: string, libraryId: string): Promise<boolean> => {
  const result = await pool.query<{ id: string }>(
    'SELECT id FROM books WHERE book_name = $1 AND library_id = $2',
    [bookName, libraryId]
  );

  return result.rows.length > 0;
};

const updateBook = async (id: string, changes: UpdateBookDto): Promise<Book | null> => {
  const entries = Object.entries(changes).filter(
    ([field, value]) =>
      UPDATABLE_BOOK_FIELDS.includes(field as (typeof UPDATABLE_BOOK_FIELDS)[number]) &&
      value !== undefined
  );

  if (entries.length === 0) return null;

  const setClause = entries.map(([field], index) => `${field} = $${index + 2}`).join(', ');
  const values = entries.map(([, value]) => value);

  const result = await pool.query<Book>(
    `UPDATE books
     SET ${setClause}
     WHERE id = $1
     RETURNING ${BOOK_SELECT_FIELDS}`,
    [id, ...values]
  );

  return result.rows[0] ?? null;
};

const deleteBookById = async (id: string): Promise<Book | null> => {
  const result = await pool.query<Book>(
    `DELETE FROM books WHERE id = $1 RETURNING ${BOOK_SELECT_FIELDS}`,
    [id]
  );

  return result.rows[0] ?? null;
};

export { checkBookExists, createBook, deleteBookById, findAllBooks, findBookById, updateBook };
