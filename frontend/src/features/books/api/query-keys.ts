export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  detail: (id: string) => [...bookKeys.all, 'detail', id] as const,
};
