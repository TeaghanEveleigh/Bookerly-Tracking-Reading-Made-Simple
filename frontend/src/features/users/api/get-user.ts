import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { User } from '@/types/api';

import { userKeys } from './query-keys';

export const getUser = (
  id: string,
): Promise<{ success: true; user: User | null }> => {
  return api.get(`/user/${id}`);
};

export const getUserQueryOptions = (id: string) => ({
  queryKey: userKeys.detail(id),
  queryFn: () => getUser(id),
});

type UseUserOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = ({ id, queryConfig }: UseUserOptions) => {
  return useQuery({
    ...getUserQueryOptions(id),
    ...queryConfig,
  });
};
