# Frontend Rules

## 1. Project Identity
- Project name: `medsight`
- Platform: Expo React Native
- Routing system: `expo-router`
- Primary UI language: React Native with NativeWind
- Shared backend-facing state should be handled by React Query, not ad hoc fetch state scattered across screens.

## 2. Routing Rules
- Clinician-facing screens must live inside the clinician route group and use `ClinicianShell` unless a special loading or nested stack screen needs a different wrapper.
- Auth screens must continue to use the auth route groups and `AuthShell`.
- `/(clinician)/report/[id]` is the assessment detail route.
- `/(clinician)/batch-results` is the batch result route.
- Do not introduce a second batch-detail route unless there is a concrete product need.
- Keep route params stable once they are used by navigation or cache keys.
- Prefer route params for ids and small display strings.
- Do not pass bulky screen state through route params when a store or query cache is the better fit.
- `report/[id]` must continue to treat the `id` param as the assessment id, not the patient id.

## 3. Shell Rules
- Use `ClinicianShell` for clinician-facing screens.
- Use `AuthShell` for auth screens.
- Set `scrollable={false}` on `ClinicianShell` only when the screen owns scrolling through a `FlatList`, `FlashList`, or similar virtualised list.
- Never wrap a long list in both `ScrollView` and `FlatList`.
- If a screen contains a long list and a header, let the list own the scroll container.
- Prefer a plain `View` inside the shell when the screen body is short and static.

## 4. State and Data Rules
- Use React Query for server state.
- Invalidate or refetch affected queries after mutations.
- Use optimistic updates only when the rollback path is clear.
- Use Zustand for cross-screen client state.
- Keep form state in a dedicated store when the user moves through multiple screens.
- Use `useDeferredValue` or a similar pattern for search input that drives filtering.
- Keep query keys predictable and descriptive.
- Reuse the same query key family for list/detail screens when they are part of the same resource.
- Treat cached data as the source of truth for navigation backtracking when the screen is intentionally long-lived.

## 5. Service Rules
- Keep API calls in `src/services/`.
- Do not put fetch logic directly into presentation components when a service function can own it.
- Preserve original filenames for batch uploads.
- Use the multipart upload path that works with mobile file URIs.
- Do not introduce new transport code inside screens when a service wrapper already exists.
- Keep API response mapping inside the screen or a thin helper, not inside the shared primitives.

## 6. UI Rules
- Keep clinician screens visually consistent with the existing blue medical theme.
- Use NativeWind for the main layout style.
- Use inline styles only where component-specific geometry or conditional styling is simpler.
- Keep cards and rows compact enough for mobile screens.
- Prefer `FlatList` or `FlashList` for long lists of cards.
- Use `numberOfLines` on short card titles when text can overflow.
- Keep information cards readable at a glance; do not over-stack typography.
- Maintain a clear visual difference between action cards, detail cards, and informational notes.

## 7. Content Rules
- Use the canonical clinical field names already used by the app and API.
- Preserve `patientId` and `patientName` in frontend data flow and route params.
- Avoid mock fallbacks in shipped screens.
- Keep copy concise and clinically appropriate.
- Keep labels consistent across manual entry, history, and report screens.
- Do not rename shared display fields just because a screen is visually different.
- If a designer label is wrong, correct the visible copy without changing the underlying data field name.

## 8. Code Style
- Write TypeScript-first React code.
- Prefer small, focused components over large monolith screens.
- Keep helper logic close to the screen when it is not reusable.
- Avoid unnecessary abstraction.
- Keep comments short and only explain why a choice was made.
- Keep imports grouped and ordered.
- Prefer explicit types when a value crosses a service, store, or route boundary.
- Avoid `any` unless it is a temporary bridge to a known backend shape.

## 9. Testing and Verification
- Run `npm run lint` after frontend doc or code changes that affect routes, screens, or shared components.
- Run `npx tsc --noEmit` when changing shared types, stores, or API response mapping.
- Check the affected screen flow manually when navigation, query keys, or cached views change.
- Verify batch upload, history delete, report open, and community feed behaviours after changes to shared navigation or query keys.
- Verify both mobile-sized and larger-device layouts when a screen contains dense cards or forms.

## 10. Decisions Already Made - Do Not Revisit Lightly
| Decision | Choice | Reason |
|---|---|---|
| Clinician shell | `ClinicianShell` | Keeps clinician screens visually and behaviourally consistent |
| Assessment history | API-backed | History should reflect saved records, not mock data |
| Batch details | Reuse `batch-results` | Avoids duplicate detail screens |
| Report view | React Query cached | Prevents unnecessary refetching on back navigation |
| Batch upload transport | Multipart upload path that works on mobile | Preserves picked filenames and avoids file URI issues |
| Search filtering | Deferred input with React Query where relevant | Keeps typing responsive on mobile |
| Manual state persistence | Zustand store | Allows the user to move between manual screens without losing input |
| Community feed loading | Loading gate plus nested tabs | Keeps the feed transition controlled and avoids route flicker |
+| CSS Interop Patch | `react-native-css-interop.patch` | Fixes critical styling issues; must be applied during install |
