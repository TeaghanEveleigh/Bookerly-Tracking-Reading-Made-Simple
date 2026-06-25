import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { User } from '@/types/api';

import { userKeys } from './query-keys';

export const deleteUser = (
  id: string,
): Promise<{ success: true; user: User }> => {
  return api.delete(`/user/${id}`, { data: { id } });
};

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({
  mutationConfig,
}: UseDeleteUserOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
