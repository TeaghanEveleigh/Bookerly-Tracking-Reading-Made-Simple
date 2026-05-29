import { Router  } from 'express';
import { create,
    getUserLibrariesHandler,
    getBooks,
    getFirst,
    update,
    remove,
 } from '';

const router = Router();

router.post('/',                      create);
router.get('/',                  findAlls);
router.get('/:id',                  findSingle);
//book fetching nested 
router.get('/id/books' , getBooksForLibrary);
router.post('id/books' , addBookToLibrary);
//Other Operations
router.patch('/:id', update);   
router.delete('/:id', delete);


export default router;
