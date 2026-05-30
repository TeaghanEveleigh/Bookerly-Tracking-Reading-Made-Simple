export interface AuthUser {
  id: string;
  email: string;
  password_hash: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export type SignupDto = LoginDto;
