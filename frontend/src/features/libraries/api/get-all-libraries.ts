import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Library } from '@/types/api';

import { libraryKeys } from './query-keys';

export const getAllLibraries = (): Promise<{
  success: true;
  libraries: Library[];
}> => {
  return api.get('/library/all');
};

export const getAllLibrariesQueryOptions = () => ({
  queryKey: [...libraryKeys.lists(), 'all'] as const,
  queryFn: getAllLibraries,
});

type UseAllLibrariesOptions = {
  queryConfig?: QueryConfig<typeof getAllLibrariesQueryOptions>;
};

export const useAllLibraries = ({
  queryConfig,
}: UseAllLibrariesOptions = {}) => {
  return useQuery({
    ...getAllLibrariesQueryOptions(),
    ...queryConfig,
  });
};
