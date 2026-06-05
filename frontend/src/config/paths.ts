// src/config/paths.ts

export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },

  auth: {
    login: {
      path: "/auth/login",
      getHref: (redirectTo?: string) =>
        redirectTo
          ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
          : "/auth/login",
    },
    register: {
      path: "/auth/register",
      getHref: () => "/auth/register",
    },
  },

  books: {
    path: "/books",
    getHref: () => "/books",
  },

  book: {
    path: "/books/:bookId",
    getHref: (bookId: string) => `/books/${bookId}`,
  },

  library: {
    path: "/library/:id",
    getHref: (libraryId: string) => `/library/${libraryId}`,
  },

  users: {
    path: "/users",
    getHref: () => "/users",
  },
} as const;