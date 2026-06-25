import { api } from '@/lib/api-client';
import type { AuthResponse } from '@/types/api';

export type LoginInput = {
  email: string;
  password: string;
};

export const login = (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};
