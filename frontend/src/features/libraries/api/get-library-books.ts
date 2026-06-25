import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Book } from '@/types/api';

import { libraryKeys } from './query-keys';

export const getLibraryBooks = (
  id: string,
): Promise<{ success: true; books: Book[] }> => {
  return api.get(`/library/${id}/books`);
};

export const getLibraryBooksQueryOptions = (id: string) => ({
  queryKey: libraryKeys.books(id),
  queryFn: () => getLibraryBooks(id),
});

type UseLibraryBooksOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getLibraryBooksQueryOptions>;
};

export const useLibraryBooks = ({
  id,
  queryConfig,
}: UseLibraryBooksOptions) => {
  return useQuery({
    ...getLibraryBooksQueryOptions(id),
    ...queryConfig,
  });
};
