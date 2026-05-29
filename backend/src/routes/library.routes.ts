import { Router  } from 'express';
import { create,
    getUserLibrariesHandler,
    getBooks,
    getFirst,
    update,
    remove,
 } from '../controllers/libraryController';

const router = Router();

router.post('/',                      create);
router.get('/',                  findAllBooks);
router.get('/:id',                  findSingleBook);
//book fetching nested 
router.get('/id/books' , getBooksForLibrary);
router.post('id/books')
//Other Operations
router.patch('/:id', update);   s
router.delete('/:id', delete);


export default router;
