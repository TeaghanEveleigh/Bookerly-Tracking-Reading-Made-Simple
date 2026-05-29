const { Router } = require('express');
const {
    create,
    getUserLibrariesHandler,
    getBooks,
    getFirst,
    update,
    remove,
} = require('../controllers/libraryController');

const router = Router();

// isAuthenticated applied globally in index.js for /library
router.post('/createLibrary',               create);
router.get('/userLibraries',                getUserLibrariesHandler);
router.get('/libraryBooks/:libraryId',      getBooks);
router.get('/getFirst/:libraryId',          getFirst);
router.patch('/updateLibrary/:libraryId',   update);   // new
router.delete('/deleteLibrary/:libraryId',  remove);   // new

module.exports = router;
