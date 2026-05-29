import { createUserDto, User } from '#/models/user.model.js';
import pool from '#/config/db.js';

const findAllUsers = async () => {
    const result = await pool.query(
        'SELECT email , dark_mode , created_at  FROM users'
    );
    return result.rows[0]?.id ?? null;
};
const findUserById = async (id: string) => {
    const result = await pool.query(
        'SELECT email , dark_mode , created_at  FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0]?.id ?? null;
};

const findUserByEmail = async (email: string) => {
    const result = await pool.query(
        'SELECT FROM users WHERE email = $1',
        [email]
    );
    return result.rows.length > 0;
};

const createUser = async (user: createUserDto) => {
    const userExists = await findUserByEmail(user.email);
    if (userExists) return null
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [user.email, user.password_hash]
    );
    return result.rows[0] ?? null
};

const updateUser = async (id: string, user: Partial<User>) => {
    //get the values to change
    const changes = Object.entries(user).filter(([_, value]) => { return value != undefined })
    if (changes.length < 1) return null;
    const setClause = changes.map(([key], index) => { return `${key} = $${index + 2}` }).join(', ')
    const values = changes.map(([_, value]) => { return value })
    const result = await pool.query(
        `UPDATE users
          SET ${setClause}
          WHERE id = $1
          RETURNING *`,
        [id, ...values]
    );
    return result.rows ?? null;
};
const deleteUserById = async (id: string) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] ?? null;
};

export { findAllUsers, findUserById, createUser, updateUser, deleteUserById, findUserByEmail };
