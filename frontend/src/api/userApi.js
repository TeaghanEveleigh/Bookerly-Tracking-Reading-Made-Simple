import apiClient from './client';

/**
 * POST /user/login
 * TODO: Connect to your backend — expects { email, password }
 * Returns { success, token } or { success: false, error }
 */
export const login = async (email, password) => {
  // TODO: Ensure your backend at POST /user/login is running
  const { data } = await apiClient.post('/user/login', { email, password });
  return data;
};

/**
 * POST /user/signup
 * TODO: Connect to your backend — expects { email, password }
 * Returns { success, token } or { success: false, error }
 * Note: Backend also auto-creates 3 default libraries on signup
 */
export const signup = async (email, password) => {
  // TODO: Ensure your backend at POST /user/signup is running
  const { data } = await apiClient.post('/user/signup', { email, password });
  return data;
};

/**
 * GET /user/logout
 * TODO: Connect to your backend — destroys the server session
 */
export const logout = async () => {
  // TODO: Ensure your backend at GET /user/logout is running
  const { data } = await apiClient.get('/user/logout');
  return data;
};

/**
 * GET /user/getDarkMode
 * TODO: Connect to your backend — returns { success, darkmode }
 */
export const getDarkMode = async (email) => {
  // TODO: Ensure your backend at GET /user/getDarkMode is running
  const { data } = await apiClient.get('/user/getDarkMode', { data: { email } });
  return data;
};
