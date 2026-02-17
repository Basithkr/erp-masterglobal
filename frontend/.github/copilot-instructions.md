<!-- Copilot instructions for masterglobal-frontend -->
# Copilot / AI agent instructions — masterglobal-frontend

This file gives concise, actionable context for AI coding agents working on this repository.

1) Big picture
- Frontend: React app created with Vite (entry: `src/main.jsx`, root component `src/App.jsx`).
- Single-page UI: main feature is `src/CustomerPage.jsx` which manages customer list and a small create form.
- Backend integration: API calls use a shared axios instance at `src/api.js` with `baseURL` set to `http://localhost:8080/api`.
  - Endpoints used: `GET /customers`, `POST /customers` (see `CustomerPage.jsx`).

2) How to run / build / lint (exact commands found in `package.json`)
- Start dev server: `npm run dev` (Vite)
- Build production bundle: `npm run build`
- Preview build: `npm run preview`
- Lint the project: `npm run lint` (runs `eslint .`)

3) Key project patterns to follow (do not invent new conventions)
- Network: always use the exported `api` from `src/api.js` to make HTTP requests so baseURL and interceptors (if added) remain central.
- UI: local component state via React `useState` and `useEffect` (see `CustomerPage.jsx` for examples of `load()` and `save()` flows).
- Files: top-level `src/` contains app source; `public/` and `src/assets/` are static assets.

4) Integration and assumptions discovered from code
- The frontend expects an API server at `http://localhost:8080` under `/api`. When changing endpoints, update `src/api.js` consistently.
- No authentication, routing, or global state library present—keep changes minimal and self-contained unless adding a documented new dependency.

5) Editing guidelines and examples
- Add new API calls in `src/api.js` or create small service modules that import `api`. Example: `const res = await api.get('/customers')`.
- When changing UI, prefer editing `src/CustomerPage.jsx` or adding new components under `src/` and importing them from `App.jsx`.
- Keep ESLint rules in mind; run `npm run lint` before submitting PRs.

6) What to avoid / watch for
- Do not hardcode a different backend host in multiple files; update `src/api.js` instead.
- There are no tests configured in this template; do not assume a test harness exists.

7) Helpful file references
- Entry point: `src/main.jsx`
- App component: `src/App.jsx`
- Feature: `src/CustomerPage.jsx`
- API client: `src/api.js`
- Build scripts: `package.json`

If anything above is unclear or you want examples expanded (e.g., adding a new API wrapper or adding routing), tell me which area to expand and I'll update this file.
