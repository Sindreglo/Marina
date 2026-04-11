# Lærdom Auth — Design Spec

## Goal

Add email/password authentication for teachers. After login, teachers land on a dashboard showing their courses with published/hidden status. Courses are linked to authenticated teachers via `teacherId`. Teacher profile (name, years of experience, bio) is stored in Firestore.

## Architecture

Firebase Auth (email/password) with a React context provider (`AuthProvider`) in the root layout. Auth state is available throughout the app via `useAuthContext()`. Protected routes redirect client-side to `/login` when unauthenticated. No back-redirect after login — always lands on `/teacher`.

## Tech Stack

- Firebase Auth 12 (email/password)
- React context (`AuthContext`) for global auth state
- Next.js App Router, all `'use client'` pages
- Firestore: `courses` collection (existing) + new `teachers` collection

---

## Data Model

### Course document — add `teacherId`

```typescript
interface Course {
  // ...existing fields...
  teacherId: string  // Firebase Auth uid
}
```

Existing courses without `teacherId` are not shown on the teacher dashboard (they won't match the uid query). No migration needed.

### Teachers collection

Collection: `teachers`, doc ID = uid

```typescript
interface TeacherProfile {
  uid: string
  name: string
  yearsExperience: number
  bio: string
  createdAt: Timestamp
}
```

Created automatically on first login with empty/zero values. Updated when teacher saves their profile from the dashboard.

### Firestore queries

- `getTeacherCourses(uid)` — query `courses` where `teacherId == uid`, no published filter (returns all — published and hidden)
- `getTeacherProfile(uid)` — get single doc from `teachers/{uid}`
- `createTeacherProfile(uid)` — set doc at `teachers/{uid}` with empty defaults + `serverTimestamp()`
- `updateTeacherProfile(uid, data)` — update doc at `teachers/{uid}`

---

## Auth Infrastructure

### `lib/firebase.ts`

Export `auth = getAuth(app)` alongside existing `db`.

### `contexts/AuthContext.tsx`

`'use client'` component. Subscribes to `onAuthStateChanged(auth, ...)` once. Exposes:

```typescript
interface AuthContextValue {
  user: User | null
  loading: boolean
}
```

`loading` starts as `true`, becomes `false` after first auth state event. This prevents protected pages from flashing before redirect.

### `app/layout.tsx`

Wrap `{children}` in `<AuthProvider>`. Layout stays a server component — `AuthProvider` is a separate `'use client'` wrapper.

---

## Pages

### `/login`

- Centered card layout on `bg` background, Lærdom logo/title at top
- Email input + password input + "Logg inn" button
- Error message below button on failed login (wrong credentials etc.)
- No registration — teachers are created manually in Firebase Console
- On success:
  1. Check if `teachers/{uid}` exists in Firestore
  2. If not: create empty profile document
  3. `router.push('/teacher')`

### `/teacher`

Protected — redirect to `/login` if no authenticated user.

Two sections:

**Your courses:**
- Grid of course cards (same visual style as landing page)
- Each card shows: title, cover color, and a status badge — green "Publisert" or gray "Skjult"
- Click card → `router.push('/kurs/{id}/rediger')`
- "Nytt kurs" button top-right → navigates to `/kurs/ny/rediger` (existing route). That page reads the current uid from auth context and passes it to `createCourse(teacherId)`

**Your profile:**
- Inline editable fields: Name, Years of experience, About (bio)
- "Lagre profil" button — saves to `teachers/{uid}`
- Loads existing profile on mount

### Loading screen

Used while auth state resolves on protected pages (`/teacher`, `/kurs/[id]/rediger`). Centered, animated — pulsing Lærdom logotype or a spinner using `accent` color. Same `LoadingScreen` component reused on both protected pages.

---

## Protected routes

All three routes below redirect to `/login` if no authenticated user, and show `<LoadingScreen />` while auth state resolves:

- `/teacher`
- `/kurs/[id]/rediger` — no ownership check (any authenticated teacher can edit any course for now)
- `/kurs/ny/rediger` — reads uid from auth context before calling `createCourse(teacherId)`

---

## Navbar changes

- Remove "Utforsk kurs" link
- **Unauthenticated:** "Logg inn" button (outline style) on the right → `/login`
- **Authenticated:** Teacher's name + "Logg ut" link on the right. `signOut(auth)` on click, then `router.push('/')`

---

## `createCourse` update

`createCourse(teacherId: string)` — adds `teacherId` field to the Firestore document on creation.

---

## Route Protection Pattern

```typescript
const { user, loading } = useAuthContext()
useEffect(() => {
  if (!loading && !user) router.replace('/login')
}, [user, loading])

if (loading || !user) return <LoadingScreen />
```

---

## Out of Scope

- Firestore security rules (manual setup in Firebase Console)
- Teacher registration flow (manual creation in Firebase Console)
- Per-teacher ownership enforcement in the editor (any logged-in teacher can edit any course)
- Student authentication
