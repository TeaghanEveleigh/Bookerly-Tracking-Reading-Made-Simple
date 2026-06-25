import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Library, UpdateLibraryInput } from '@/types/api';

import { libraryKeys } from './query-keys';

export const updateLibrary = ({
  id,
  data,
}: UpdateLibraryInput): Promise<{ success: true; library: Library }> => {
  return api.patch(`/library/${id}`, data);
};

type UseUpdateLibraryOptions = {
  mutationConfig?: MutationConfig<typeof updateLibrary>;
};

export const useUpdateLibrary = ({
  mutationConfig,
}: UseUpdateLibraryOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLibrary,
    onSuccess: (...args) => {
      const [, variables] = args;
      void queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: libraryKeys.detail(variables.id),
      });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
