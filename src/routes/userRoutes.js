const express = require('express');
const { checkEmailExists, checkPasswordCorrect, createUser, createUserLibrary , getDarkMode , getUserID} = require('../services/userService');
const { isAuthenticated } = require('../middleware/authMiddleware'); 
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/checkEmailExists', async (req, res) => {
    const email = req.body.email;
    const emailExists = await checkEmailExists(email);
    res.send({ emailExists });
});

router.post('/checkPasswordCorrect', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const passwordCorrect = await checkPasswordCorrect(email, password);
    res.send({ passwordCorrect });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.send({ success: false, error: 'Email does not exist' });
        }

        const passwordCorrect = await checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.send({ success: false, error: 'Incorrect password' });
        }

        const userId = await getUserID(email);
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Checking if email exists');
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.send({ success: false, error: 'Email already in use' });
        }

        console.log('Creating user');
        await createUser(email, password);

        console.log('Getting user ID');
        const userId = await getUserID(email);
        
        // console.log('Creating user library');
        // const response = await createUserLibrary(userId, "Currently Reading");

        console.log('Creating JWT token');
        const token = jwt.sign({
            id: userId,
            email: email
        }, "my key", { expiresIn: '1d' });

        res.send({ success: true, token: token });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

router.post('/toggleDarkmode', async (req, res) => {
    const email = req.body.email;
    try {
        await toggleDarkmode(email);
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

router.get('/getDarkMode', async (req, res) => {
    const email = req.body.email;
    try {
        const darkmode = await getDarkMode(email);
        res.send({ success: true, darkmode });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = router;
