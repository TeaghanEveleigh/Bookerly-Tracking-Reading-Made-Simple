import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Book } from '@/types/api';

import { libraryKeys } from './query-keys';

export const getFirstLibraryBooks = (
  id: string,
): Promise<{ success: true; books: Book[] }> => {
  return api.get(`/library/${id}/books/first`);
};

export const getFirstLibraryBooksQueryOptions = (id: string) => ({
  queryKey: libraryKeys.firstBooks(id),
  queryFn: () => getFirstLibraryBooks(id),
});

type UseFirstLibraryBooksOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getFirstLibraryBooksQueryOptions>;
};

export const useFirstLibraryBooks = ({
  id,
  queryConfig,
}: UseFirstLibraryBooksOptions) => {
  return useQuery({
    ...getFirstLibraryBooksQueryOptions(id),
    ...queryConfig,
  });
};
