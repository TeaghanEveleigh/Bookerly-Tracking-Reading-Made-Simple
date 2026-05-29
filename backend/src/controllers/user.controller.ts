import jwt from 'jsonwebtoken';
import { checkEmailExists,
    checkPasswordCorrect,
    createUser,
    updateUser,
    getUserID,
    toggleDarkmode,
    getDarkMode,
 } from '../services/user.service.js';
import { createUserLibrary  } from '../services/library.service.js';



const update = async (req, res, next) => {
    try {
        const body = req.body;
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




export { create , findAll , findSingle , update , delete  };
