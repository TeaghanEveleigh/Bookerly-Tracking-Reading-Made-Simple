import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { CreateLibraryInput, Library } from '@/types/api';

import { libraryKeys } from './query-keys';

export const createLibrary = (
  data: CreateLibraryInput,
): Promise<{ success: true; library: Library }> => {
  return api.post('/library', data);
};

type UseCreateLibraryOptions = {
  mutationConfig?: MutationConfig<typeof createLibrary>;
};

export const useCreateLibrary = ({
  mutationConfig,
}: UseCreateLibraryOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLibrary,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      mutationConfig?.onSuccess?.(...args);
    },
    ...mutationConfig,
  });
};
