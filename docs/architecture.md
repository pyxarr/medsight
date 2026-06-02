# Frontend Architecture

## 1. Overview
- `medsight` is an Expo React Native app built with `expo-router`.
- The frontend serves two user journeys: clinician and member.
- The clinician journey is the most complete surface and includes onboarding, manual assessment, batch upload, report viewing, history, profile, and community.
- The frontend is organised around route groups, shared shells, domain components, React Query for server state, and Zustand for local cross-screen state.

## 2. Repository Layout
| Path | Responsibility |
|---|---|
| `src/app/` | File-based routing and screen composition. |
| `src/app/(auth)/` | Auth routes for clinician and member entry points. |
| `src/app/(clinician)/` | Authenticated clinician surfaces, reports, and batch detail screens. |
| `src/app/(clinician)/(tabs)/` | Clinician tab navigator, history, profile, home, and community entry. |
| `src/app/(clinician)/(tabs)/community/` | Community loading gate, nested tabs, and detail routes. |
| `src/components/ui/` | Reusable UI primitives and low-level building blocks. |
| `src/components/clinician/` | Clinician domain components for manual entry, batch upload, history, report, profile, and community. |
| `src/services/` | API wrappers and transport logic. |
| `src/store/` | Zustand stores for auth, manual assessment state, UI flags, and community state. |
| `src/lib/` | Shared utilities, Supabase client, auth helpers, theming, and validation helpers. |
| `src/context/` | React context providers such as `QueryProvider`. |
| `assets/` | Images, icons, and onboarding art. |
| `docs/` | Frontend implementation documentation. |

## 3. App Shells
- `AuthShell` wraps authentication screens with the shared background and keyboard handling.
- `ClinicianShell` wraps clinician-facing screens with the gradient background, safe area handling, optional header, and optional scrolling.
- Community uses custom tab bars rather than the default navigation chrome so the feed can own its layout and loading state.

## 4. Route Groups and Screen Map
### 4.1 Root and Onboarding
| Route | Status | Notes |
|---|---|---|
| `/` | Complete | Redirects to onboarding. |
| `/onboarding` | Complete | Animated intro and role selection entry. |
| `/onboarding/role-selection` | Complete | Routes users to member or clinician auth. |

### 4.2 Auth
| Route | Status | Notes |
|---|---|---|
| `/(auth)/clinician/sign-in` | Complete | Clinician login. |
| `/(auth)/clinician/sign-up` | Complete | Clinician registration. |
| `/(auth)/clinician/otp` | Complete | Email verification. |
| `/(auth)/clinician/forgot-password` | Complete | Password reset request. |
| `/(auth)/clinician/new-password` | Complete | New password entry. |
| `/(auth)/clinician/password` | Complete | Password maintenance screen. |
| `/(auth)/clinician/acknowledge` | Complete | Clinician acknowledgement flow. |
| `/(auth)/member/*` | Scaffolded | Member auth routes exist, but the post-auth shell is not implemented. |

### 4.3 Clinician Tabs and Details
| Route | Status | Notes |
|---|---|---|
| `/(clinician)/(tabs)` | Complete | Main clinician tab navigator. |
| `/(clinician)/(tabs)/index` | Complete | Manual vs batch entry landing screen. |
| `/(clinician)/(tabs)/history` | Complete | Assessment and batch history. |
| `/(clinician)/(tabs)/profile` | Partial | Static profile content. |
| `/(clinician)/(tabs)/community` | Complete | Community loading gate and nested stack. |
| `/(clinician)/report/[id]` | Complete | Assessment detail report. |
| `/(clinician)/batch-results` | Complete | Batch result view for fresh uploads and history. |

### 4.4 Community Nested Tree
| Route | Status | Notes |
|---|---|---|
| `/(clinician)/(tabs)/community/(tabs)/home` | Complete | Feed with infinite scroll and reactions. |
| `/(clinician)/(tabs)/community/(tabs)/search` | Complete | Search screen. |
| `/(clinician)/(tabs)/community/(tabs)/chat` | Complete | Chat tab. |
| `/(clinician)/(tabs)/community/(tabs)/notifications` | Complete | Notifications tab. |
| `/(clinician)/(tabs)/community/profile/[id]` | Complete | Community profile detail. |
| `/(clinician)/(tabs)/community/post/[id]` | Complete | Community post detail. |
| `/(clinician)/(tabs)/community/bookmark/[id]` | Complete | Saved posts and bookmarks. |
| `/(clinician)/(tabs)/community/create` | Complete | Post composer. |

## 5. Screen Layers
### Onboarding and Auth
- Onboarding handles first-run presentation and role selection.
- Clinician auth uses Supabase-backed sign-in, sign-up, OTP, forgot-password, and reset flows.
- Member auth routes exist but the member post-auth shell is not yet built.

### Auth Screens
- Auth screens are focused on identity only.
- They should not own application state beyond the minimum needed to submit a login, registration, or password reset request.
- Auth flows should continue to use the shared auth shell and modal-style stack behaviour already established in the route layout.

### Clinician Entry Flow
- `ManualEntry` is the clinician landing screen for choosing manual or batch entry.
- Manual assessment is split into `manual-clinical.tsx` and `manual-blood.tsx`.
- `manualAssessmentStore` preserves entered values while the user moves between screens.

### Manual Assessment Screens
- `manual-clinical.tsx` contains the required clinical fields and patient name fields.
- `manual-blood.tsx` contains the optional blood biomarker fields.
- The biopsy info card on `ManualEntry` is informational only and does not collect data.
- Manual entry should remain aligned with the clinician API request shape.

### Assessment Output
- `report/[id]` renders a single assessment detail view.
- `batch-results.tsx` renders batch upload results and historical batch views.
- Both screens reuse the same report-style data shapes so successful batch rows can open a report without rebuilding the payload.

### Batch Result Screens
- Fresh upload results arrive from the batch upload component and are passed directly to `batch-results`.
- Historical batch views use the `batchId` route param and reconstruct the same shape through API queries.
- The screen must stay scrollable because it renders a vertical stack of summary content and result cards.

### History
- The history screen shows assessments and batches in separate modes.
- It uses `FlatList` for long lists and pull-to-refresh for both tabs.
- Assessment deletion is optimistic and updates query cache state.

### History Screen Details
- Assessments show patient name, patient id, sample date, risk level, score, and confidence.
- Batches show filename, batch id, total rows, and creation date.
- Search should remain responsive while the query layer is updated.
- History should not fall back to mock records.

### Community
- Community has its own loading transition, nested tabs, infinite feed, post details, profile details, bookmarks, chat, and search.
- The feed uses optimistic reaction handling and query invalidation to keep likes/bookmarks responsive.

### Community Screen Details
- `community/_layout.tsx` gates the nested stack behind a loading screen.
- `community/(tabs)/home.tsx` owns the infinite feed and the composer/toolbar header.
- `community/(tabs)` has its own custom tab bar so the feed can keep a content-first layout.
- Detail routes for profiles, posts, bookmarks, chat, and notifications are all part of the same community tree.

### Profile
- Profile is visually complete but still uses static content.

### Profile Screen Details
- The profile surface is layout-complete but not data-complete.
- Rows and sections are present, but the values are placeholders until the account data contract is wired.

## 6. State and Data
- `authStore` manages the hydrated Supabase session.
- `manualAssessmentStore` manages clinician manual entry state across screens.
- `uiStore` tracks cross-screen UI state such as community focus.
- `communityStore` holds community-specific client state.
- React Query is the default server-state layer for report, history, batch, and community data.
- Screen-level derived state should be memoised when it controls filters, list projections, or route params.

### Query State
- Report and batch detail views use long-lived cache because users frequently navigate back and forth between lists and detail views.
- History and community data should refetch after mutations or focus changes.
- Mutations that affect history or community state must invalidate the relevant query key range.

## 7. Services
- `assessmentService.ts` handles manual assessment, batch upload, assessment detail, history, deletion, and batch listing.
- `communityService.ts` handles community feed, search, post detail, replies, reactions, follows, and bookmarks.
- Services are the only place that should know the exact API path shape.

### Assessment Service Responsibilities
- Build manual assessment payloads.
- Submit batch uploads without rewriting the picked file.
- Fetch assessment details by id.
- Fetch assessment history by filters.
- Fetch batch lists and batch assessments.
- Delete assessments and surface API errors cleanly.

### Community Service Responsibilities
- Fetch paginated feeds.
- Fetch following feeds.
- Search posts and users.
- Create posts and replies.
- Toggle likes, reposts, bookmarks, and follows.
- Fetch bookmarks and post-level detail.

## 8. Component System
- UI primitives live under `src/components/ui/`.
- Clinician domain components live under `src/components/clinician/`.
- Report rendering is split into small composable cards and charts.
- Community rendering is split into feed, post, comment, chat, and header components.

### UI Primitives
- `Button`, `Input`, `Text`, `Dialog`, `Checkbox`, `Separator`, and `Icon` provide the shared base layer.
- These primitives should stay generic and should not embed clinician-specific logic.

### Clinician Components
- `ManualEntry` is the manual/batch landing surface.
- `BatchUpload` handles file selection and submission.
- `BatchResultRowCard` renders batch row outcomes.
- `AssessmentCard` and `BatchCard` render history lists.
- `HistorySearchBar` controls history filtering.

### Report Components
- `RiskSummaryCard`, `CrossDatasetAgreement`, `KeyContributingFactors`, `FeatureContributionChart`, `ConfidenceByDataset`, `OodWarningCard`, `SuggestedAction`, and `ReportDisclaimer` are used together to build the assessment detail page.

### Community Components
- `CommunityHeader`, `PostCard`, `ChatItem`, `CommentItem`, `CommunitySearchBar`, and `CommunityLoadingScreen` make up the social surface.

### Profile Components
- `ProfileHeader`, `ProfileRow`, and `ProfileSection` make up the profile layout.

## 9. Data Flow
### Manual Assessment
1. The user enters the clinical form.
2. The store retains values between screens.
3. The submission payload is assembled in `ManualEntry`.
4. The API result is routed straight to the report page for instant display.

Manual flow details:
- patient name is collected in the clinical screen and persisted in the shared store
- the blood screen is optional and only contributes additional input when values exist
- the report route receives the assessment result immediately so the user sees a populated detail page without waiting for a second fetch when possible

### Batch Upload
1. The user picks a file.
2. The upload uses multipart transport that preserves the original filename.
3. The response is routed to `batch-results`.
4. Historical batch views reuse the same screen with `batchId`.

Batch flow details:
- file handling must work with mobile-picked URIs
- row-level success and failure states are shown in the result screen
- successful rows can open the report view
- failed rows remain visible only in the live batch response, not as persisted history rows

### History and Report
1. History fetches list data through React Query.
2. Report fetches the detailed assessment by id and caches it aggressively.
3. Deletion invalidates the relevant assessment and batch-result queries.

History flow details:
- assessment history supports patient id, patient name, and risk level filtering
- batches are filtered locally by filename and batch id fragments
- pull-to-refresh should always be available on the active list

### Community
1. The feed uses infinite scrolling.
2. Reactions mutate optimistically.
3. Search, bookmarks, and nested views all stay on the same community route tree.

Community flow details:
- `useFocusEffect` is used to refresh community state when the community screens gain focus
- optimistic reactions must be reconciled with query invalidation after the mutation settles
- nested community views should preserve back navigation within the community stack

## 10. Design Language
- NativeWind is the default styling system.
- The visual language uses a blue medical accent with white cards and soft neutral backgrounds.
- Rounded cards, compact chips, and small helper text are used to keep dense clinical data readable on mobile.
- `ClinicianShell` provides the common gradient background used by most clinician pages.
- Community uses a more content-heavy feed layout but still follows the same palette.

## 11. Supporting Files and Utilities
- `src/context/QueryProvider.tsx` owns the React Query client setup used by the app.
- `src/lib/supabase.ts` configures the Supabase client and shared storage behaviour.
- `src/lib/auth.ts` and `src/store/authStore.ts` work together to hydrate and expose the current session.
- `src/lib/theme.ts` centralises the navigation theme.
- `src/lib/validations/auth.ts` contains the auth form validation schemas.
- `src/hooks/useOptimisticReactions.ts` keeps the community reaction UI responsive before the server confirms a change.
- `src/components/DevSitemapFab.tsx` is a dev-only helper for route inspection.
- `global.css` loads the shared NativeWind base styling.
- `src/components/clinician/community/CommunityLoadingScreen.tsx` controls the community loading transition.
- `src/components/clinician/profile/*` contains the reusable profile layout primitives.
- `src/components/clinician/history/*` contains the history-specific card and filter UI.
- `src/components/clinician/report/*` contains the report cards and charts that are composed on the detail page.
- `patches/react-native-css-interop.patch` ensures styling consistency and fixes interop issues between NativeWind and React Native.

## 12. Current Gaps
- Member post-auth screens are not implemented.
- Profile content is still static.
- Some community and profile actions are placeholders rather than fully connected product actions.

## 13. Stability Notes
- The batch results page and report page now depend on stable route params rather than ad hoc screen state.
- The history screen depends on query key consistency for delete and refresh behaviour.
- The app should avoid introducing new route trees unless they solve a real product need.

## 14. Maintenance Rule
- Update this file whenever route names, shell behaviour, data flow, or client state boundaries change.
