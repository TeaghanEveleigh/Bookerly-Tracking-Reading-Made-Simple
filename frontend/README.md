# BookApp Frontend

A Vite + React + Material UI frontend for the `book-backend-main` Express API.

## Quick Start

```bash
npm install
cp .env.example .env.local   # then fill in VITE_API_URL
npm run dev
```

Make sure `book-backend-main` is running on port 3001 (or update `VITE_API_URL`).

---

## Project Structure

```
src/
├── api/                    # All backend API calls (one file per resource)
│   ├── client.js           # Axios instance — JWT interceptor lives here
│   ├── userApi.js          # POST /user/login, /user/signup, GET /user/logout
│   ├── bookApi.js          # POST /book/createBook, GET /book/getBook/:id
│   └── libraryApi.js       # GET /library/userLibraries, POST /library/createLibrary, etc.
│
├── components/
│   ├── layout/
│   │   ├── NavBar.jsx      # Top app bar with nav links + user menu
│   │   ├── PageLayout.jsx  # Wraps pages with NavBar + content offset
│   │   └── ProtectedRoute.jsx  # Guards authenticated routes
│   └── ui/
│       └── BookCard.jsx    # Reusable book display card (Google Books format)
│
├── context/
│   └── AuthContext.jsx     # Auth state, login/signup/logout, token management
│
├── pages/
│   ├── Login/
│   │   └── LoginPage.jsx   # Sign In + Sign Up tabs (MUI)
│   ├── Home/
│   │   └── HomePage.jsx    # Library shelf previews (first 5 books each)
│   ├── Search/
│   │   └── SearchPage.jsx  # Book discovery via backend Google Books proxy
│   └── Library/
│       └── LibraryPage.jsx # Full library view with tabs per shelf
│
└── theme/
    └── theme.js            # MUI theme — colors, typography, component overrides
```

---

## Backend Connection Points

Every `// TODO:` comment in the code points to the exact backend route being called.
Search for `// TODO:` across the `src/api/` folder to find all connection points.

| Frontend file    | Backend route(s)                                                            |
|------------------|-----------------------------------------------------------------------------|
| userApi.js       | POST /user/login, POST /user/signup, GET /user/logout                       |
| bookApi.js       | POST /book/createBook, GET /book/getBook/:id, POST /discover/discover       |
| libraryApi.js    | GET /library/userLibraries, POST /library/createLibrary, GET /library/...   |

All protected routes require a JWT token — the axios client.js attaches it automatically from localStorage.

---

## Environment Variables

| Variable       | Default                 | Description           |
|----------------|-------------------------|-----------------------|
| VITE_API_URL   | http://localhost:3001   | Your backend base URL |
