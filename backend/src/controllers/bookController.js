import { createBook,
    getBook,
    checkBookExists,
    updateBook,
    removeBook,
 } from '../services/book.service';

const create = async (req, res, next) => {
    try {
        const {
            bookName, bookPreviewPicture, bookDescription, bookAuthors,
            numberOfPages, estimatedReadTime, publisher, bookLink, libraryId,
        } = req.body;

        if (!bookName || !libraryId) {
            return res.status(400).json({ success: false, error: 'bookName and libraryId are required' });
        }

        const bookExists = await checkBookExists(bookName, libraryId);
        if (bookExists) {
            return res.status(409).json({ success: false, error: 'Book already exists in this library' });
        }

        const book = await createBook(
            bookName, bookPreviewPicture, bookDescription, bookAuthors,
            numberOfPages, estimatedReadTime, publisher, bookLink, libraryId
        );
        res.status(201).json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

const getOne = async (req, res, next) => {
    try {
        const book = await getBook(req.params.bookId);
        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }
        res.json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, error: 'No fields provided to update' });
        }

        const book = await updateBook(req.params.bookId, req.body);
        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }
        res.json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await removeBook(id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export { create, getOne, update, remove };
