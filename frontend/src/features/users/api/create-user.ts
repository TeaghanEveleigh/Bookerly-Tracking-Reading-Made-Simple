import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { CreateUserInput, User } from '@/types/api';

import { userKeys } from './query-keys';

export const createUser = (
  data: CreateUserInput,
): Promise<{ success: boolean; user: User | null }> => {
  return api.post('/user', data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
