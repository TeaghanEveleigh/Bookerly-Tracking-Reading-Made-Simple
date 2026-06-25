import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Book } from '@/types/api';

import { bookKeys } from './query-keys';

export const getBook = (
  id: string,
): Promise<{ success: true; book: Book }> => {
  return api.get(`/book/${id}`);
};

export const getBookQueryOptions = (id: string) => ({
  queryKey: bookKeys.detail(id),
  queryFn: () => getBook(id),
});

type UseBookOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBookQueryOptions>;
};

export const useBook = ({ id, queryConfig }: UseBookOptions) => {
  return useQuery({
    ...getBookQueryOptions(id),
    ...queryConfig,
  });
};
