import type { NextFunction, Request, Response } from 'express';
import { isProvided, isString } from '#/lib/typevalidators.js';
import {
  checkBookExists,
  createBook,
  deleteBookById,
  findAllBooks,
  findBookById,
  updateBook,
} from '#/services/book.service.js';

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      book_name,
      book_preview_picture,
      book_description,
      book_authors,
      number_of_pages,
      estimated_read_time,
      publisher,
      book_link,
      progress_page,
      progress_percent,
      library_id,
    } = req.body;

    if (
      !isProvided(book_name) ||
      !isString(book_name) ||
      !isProvided(library_id) ||
      !isString(library_id)
    ) {
      res.status(400).json({ success: false, error: 'book_name and library_id are required' });
      return;
    }

    const bookExists = await checkBookExists(book_name, library_id);

    if (bookExists) {
      res.status(409).json({ success: false, error: 'Book already exists in this library' });
      return;
    }

    const book = await createBook({
      book_name,
      book_preview_picture,
      book_description,
      book_authors,
      number_of_pages,
      estimated_read_time,
      publisher,
      book_link,
      progress_page,
      progress_percent,
      library_id,
    });

    res.status(201).json({ success: true, book });
  } catch (err) {
    next(err);
  }
};

const findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const books = await findAllBooks();

    res.status(200).json({ success: true, books });
  } catch (err) {
    next(err);
  }
};

const findSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Book id is required' });
      return;
    }

    const book = await findBookById(id);

    if (!book) {
      res.status(404).json({ success: false, error: 'Book not found' });
      return;
    }

    res.status(200).json({ success: true, book });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Book id is required' });
      return;
    }

    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ success: false, error: 'No fields provided to update' });
      return;
    }

    const book = await updateBook(id, req.body);

    if (!book) {
      res.status(404).json({ success: false, error: 'Book not found' });
      return;
    }

    res.status(200).json({ success: true, book });
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Book id is required' });
      return;
    }

    const deleted = await deleteBookById(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Book not found' });
      return;
    }

    res.status(200).json({ success: true, book: deleted });
  } catch (err) {
    next(err);
  }
};

export { create, deleteBook, findAll, findSingle, update };
