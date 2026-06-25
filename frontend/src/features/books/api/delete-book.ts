import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Book } from '@/types/api';

import { bookKeys } from './query-keys';

export const deleteBook = (
  id: string,
): Promise<{ success: true; book: Book }> => {
  return api.delete(`/book/${id}`);
};

type UseDeleteBookOptions = {
  mutationConfig?: MutationConfig<typeof deleteBook>;
};

export const useDeleteBook = ({
  mutationConfig,
}: UseDeleteBookOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
