// This file is kept as a backward-compatibility shim.
// The actual implementation has been moved to:
//   src/pages/Client/Profile/index.jsx
//
// Vite resolves './pages/Client/Profile' in App.jsx by first checking
// for Profile.jsx, then Profile/index.jsx. Since this file exists, we
// re-export from the new module directory so nothing breaks during the
// transition and so any future direct imports of this path still work.

export { default } from './Profile/index';