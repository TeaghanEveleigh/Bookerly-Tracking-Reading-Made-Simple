import type { NextFunction, Request, Response } from 'express';
import { isProvided, isString } from '#/lib/typevalidators.js';
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

const getAuthenticatedUserId = (req: Request, res: Response): string | null => {
  if (!req.user?.id) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return null;
  }

  return String(req.user.id);
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req, res);

    if (!userId) return;

    const { library_name } = req.body;

    if (!isProvided(library_name) || !isString(library_name)) {
      res.status(400).json({ success: false, error: 'library_name is required' });
      return;
    }

    const library = await createUserLibrary(userId, library_name);

    res.status(201).json({ success: true, library });
  } catch (err) {
    next(err);
  }
};

const findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const libraries = await findAllLibraries();

    res.status(200).json({ success: true, libraries });
  } catch (err) {
    next(err);
  }
};

const findSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Library id is required' });
      return;
    }

    const library = await findLibraryById(id);

    if (!library) {
      res.status(404).json({ success: false, error: 'Library not found' });
      return;
    }

    res.status(200).json({ success: true, library });
  } catch (err) {
    next(err);
  }
};

const getUserLibrariesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page  , size } = req.params;
  try {
    const userId = getAuthenticatedUserId(req, res);
    
    if (!userId) return;

    const libraries = await getUserLibraries(userId , page , size);

    res.status(200).json({ success: true, libraries });
  } catch (err) {
    next(err);
  }
};

const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Library id is required' });
      return;
    }

    const books = await getLibraryBooks(id);

    res.status(200).json({ success: true, books });
  } catch (err) {
    next(err);
  }
};

const getFirst = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Library id is required' });
      return;
    }

    const books = await getFirstFiveBooks(id);

    res.status(200).json({ success: true, books });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Library id is required' });
      return;
    }

    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ success: false, error: 'No fields provided to update' });
      return;
    }

    const library = await updateLibrary(id, req.body);

    if (!library) {
      res.status(404).json({ success: false, error: 'Library not found' });
      return;
    }

    res.status(200).json({ success: true, library });
  } catch (err) {
    next(err);
  }
};

const deleteLibrary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isProvided(id) || !isString(id)) {
      res.status(400).json({ success: false, error: 'Library id is required' });
      return;
    }

    const deleted = await deleteLibraryById(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Library not found' });
      return;
    }

    res.status(200).json({ success: true, library: deleted });
  } catch (err) {
    next(err);
  }
};

export {
  create,
  deleteLibrary,
  findAll,
  findSingle,
  getBooks,
  getFirst,
  getUserLibrariesHandler,
  update,
};
