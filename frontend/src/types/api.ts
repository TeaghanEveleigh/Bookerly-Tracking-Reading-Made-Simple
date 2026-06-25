export type ApiSuccessResponse = {
  success: true;
};

export type User = {
  id: string;
  email: string;
  dark_mode?: boolean;
  created_at?: string;
};

export type AuthResponse = ApiSuccessResponse & {
  token: string;
  user?: User;
};

export type Book = {
  id: string;
  book_name: string;
  book_preview_picture?: string;
  book_description?: string;
  book_authors?: string[];
  number_of_pages?: number;
  estimated_read_time?: string;
  publisher?: string;
  book_link?: string;
  progress_page: number;
  progress_percentage: number;
  library_id: string;
};

export type CreateBookInput = Omit<
  Book,
  'id' | 'progress_page' | 'progress_percentage'
> &
  Partial<Pick<Book, 'progress_page' | 'progress_percentage'>>;

export type UpdateBookInput = {
  id: string;
  data: Partial<Omit<Book, 'id' | 'library_id'>>;
};

export type Library = {
  id: string;
  library_name: string;
  library_photo_url?: string;
  user_id: string;
  created_at?: string;
};

export type CreateLibraryInput = Pick<Library, 'library_name'> &
  Partial<Pick<Library, 'library_photo_url'>>;

export type UpdateLibraryInput = {
  id: string;
  data: Partial<Pick<Library, 'library_name' | 'library_photo_url'>>;
};

export type UpdateUserInput = {
  id: string;
  data: Partial<Pick<User, 'email' | 'dark_mode'> & { password: string }>;
};

export type CreateUserInput = {
  email: string;
  password_hash: string;
};
