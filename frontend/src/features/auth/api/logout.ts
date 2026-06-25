import { api } from '@/lib/api-client';

export const logout = (): Promise<{ success: true }> => {
  return api.get('/auth/logout');
};
