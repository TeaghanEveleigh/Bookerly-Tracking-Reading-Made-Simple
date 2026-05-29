import apiClient from './client';

/**
 * GET /library/userLibraries
 * TODO: Connect to your backend — fetches all libraries for the authed user
 * Returns { success, libraries }
 * Requires: JWT auth token
 */
export const getUserLibraries = async () => {
  // TODO: Ensure your backend at GET /library/userLibraries is running
  const { data } = await apiClient.get('/library/userLibraries');
  return data;
};

/**
 * POST /library/createLibrary
 * TODO: Connect to your backend — creates a new named library for the authed user
 * Expects { libraryName }
 * Returns { success }
 * Requires: JWT auth token
 */
export const createLibrary = async (libraryName) => {
  // TODO: Ensure your backend at POST /library/createLibrary is running
  const { data } = await apiClient.post('/library/createLibrary', { libraryName });
  return data;
};

/**
 * GET /library/libraryBooks/:libraryId
 * TODO: Connect to your backend — fetches all books in a specific library
 * Returns { success, books }
 * Requires: JWT auth token
 */
export const getLibraryBooks = async (libraryId) => {
  // TODO: Ensure your backend at GET /library/libraryBooks/:libraryId is running
  const { data } = await apiClient.get(`/library/libraryBooks/${libraryId}`);
  return data;
};

/**
 * GET /library/getFirst/:libraryId
 * TODO: Connect to your backend — fetches the first 5 books in a library (used for home page previews)
 * Returns { success, books }
 * Requires: JWT auth token
 */
export const getFirstFiveBooks = async (libraryId) => {
  // TODO: Ensure your backend at GET /library/getFirst/:libraryId is running
  const { data } = await apiClient.get(`/library/getFirst/${libraryId}`);
  return data;
};
