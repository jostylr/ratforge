# RatForge Project Plan

## Overview

This document outlines the implementation plan for RatForge, starting from project setup through a working first exercise (counting kittens). The plan is divided into phases, with each phase building on the previous.

---

## Phase 1: Project Foundation

**Goal**: Set up the basic project structure, tooling, and dependencies.

### Tasks

- [ ] **1.1 Initialize Bun project**
  - `bun init`
  - Configure `bunfig.toml` if needed
  - Set up TypeScript (`tsconfig.json`)

- [ ] **1.2 Install dependencies**
  ```bash
  bun add ratmath
  ```
  No other runtime dependencies needed (Bun has native SQLite, HTTP server)

- [ ] **1.3 Create directory structure**
  ```
  ratforge/
  ├── src/
  │   ├── server.ts           # Main server entry
  │   ├── routes/             # Route handlers
  │   ├── db/                 # Database utilities
  │   ├── auth/               # Authentication logic
  │   ├── exercises/          # Exercise definitions
  │   └── templates/          # HTML templates
  ├── public/
  │   ├── css/
  │   ├── js/
  │   ├── images/
  │   └── sounds/
  ├── data/                   # User data (gitignored)
  ├── spec.md
  ├── project-plan.md
  ├── package.json
  └── tsconfig.json
  ```

- [ ] **1.4 Set up dev tooling**
  - Add scripts to `package.json`: `dev`, `build`, `start`
  - Configure hot reload with `bun --watch`

### Deliverable
Running `bun run dev` starts a server that returns "RatForge" on `/`.

---

## Phase 2: Core Server & Routing

**Goal**: Implement basic HTTP server with routing and static file serving.

### Tasks

- [ ] **2.1 Create main server**
  - Use `Bun.serve()` 
  - Route dispatcher pattern
  - Static file serving from `/public`

- [ ] **2.2 Implement template system**
  - Simple string template function
  - Base layout template
  - Page-specific templates

- [ ] **2.3 Set up routes**
  - `GET /` - Landing page
  - `GET /about` - About page
  - `GET /css/*`, `GET /js/*`, `GET /images/*` - Static assets

- [ ] **2.4 Add global CSS**
  - Create `/public/css/main.css`
  - Basic reset, typography, colors
  - Layout utilities
  - Responsive breakpoints

### Deliverable
Styled landing page and about page served from Bun.

---

## Phase 3: Database & Event Sourcing

**Goal**: Implement per-user SQLite databases with event sourcing.

### Tasks

- [ ] **3.1 Create database utilities**
  - `src/db/index.ts` - Database connection manager
  - `src/db/events.ts` - Event logging functions
  - `src/db/migrate.ts` - Schema initialization

- [ ] **3.2 Implement user data isolation**
  - Create user directory on first access
  - Initialize `events.db` with schema
  - Connection pooling/caching per user

- [ ] **3.3 Event functions**
  ```typescript
  logEvent(userId: string, type: string, payload: object): void
  getEvents(userId: string, since?: Date): Event[]
  rebuildState(userId: string): UserState
  ```

- [ ] **3.4 Create materialized view system**
  - Progress view (exercises attempted, scores)
  - Settings view (user preferences)
  - On-demand rebuild from events

### Deliverable
Events can be logged and queried per user.

---

## Phase 4: Authentication

**Goal**: Implement passwordless and password-based authentication.

### Tasks

- [ ] **4.1 Create tokens database**
  - `data/tokens.db` - Shared token → user mapping
  - Schema: `tokens(token TEXT PRIMARY KEY, user_id TEXT, created_at TEXT)`

- [ ] **4.2 Passwordless auth**
  - `POST /api/auth/start` - Generate token, create user
  - Redirect to `/u/<token>`
  - Set session cookie

- [ ] **4.3 Session management**
  - Cookie: `ratforge_session` (signed)
  - Session validation middleware
  - Extract user_id from token or session

- [ ] **4.4 Password auth (optional, can defer)**
  - `GET /register`, `GET /login` pages
  - `POST /api/auth/register`, `POST /api/auth/login`
  - Password hashing with Bun's crypto

- [ ] **4.5 Auth middleware**
  - Protect `/dashboard`, `/practice/*`, `/explore/*`
  - Redirect unauthenticated users to `/`

### Deliverable
Users can start learning with a bookmarkable URL and return later.

---

## Phase 5: Frontend Setup

**Goal**: Set up htmx, Alpine.js, and base UI components.

### Tasks

- [ ] **5.1 Add frontend libraries**
  - Download htmx.min.js → `/public/js/`
  - Download alpine.min.js → `/public/js/`

- [ ] **5.2 Create base layout**
  - Navigation bar with user info
  - Main content area
  - Footer

- [ ] **5.3 Create dashboard page**
  - Welcome message
  - Progress summary (placeholder)
  - Links to exercises

- [ ] **5.4 Style components**
  - Buttons, inputs, cards
  - Navigation styles
  - Progress indicators

### Deliverable
Authenticated users see a styled dashboard with navigation.

---

## Phase 6: Exercise System Core

**Goal**: Build the framework for exercises.

### Tasks

- [ ] **6.1 Define exercise interface**
  ```typescript
  // src/exercises/types.ts
  interface Exercise {
    id: string;
    topic: string;
    title: string;
    difficulty: number;
    generate(seed?: number): ExerciseInstance;
    validate(instance: ExerciseInstance, answer: unknown): ValidationResult;
    renderHTML(instance: ExerciseInstance): string;
  }
  ```

- [ ] **6.2 Create exercise registry**
  - Load exercises from `/src/exercises/`
  - Map exercise IDs to implementations

- [ ] **6.3 Exercise API routes**
  - `GET /api/exercise/:id/generate` - Create instance
  - `POST /api/exercise/:id/submit` - Check answer, log event

- [ ] **6.4 Exercise page template**
  - Title, instructions
  - Interactive content area
  - Submit button, feedback area
  - "Next" button on completion

### Deliverable
Exercise framework ready to add specific exercises.

---

## Phase 7: Counting Exercise - "Kittens in a Basket"

**Goal**: Implement the first real exercise.

### Tasks

- [ ] **7.1 Create kitten assets**
  - 10 unique kitten images (SVG preferred)
  - Different poses/colors for variety
  - Basket image

- [ ] **7.2 Implement counting exercise**
  ```typescript
  // src/exercises/counting/basket.ts
  export const kittenBasketExercise: Exercise = {
    id: 'counting-basket',
    topic: 'counting',
    title: 'Kittens in a Basket',
    difficulty: 1,
    generate(seed) {
      const total = randomInt(5, 12, seed);
      const target = randomInt(1, total - 1, seed);
      return { seed, params: { total, target }, correctAnswer: target };
    },
    validate(instance, answer) {
      return { correct: answer === instance.correctAnswer };
    },
    renderHTML(instance) {
      // Return HTML with kittens and basket
    }
  };
  ```

- [ ] **7.3 Interactive UI with Alpine.js**
  ```html
  <div x-data="kittenGame({ total: 10, target: 4 })">
    <p>Put <strong x-text="target"></strong> kittens in the basket!</p>
    
    <div class="play-area">
      <template x-for="kitten in kittens" :key="kitten.id">
        <img :src="kitten.src" 
             :class="{ 'in-basket': kitten.inBasket }"
             @click="toggleKitten(kitten.id)">
      </template>
    </div>
    
    <div class="basket" @drop="dropKitten" @dragover.prevent>
      <img src="/images/basket.svg">
      <span x-text="countInBasket()"></span> kittens
    </div>
    
    <button @click="checkAnswer" :disabled="!canSubmit">Check Answer</button>
  </div>
  ```

- [ ] **7.4 Exercise page route**
  - `GET /practice/counting/basket` - Render exercise page
  - Load exercise, generate instance
  - Store instance in session for validation

- [ ] **7.5 Feedback and progression**
  - Show success/failure message
  - Play sound effect
  - Log `exercise_attempt` event
  - "Try Again" or "Next" button

- [ ] **7.6 Add audio feedback**
  - `/public/sounds/correct.mp3`
  - `/public/sounds/incorrect.mp3`
  - `/public/sounds/click.mp3`

### Deliverable
Users can play the kitten counting game with full event logging.

---

## Phase 8: Progress Tracking

**Goal**: Show users their learning progress.

### Tasks

- [ ] **8.1 Progress API**
  - `GET /api/progress` - Overall stats
  - Calculate from events

- [ ] **8.2 Progress page**
  - `GET /progress` - Progress dashboard
  - Exercises completed, accuracy, streaks

- [ ] **8.3 Dashboard integration**
  - Show recent activity
  - Quick stats card
  - Suggested next exercise

### Deliverable
Users can see their progress and history.

---

## Phase 9: Polish & Testing

**Goal**: Refine UX and ensure stability.

### Tasks

- [ ] **9.1 Error handling**
  - 404, 500 error pages
  - Graceful database errors
  - Network error recovery (htmx)

- [ ] **9.2 Loading states**
  - htmx loading indicators
  - Skeleton screens

- [ ] **9.3 Mobile responsiveness**
  - Touch-friendly interactions
  - Responsive layout

- [ ] **9.4 Manual testing**
  - Test all user flows
  - Test on mobile devices
  - Test with slow network

- [ ] **9.5 Documentation**
  - Update README.md
  - Add setup instructions

### Deliverable
Polished, working MVP ready for real users.

---

## Implementation Order Summary

| Week | Phase | Focus |
|------|-------|-------|
| 1 | 1-2 | Foundation & Server |
| 2 | 3-4 | Database & Auth |
| 3 | 5-6 | Frontend & Exercise Framework |
| 4 | 7 | Kitten Exercise |
| 5 | 8-9 | Progress & Polish |

---

## File Creation Checklist (Phase 1-7)

### Core Files
```
src/server.ts
src/routes/index.ts
src/routes/auth.ts
src/routes/api.ts
src/routes/exercises.ts
src/db/index.ts
src/db/events.ts
src/db/tokens.ts
src/auth/session.ts
src/auth/middleware.ts
src/exercises/types.ts
src/exercises/registry.ts
src/exercises/counting/basket.ts
src/templates/layout.ts
src/templates/pages/home.ts
src/templates/pages/dashboard.ts
src/templates/pages/exercise.ts
src/templates/components/nav.ts
```

### Public Assets
```
public/css/main.css
public/js/htmx.min.js
public/js/alpine.min.js
public/js/app.js
public/images/kittens/kitten-1.svg through kitten-10.svg
public/images/basket.svg
public/sounds/correct.mp3
public/sounds/incorrect.mp3
public/sounds/click.mp3
```

### Config Files
```
package.json
tsconfig.json
.gitignore
README.md
```

---

## Success Criteria for MVP

1. ✅ User can start learning without registration (passwordless)
2. ✅ User can bookmark URL and return later
3. ✅ User can play "Kittens in a Basket" exercise
4. ✅ User actions are logged to personal SQLite database
5. ✅ User can see basic progress information
6. ✅ Works on desktop and mobile browsers
7. ✅ No external service dependencies (runs entirely on Bun)

---

## Future Phases (Post-MVP)

- **Phase 10**: Additional counting exercises
- **Phase 11**: Natural number operations
- **Phase 12**: Password authentication
- **Phase 13**: Integer introduction
- **Phase 14**: Ratmath integration for rationals
- **Phase 15**: Cross-user features (leaderboards, etc.)
