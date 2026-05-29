import {
    updateUser,
    createUser,
    findUserById,
    findAllUsers,
    deleteUserById
} from '../services/user.service.js';
import type { Request, Response, NextFunction } from 'express';
import { isBoolean, isProvided, isString } from '#/lib/typevalidators.js';


const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id, email, password: password_hash, dark_mode } = req.body;
        if (
            email === undefined &&
            password_hash === undefined &&
            dark_mode === undefined &&
            id === undefined
        ) {
            res.status(400).json({ success: false, error: 'No fields provided on create' })
            return
        }
        // validate each value that has been passed
        if (isProvided(email) && !isString(email)) {
            res.status(400).json({
                success: false,
                error: 'Email must be a string',
            });
            return;
        }
        if (isProvided(id) && !isString(id)) {
            res.status(400).json({
                success: false,
                error: 'id must be a string',
            });
            return;
        }
        if (isProvided(password_hash) && !isString(password_hash)) {
            res.status(400).json({
                success: false,
                error: 'Password must be a string',
            });
            return;
        }

        if (isProvided(dark_mode) && !isBoolean(dark_mode)) {
            res.status(400).json({
                success: false,
                error: 'Dark mode must be a boolean',
            });
            return;
        }
        const user = await updateUser(id, { email, password_hash, dark_mode });
        res.status(200).json({ sucess: true, user })
    } catch (err) {
        next(err)
    }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password_hash } = req.body;
        // Email and password must be provided if not return
        if (!(isProvided(email) && isString(email) && isProvided(password_hash) && isString(password_hash))) {
            res.status(400).json({ success: false, error: 'Username or password must be of type string and both must be provided' })
            return
        }
        const user = await createUser({ email, password_hash });
        if (user === undefined) {
            res.status(500).json({ sucess: false, err: 'Server side error occured' })
            return
        }
        res.status(200).json({ sucess: true, user })
    } catch (err) {
        next(err)
    }
};

const findSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.body;
        if (!isProvided(id) || !isString) {
            res.status(400).json({ success: false, error: 'User not found' });
            return
        }
        const user = await findUserById(id)
        res.json({ success: true, user: user });
    } catch (err) {
        next(err);
    }
};
const findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await findAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.body;
        if (!isProvided(id) || !isString(id)) {
            res.status(400).json({ success: false, err: 'No id provided or id is not of correct shape' })
            return
        }
        const deleted = await deleteUserById(id);
        if (!deleted) {
            res.status(404).json({ success: false, error: 'User not found' });
            return
        }
        res.status(200).json({ success: true, user: deleted });
    } catch (err) {
        next(err);
    }
};



export { create, findAll, findSingle, update, deleteUser };
