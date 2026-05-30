export interface Library {
  id: string;
  library_name: string;
  library_photo_url?: string;
  user_id: string;
}

export type CreateLibraryDto = Pick<Library, 'library_name'> &
  Partial<Pick<Library, 'library_photo_url'>>;

export type UpdateLibraryDto = Partial<Pick<Library, 'library_name' | 'library_photo_url'>>;
