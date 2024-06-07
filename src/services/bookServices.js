const pool = require('../config/db');



const createBook = async ( bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink ,libraryId) => {
    const query = {
        text: 'INSERT INTO books ( book_name, book_preview_picture, book_description, book_authors, number_of_pages, estimated_read_time, publisher, book_link , library_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9)',
        values: [ bookName, bookPreviewPicture, bookDescription, bookAuthors, numberOfPages, estimatedReadTime, publisher, bookLink , libraryId],
    };
    try {
        await pool.query(query);
    } catch (error) {
        console.error('Error creating book:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}

const getBook = async (bookId) => {
    const query = {
        text: 'SELECT * FROM books WHERE id = $1',
        values: [bookId],
    };
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting book:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}
const checkBookExists = async (bookName , bookDescription) => {
    const query = {
        text: 'SELECT * FROM books WHERE book_name = $1 AND book_description = $2',
        values: [bookName, bookDescription],
    };
    const result = await pool.query(query);
    return result.rows.length > 0;
}

module.exports = {
    createBook,
    getBook , 
    checkBookExists
};

