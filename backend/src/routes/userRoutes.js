const { Router } = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
    login,
    signup,
    update,
    toggleDarkmodeHandler,
    getDarkModeHandler,
    logout,
} = require('../controllers/userController');

const router = Router();

// Public
router.post('/login',  login);
router.post('/signup', signup);
router.get('/logout',  logout);

// Protected — need JWT to know which user
router.patch('/update',          isAuthenticated, update);
router.post('/toggleDarkmode',   isAuthenticated, toggleDarkmodeHandler);
router.get('/getDarkMode',       isAuthenticated, getDarkModeHandler);

module.exports = router;
