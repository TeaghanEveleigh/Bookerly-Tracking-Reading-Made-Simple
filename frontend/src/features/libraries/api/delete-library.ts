import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Library } from '@/types/api';

import { libraryKeys } from './query-keys';

export const deleteLibrary = (
  id: string,
): Promise<{ success: true; library: Library }> => {
  return api.delete(`/library/${id}`);
};

type UseDeleteLibraryOptions = {
  mutationConfig?: MutationConfig<typeof deleteLibrary>;
};

export const useDeleteLibrary = ({
  mutationConfig,
}: UseDeleteLibraryOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLibrary,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
