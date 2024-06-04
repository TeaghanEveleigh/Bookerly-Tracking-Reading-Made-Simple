const express = require('express');
const { createUserLibrary, getUserLibraries, getLibraryBooks } = require('../services/libraryService');
const router = express.Router();
const session = require('express-session');
const { isAuthenticated } = require('../middleware/authMiddleware'); 



router.post('/createLibrary',   async (req, res) => {
    const { libraryName } = req.body;
    const userId = req.user.id;
    try {
        await createUserLibrary(userId, libraryName);
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message , userId :"id was: " + userId});
    }
    //send that library back to user
    
});

router.get('/userLibraries',  async (req, res) => {

    const  userId  = req.user.id;
    try {
        const libraries = await getUserLibraries(userId);
        res.send({ success: true, libraries  : libraries });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

router.get('/libraryBooks/:libraryId',   async (req, res) => {
    const { libraryId } = req.params;
    const { pageNumber = 1, limit = 10 } = req.query;
    try {
        const books = await getLibraryBooks(libraryId);
        res.send({ success: true, books });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});
router.get('/getFirstFiveBooks/:libraryId',   async (req, res) => {
    
    try {
        const books = await getFirstFiveBooks(libraryId);
        res.send({ success: true, books });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = router;