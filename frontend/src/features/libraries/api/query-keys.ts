import type { GetLibrariesParams } from './get-libraries';

export const libraryKeys = {
  all: ['libraries'] as const,
  lists: () => [...libraryKeys.all, 'list'] as const,
  list: (params: GetLibrariesParams) =>
    [...libraryKeys.lists(), params] as const,
  detail: (id: string) => [...libraryKeys.all, 'detail', id] as const,
  books: (id: string) => [...libraryKeys.detail(id), 'books'] as const,
  firstBooks: (id: string) =>
    [...libraryKeys.detail(id), 'books', 'first'] as const,
};
