import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Book, UpdateBookInput } from '@/types/api';

import { bookKeys } from './query-keys';

export const updateBook = ({
  id,
  data,
}: UpdateBookInput): Promise<{ success: true; book: Book }> => {
  return api.patch(`/book/${id}`, data);
};

type UseUpdateBookOptions = {
  mutationConfig?: MutationConfig<typeof updateBook>;
};

export const useUpdateBook = ({
  mutationConfig,
}: UseUpdateBookOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (...args) => {
      const [, variables] = args;
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      void queryClient.invalidateQueries({
        queryKey: bookKeys.detail(variables.id),
      });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
