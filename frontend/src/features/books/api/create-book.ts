import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Book, CreateBookInput } from '@/types/api';

import { bookKeys } from './query-keys';

export const createBook = (
  data: CreateBookInput,
): Promise<{ success: true; book: Book }> => {
  return api.post('/book', data);
};

type UseCreateBookOptions = {
  mutationConfig?: MutationConfig<typeof createBook>;
};

export const useCreateBook = ({
  mutationConfig,
}: UseCreateBookOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
