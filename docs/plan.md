# Frontend Plan

## 1. Purpose
- Track the frontend delivery order for the `medsight` Expo app.
- Keep clinician workflows stable while incomplete member, profile, and community refinements are added.
- Prevent route drift, duplicated shells, and UI regressions as screens evolve.

## 2. Current Baseline
### Delivered and Stable
- Onboarding and role selection.
- Clinician auth flow.
- Manual assessment flow with persisted form state.
- Manual assessment optional Patient ID input with `P-{year}-` prefix + numeric UX.
- Batch upload and batch-results screens.
- API-backed report view.
- API-backed history list with refresh and delete.
- Patient timeline screen with API-backed history, delete, and expand-to-report.
- Delete confirmation modal on AssessmentCard.
- User-friendly error messages across all assessment/batch/history screens.
- Validation error parsing (`src/lib/errors.ts`) for FastAPI field validation errors.
- Dev-only console logging gated behind `__DEV__`.
- Community feed with Supabase Realtime live updates and scroll-to-top on new post.
- Community search wired to API with debounced query and sectioned results.
- Community post detail with reply composer and media attachment.
- Community create post with image/video picker and media upload.
- Community bookmarks screen with infinite scroll and consistent toggle behaviour.

### Delivered but Partial
- Profile screen layout (static content, not API-backed).
- Member auth route set (post-auth shell not implemented).
- Community chat and notifications tabs (scaffolded, not wired).
- Community profile detail screen.

### Still Missing
- Member post-auth shell and member dashboard.
- Real profile data wiring.
- Notifications system.
- Community recent searches persistence.

## 3. Delivery Phases
### Phase 1: Keep Clinician Assessment Stable
- Keep manual clinical and blood forms aligned with the backend payload shape.
- Keep batch upload preserving filenames and working around mobile file permissions.
- Keep report routing stable for direct assessment ids and historical batch views.
- Keep history refresh, search, and delete working against cached server state.
- Keep clinician screens using the correct shell and scroll behaviour.

Definition of done:
- clinician assessment, batch, report, and history screens remain API-backed and usable without mock fallbacks.

Success signals:
- no stale history after delete
- batch uploads preserve the original file name
- report pages open correctly from both live results and history

### Phase 2: Finish Member and Profile Surfaces
- Add the member post-auth shell and first real member dashboard.
- Replace static profile content with real account data.
- Add profile edit flows only when the data contract is ready.
- Align member UI copy and navigation with the existing role selection flow.

Definition of done:
- member and clinician have separate post-auth experiences.
- profile stops behaving like a static stub.

Success signals:
- member users can leave auth and reach a meaningful home screen
- profile data is read from a real source instead of hardcoded text

### Phase 3: Harden Community
- Keep the feed fast with infinite scrolling and cache invalidation.
- Finish the remaining community views and polish the interaction states.
- Add empty, loading, and error states consistently across community screens.
- Keep nested community navigation predictable across feed, detail, and composer flows.

Definition of done:
- community routes feel complete and behave consistently across feed, search, bookmarks, and detail views.

Success signals:
- reaction toggles stay responsive
- search and bookmarks remain in sync with navigation state
- community loading and error states feel intentional rather than incidental

### Phase 4: Quality and Accessibility
- Audit spacing, typography, and contrast across clinician screens.
- Keep lists virtualised where needed and avoid nested scroll conflicts.
- Add or expand tests for the most important screen flows.
- Review mobile spacing for smaller phone widths and larger tablet-like screens.

Definition of done:
- the main routes remain stable on mobile and the UI stays consistent across screen sizes.

Success signals:
- no layout regressions when data is long
- no nested-scroll warnings on screens with lists
- no unreadable card content on small devices

### Phase 5: Documentation and Drift Control
- Keep `architecture.md`, `plan.md`, and `rules.md` aligned with the current frontend code.
- Update the docs whenever route names, shell behaviour, or data flow change.
- Keep the frontend audit current enough that it can be used as a quick repo map.

## 4. Working Order
Recommended execution order:
1. clinician assessment stability
2. member post-auth shell
3. profile data wiring
4. community polish
5. quality and accessibility pass
6. documentation sync

## 5. Documentation Sync
- Update this plan whenever a route, shell, or data-flow decision changes.
- Keep the architecture and rules docs in sync with the actual frontend implementation.
