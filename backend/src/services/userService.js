const pool = require('../config/db');
const { hashPassword, comparePasswords } = require('./securePassword');

const getUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, email, dark_mode, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0] ?? null;
};

const getUserID = async (email) => {
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0]?.id ?? null;
};

const checkEmailExists = async (email) => {
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );
    return result.rows.length > 0;
};

const checkPasswordCorrect = async (email, password) => {
    const result = await pool.query(
        'SELECT password FROM users WHERE email = $1',
        [email]
    );
    if (result.rows.length === 0) return false;
    return comparePasswords(password, result.rows[0].password);
};

const createUser = async (email, password) => {
    const userExists = await checkEmailExists(email);
    if (userExists) throw new Error('User already exists');

    const hashed = await hashPassword(password);
    await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hashed]
    );
};

const updateUser = async (id, changes) => {
    const fields = [];
    const values = [];
    let i = 1;

    if (changes.email !== undefined) {
        fields.push(`email = $${i++}`);
        values.push(changes.email);
    }
    if (changes.password !== undefined) {
        fields.push(`password = $${i++}`);
        values.push(await hashPassword(changes.password));
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING id, email, dark_mode, created_at`,
        values
    );
    return result.rows[0] ?? null;
};

const toggleDarkmode = async (id) => {
    const result = await pool.query(
        'UPDATE users SET dark_mode = NOT dark_mode WHERE id = $1 RETURNING dark_mode',
        [id]
    );
    return result.rows[0]?.dark_mode ?? null;
};

const getDarkMode = async (id) => {
    const result = await pool.query(
        'SELECT dark_mode FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0]?.dark_mode ?? null;
};

module.exports = {
    getUserById,
    getUserID,
    checkEmailExists,
    checkPasswordCorrect,
    createUser,
    updateUser,
    toggleDarkmode,
    getDarkMode,
};
