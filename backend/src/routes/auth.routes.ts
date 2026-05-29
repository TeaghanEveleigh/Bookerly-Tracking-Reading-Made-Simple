import { Router  } from 'express';
import { login,
    signup,
    logout,
 } from '../controllers/userController';

const router = Router();

// Public
router.post('/login',  login);
router.post('/signup', signup);
router.get('/logout',  logout);



export default router;