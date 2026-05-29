// Book.ts

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
  progress_percent : number
  library_id: string;
  
}