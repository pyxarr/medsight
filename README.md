# MedSight Frontend

![Expo](https://img.shields.io/badge/Expo-56-000000) ![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6) ![pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-F69220) ![NativeWind](https://img.shields.io/badge/Styling-NativeWind-38BDF8)

## Overview 🩺

`medsight` is the Expo React Native frontend for the MedSight breast cancer risk assessment product. It serves both clinician and member entry points, but the clinician workflow is the most complete surface today.

The app includes:

- onboarding and role selection
- clinician authentication
- manual assessment entry
- batch upload and batch results
- assessment report viewing
- history for assessments and batches
- community feed, search, bookmarks, chat, and notifications
- basic member auth scaffolding

## Quick Start 🚀

```bash
pnpm install
pnpm start
```

Platform shortcuts:

```bash
pnpm android
pnpm ios
pnpm web
pnpm lint
```

## Repository Layout 🗂️

```text
medsight/
├── src/
│   ├── app/                  # Expo Router screens and route groups
│   ├── components/          # Shared UI and clinician/community components
│   ├── context/              # React context providers
│   ├── lib/                  # Auth helpers, theme, validation, utilities
│   ├── services/             # API calls and transport helpers
│   ├── store/                # Zustand stores
│   └── types/                # Shared TypeScript types
├── assets/                   # Logos, onboarding art, icons
├── docs/                     # Frontend architecture, plan, and rules
├── app.json                  # Expo app config
├── package.json              # Scripts and dependencies
├── pnpm-lock.yaml            # Locked dependency graph
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

## Stack 🧰

| Technology | Purpose |
| --- | --- |
| `Expo SDK 56` | Mobile app runtime |
| `expo-router` | File-based navigation |
| `React 19` | UI runtime |
| `React Native 0.85` | Cross-platform mobile layer |
| `TypeScript` | Static typing |
| `NativeWind` | Tailwind-style UI styling |
| `TanStack Query` | Server-state caching and mutations |
| `Zustand` | Cross-screen client state |
| `Supabase Auth` | User authentication |

## Key Routes 🔌

### Onboarding and Auth

| Route | Purpose |
| --- | --- |
| `/` | Redirects into onboarding |
| `/onboarding` | Intro slides and first-run experience |
| `/onboarding/role-selection` | Role selection |
| `/(auth)/clinician/sign-in` | Clinician sign-in |
| `/(auth)/clinician/sign-up` | Clinician sign-up |
| `/(auth)/clinician/otp` | OTP verification |
| `/(auth)/clinician/forgot-password` | Password reset request |
| `/(auth)/clinician/new-password` | New password setup |

### Clinician Workspace

| Route | Purpose |
| --- | --- |
| `/(clinician)/(tabs)` | Main clinician tab shell |
| `/(clinician)/(tabs)/index` | Manual vs batch entry landing screen |
| `/(clinician)/(tabs)/history` | Assessments and batches history |
| `/(clinician)/(tabs)/profile` | Clinician profile screen |
| `/(clinician)/(tabs)/community` | Community loading gate and nested stack |
| `/(clinician)/report/[id]` | Assessment detail report |
| `/(clinician)/batch-results` | Batch results screen |

### Community Nested Routes

| Route | Purpose |
| --- | --- |
| `/(clinician)/(tabs)/community/(tabs)/home` | Community feed |
| `/(clinician)/(tabs)/community/(tabs)/search` | Search |
| `/(clinician)/(tabs)/community/(tabs)/chat` | Chat |
| `/(clinician)/(tabs)/community/(tabs)/notifications` | Notifications |
| `/(clinician)/(tabs)/community/post/[id]` | Post detail |
| `/(clinician)/(tabs)/community/profile/[id]` | Profile detail |
| `/(clinician)/(tabs)/community/bookmark/[id]` | Bookmarks |
| `/(clinician)/(tabs)/community/create` | Create post |

## Frontend Architecture ⚙️

- `AuthShell` wraps auth screens.
- `ClinicianShell` wraps clinician-facing screens.
- React Query manages server state, caching, and mutations.
- Zustand manages cross-screen local state such as manual assessment inputs.
- `expo-router` owns navigation and route grouping.
- `community/_layout.tsx` uses a loading gate before rendering the nested community stack.

## Main Data Flows 🧭

### Manual Assessment
1. Open `ManualEntry`.
2. Fill clinical fields.
3. Optionally fill blood biomarker fields.
4. Submit the assessment.
5. Open the generated report screen.

### Batch Upload
1. Pick a file.
2. Upload through the batch endpoint.
3. Review row-level success and failure.
4. Open the report for successful rows.

### History
1. Open the history tab.
2. Switch between assessments and batches.
3. Search, refresh, or delete.
4. Open report or batch detail views from the list.

### Community
1. Open the community tab.
2. Browse the feed with infinite scroll.
3. Search, bookmark, react, chat, or open profiles/posts.

## Shared UI Patterns 🎨

- Use `ClinicianShell` for clinician screens unless a list owns the scroll container.
- Prefer `FlatList` or `FlashList` for long lists.
- Keep card content compact and readable on mobile.
- Keep route params stable and small.
- Use the existing blue medical palette and rounded-card style language.

## Environment 🛠️

Copy `.env.example` to `.env` and provide:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Documentation 📚

- `docs/architecture.md` explains the frontend structure.
- `docs/plan.md` tracks delivery phases.
- `docs/rules.md` contains frontend engineering rules.

## Notes

- `docs/prd.md` is the product source of truth and should not be edited unless explicitly required.
- The frontend currently has the strongest coverage in clinician workflows.
