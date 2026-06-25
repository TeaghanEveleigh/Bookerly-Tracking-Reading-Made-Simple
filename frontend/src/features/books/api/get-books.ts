import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Book } from '@/types/api';

import { bookKeys } from './query-keys';

export const getBooks = (): Promise<{ success: true; books: Book[] }> => {
  return api.get('/book');
};

export const getBooksQueryOptions = () => ({
  queryKey: bookKeys.lists(),
  queryFn: getBooks,
});

type UseBooksOptions = {
  queryConfig?: QueryConfig<typeof getBooksQueryOptions>;
};

export const useBooks = ({ queryConfig }: UseBooksOptions = {}) => {
  return useQuery({
    ...getBooksQueryOptions(),
    ...queryConfig,
  });
};
