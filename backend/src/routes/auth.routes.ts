import { Router  } from 'express';
import { isAuthenticated  } from '../middleware/authMiddleware';
import { login,
    signup,
    update,
    logout,
 } from '../controllers/userController';

const router = Router();

// Public
router.post('/login',  login);
router.post('/signup', signup);
router.get('/logout',  logout);
// Protected — need JWT to know which user
router.patch('/update',          isAuthenticated, update);
router.delete('')


export default router;