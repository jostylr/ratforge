# RatForge Specification

## Overview

RatForge is a web-based platform for mastering arithmetic, progressing from counting through natural numbers, integers, rationals, and eventually real numbers. The platform emphasizes exploration and practice with a personalized, event-sourced learning journey for each user.

---

## Core Philosophy

- **Progressive mastery**: Start with counting, build to complex number systems
- **Event-sourced learning**: Every action is logged, enabling replay, analytics, and undo
- **Visual and tactile**: Use images and interactive elements (e.g., kittens in baskets)
- **Low friction**: Passwordless authentication option for easy access

---

## Technology Stack

### Backend
- **Runtime**: Bun (native SQLite, native HTTP server)
- **Database**: SQLite (one file per user in `data/<user_id>/events.db`)
- **Math Library**: [ratmath](https://github.com/jostylr/ratmath) for rational number operations

### Frontend
- **Interactivity**: htmx (server-driven UI updates)
- **Client state**: Alpine.js (lightweight reactive components)
- **Styling**: Global CSS file (`/public/css/main.css`) + per-page styles as needed
- **Icons/Images**: SVG assets for exercises (kittens, objects, etc.)

### Authentication
- **Passwordless**: Bookmarkable URL with unique token (`/u/<token>`)
- **Password-based**: Optional email + password login
- **Session**: Cookie-based (`ratforge_session`)

---

## Data Architecture

### User Data Isolation
```
data/
├── <user_id_1>/
│   ├── events.db      # Event-sourced log
│   └── state.db       # Materialized view (optional, for performance)
├── <user_id_2>/
│   ├── events.db
│   └── state.db
└── ...
```

### Event Schema (SQLite)
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,  -- JSON
    version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_timestamp ON events(timestamp);
```

### Event Types
| Event Type | Description | Payload Example |
|------------|-------------|-----------------|
| `session_start` | User begins a session | `{"device": "...", "referrer": "..."}` |
| `exercise_start` | User starts an exercise | `{"exercise_id": "counting-1", "params": {...}}` |
| `exercise_attempt` | User submits an answer | `{"exercise_id": "...", "answer": 4, "correct": true}` |
| `exercise_complete` | User finishes exercise | `{"exercise_id": "...", "score": 10, "time_ms": 5000}` |
| `progress_unlock` | New content unlocked | `{"unlocked": "integers-basics"}` |

### Materialized Views
Views are reconstructed from events on demand or cached in `state.db`:
```sql
-- Example: user progress view
CREATE VIEW user_progress AS
SELECT 
    json_extract(payload, '$.exercise_id') as exercise_id,
    COUNT(*) as attempts,
    SUM(CASE WHEN json_extract(payload, '$.correct') THEN 1 ELSE 0 END) as correct,
    MAX(timestamp) as last_attempt
FROM events
WHERE event_type = 'exercise_attempt'
GROUP BY json_extract(payload, '$.exercise_id');
```

---

## Authentication System

### Passwordless Flow
1. User visits `/` and clicks "Start Learning"
2. Server generates unique token, creates user folder
3. User redirected to `/u/<token>`
4. Cookie set with session info
5. User bookmarks URL for future access

### Password-Based Flow
1. User visits `/register` or `/login`
2. Email + password submitted
3. Server validates/creates account
4. Session cookie set
5. User can access via `/dashboard`

### Token Structure
- 32-character alphanumeric string
- Stored in `data/tokens.db` mapping token → user_id
- Tokens never expire (bookmarkable)

---

## Page Structure

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page, start learning |
| `/login` | Password login form |
| `/register` | Password registration form |
| `/about` | About RatForge |

### Authenticated Pages
| Route | Description |
|-------|-------------|
| `/u/<token>` | User dashboard (passwordless) |
| `/dashboard` | User dashboard (password auth) |
| `/explore/<topic>` | Exploration page for topic |
| `/practice/<exercise>` | Practice exercise page |
| `/progress` | User progress overview |
| `/settings` | User settings |

### Exercise Pages (First Implementation)
| Route | Description |
|-------|-------------|
| `/practice/counting/basic` | Count objects on screen |
| `/practice/counting/basket` | Move N objects to basket |
| `/explore/counting` | Free exploration of counting |

---

## Exercise System

### Exercise Definition
Each exercise is defined in `/exercises/<topic>/<name>.ts`:
```typescript
interface Exercise {
    id: string;
    topic: string;
    title: string;
    description: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    generate(): ExerciseInstance;
    validate(instance: ExerciseInstance, answer: unknown): boolean;
    render(instance: ExerciseInstance): string; // HTML
}

interface ExerciseInstance {
    seed: number;
    params: Record<string, unknown>;
    correctAnswer: unknown;
}
```

### Counting Exercise Example: "Kittens in a Basket"
- **Setup**: Display N kittens (e.g., 10) scattered on page
- **Prompt**: "Put 4 kittens in the basket"
- **Interaction**: User clicks/drags kittens to basket
- **Validation**: Count kittens in basket matches target
- **Feedback**: Visual + audio feedback on success/failure

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/start` | Create passwordless session |
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | End session |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Log an event |
| GET | `/api/events?since=<timestamp>` | Get events since timestamp |

### Exercises
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercise/<id>/generate` | Generate exercise instance |
| POST | `/api/exercise/<id>/submit` | Submit answer |
| GET | `/api/exercise/<id>/hint` | Get hint (if available) |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get user progress summary |
| GET | `/api/progress/<topic>` | Get topic-specific progress |

---

## Frontend Architecture

### htmx Patterns
- Page navigation: `hx-get` with `hx-push-url`
- Exercise submission: `hx-post` with `hx-swap="innerHTML"`
- Progress updates: `hx-trigger="every 30s"` polling or SSE

### Alpine.js Patterns
- Drag-and-drop state: `x-data="{ selected: [], inBasket: [] }"`
- Timer display: `x-data="{ elapsed: 0 }"` with `x-init` interval
- Answer input: `x-model` binding with validation

### Component Structure
```
/public/
├── css/
│   └── main.css           # Global styles
├── js/
│   ├── htmx.min.js
│   ├── alpine.min.js
│   └── app.js             # Custom utilities
├── images/
│   ├── kittens/           # Kitten SVGs/PNGs
│   ├── objects/           # Other countable objects
│   └── ui/                # UI icons
└── sounds/
    ├── correct.mp3
    ├── incorrect.mp3
    └── click.mp3
```

### Page Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RatForge - {{title}}</title>
    <link rel="stylesheet" href="/css/main.css">
    {{#if pageStyles}}<style>{{pageStyles}}</style>{{/if}}
    <script src="/js/htmx.min.js" defer></script>
    <script src="/js/alpine.min.js" defer></script>
</head>
<body>
    <nav><!-- Navigation --></nav>
    <main>{{content}}</main>
    <footer><!-- Footer --></footer>
</body>
</html>
```

---

## Security Considerations

- **Token secrecy**: Passwordless tokens are sensitive; treat as passwords
- **CSRF protection**: Include CSRF token in forms
- **Rate limiting**: Limit login attempts, exercise submissions
- **Input validation**: Sanitize all user input
- **SQL injection**: Use parameterized queries only

---

## Future Considerations

### Cross-User Interactions
- Leaderboards (opt-in)
- Shared challenges
- Teacher/student relationships
- Class progress dashboards

### Content Expansion
- Natural numbers: addition, subtraction, multiplication, division
- Integers: negative numbers, number line
- Rationals: fractions, decimals, ratmath integration
- Reals: irrational numbers, limits (advanced)

### Analytics
- Learning path optimization
- Difficulty adjustment
- Time-based performance tracking
- Spaced repetition scheduling

---

## Glossary

| Term | Definition |
|------|------------|
| **Event** | Immutable record of user action |
| **Materialized View** | Computed state derived from events |
| **Exercise** | A specific practice problem type |
| **Exploration** | Free-form learning activity |
| **Topic** | Category of math content (counting, integers, etc.) |
| **ratmath** | External library for rational number arithmetic |
