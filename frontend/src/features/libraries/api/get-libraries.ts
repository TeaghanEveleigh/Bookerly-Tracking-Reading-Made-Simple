import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Library } from '@/types/api';

import { libraryKeys } from './query-keys';

export type GetLibrariesParams = {
  page?: number;
  size?: number;
};

export const getLibraries = (
  params: GetLibrariesParams = {},
): Promise<{ success: true; libraries: Library[] }> => {
  return api.get('/library', { params });
};

export const getLibrariesQueryOptions = (
  params: GetLibrariesParams = {},
) => ({
  queryKey: libraryKeys.list(params),
  queryFn: () => getLibraries(params),
});

type UseLibrariesOptions = {
  params?: GetLibrariesParams;
  queryConfig?: QueryConfig<typeof getLibrariesQueryOptions>;
};

export const useLibraries = ({
  params = {},
  queryConfig,
}: UseLibrariesOptions = {}) => {
  return useQuery({
    ...getLibrariesQueryOptions(params),
    ...queryConfig,
  });
};
