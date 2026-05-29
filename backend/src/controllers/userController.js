import jwt from 'jsonwebtoken';
import { checkEmailExists,
    checkPasswordCorrect,
    createUser,
    updateUser,
    getUserID,
    toggleDarkmode,
    getDarkMode,
 } from '../services/user.service';
import { createUserLibrary  } from '../services/library.service';

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const passwordCorrect = await checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const userId = await getUserID(email);
        const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ success: true, token });
    } catch (err) {
        next(err);
    }
};

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(409).json({ success: false, error: 'Email already in use' });
        }

        await createUser(email, password);
        const userId = await getUserID(email);

        // Create default libraries for new user
        await Promise.all([
            createUserLibrary(userId, 'Currently Reading'),
            createUserLibrary(userId, 'Want to Read'),
            createUserLibrary(userId, 'Finished Reading'),
        ]);

        const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ success: true, token });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ success: false, error: 'No fields provided to update' });
        }

        const updated = await updateUser(req.user.id, { email, password });
        if (!updated) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user: updated });
    } catch (err) {
        next(err);
    }
};

const toggleDarkmodeHandler = async (req, res, next) => {
    try {
        const darkMode = await toggleDarkmode(req.user.id);
        res.json({ success: true, dark_mode: darkMode });
    } catch (err) {
        next(err);
    }
};

const getDarkModeHandler = async (req, res, next) => {
    try {
        const darkMode = await getDarkMode(req.user.id);
        res.json({ success: true, dark_mode: darkMode });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.json({ success: true });
};

export { login, signup, update, toggleDarkmodeHandler, getDarkModeHandler, logout,  };
