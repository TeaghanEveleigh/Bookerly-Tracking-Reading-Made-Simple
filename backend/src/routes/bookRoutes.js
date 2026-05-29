const { Router } = require('express');
const { create, getOne, update, remove } = require('../controllers/bookController');

const router = Router();

// isAuthenticated applied globally in index.js for /book
router.post('/createBook',                      create);
router.get('/getBook/:bookId',                  getOne);
router.patch('/updateBook/:bookId',             update);   // new
router.delete('/removeBook/:bookName/:libraryId', remove);

module.exports = router;
