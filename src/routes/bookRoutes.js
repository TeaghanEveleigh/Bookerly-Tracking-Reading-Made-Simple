const express = require('express');
const { createBook, getBook , checkBookExists } = require('../services/bookServices');
const router = express.Router();
const  isAuthenticated  = require('../middleware/authMiddleware'); 



router.post('/createBook',  async (req, res) => {
    const { bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink , libraryId } = req.body;
    // Check if the book already exists
    const bookExists = await checkBookExists(bookName, libraryId);
    if (bookExists) {
        return res.send({ success: false, error: 'Book already exists' });
    }

    try {
        await createBook(bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink , libraryId);
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

router.get('/getBook/:bookId',  async (req, res) => {
    const { bookId } = req.params;
    try {
        const book = await getBook(bookId);
        res.send({ success: true, book });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});
router.get('/removeBook/:bookName/:libraryId',  async (req, res) => {
    const { bookName, libraryId } = req.params;
    try {
        const book = await removeBook(bookName, libraryId);
        res.send({ success: true, book });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = router;