import { api } from '@/lib/api-client';
import type { AuthResponse } from '@/types/api';

import type { LoginInput } from './login';

export type SignupInput = LoginInput;

export const signup = (data: SignupInput): Promise<AuthResponse> => {
  return api.post('/auth/signup', data);
};
