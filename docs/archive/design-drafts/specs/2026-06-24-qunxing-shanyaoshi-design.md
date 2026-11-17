# 群星闪耀时 Design Spec

Date: 2026-06-24

## Summary

`群星闪耀时` is a static-first, WebGL-based philosophical civilization atlas inspired by the immersive shape of `诗云 · Poetry Cloud`. The first release presents roughly 100 carefully curated philosophers as stars in a dark, poetic cosmos. Users can roam the star field, search philosophers or philosophical questions, read selected arguments, trace typed intellectual relationships, and keep local collections and notes.

The first release is not a full encyclopedia and not a user-account platform. It should prove the core experience: a beautiful navigable map of human thought, backed by structured, reviewable data that can later grow into a larger knowledge graph, API-backed service, and semantic search system.

## Goals

- Build a first-screen experience that opens directly into a three-dimensional philosopher star map.
- Curate about 100 philosophers with high-quality Chinese-facing profiles and multilingual data fields.
- Support lightweight question and topic search, returning selected philosophers and argument summaries.
- Represent intellectual relationships as a typed network, not a linear lineage tree.
- Provide local-only collections and notes without adding accounts, login, or cloud sync.
- Keep the first release deployable as a static site while preserving API boundaries for future backend replacement.
- Mark data review status clearly so AI-assisted content is not presented as unchecked authority.

## Non-Goals

- No login, user center, cloud sync, public notes, comments, or social features.
- No claim to cover all philosophers in the first release.
- No vector database or embedding pipeline in the first release.
- No large-scale crawler, data ingestion system, or editorial backend.
- No marketing landing page before the actual app.
- No unverified modern translation excerpts presented as source text.

## Product Scope

The first release contains:

- A full-screen three-dimensional star map.
- Philosopher detail panels.
- Civilization, period, tradition, and theme filters.
- Typed intellectual relationship lines.
- Lightweight search across philosophers, themes, and selected arguments.
- Local collections and notes with JSON import/export.
- A short first-run onboarding flow of no more than three steps.
- Static JSON data files with review states.

The first release should include about 100 refined philosophers. Selection should balance civilizations and theme coverage, while favoring figures that form useful relationships and support strong question search results.

## Visual Direction

The chosen direction is `诗性宇宙`.

The interface should feel like a dark cosmic field with warm gold emphasis, literary Chinese copy, and restrained academic density. It should borrow the broad interaction pattern of an immersive star map, but the subject is philosophical civilization rather than poetry generation.

Visual principles:

- Dark full-screen universe as the primary surface.
- Warm gold for focus, onboarding, and selected states.
- Civilizations and schools use a broader color palette so the UI does not become one-note gold.
- The universe uses a hybrid map grammar: historical time controls center-to-edge radius, while civilization and school control sector, local clustering, and color family.
- Earlier philosophers sit closer to the center. More recent philosophers sit farther out. Unknown or disputed dates use approximate period buckets rather than false precision.
- A core philosopher and their school or tradition should share a recognizable color family, with hue or lightness variants for subtraditions.
- Panels are translucent and compact, with enough density for repeated reading.
- The first screen is the usable app, not a landing page.
- The experience should feel poetic, but data labels and source notes must remain sober and clear.

## Information Architecture

### Top HUD

- Project title: `群星闪耀时`.
- Search entry for philosophers, civilizations, traditions, themes, and questions.
- View filters for civilization, period, tradition, and theme.
- Collection and notes entry.
- Settings entry for quality, label density, relationship visibility, and data notes.

### Star Map

- A star represents a philosopher.
- Star color primarily represents civilization plus school or intellectual tradition. Civilization supplies the base hue, while tradition or school supplies a related variant.
- Star size combines influence weight, relationship count, and profile completeness.
- Star position is generated deterministically from chronology, civilization, tradition, theme, and philosopher id seed.
- Center-to-edge radius primarily represents chronology: ancient and classical figures are near the center, medieval and early modern figures occupy middle rings, modern and contemporary figures move outward.
- Angular sector and local clustering represent civilization, school, and tradition so users can still perceive intellectual neighborhoods.
- The map should expose or imply this grammar through subtle time rings, color legends, and settings/help copy, without turning the main surface into a diagram.
- Relationship lines are subdued by default.
- Selecting a philosopher highlights their relevant intellectual network and dims unrelated stars.
- Selecting a philosopher also reveals that philosopher's local thought system as nearby concept satellites.

### Thought System Expansion

The selected philosopher can show a small local `思想星系` around their star. This is a separate scale from the global philosopher universe.

Interaction rules:

- First level: thought problems or concepts orbit the philosopher star, such as `苦与生命处境`, `缘起`, or `无我`.
- Clicking a problem or concept expands its second-level claims, such as `四圣谛组织问题` or `诸法因缘生`.
- Clicking a claim opens or focuses the detail panel section for that claim.
- Claim details show the claim text, a short explanation, evidence summary, work title when available, locator, excerpt status, and review status.
- The local thought system should be readable, optional, and dismissible. It should not permanently crowd the global universe.

The first implementation can support one selected philosopher at a time. It does not need to render every philosopher's thought system simultaneously.

### Philosopher Panel

The right-side desktop panel and mobile bottom sheet show:

- Chinese name, English name, native/original name.
- Birth and death display.
- Civilization, period, traditions, and schools.
- One-line positioning sentence.
- 150-250 character Chinese summary.
- Keywords.
- Representative works.
- Three to six core questions or thought problems.
- Expandable claims under each thought problem.
- Evidence, source notes, work locators, excerpt status, and review status for claims when available.
- Two to five selected argument summaries or public-domain excerpts.
- Typed relationships grouped by relation type.
- Actions: collect philosopher, collect argument, add note.

### Search Results

Search returns three kinds of result:

- `philosopher`: click to locate the star and open the philosopher panel.
- `argument`: display philosopher, question, claim, explanation, source, and review state.
- `theme`: display related philosophers and arguments.

Examples:

- Searching `柏拉图` locates Plato.
- Searching `正义` returns selected arguments from Plato, Aristotle, Confucius, Rawls, and others when available.
- Searching `人是否自由` maps to themes such as free will, determinism, responsibility, and subjectivity through aliases and keywords.

### Collections And Notes

Collections and notes live in the browser only for the first release.

Supported targets:

- Philosopher.
- Argument.
- Search question.
- Note.

The collection drawer groups content by `philosophers`, `arguments`, `questions`, and `notes`. Notes are bound to one target object. Import and export use JSON so users can preserve local data without a user account.

## Data Model

The first release uses static JSON files, but data access should be wrapped behind API-like functions so a backend can replace local files later.

### Philosopher

```ts
type Philosopher = {
  id: string
  names: {
    zh: string
    en: string
    native?: string
  }
  life: {
    birth?: number
    death?: number
    display: string
  }
  civilization: string
  traditions: string[]
  periods: string[]
  themes: string[]
  keywordsZh: string[]
  summaryZh: string
  oneLineZh: string
  works: string[]
  influenceWeight: 1 | 2 | 3
  reviewStatus: "draft" | "reviewed"
  sourceNotes: SourceNote[]
  thoughtSystem?: PhilosopherThoughtSystem
}

type PhilosopherThoughtSystem = {
  problems: ThoughtProblem[]
}

type ThoughtProblem = {
  id: string
  titleZh: string
  questionZh: string
  summaryZh: string
  themeIds: string[]
  weight: 1 | 2 | 3
  claims: ThoughtClaim[]
}

type ThoughtClaim = {
  id: string
  titleZh: string
  claimZh: string
  explanationZh: string
  themeIds: string[]
  weight: 1 | 2 | 3
  evidence: ThoughtEvidence[]
}

type ThoughtEvidence = {
  id: string
  titleZh: string
  summaryZh: string
  source: {
    workId?: string
    locator?: string
    excerptStatus: "none" | "public_domain" | "summary_only"
  }
}
```

Thought-system records are the source of the expandable concept satellites. They should be curated for density: enough to make each major philosopher legible, but not enough to turn the selected view into an encyclopedia page.

### Argument

```ts
type Argument = {
  id: string
  philosopherId: string
  themeIds: string[]
  questionZh: string
  claimZh: string
  explanationZh: string
  source: {
    workId?: string
    locator?: string
    publicDomainExcerptZh?: string
    excerptStatus: "none" | "public_domain" | "summary_only"
  }
  keywordsZh: string[]
  reviewStatus: "draft" | "reviewed"
}
```

### Relationship

The system should use `思想关系网络`, not `学术传承树`.

```ts
type Relationship = {
  id: string
  from: string
  to: string
  type:
    | "direct_student"
    | "influence"
    | "school"
    | "shared_problem"
    | "critique"
    | "reception"
  strength: 1 | 2 | 3
  confidence: "high" | "medium" | "low"
  themeIds: string[]
  noteZh: string
  reviewStatus: "draft" | "reviewed"
}
```

Relationship display rules:

- Default view shows high-confidence direct student, influence, and critique relationships.
- Optional filters reveal school, shared problem, and reception relationships.
- Weak associations should not visually pollute the map.
- Each relationship needs a relation type, strength, confidence, and explanatory note.

### Theme

```ts
type Theme = {
  id: string
  zh: string
  en: string
  aliasesZh: string[]
  parentId?: string
}
```

### Work

```ts
type Work = {
  id: string
  philosopherId: string
  titleZh: string
  titleEn?: string
  originalTitle?: string
  yearDisplay?: string
  noteZh: string
}
```

### Local Collection And Note

```ts
type LocalNote = {
  id: string
  targetType: "philosopher" | "argument" | "search"
  targetId: string
  body: string
  createdAt: string
  updatedAt: string
  userId: null
  syncStatus: "local_only"
}
```

## Data Files

The initial static data layout should be:

- `public/data/philosophers.index.json`
- `public/data/philosophers/{id}.json`
- `public/data/arguments.index.json`
- `public/data/relationships.json`
- `public/data/themes.json`
- `public/data/works.json`

The app should load indexes on first screen and load full philosopher details on demand. At 100 philosophers, this is mostly an architectural boundary rather than a hard performance requirement.

## Content And Review Workflow

The content workflow is AI-assisted but review-gated.

1. Define schema and validation scripts first.
2. Create 20 seed philosophers across civilizations and themes.
3. Use those seed entries to validate the star map, panels, search, notes, and relationship network.
4. Generate candidate data for about 100 philosophers with AI assistance.
5. Mark generated content as `draft`.
6. Review core fields manually: names, chronology, civilization, tradition, summary, themes, arguments, relationship notes, and source notes.
7. Promote reviewed records to `reviewed`.
8. Formal UI should prioritize reviewed content and mark draft content clearly if it is visible.

Content rules:

- Chinese summaries are preferred for the first release.
- English and native/original names are stored from the beginning.
- Public-domain excerpts may be included only when their status is clear.
- Modern translation excerpts should not be used unless licensing is clear.
- Argument records must say whether they are summaries or public-domain excerpts.

## Technical Architecture

Use:

- Vite.
- React.
- TypeScript.
- Three.js.
- `@react-three/fiber`.
- `@react-three/drei`.
- Zustand.
- Fuse.js or a small local search implementation.
- IndexedDB for local collection and notes.
- Vitest for domain tests.
- Playwright for interaction smoke tests.

Suggested source structure:

```text
src/
  data/
    client.ts
    schemas.ts
    loaders.ts
    search/
  domain/
    layout/
    relationships/
    collections/
  scene/
    StarField.tsx
    PhilosopherStars.tsx
    RelationshipLines.tsx
    CameraRig.tsx
  ui/
    AppShell.tsx
    TopHud.tsx
    SearchPanel.tsx
    PhilosopherPanel.tsx
    ArgumentPanel.tsx
    CollectionsDrawer.tsx
    SettingsPanel.tsx
    Onboarding.tsx
  styles/
  tests/
```

The `src/data` layer exposes API-shaped functions:

```ts
getPhilosopherIndex(): Promise<PhilosopherIndexEntry[]>
getPhilosopher(id: string): Promise<Philosopher>
getRelationships(): Promise<Relationship[]>
searchArguments(query: string): Promise<ArgumentSearchResult[]>
searchPhilosophers(query: string): Promise<PhilosopherSearchResult[]>
```

Future backend integration should replace only this layer when possible.

## Search Design

The first release should not implement vector search. It should implement structured lightweight search over curated data.

Search pipeline:

1. Normalize query.
2. Match theme aliases from `themes.aliasesZh`.
3. Match philosopher names and keywords.
4. Match argument fields: `questionZh`, `claimZh`, `explanationZh`, and `keywordsZh`.
5. Boost arguments whose theme ids match detected themes.
6. Prefer reviewed content.
7. Sort by theme match, direct question match, keyword match, then explanation match.

Provider interface:

```ts
type ArgumentSearchProvider = {
  search(query: string, options?: SearchOptions): Promise<ArgumentSearchResult[]>
}
```

The first implementation is `LocalKeywordArgumentSearchProvider`. A later implementation can be `RemoteVectorArgumentSearchProvider` without changing UI components.

## Star Map Layout

The first layout should be deterministic.

Inputs:

- Birth/death year when available.
- Period bucket when exact chronology is missing or disputed.
- Civilization.
- Traditions.
- Themes.
- Influence weight.
- Relationship count.
- Philosopher id seed.

Rules:

- Historical time defines the primary radius from the center. Older records sit nearer the center and newer records sit farther away.
- Period buckets smooth uncertainty: unknown dates should use `ancient`, `classical`, `medieval`, `early_modern`, `modern`, or `contemporary` style buckets rather than pretending to know exact years.
- Civilizations define large angular sectors.
- Traditions and schools define local clustering and color variants inside those sectors.
- Themes may add secondary local jitter or relationship emphasis, but should not override the chronology-plus-school grammar.
- Id seed adds stable jitter.
- Selected philosopher network receives emphasis while unrelated stars dim.
- The selected philosopher's thought-system satellites are laid out in a local orbit around that philosopher and do not affect global philosopher coordinates.

The layout does not need to be historically perfect in the first release, but it must be stable and explainable. Users should be able to understand that the center is older, the edge is newer, and same-color neighborhoods indicate related civilizations or schools.

## Performance And Compatibility

- First screen should load indexes and render without fetching every full profile.
- Low-performance settings should reduce bloom, label density, and relationship line count.
- If WebGL is unavailable, show a human-readable unsupported-browser message.
- Mobile should use touch rotation, pinch zoom, and bottom-sheet panels.
- Desktop should support drag rotate, wheel zoom, and click selection.

## Milestones

### M1 Project Skeleton

Create Vite, React, TypeScript, R3F, base styles, data folders, validation scaffolding, and static deployment scripts.

### M2 Data Model And 20 Seed Philosophers

Implement schemas and validation. Create 20 seed philosophers, selected arguments, themes, works, and relationships.

### M3 Star Map MVP

Render stars, civilization colors, labels, relationship lines, selection, camera controls, and philosopher detail panel.

### M4 Search And Argument Results

Support philosopher, theme, and argument search. Result clicks locate stars or open argument detail.

### M5 Collections And Notes

Implement local collections, notes, JSON export, and JSON import.

### M6 Visual Polish And Onboarding

Apply the poetic cosmos visual direction, add first-run onboarding, mobile bottom sheets, loading states, errors, and settings.

### M7 Expand To 100 Philosophers

Expand data, review records, refine relationships, complete theme coverage, and run final performance checks.

## Acceptance Criteria

- The app opens directly into a nonblank star map.
- About 100 philosophers render smoothly on desktop.
- A selected philosopher opens a complete detail panel.
- Search can find philosophers by Chinese, English, or native/original names when provided.
- At least 8 themes return useful argument results.
- Every refined philosopher has a summary, themes, keywords, and at least 2 arguments or claims.
- Relationship lines can be filtered by relation type.
- The UI does not present intellectual history as a single inheritance tree.
- The global star map communicates the approved hybrid grammar: chronology by radius, civilization/school by color and local cluster.
- Selecting a philosopher with thought-system data reveals expandable concept satellites.
- Expanding a concept can reveal claims, and claim details can display explanation plus source/evidence metadata.
- Collections and notes persist after refresh.
- Collections and notes can be exported and imported as JSON.
- Data validation catches missing ids, broken philosopher references, broken theme references, duplicate ids, and invalid review statuses.
- The project can build as a static site.

## Open Decisions Deferred Past First Release

- Whether to add account login and cloud sync.
- Whether to add a backend editorial workflow.
- Whether to add vector search or retrieval-augmented answers.
- Whether to support multilingual UI beyond stored multilingual fields.
- Whether to include long public-domain primary text passages.
