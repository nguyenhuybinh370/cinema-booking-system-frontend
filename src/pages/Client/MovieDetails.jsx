// This file is kept as a backward-compatibility shim.
// The actual implementation has been moved to:
//   src/pages/Client/MovieDetails/index.jsx
//
// App.jsx imports './pages/Client/MovieDetails' which resolves to
// MovieDetails.jsx first. Re-exporting keeps all imports working
// without touching the router.

export { default } from './MovieDetails/index';