// User.ts

export interface User {
  id: number;
  email: string;
  password_hash: string;
  dark_mode: boolean;
  created_at: Date;
}
export type PublicUser = Omit<User , "password_hash" | "created_at">