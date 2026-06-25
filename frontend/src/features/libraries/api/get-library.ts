import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Library } from '@/types/api';

import { libraryKeys } from './query-keys';

export const getLibrary = (
  id: string,
): Promise<{ success: true; library: Library }> => {
  return api.get(`/library/${id}`);
};

export const getLibraryQueryOptions = (id: string) => ({
  queryKey: libraryKeys.detail(id),
  queryFn: () => getLibrary(id),
});

type UseLibraryOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getLibraryQueryOptions>;
};

export const useLibrary = ({ id, queryConfig }: UseLibraryOptions) => {
  return useQuery({
    ...getLibraryQueryOptions(id),
    ...queryConfig,
  });
};
