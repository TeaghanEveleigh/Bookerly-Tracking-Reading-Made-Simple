const pool = require('../config/db');

const createBook = async (bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink, libraryId) => {
    const result = await pool.query(
        `INSERT INTO books (book_name, book_preview_picture, book_description, book_authors,
         number_of_pages, estimated_read_time, publisher, book_link, library_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink, libraryId]
    );
    return result.rows[0];
};

const getBook = async (bookId) => {
    const result = await pool.query(
        'SELECT * FROM books WHERE id = $1',
        [bookId]
    );
    return result.rows[0] ?? null;
};

const checkBookExists = async (bookName, libraryId) => {
    const result = await pool.query(
        'SELECT id FROM books WHERE book_name = $1 AND library_id = $2',
        [bookName, libraryId]
    );
    return result.rows.length > 0;
};

const updateBook = async (bookId, changes) => {
    const fields = [];
    const values = [];
    let i = 1;

    const allowed = [
        'book_name', 'book_preview_picture', 'book_description',
        'book_authors', 'number_of_pages', 'estimated_read_time',
        'publisher', 'book_link', 'progress', 'status'
    ];

    for (const key of allowed) {
        if (changes[key] !== undefined) {
            fields.push(`${key} = $${i++}`);
            values.push(changes[key]);
        }
    }

    if (fields.length === 0) return getBook(bookId);

    // Auto-drive status from progress
    if (changes.progress === 100 && !changes.status) {
        fields.push(`status = $${i++}`);
        values.push('finished');
    } else if (changes.progress > 0 && changes.progress < 100 && !changes.status) {
        fields.push(`status = $${i++}`);
        values.push('reading');
    }

    values.push(bookId);
    const result = await pool.query(
        `UPDATE books SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    );
    return result.rows[0] ?? null;
};

const removeBook = async (bookName, libraryId) => {
    const result = await pool.query(
        'DELETE FROM books WHERE book_name = $1 AND library_id = $2',
        [bookName, libraryId]
    );
    return (result.rowCount ?? 0) > 0;
};

module.exports = {
    createBook,
    getBook,
    checkBookExists,
    updateBook,
    removeBook,
};
