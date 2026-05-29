// User.ts

export interface User {
  id: string;
  email: string;
  password_hash: string;
  dark_mode: boolean;
  created_at: Date;
}
export type PublicUser = Omit<User , "password_hash" | "created_at">

export type createUserDto = Omit<User, "id" | "created_at" | "dark_mode">