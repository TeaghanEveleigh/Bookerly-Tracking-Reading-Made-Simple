import { Library } from "../models/library.model";

import pool from '../config/db';

const createUserLibrary = async (id : string, libraryName  :string) => {
    const result = await pool.query(
        'INSERT INTO libraries (user_id, library_name) VALUES ($1, $2) RETURNING *',
        [id, libraryName]
    );
    return result.rows[0];
};

const getUserLibraries = async (id : string) => {
    const result = await pool.query(
        'SELECT * FROM libraries WHERE user_id = $1',
        [id]
    );
    return result.rows;
};

const getLibraryBooks = async (id : string) => {
    const result = await pool.query(
        'SELECT * FROM books WHERE library_id = $1',
        [id]
    );
    return result.rows;
};

const getFirstFiveBooks = async (id) => {
    const result = await pool.query(
        'SELECT * FROM books WHERE library_id = $1 LIMIT 4',
        [id]
    );
    return result.rows;
};

const updateLibrary = async (id : string, changes : Partial<Library>) => {
    const fields = [];
    const values = [];
    let i = 1;

    if (changes.library_name !== undefined) {
        fields.push(`library_name = $${i++}`);
        values.push(changes.library_name);
    }
    if (changes.library_photo_url !== undefined) {
        fields.push(`library_photo_url = $${i++}`);
        values.push(changes.library_photo_url);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
        `UPDATE libraries SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    );
    return result.rows[0] ?? null;
};

const deleteLibrary = async (id) => {
    const result = await pool.query(
        'DELETE FROM libraries WHERE id = $1',
        [id]
    );
    return (result.rowCount ?? 0) > 0;
};

export { createUserLibrary, getUserLibraries, getLibraryBooks, getFirstFiveBooks, updateLibrary, deleteLibrary,  };
