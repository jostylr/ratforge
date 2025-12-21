# Counting Build Plan

Below is a concrete "build plan" for coding agents. It’s structured as: content model → exercise families → themes/skins → modes → parameters → online interactions → worksheet generators → QA + telemetry. It’s not fluffy; it’s a spec.

---

## 0. Core Content Model

### Entities

#### `SkillAtom`
- `id`: string
- `domain`: `counting` | `grouping` | `place_value` | `meaning` | `operations` | `equivalence` | `estimation` | `proportional`
- `level`: integer (0…N)
- `prereqs`: `[SkillAtom.id]`
- `success_criteria`: machine-checkable statements

#### `ExerciseTemplate`
- `id`: string
- `family`: (see section 1)
- `prompts`: functions of parameters + theme
- `generator(params, rng)` -> `ExerciseInstance`
- `validator(instance)` -> `AnswerKey + Rubric`
- `renderers`: `web` | `worksheet` | `both`
- `modes_supported`: `explore` | `guided` | `quiz`

#### `ExerciseInstance`
- `seed`: number
- `state`: JSON (objects, arrangement, constraints)
- `task`: machine-readable objective(s)
- `solution`: canonical + alternate solutions
- `hints`: progressive

#### `ThemeSkin`
- `id`: string
- `tone`: `cute` | `adventure` | `utilitarian` | `mature`
- `assets`: icons, nouns, narration style
- `text_overrides`: replaces "items" with "acorns", "crates", "packets", etc.

---

## 1. Exercise Families (concrete set)

Each family includes: Exploratory version + Quiz-like version, and supports both web and worksheet where possible.

### F1: Subitize & Recognize (instant "how many?")
**Goal**: quantity recognition without counting-by-ones.

- **Explore (web): "Flash field"**
  - Show 1–10 items for 300–1500ms, then hide.
  - Learner selects amount via tiles / number / drawing marks.
  - Optional: show learner’s "reconstruction" (drag items into a tray).
- **Quiz (web/worksheet): "How many did you see?"**
  - Worksheet: dot cards / ten-frames / dice patterns (varied arrangements).

#### Adjustable Parameters
- `n_range`: (e.g., 1–5, 1–10, 6–20)
- `arrangement`: `random` | `dice` | `ten_frame` | `clustered` | `linear` | `array`
- `exposure_ms`
- `distractors`: (similar-looking groups)
- `must_explain`: (checkbox: "How did you know?" free response / selected strategy)

#### Themes
- **Cute**: "Fireflies appeared!"
- **Adventure**: "Enemy drones pinged briefly… how many?"
- **Utilitarian/Adult**: "Inventory scan: items visible on conveyor for 0.8s."

---

### F2: One-to-one Correspondence & Counting Protocol
**Goal**: counting as a reliable procedure; debugging miscounts.

- **Explore (web): "Count-and-move"**
  - Items scattered; learner must drag each into a "counted bin" as they count.
  - Engine can introduce "temptations" for error: overlapping items, moving items, duplicates.
- **Quiz (web/worksheet): "Find the counting mistake"**
  - Show a recorded counting sequence with a highlighted skip/double count; choose what went wrong.

#### Parameters
- `n_range`
- `motion`: `static` | `slight_jiggle` | `shuffle_after_k`
- `occlusion`: `none` | `mild` | `heavy`
- `error_injection_rate`: (for "debug" mode)
- `counting_aids`: `touch-to-tag` | `color-mark` | `move-to-bin`

#### Themes
- **Cute**: "Count kittens into baskets"
- **Adventure**: "Load supplies into compartments"
- **Adult**: "Audit checklist: ensure each item is counted exactly once"

---

### F3: Equivalence by Pairing (no numerals allowed)
**Goal**: same quantity via bijection; "equal without counting".

- **Explore (web): "Matchmakers"**
  - Two piles: drag links between items (pairing). If all paired, equal; leftovers indicate more/less.
  - Allow reshuffling; learner discovers invariance.
- **Quiz (web/worksheet): "Which is more?"**
  - Worksheet: draw lines pairing objects; circle which side has leftovers.

#### Parameters
- `n_left`, `n_right`: (equal or offset)
- `pairing_constraints`: `free` | `one-to-one only` | `must-cross-river` (fun constraint)
- `layout`: `aligned` | `scattered` | `nested`

#### Themes
- **Cute**: "Pair socks"
- **Adventure**: "Pair oxygen tanks to crew seats"
- **Adult**: "Pair invoices to payments"

---

### F4: Grouping & Unitizing (make bundles)
**Goal**: the birth of structure: "a group of 5 is one thing".

- **Explore (web): "Bundle factory"**
  - Items appear; learner can bundle into groups of `g`.
  - Show bundles as containers; allow regrouping.
  - Prompt: "Make 23 using bundles of 5 and singles."
- **Quiz (web/worksheet): "How many bundles? how many left?"**
  - Worksheet: circles representing bundles + leftovers.

#### Parameters
- `g`: (group size: 2, 3, 4, 5, 10, 12…)
- `n_total`
- `allowed_remainders`: `0_only` | `any`
- `bundle_limit`: (forces creative regrouping)
- `multi_group`: allow two bundle sizes (e.g., 10s and 1s)

#### Themes
- **Cute**: "Acorns into nests (groups of 4)"
- **Adventure**: "Ammo clips (groups of 6)"
- **Adult**: "Packaging: boxes of 12, loose units"

---

### F5: Place Value as Nested Containers
**Goal**: base systems as containment; not just digits.

- **Explore (web): "Crates within crates"**
  - Base `b` chosen; `b` singles → 1 bundle; `b` bundles → 1 super-bundle.
  - Learner builds numbers and sees the representation.
- **Quiz (web/worksheet): "Represent 347 (base 10) as crates"**
  - Worksheet: draw hundreds/tens/ones containers, or base-5 variants.

#### Parameters
- `base`: (2–12, default 10)
- `max_places`: (2–5)
- `n_target`
- `representation`: `containers` | `abacus` | `place_table`
- `digits_allowed`: `none` (pure containers) | `digits` | `both`

#### Themes
- **Cute**: "Honey jars and honeycombs"
- **Adventure**: "Cargo pallets → crates → containers"
- **Adult**: "Cash drawers: bills, straps, bricks" (works surprisingly well)

---

### F6: Number Meaning (cardinal, ordinal, measure)
**Goal**: "7" means different things depending on question.

- **Explore (web): "Same number, different story"**
  - Present a scene; learner toggles task type:
    - **Cardinal**: "How many apples?"
    - **Ordinal**: "Which apple is 7th?"
    - **Measure**: "Mark 7 units on a strip"
- **Quiz (web/worksheet): "Identify the type"**
  - Given statement, select cardinal/ordinal/measure + answer.

#### Parameters
- `n`
- `context`: `lineup` | `distance` | `containers` | `time`
- `unit`: `steps` | `seconds` | `meters` | `tiles`
- `noise`: distractor objects not counted

#### Themes
- **Cute**: "Train cars"
- **Adventure**: "Checkpoint markers"
- **Adult**: "Queue position at a ticket counter / time on a timer / dosage units"

---

### F7: Operations via Actions (add, take, combine, compare)
**Goal**: operations grounded in transformations; counting as one strategy, not the only one.

- **Explore (web): "Action sandbox"**
  - Learner manipulates objects: add/remove/merge/split.
  - Prompts like: "Make it 12 without counting by ones." (encourages grouping).
- **Quiz (web/worksheet): story problems with visual supports**
  - Worksheet: "Start with 8, add 5 → how many?" with ten-frame hints.

#### Parameters
- `operation`: `+` | `-` | `compare` | `missing_addend`
- `magnitudes`: ranges; allow negatives for older version
- `representation`: `objects` | `number_line` | `bar_model` | `array`
- `strategy_prompt`: `count_on` | `make_ten` | `group` | `inverse`

#### Themes
- **Cute**: "Cookies gained/lost"
- **Adventure**: "Fuel cells consumed/added"
- **Adult**: "Budgeting: deposits/withdrawals; inventory restock/shrink"

---

### F8: Arrays & Area (multiplication as structure)
**Goal**: multiplication emerges from grouping + geometry.

- **Explore (web): "Build a rectangle"**
  - Drag tiles into rows/cols; see rows × cols.
  - Allow factoring: "Make 24 as a rectangle in two different ways."
- **Quiz (web/worksheet): "Compute / complete array"**
  - Worksheet: partial array; fill missing row/column count.

#### Parameters
- `n_total` or `(r,c)` bounds
- `allowed_rotations`
- `factor_focus`: prime/composite flags
- `show_equations`: on/off

#### Themes
- **Cute**: "Garden plots"
- **Adventure**: "Shield grid"
- **Adult**: "Seating plan / warehouse pallet layout"

---

### F9: Estimation & "Anti-counting"
**Goal**: knowing when counting is dumb; using benchmarks.

- **Explore (web): "Which is closer?"**
  - Quick comparisons, magnitude guesses, then reveal.
  - Teach anchors: 5, 10, 25, 50, 100.
- **Quiz (web/worksheet): "Estimate then bound"**
  - Provide "at least / at most" bounds.

#### Parameters
- `n_range`: (10–200+)
- `density`: `sparse` | `packed`
- `anchor_set`
- `time_pressure`

#### Themes
- **Cute**: "Sprinkles"
- **Adventure**: "Stars in a patch"
- **Adult**: "Crowd count / parts in a bin"

---

### F10: Adult/Older-kid "usable math" tracks
These reuse families above but shift contexts:

- **Time & scheduling**: counting intervals, regrouping minutes into hours (place value in base 60-lite)
- **Money & change-making**: unitizing, place value, operations, equivalence
- **Packing & shipping**: grouping (12, 24), arrays, leftovers
- **Data entry/auditing**: one-to-one, error detection, pairing equivalence

*Parameters just swap ThemeSkin + context_pack.*

---

## 2. Modes: exploratory vs quiz-like

### Explore mode
- No single "right path"; multiple solutions accepted.
- Engine records strategy signals:
  - time-to-first-action
  - number of recounts
  - grouping usage
  - hint usage
- Debrief card: "You used grouping / you counted by ones / try bundling next time."

### Quiz mode
- Clear prompt, single-scored answer (or small set).
- Timed optional.
- Minimal hints, or "one hint costs points."

*Note: both modes can share the same ExerciseInstance; mode just changes UI + rubric strictness.*

---

## 3. Adjustable difficulty knobs (global)

Make these standard across templates so your generator can do adaptive scheduling:
- **Magnitude**: max N
- **Structure Visibility**: how strongly patterns are presented (ten-frame vs scattered)
- **Noise**: distractors, occlusion, motion
- **Time Pressure**
- **Representation Count**: objects vs symbols vs mixed
- **Constraint Level**: free play vs must use a tool (bundle-only, no numerals, etc.)
- **Explanation Required**: none / choose strategy / free response

---

## 4. Rendering targets

### Web interactive (minimum UI kit)
- Scene area (objects)
- Tools: tag, move-to-bin, bundle, split, link/pair, number tiles, scratchpad
- Optional: number line / ten-frame overlay toggle
- Hint system (tiered)
- Accessibility: keyboard support + screenreader labels ("Item 7 of 12")

### Worksheet generator
For each family, define printable renderers:
- Dot cards / ten-frames / arrays
- "Draw lines to pair"
- "Circle bundles of g"
- "Container place-value tables"
- Story problems with small visuals
- Answer keys + rubrics

#### Output formats:
- PDF (for print)
- SVG/PNG (for embedding)
- JSON blueprint (for re-rendering)

---

## 5. Agent implementation plan (what to assign)

- **Agent A: Content engine**
  - Implement `SkillAtom`, `ExerciseTemplate`, `ExerciseInstance`
  - RNG seeding, generator/validator interfaces
  - Alternate-solution handling (especially grouping/place-value)
- **Agent B: Template pack 1**
  - Implement F1–F5 generators + validators
  - Provide at least 5 variants each (arrangements, constraints)
- **Agent C: Template pack 2**
  - Implement F6–F10 generators + validators
  - Adult contexts pack
- **Agent D: Web renderer**
  - Common interaction primitives (drag, bundle, pair, tag)
  - Mode toggles (explore/quiz)
  - Event telemetry
- **Agent E: Worksheet renderer**
  - PDF pipeline + layout rules
  - Answer key generator
  - Parameter-to-layout mapping (avoid clutter, consistent spacing)
- **Agent F: QA + adaptive scheduler**
  - Property-based tests: counting correctness, no impossible tasks, uniqueness of answer where required
  - Difficulty estimator and spaced repetition scheduling

---

## 6. Concrete "starter set" (ship these first)

If you want a tight MVP that still feels deep:
1. **F1 Flash subitize** (web + worksheet)
2. **F2 Count-and-move** (web) + **error-detect** (worksheet)
3. **F4 Bundle factory** (web + worksheet)
4. **F5 Nested containers base-10** (web + worksheet)
5. **F7 Action sandbox add/subtract** (web) + **bar-model worksheets**

---

## 7. URL-based Generation Patterns & Physical Bridge

To enable a seamless "phygital" (physical-to-digital) loop, the system must support stateless or DB-backed URLs that reconstruct specific exercise states.

### URL Archetypes

1. **Exact Instance URL**
   - **Purpose**: "I want to do this exact worksheet/game again."
   - **Pattern**: `.../generate?template_id=F1&params={...}&seed=12345&mode=quiz`
   - **Behavior**: Re-creates the *exact* same layout, items, and distractors.

2. **Variation URL (Fresh Seed)**
   - **Purpose**: "I like this difficulty level, but I need new numbers/arrangements."
   - **Pattern**: `.../generate?template_id=F1&params={...}&mode=quiz` (omits seed)
   - **Behavior**: Keeps the difficulty parameters (range, arrangement type, noise) but generates a fresh instance.

3. **Answer Key URL**
   - **Purpose**: "I finished the worksheet, now I want to check my work instantly."
   - **Pattern**: `.../generate?template_id=F1&params={...}&seed=12345&reveal_solution=true`
   - **Behavior**: Navigates to a digital version of the exact instance with the solution already rendered or easily toggleable.

### Worksheet QR Integration

Every generated worksheet should have a configuration option to include QR codes in the header or footer:
- **Top Left**: QR to the **Exact Instance** (digital version of the paper).
- **Top Right**: QR to a **Fresh Variation** (same level, new task).
- **Bottom Right**: QR to the **Answer Key** (for self-grading).

*This bridge allows parents and teachers to print a static sheet that remains "alive" and connected to the digital engine.*
