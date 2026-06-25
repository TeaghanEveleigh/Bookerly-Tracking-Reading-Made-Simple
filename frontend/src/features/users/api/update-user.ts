import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { UpdateUserInput, User } from '@/types/api';

import { userKeys } from './query-keys';

export const updateUser = ({
  id,
  data,
}: UpdateUserInput): Promise<{ success: boolean; user: User | null }> => {
  return api.patch(`/user/${id}`, { id, ...data });
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (...args) => {
      const [, variables] = args;
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      void queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
