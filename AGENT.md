# Agent Instructions - medsight frontend

You are working in the `medsight` frontend repository.

## 1. Repository Identity
- Project name: `medsight`
- Platform: Expo React Native
- Routing: `expo-router`
- Styling: NativeWind
- State: Zustand + TanStack Query
- Auth: Supabase

## 2. Source of Truth
- Read `docs/architecture.md`, `docs/plan.md`, and `docs/rules.md` before making frontend changes.
- Do not edit `docs/prd.md` unless the user explicitly asks.
- Keep `README.md` aligned with the actual frontend implementation.

## 3. Working Rules
- Prefer the smallest correct change.
- Do not refactor unrelated code.
- Do not touch backend repos or backend docs.
- Use `apply_patch` for manual file edits.
- Keep changes scoped to the requested frontend area.

## 4. Routing Rules
- Use `ClinicianShell` for clinician-facing screens.
- Use `AuthShell` for auth screens.
- Keep `/(clinician)/report/[id]` as the report route.
- Keep `/(clinician)/batch-results` as the batch result route.
- Do not create duplicate detail routes when an existing screen can be reused.

## 5. State and Data Rules
- Use React Query for server state, caching, and mutations.
- Use Zustand for cross-screen client state.
- Invalidate affected queries after deletes and other mutations.
- Preserve `patientId` and `patientName` in frontend data flow.
- Keep batch uploads preserving the original filename.

## 6. UI Rules
- Keep the current blue medical visual language.
- Prefer `FlatList` or `FlashList` for long lists.
- Avoid nested scroll conflicts.
- Keep cards compact and readable on mobile.
- Use helper text and info blocks sparingly and intentionally.

## 7. Verification
- Run `npm run lint` after route, screen, or shared component changes.
- Run `npx tsc --noEmit` after shared type, store, or service changes.
- Check the affected screen flow manually when navigation or query keys change.

## 8. Current Frontend Focus
- Manual assessment flow
- Batch upload and batch results
- Assessment report view
- History list and delete flow
- Community feed and nested routes
- Profile screen polish
- Member post-auth shell is still incomplete

## 9. Commit Style
- Use conventional commits.
- Recommended prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
