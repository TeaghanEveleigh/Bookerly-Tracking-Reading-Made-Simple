import { createUserLibrary,
    getUserLibraries,
    getLibraryBooks,
    getFirstFiveBooks,
    updateLibrary,
    deleteLibrary,
 } from '../services/library.service.js';

const create = async (req, res, next) => {
    try {
        const { libraryName } = req.body;
        if (!libraryName) {
            return res.status(400).json({ success: false, error: 'libraryName is required' });
        }
        const library = await createUserLibrary(req.user.id, libraryName);
        res.status(201).json({ success: true, library });
    } catch (err) {
        next(err);
    }
};

const getUserLibrariesHandler = async (req, res, next) => {
    try {
        const libraries = await getUserLibraries(req.user.id);
        res.json({ success: true, libraries });
    } catch (err) {
        next(err);
    }
};

const getBooks = async (req, res, next) => {
    try {
        const books = await getLibraryBooks(req.params.libraryId);
        res.json({ success: true, books });
    } catch (err) {
        next(err);
    }
};

const getFirst = async (req, res, next) => {
    try {
        const books = await getFirstFiveBooks(req.params.libraryId);
        res.json({ success: true, books });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, error: 'No fields provided to update' });
        }
        const library = await updateLibrary(req.params.libraryId, req.body);
        if (!library) {
            return res.status(404).json({ success: false, error: 'Library not found' });
        }
        res.json({ success: true, library });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const deleted = await deleteLibrary(req.params.libraryId);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Library not found' });
        }
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export { create, getUserLibrariesHandler, getBooks, getFirst, update, remove };
