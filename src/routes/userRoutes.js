const express = require('express');
const { checkEmailExists, checkPasswordCorrect, createUser, createUserLibrary , getDarkMode , getUserID} = require('../services/userService');
const { isAuthenticated } = require('../middleware/authMiddleware'); 
const router = express.Router();


router.post('/checkEmailExists',  async (req, res) => {
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
        req.session.user = {
            email: req.body.email,
            userId : userId
            // darkmode : getDarkMode(req.body.email)
            // Other user data you want to store
        };

        res.send({ success: true , id : userId , email : req.body.email});
        
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
   
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.send({ success: false, error: 'Email already in use' });
        }

        await createUser(email, password);

        res.send({ success: true });
        req.session.user = {
            email: req.body.email,
            userId : getUserID(req.body.email)
            // Other user data you want to store
        };
    } catch (error) {
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