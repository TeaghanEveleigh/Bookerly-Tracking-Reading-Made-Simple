import apiClient from './client';

/**
 * POST /discover/discover
 * TODO: Connect to your backend — proxies Google Books API
 * Expects { query, orderBy?, maxResults? }
 * Returns { success, books } — books is array of Google Books volume objects
 * Requires: JWT auth token (set automatically by apiClient interceptor)
 */
export const discoverBooks = async (query, orderBy = 'relevance', maxResults = 40) => {
  // TODO: Ensure your backend at POST /discover/discover is running and authenticated
  const { data } = await apiClient.post('/discover/discover', {
    query,
    orderBy,
    maxResults,
  });
  return data;
};

/**
 * GET /book/getBook/:bookId
 * TODO: Connect to your backend — fetches a single book by ID
 * Returns { success, book }
 * Requires: JWT auth token
 */
export const getBook = async (bookId) => {
  // TODO: Ensure your backend at GET /book/getBook/:bookId is running
  const { data } = await apiClient.get(`/book/getBook/${bookId}`);
  return data;
};

/**
 * POST /book/createBook
 * TODO: Connect to your backend — adds a book to a library
 * Expects the full book payload + libraryId
 * Returns { success } or { success: false, error }
 * Requires: JWT auth token
 */
export const createBook = async (bookPayload) => {
  // TODO: Ensure your backend at POST /book/createBook is running
  // bookPayload: { bookName, bookPreviewPicture, bookDescription, bookAuthors,
  //                numberOfPages, estimatedReadTime, publisher, bookLink, libraryId }
  const { data } = await apiClient.post('/book/createBook', bookPayload);
  return data;
};

/**
 * GET /book/removeBook/:bookName/:libraryId
 * TODO: Connect to your backend — removes a book from a library
 * Requires: JWT auth token
 */
export const removeBook = async (bookName, libraryId) => {
  // TODO: Ensure your backend at GET /book/removeBook/:bookName/:libraryId is running
  const { data } = await apiClient.get(`/book/removeBook/${bookName}/${libraryId}`);
  return data;
};
