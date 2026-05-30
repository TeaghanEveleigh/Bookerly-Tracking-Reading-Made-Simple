import { Router } from 'express';
import {
  create,
  deleteLibrary,
  findAll,
  findSingle,
  getBooks,
  getFirst,
  getUserLibrariesHandler,
  update,
} from '#/controllers/library.controller.js';
import { isAuthenticated } from '#/middleware/authMiddleware.js';

const router = Router();

router.post('/', isAuthenticated, create);
router.get('/', isAuthenticated, getUserLibrariesHandler);
router.get('/all', isAuthenticated, findAll);
router.get('/:id/books/first', isAuthenticated, getFirst);
router.get('/:id/books', isAuthenticated, getBooks);
router.get('/:id', isAuthenticated, findSingle);
router.patch('/:id', isAuthenticated, update);
router.delete('/:id', isAuthenticated, deleteLibrary);

export default router;
