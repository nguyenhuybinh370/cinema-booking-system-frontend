# Admin interview readiness

Each numbered task is one commit. Verification does not use a browser.
Existing package-lock.json edits and .env are user-owned and excluded from task commits.
The branch includes seven pre-existing Admin commits ahead of origin/main.

- [x] FE-1: Split transaction management into focused components/hooks; retain API contracts, clarify manual refund semantics, guard duplicate submissions and stale refund responses. Verify lint, server-render tests and production build.
- [x] FE-2: Make the Admin demo use real operational modules and remove mock dashboard content from the demo. Verify lint and production build.
- [ ] FE-3: Document personal Admin contribution, demo checklist and verification results. Verify final build and relevant static checks.

Delivery: push the task branch and create a frontend PR targeting main; user merges.
Backend work is tracked in the backend repository's INTERVIEW_TODO.md.

FE-1: 5 Node server-render tests passed; ESLint passed for Transactions and
useClientPagination; Vite production build passed (existing large bundle warning).
The redundant pagination copy of incoming data was removed.

FE-2: Replaced mock dashboard with revenue, daily occupancy and pending-refund
APIs. Restored movie create/edit API persistence through the existing form.
Removed prototype-only CMS/catalog/settings routes and navigation; source files
are retained. Ignored local environment files. Scoped ESLint and Vite build pass;
13 Node tests cover refund rendering, dashboard mapping/API contracts and movie
API payloads/rendering. API adapter tests are not browser or live-server E2E tests.
