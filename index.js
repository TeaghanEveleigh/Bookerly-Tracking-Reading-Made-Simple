const express = require('express');
const router = express.Router();
const { checkEmailExists, checkPasswordCorrect, createUser, getUserID, getDarkMode, toggleDarkmode } = require('../services/userService');

router.post('/checkEmailExists', asyncHandler(async (req, res) => {
    const email = req.body.email;
    const emailExists = await checkEmailExists(email);
    res.send({ emailExists });
}));

router.post('/checkPasswordCorrect', asyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const passwordCorrect = await checkPasswordCorrect(email, password);
    res.send({ passwordCorrect });
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
        return res.status(400).json({ success: false, error: 'Email does not exist' });
    }

    const passwordCorrect = await checkPasswordCorrect(email, password);
    if (!passwordCorrect) {
        return res.status(400).json({ success: false, error: 'Incorrect password' });
    }

    const userId = await getUserID(email);
    req.session.user = { email, userId };
    res.json({ success: true, userId, email });
}));

router.post('/signup', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    await createUser(email, password);
    const userId = await getUserID(email);
    req.session.user = { email, userId };
    res.json({ success: true });
}));

router.post('/toggleDarkmode', asyncHandler(async (req, res) => {
    const email = req.body.email;
    await toggleDarkmode(email);
    res.json({ success: true });
}));

router.get('/getDarkMode', asyncHandler(async (req, res) => {
    const email = req.body.email;
    const darkmode = await getDarkMode(email);
    res.json({ success: true, darkmode });
}));

router.get('/logout', asyncHandler(async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
}));

module.exports = router;
