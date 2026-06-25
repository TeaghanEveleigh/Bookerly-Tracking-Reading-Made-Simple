import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { User } from '@/types/api';

import { userKeys } from './query-keys';

export const getUsers = (): Promise<{ success: true; users: User[] }> => {
  return api.get('/user');
};

export const getUsersQueryOptions = () => ({
  queryKey: userKeys.lists(),
  queryFn: getUsers,
});

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
