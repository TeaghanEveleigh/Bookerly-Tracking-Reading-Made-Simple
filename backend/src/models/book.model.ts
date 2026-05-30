export interface Book {
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
  progress_percent: number;
  library_id: string;
}

export type CreateBookDto = Omit<Book, 'id' | 'progress_page' | 'progress_percent'> &
  Partial<Pick<Book, 'progress_page' | 'progress_percent'>>;

export type UpdateBookDto = Partial<Omit<Book, 'id' | 'library_id'>>;
