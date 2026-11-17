# 群星闪耀时 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first release of `群星闪耀时`: a static-first WebGL philosopher star map with curated philosopher data, typed intellectual relationships, lightweight topic search, and local collections/notes.

**Architecture:** Use a Vite React app with TypeScript. Keep data access behind API-shaped local client functions so static JSON can be replaced by remote APIs without rewriting UI. Keep domain logic pure and tested; isolate Three.js/R3F rendering in `src/scene`; keep UI panels in `src/ui`.

**Tech Stack:** Vite, React, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, Zustand, Zod, Fuse.js, idb, Vitest, Playwright.

---

## Scope Check

The approved spec is one coherent first-release app. It contains these coupled subsystems:

- Static data model and validation.
- WebGL star map.
- Philosopher and argument UI panels.
- Lightweight local search.
- Local-only collections and notes.
- Visual polish, onboarding, and static deployment.

This plan keeps them in one implementation stream because each subsystem is needed to validate the app experience. User accounts, cloud sync, vector search, editorial backend, and full philosopher coverage are outside this plan.

## File Structure

Create or modify these files.

```text
<repo>/
  package.json                         Project scripts and dependencies.
  index.html                           Vite HTML entry.
  tsconfig.json                        TypeScript project config.
  tsconfig.node.json                   TypeScript config for Vite/Vitest tooling.
  vite.config.ts                       Vite and Vitest config.
  playwright.config.ts                 Playwright smoke config.
  src/
    main.tsx                           React entry.
    App.tsx                            Top-level app composition.
    data/
      schemas.ts                       Zod schemas and exported TS types.
      client.ts                        API-shaped static JSON client.
      fixtures.ts                      Test fixture builders.
      search/
        argumentSearch.ts              Local keyword argument search provider.
        philosopherSearch.ts           Philosopher/theme search helpers.
    domain/
      layout/
        starLayout.ts                  Deterministic philosopher coordinate generation.
      relationships/
        relationshipFilters.ts         Relationship filtering and highlighting rules.
      collections/
        localCollections.ts            IndexedDB collections/notes repository.
    scene/
      StarScene.tsx                    R3F canvas scene wrapper.
      PhilosopherStars.tsx             Star rendering and click selection.
      RelationshipLines.tsx            Relationship line rendering.
      CameraRig.tsx                    Camera orbit/focus controls.
      webglSupport.ts                  WebGL availability detection.
    store/
      appStore.ts                      Zustand app state.
    ui/
      AppShell.tsx                     HUD, scene, panels, and drawers.
      TopHud.tsx                       Title, search, filters, settings trigger.
      SearchPanel.tsx                  Search input and grouped results.
      PhilosopherPanel.tsx             Philosopher details.
      ArgumentPanel.tsx                Argument details.
      CollectionsDrawer.tsx            Local saved items and notes.
      SettingsPanel.tsx                Quality and relationship visibility settings.
      Onboarding.tsx                   First-run onboarding.
      LoadingScreen.tsx                Loading and data error states.
    styles/
      theme.css                        Global visual system.
    test/
      setup.ts                         Vitest DOM setup.
  tests/
    smoke.spec.ts                      Playwright smoke test.
  tools/
    validate-data.mjs                  Static JSON integrity validation.
    seed-initial-data.mjs              Generates the 20-record seed dataset.
    roster-100.json                    First-release target roster.
  public/
    data/
      philosophers.index.json          Lightweight first-screen philosopher index.
      philosophers/*.json              Per-philosopher detail files.
      arguments.index.json             Argument search index.
      relationships.json               Typed relationship network.
      themes.json                      Theme dictionary and aliases.
      works.json                       Work dictionary.
```

## Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `playwright.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create package and source directories**

Run:

```bash
cd <repo>
mkdir -p src/test
```

Create `package.json`:

```json
{
  "name": "qunxing-shanyaoshi",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:smoke": "playwright test",
    "validate:data": "node tools/validate-data.mjs"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

- [ ] **Step 2: Install runtime and test dependencies**

Run:

```bash
cd <repo>
npm install react react-dom three @react-three/fiber @react-three/drei zustand zod fuse.js idb
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom playwright
```

Expected: `package-lock.json` is created and `package.json` contains the dependencies.

- [ ] **Step 3: Create HTML and TypeScript config**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#03040a" />
    <meta name="description" content="一张可漫游的三维哲人星图。" />
    <title>群星闪耀时</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 4: Configure Vite and Vitest**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1",
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

- [ ] **Step 6: Create the initial app shell**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Replace `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <main className="app" data-testid="app-root">
      <h1>群星闪耀时</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify the empty shell**

Run:

```bash
cd <repo>
npm run build
npm run test
```

Expected: both commands exit with code 0.

- [ ] **Step 8: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时
git commit -m "chore: scaffold qunxing shanyaoshi app"
```

Expected: commit succeeds and contains the Vite skeleton.

## Task 2: Data Schemas And Validation

**Files:**
- Create: `src/data/schemas.ts`
- Create: `src/data/fixtures.ts`
- Create: `src/data/schemas.test.ts`
- Create: `tools/validate-data.mjs`

- [ ] **Step 1: Write schema tests first**

Create `src/data/schemas.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  argumentSchema,
  philosopherSchema,
  relationshipSchema,
  themeSchema,
  workSchema,
} from "./schemas";
import {
  validArgument,
  validPhilosopher,
  validRelationship,
  validTheme,
  validWork,
} from "./fixtures";

describe("data schemas", () => {
  it("accepts valid philosopher records", () => {
    expect(philosopherSchema.parse(validPhilosopher).id).toBe("plato");
  });

  it("rejects invalid review statuses", () => {
    expect(() =>
      philosopherSchema.parse({ ...validPhilosopher, reviewStatus: "unchecked" }),
    ).toThrow();
  });

  it("accepts valid arguments, relationships, themes, and works", () => {
    expect(argumentSchema.parse(validArgument).id).toBe("plato-justice-soul-order");
    expect(relationshipSchema.parse(validRelationship).type).toBe("direct_student");
    expect(themeSchema.parse(validTheme).id).toBe("justice");
    expect(workSchema.parse(validWork).id).toBe("republic");
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/data/schemas.test.ts
```

Expected: FAIL because `src/data/schemas.ts` and `src/data/fixtures.ts` do not exist.

- [ ] **Step 3: Implement Zod schemas**

Create `src/data/schemas.ts`:

```ts
import { z } from "zod";

export const reviewStatusSchema = z.enum(["draft", "reviewed"]);
export const relationshipTypeSchema = z.enum([
  "direct_student",
  "influence",
  "school",
  "shared_problem",
  "critique",
  "reception",
]);

export const sourceNoteSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
  noteZh: z.string().min(1),
});

export const philosopherIndexEntrySchema = z.object({
  id: z.string().min(1),
  names: z.object({
    zh: z.string().min(1),
    en: z.string().min(1),
    native: z.string().min(1).optional(),
  }),
  life: z.object({
    birth: z.number().optional(),
    death: z.number().optional(),
    display: z.string().min(1),
  }),
  civilization: z.string().min(1),
  traditions: z.array(z.string().min(1)).min(1),
  periods: z.array(z.string().min(1)).min(1),
  themes: z.array(z.string().min(1)).min(1),
  keywordsZh: z.array(z.string().min(1)),
  oneLineZh: z.string().min(1),
  influenceWeight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reviewStatus: reviewStatusSchema,
});

export const philosopherSchema = philosopherIndexEntrySchema.extend({
  summaryZh: z.string().min(20),
  works: z.array(z.string().min(1)),
  sourceNotes: z.array(sourceNoteSchema),
});

export const argumentSchema = z.object({
  id: z.string().min(1),
  philosopherId: z.string().min(1),
  themeIds: z.array(z.string().min(1)).min(1),
  questionZh: z.string().min(1),
  claimZh: z.string().min(1),
  explanationZh: z.string().min(20),
  source: z.object({
    workId: z.string().min(1).optional(),
    locator: z.string().min(1).optional(),
    publicDomainExcerptZh: z.string().optional(),
    excerptStatus: z.enum(["none", "public_domain", "summary_only"]),
  }),
  keywordsZh: z.array(z.string().min(1)),
  reviewStatus: reviewStatusSchema,
});

export const relationshipSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: relationshipTypeSchema,
  strength: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  confidence: z.enum(["high", "medium", "low"]),
  themeIds: z.array(z.string().min(1)),
  noteZh: z.string().min(1),
  reviewStatus: reviewStatusSchema,
});

export const themeSchema = z.object({
  id: z.string().min(1),
  zh: z.string().min(1),
  en: z.string().min(1),
  aliasesZh: z.array(z.string().min(1)),
  parentId: z.string().min(1).optional(),
});

export const workSchema = z.object({
  id: z.string().min(1),
  philosopherId: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  originalTitle: z.string().min(1).optional(),
  yearDisplay: z.string().min(1).optional(),
  noteZh: z.string().min(1),
});

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type RelationshipType = z.infer<typeof relationshipTypeSchema>;
export type PhilosopherIndexEntry = z.infer<typeof philosopherIndexEntrySchema>;
export type Philosopher = z.infer<typeof philosopherSchema>;
export type Argument = z.infer<typeof argumentSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Work = z.infer<typeof workSchema>;
```

- [ ] **Step 4: Create test fixtures**

Create `src/data/fixtures.ts`:

```ts
import type { Argument, Philosopher, Relationship, Theme, Work } from "./schemas";

export const validTheme: Theme = {
  id: "justice",
  zh: "正义",
  en: "Justice",
  aliasesZh: ["公正", "公平", "义"],
};

export const validWork: Work = {
  id: "republic",
  philosopherId: "plato",
  titleZh: "理想国",
  titleEn: "Republic",
  originalTitle: "Πολιτεία",
  yearDisplay: "约公元前 375 年",
  noteZh: "政治哲学与理念论核心文本之一。",
};

export const validPhilosopher: Philosopher = {
  id: "plato",
  names: { zh: "柏拉图", en: "Plato", native: "Πλάτων" },
  life: { birth: -428, death: -348, display: "约公元前 428/427 - 前 348/347" },
  civilization: "ancient_greek",
  traditions: ["platonism", "ancient_greek_philosophy"],
  periods: ["classical_antiquity"],
  themes: ["justice", "forms", "knowledge", "soul"],
  keywordsZh: ["理念论", "正义", "灵魂", "城邦"],
  oneLineZh: "以理念论和《理想国》奠定西方形而上学与政治哲学的核心人物。",
  summaryZh: "柏拉图通过对话录保存并重构苏格拉底的问题意识，以理念论、灵魂论和城邦正义构成西方哲学长期讨论的基本框架。",
  works: ["republic"],
  influenceWeight: 3,
  reviewStatus: "reviewed",
  sourceNotes: [{ label: "Primary tradition", noteZh: "以柏拉图对话录传统为基础。" }],
};

export const validArgument: Argument = {
  id: "plato-justice-soul-order",
  philosopherId: "plato",
  themeIds: ["justice", "soul", "politics"],
  questionZh: "正义是什么？",
  claimZh: "正义不仅是外在制度安排，也是一种灵魂各部分各安其位的秩序。",
  explanationZh: "在《理想国》中，柏拉图把城邦结构与灵魂结构对应起来，认为正义表现为各部分履行自身职分，而非彼此争夺支配权。",
  source: { workId: "republic", locator: "Book IV", excerptStatus: "summary_only" },
  keywordsZh: ["正义", "灵魂秩序", "城邦"],
  reviewStatus: "reviewed",
};

export const validRelationship: Relationship = {
  id: "socrates-plato-direct",
  from: "socrates",
  to: "plato",
  type: "direct_student",
  strength: 3,
  confidence: "high",
  themeIds: ["ethics", "knowledge"],
  noteZh: "柏拉图通过对话录保存并重构苏格拉底的问题意识。",
  reviewStatus: "reviewed",
};
```

- [ ] **Step 5: Add data validation script**

Create `tools/validate-data.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "public", "data");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, getId, label) {
  const seen = new Set();
  for (const item of items) {
    const id = getId(item);
    assert(typeof id === "string" && id.length > 0, `${label} has missing id`);
    assert(!seen.has(id), `${label} has duplicate id: ${id}`);
    seen.add(id);
  }
  return seen;
}

const philosophersIndex = readJson(path.join(dataDir, "philosophers.index.json"));
const argumentsIndex = readJson(path.join(dataDir, "arguments.index.json"));
const relationships = readJson(path.join(dataDir, "relationships.json"));
const themes = readJson(path.join(dataDir, "themes.json"));
const works = readJson(path.join(dataDir, "works.json"));

const philosopherIds = assertUnique(philosophersIndex, (item) => item.id, "philosophers.index.json");
const argumentIds = assertUnique(argumentsIndex, (item) => item.id, "arguments.index.json");
const themeIds = assertUnique(themes, (item) => item.id, "themes.json");
const workIds = assertUnique(works, (item) => item.id, "works.json");

for (const philosopher of philosophersIndex) {
  const detailPath = path.join(dataDir, "philosophers", `${philosopher.id}.json`);
  assert(fs.existsSync(detailPath), `missing philosopher detail: ${philosopher.id}`);
  const detail = readJson(detailPath);
  assert(detail.id === philosopher.id, `detail id mismatch: ${philosopher.id}`);
  for (const theme of detail.themes) assert(themeIds.has(theme), `unknown theme ${theme} on ${detail.id}`);
  for (const work of detail.works) assert(workIds.has(work), `unknown work ${work} on ${detail.id}`);
  assert(["draft", "reviewed"].includes(detail.reviewStatus), `invalid reviewStatus on ${detail.id}`);
}

for (const argument of argumentsIndex) {
  assert(philosopherIds.has(argument.philosopherId), `argument ${argument.id} has unknown philosopher ${argument.philosopherId}`);
  for (const theme of argument.themeIds) assert(themeIds.has(theme), `argument ${argument.id} has unknown theme ${theme}`);
  if (argument.source?.workId) assert(workIds.has(argument.source.workId), `argument ${argument.id} has unknown work ${argument.source.workId}`);
  assert(["none", "public_domain", "summary_only"].includes(argument.source.excerptStatus), `argument ${argument.id} has invalid excerptStatus`);
  assert(["draft", "reviewed"].includes(argument.reviewStatus), `argument ${argument.id} has invalid reviewStatus`);
}

for (const relationship of relationships) {
  assert(philosopherIds.has(relationship.from), `relationship ${relationship.id} has unknown from ${relationship.from}`);
  assert(philosopherIds.has(relationship.to), `relationship ${relationship.id} has unknown to ${relationship.to}`);
  for (const theme of relationship.themeIds) assert(themeIds.has(theme), `relationship ${relationship.id} has unknown theme ${theme}`);
  assert(["direct_student", "influence", "school", "shared_problem", "critique", "reception"].includes(relationship.type), `relationship ${relationship.id} has invalid type`);
  assert([1, 2, 3].includes(relationship.strength), `relationship ${relationship.id} has invalid strength`);
  assert(["high", "medium", "low"].includes(relationship.confidence), `relationship ${relationship.id} has invalid confidence`);
  assert(["draft", "reviewed"].includes(relationship.reviewStatus), `relationship ${relationship.id} has invalid reviewStatus`);
}

console.log(`data ok: ${philosopherIds.size} philosophers, ${argumentIds.size} arguments, ${relationships.length} relationships, ${themeIds.size} themes`);
```

- [ ] **Step 6: Run schema tests**

Run:

```bash
cd <repo>
npm run test -- src/data/schemas.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src/data Desktop/群星闪耀时/tools/validate-data.mjs
git commit -m "feat: add data schemas and validation"
```

Expected: commit succeeds with schema and validation files.

## Task 3: Seed Data And 100-Person Roster

**Files:**
- Create: `tools/roster-100.json`
- Create: `tools/seed-initial-data.mjs`
- Create: `public/data/themes.json`
- Create: `public/data/works.json`
- Create: `public/data/relationships.json`
- Create: `public/data/arguments.index.json`
- Create: `public/data/philosophers.index.json`
- Create: `public/data/philosophers/*.json`

- [ ] **Step 1: Create the first-release roster file**

Create `tools/roster-100.json`:

```json
[
  {"id":"confucius","zh":"孔子","en":"Confucius","civilization":"chinese"},
  {"id":"laozi","zh":"老子","en":"Laozi","civilization":"chinese"},
  {"id":"zhuangzi","zh":"庄子","en":"Zhuangzi","civilization":"chinese"},
  {"id":"mozi","zh":"墨子","en":"Mozi","civilization":"chinese"},
  {"id":"mencius","zh":"孟子","en":"Mencius","civilization":"chinese"},
  {"id":"xunzi","zh":"荀子","en":"Xunzi","civilization":"chinese"},
  {"id":"wang-yangming","zh":"王阳明","en":"Wang Yangming","civilization":"chinese"},
  {"id":"zhu-xi","zh":"朱熹","en":"Zhu Xi","civilization":"chinese"},
  {"id":"hu-shi","zh":"胡适","en":"Hu Shih","civilization":"chinese"},
  {"id":"liang-shuming","zh":"梁漱溟","en":"Liang Shuming","civilization":"chinese"},
  {"id":"buddha","zh":"释迦牟尼","en":"Gautama Buddha","civilization":"indian"},
  {"id":"mahavira","zh":"摩诃毗罗","en":"Mahavira","civilization":"indian"},
  {"id":"nagarjuna","zh":"龙树","en":"Nagarjuna","civilization":"indian"},
  {"id":"vasubandhu","zh":"世亲","en":"Vasubandhu","civilization":"indian"},
  {"id":"adi-shankara","zh":"商羯罗","en":"Adi Shankara","civilization":"indian"},
  {"id":"ramanuja","zh":"罗摩奴阇","en":"Ramanuja","civilization":"indian"},
  {"id":"tagore","zh":"泰戈尔","en":"Rabindranath Tagore","civilization":"indian"},
  {"id":"gandhi","zh":"甘地","en":"M. K. Gandhi","civilization":"indian"},
  {"id":"ambedkar","zh":"安贝德卡尔","en":"B. R. Ambedkar","civilization":"indian"},
  {"id":"krishnamurti","zh":"克里希那穆提","en":"Jiddu Krishnamurti","civilization":"indian"},
  {"id":"thales","zh":"泰勒斯","en":"Thales","civilization":"ancient_greek"},
  {"id":"heraclitus","zh":"赫拉克利特","en":"Heraclitus","civilization":"ancient_greek"},
  {"id":"parmenides","zh":"巴门尼德","en":"Parmenides","civilization":"ancient_greek"},
  {"id":"socrates","zh":"苏格拉底","en":"Socrates","civilization":"ancient_greek"},
  {"id":"plato","zh":"柏拉图","en":"Plato","civilization":"ancient_greek"},
  {"id":"aristotle","zh":"亚里士多德","en":"Aristotle","civilization":"ancient_greek"},
  {"id":"epicurus","zh":"伊壁鸠鲁","en":"Epicurus","civilization":"ancient_greek"},
  {"id":"zeno-citium","zh":"芝诺","en":"Zeno of Citium","civilization":"ancient_greek"},
  {"id":"plotinus","zh":"普罗提诺","en":"Plotinus","civilization":"ancient_greek"},
  {"id":"hypatia","zh":"希帕提娅","en":"Hypatia","civilization":"ancient_greek"},
  {"id":"augustine","zh":"奥古斯丁","en":"Augustine of Hippo","civilization":"latin_christian"},
  {"id":"boethius","zh":"波爱修斯","en":"Boethius","civilization":"latin_christian"},
  {"id":"anselm","zh":"安瑟尔谟","en":"Anselm of Canterbury","civilization":"latin_christian"},
  {"id":"aquinas","zh":"托马斯·阿奎那","en":"Thomas Aquinas","civilization":"latin_christian"},
  {"id":"ockham","zh":"奥卡姆","en":"William of Ockham","civilization":"latin_christian"},
  {"id":"erasmus","zh":"伊拉斯谟","en":"Erasmus","civilization":"european_modern"},
  {"id":"machiavelli","zh":"马基雅维利","en":"Niccolo Machiavelli","civilization":"european_modern"},
  {"id":"montaigne","zh":"蒙田","en":"Michel de Montaigne","civilization":"european_modern"},
  {"id":"bacon","zh":"弗朗西斯·培根","en":"Francis Bacon","civilization":"european_modern"},
  {"id":"hobbes","zh":"霍布斯","en":"Thomas Hobbes","civilization":"european_modern"},
  {"id":"descartes","zh":"笛卡尔","en":"Rene Descartes","civilization":"european_modern"},
  {"id":"spinoza","zh":"斯宾诺莎","en":"Baruch Spinoza","civilization":"european_modern"},
  {"id":"locke","zh":"洛克","en":"John Locke","civilization":"european_modern"},
  {"id":"leibniz","zh":"莱布尼茨","en":"G. W. Leibniz","civilization":"european_modern"},
  {"id":"hume","zh":"休谟","en":"David Hume","civilization":"european_modern"},
  {"id":"rousseau","zh":"卢梭","en":"Jean-Jacques Rousseau","civilization":"european_modern"},
  {"id":"kant","zh":"康德","en":"Immanuel Kant","civilization":"european_modern"},
  {"id":"hegel","zh":"黑格尔","en":"G. W. F. Hegel","civilization":"european_modern"},
  {"id":"schopenhauer","zh":"叔本华","en":"Arthur Schopenhauer","civilization":"european_modern"},
  {"id":"kierkegaard","zh":"克尔凯郭尔","en":"Soren Kierkegaard","civilization":"european_modern"},
  {"id":"mill","zh":"约翰·密尔","en":"John Stuart Mill","civilization":"european_modern"},
  {"id":"marx","zh":"马克思","en":"Karl Marx","civilization":"european_modern"},
  {"id":"nietzsche","zh":"尼采","en":"Friedrich Nietzsche","civilization":"european_modern"},
  {"id":"frege","zh":"弗雷格","en":"Gottlob Frege","civilization":"european_modern"},
  {"id":"husserl","zh":"胡塞尔","en":"Edmund Husserl","civilization":"european_modern"},
  {"id":"bergson","zh":"柏格森","en":"Henri Bergson","civilization":"european_modern"},
  {"id":"dewey","zh":"杜威","en":"John Dewey","civilization":"american"},
  {"id":"wittgenstein","zh":"维特根斯坦","en":"Ludwig Wittgenstein","civilization":"european_modern"},
  {"id":"heidegger","zh":"海德格尔","en":"Martin Heidegger","civilization":"european_modern"},
  {"id":"russell","zh":"罗素","en":"Bertrand Russell","civilization":"european_modern"},
  {"id":"whitehead","zh":"怀特海","en":"Alfred North Whitehead","civilization":"european_modern"},
  {"id":"carnap","zh":"卡尔纳普","en":"Rudolf Carnap","civilization":"european_modern"},
  {"id":"arendt","zh":"阿伦特","en":"Hannah Arendt","civilization":"european_modern"},
  {"id":"sartre","zh":"萨特","en":"Jean-Paul Sartre","civilization":"european_modern"},
  {"id":"beauvoir","zh":"波伏娃","en":"Simone de Beauvoir","civilization":"european_modern"},
  {"id":"merleau-ponty","zh":"梅洛-庞蒂","en":"Maurice Merleau-Ponty","civilization":"european_modern"},
  {"id":"camus","zh":"加缪","en":"Albert Camus","civilization":"european_modern"},
  {"id":"quine","zh":"蒯因","en":"W. V. O. Quine","civilization":"american"},
  {"id":"rawls","zh":"罗尔斯","en":"John Rawls","civilization":"american"},
  {"id":"nozick","zh":"诺齐克","en":"Robert Nozick","civilization":"american"},
  {"id":"foucault","zh":"福柯","en":"Michel Foucault","civilization":"european_modern"},
  {"id":"derrida","zh":"德里达","en":"Jacques Derrida","civilization":"european_modern"},
  {"id":"habermas","zh":"哈贝马斯","en":"Jurgen Habermas","civilization":"european_modern"},
  {"id":"singer","zh":"彼得·辛格","en":"Peter Singer","civilization":"global_modern"},
  {"id":"nussbaum","zh":"努斯鲍姆","en":"Martha Nussbaum","civilization":"global_modern"},
  {"id":"al-farabi","zh":"法拉比","en":"Al-Farabi","civilization":"islamic"},
  {"id":"ibn-sina","zh":"伊本·西那","en":"Ibn Sina","civilization":"islamic"},
  {"id":"al-ghazali","zh":"安萨里","en":"Al-Ghazali","civilization":"islamic"},
  {"id":"ibn-rushd","zh":"伊本·鲁世德","en":"Ibn Rushd","civilization":"islamic"},
  {"id":"mulla-sadra","zh":"穆拉·萨德拉","en":"Mulla Sadra","civilization":"islamic"},
  {"id":"saadia-gaon","zh":"萨阿迪亚·高昂","en":"Saadia Gaon","civilization":"jewish"},
  {"id":"maimonides","zh":"迈蒙尼德","en":"Maimonides","civilization":"jewish"},
  {"id":"buber","zh":"布伯","en":"Martin Buber","civilization":"jewish"},
  {"id":"levinas","zh":"列维纳斯","en":"Emmanuel Levinas","civilization":"jewish"},
  {"id":"dogen","zh":"道元","en":"Dogen","civilization":"japanese"},
  {"id":"nishida","zh":"西田几多郎","en":"Nishida Kitaro","civilization":"japanese"},
  {"id":"watsuji","zh":"和辻哲郎","en":"Watsuji Tetsuro","civilization":"japanese"},
  {"id":"toegye","zh":"退溪李滉","en":"Yi Hwang","civilization":"korean"},
  {"id":"yulgok","zh":"栗谷李珥","en":"Yi I","civilization":"korean"},
  {"id":"ibn-khaldun","zh":"伊本·赫勒敦","en":"Ibn Khaldun","civilization":"islamic"},
  {"id":"amo","zh":"安东·威廉·阿莫","en":"Anton Wilhelm Amo","civilization":"african"},
  {"id":"senghor","zh":"桑戈尔","en":"Leopold Sedar Senghor","civilization":"african"},
  {"id":"hountondji","zh":"洪通吉","en":"Paulin Hountondji","civilization":"african"},
  {"id":"dussel","zh":"杜塞尔","en":"Enrique Dussel","civilization":"latin_american"},
  {"id":"zelea","zh":"塞亚","en":"Leopoldo Zea","civilization":"latin_american"},
  {"id":"sor-juana","zh":"胡安娜修女","en":"Sor Juana Ines de la Cruz","civilization":"latin_american"},
  {"id":"plumwood","zh":"普拉姆伍德","en":"Val Plumwood","civilization":"global_modern"},
  {"id":"butler","zh":"巴特勒","en":"Judith Butler","civilization":"global_modern"},
  {"id":"hooks","zh":"贝尔·胡克斯","en":"bell hooks","civilization":"global_modern"}
]
```

- [ ] **Step 2: Create the deterministic seed script**

Create `tools/seed-initial-data.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "public", "data");
const philosophersDir = path.join(dataDir, "philosophers");
fs.mkdirSync(philosophersDir, { recursive: true });

const themes = [
  { id: "justice", zh: "正义", en: "Justice", aliasesZh: ["公正", "公平", "义"] },
  { id: "ethics", zh: "伦理", en: "Ethics", aliasesZh: ["德性", "道德", "善"] },
  { id: "knowledge", zh: "知识", en: "Knowledge", aliasesZh: ["认识", "真理", "经验"] },
  { id: "politics", zh: "政治", en: "Politics", aliasesZh: ["城邦", "国家", "权力"] },
  { id: "metaphysics", zh: "形而上学", en: "Metaphysics", aliasesZh: ["存在", "实体", "本体"] },
  { id: "language", zh: "语言", en: "Language", aliasesZh: ["意义", "命名", "表达"] },
  { id: "freedom", zh: "自由", en: "Freedom", aliasesZh: ["自由意志", "责任", "主体性"] },
  { id: "life_death", zh: "生死", en: "Life and Death", aliasesZh: ["死亡", "人生", "痛苦"] },
  { id: "religion", zh: "宗教", en: "Religion", aliasesZh: ["信仰", "神", "解脱"] },
  { id: "aesthetics", zh: "审美", en: "Aesthetics", aliasesZh: ["艺术", "美", "诗"] }
];

const philosophers = [
  ["confucius", "孔子", "Confucius", "chinese", ["confucianism"], ["ethics", "politics", "justice"], "以仁、礼和君子修养奠定儒家伦理政治传统。"],
  ["laozi", "老子", "Laozi", "chinese", ["daoism"], ["metaphysics", "politics", "life_death"], "以道、无为和反强制秩序开辟道家思想。"],
  ["zhuangzi", "庄子", "Zhuangzi", "chinese", ["daoism"], ["freedom", "language", "life_death"], "以逍遥、齐物和语言怀疑展开自由哲学。"],
  ["mozi", "墨子", "Mozi", "chinese", ["mohism"], ["justice", "ethics", "politics"], "以兼爱、非攻和功利衡量挑战礼乐等级秩序。"],
  ["mencius", "孟子", "Mencius", "chinese", ["confucianism"], ["ethics", "politics"], "以性善、仁政和恻隐之心发展儒家道德心理学。"],
  ["xunzi", "荀子", "Xunzi", "chinese", ["confucianism"], ["ethics", "politics", "knowledge"], "以性恶、礼法和学习工夫重塑儒家秩序论。"],
  ["buddha", "释迦牟尼", "Gautama Buddha", "indian", ["buddhism"], ["life_death", "religion", "ethics"], "以四圣谛、缘起和解脱道路奠定佛教思想。"],
  ["nagarjuna", "龙树", "Nagarjuna", "indian", ["madhyamaka"], ["metaphysics", "language", "religion"], "以空性和中道批判实体化理解。"],
  ["adi-shankara", "商羯罗", "Adi Shankara", "indian", ["advaita_vedanta"], ["metaphysics", "religion", "knowledge"], "以不二论阐释梵我关系和解脱知识。"],
  ["socrates", "苏格拉底", "Socrates", "ancient_greek", ["socratic"], ["ethics", "knowledge"], "以问答法把哲学转向德性、无知和自我审查。"],
  ["plato", "柏拉图", "Plato", "ancient_greek", ["platonism"], ["justice", "knowledge", "metaphysics"], "以理念论和《理想国》构成西方哲学核心源头之一。"],
  ["aristotle", "亚里士多德", "Aristotle", "ancient_greek", ["peripatetic"], ["ethics", "metaphysics", "politics"], "以实体、目的因和德性伦理建立系统哲学框架。"],
  ["epicurus", "伊壁鸠鲁", "Epicurus", "ancient_greek", ["epicureanism"], ["ethics", "life_death"], "以快乐、宁静和死亡无感论回应人生恐惧。"],
  ["zeno-citium", "芝诺", "Zeno of Citium", "ancient_greek", ["stoicism"], ["ethics", "freedom"], "以顺应自然和内在自由开创斯多葛传统。"],
  ["al-farabi", "法拉比", "Al-Farabi", "islamic", ["islamic_peripatetic"], ["politics", "metaphysics"], "把希腊哲学与伊斯兰思想结合，讨论理想城邦和第一存在者。"],
  ["ibn-sina", "伊本·西那", "Ibn Sina", "islamic", ["islamic_peripatetic"], ["metaphysics", "knowledge"], "以本质与存在区分影响中世纪形而上学。"],
  ["aquinas", "托马斯·阿奎那", "Thomas Aquinas", "latin_christian", ["scholasticism"], ["religion", "metaphysics", "ethics"], "以亚里士多德哲学重构基督教神学理性。"],
  ["descartes", "笛卡尔", "Rene Descartes", "european_modern", ["rationalism"], ["knowledge", "metaphysics"], "以方法怀疑和我思命题开启近代主体哲学。"],
  ["hume", "休谟", "David Hume", "european_modern", ["empiricism"], ["knowledge", "ethics"], "以经验主义和因果怀疑挑战理性主义自信。"],
  ["kant", "康德", "Immanuel Kant", "european_modern", ["critical_philosophy"], ["knowledge", "ethics", "freedom"], "以批判哲学重设知识、自由和道德法则的边界。"]
];

const works = philosophers.map(([id, zh, en]) => ({
  id: `${id}-primary-work`,
  philosopherId: id,
  titleZh: `${zh}代表文本`,
  titleEn: `${en} primary text`,
  noteZh: "第一版用于展示的种子文本，审核时替换为具体作品。",
}));

const philosopherIndex = philosophers.map(([id, zh, en, civilization, traditions, themeIds, oneLineZh]) => ({
  id,
  names: { zh, en },
  life: { display: "年代信息待审核" },
  civilization,
  traditions,
  periods: ["first_release_seed"],
  themes: themeIds,
  keywordsZh: themeIds.map((themeId) => themes.find((theme) => theme.id === themeId)?.zh || themeId),
  oneLineZh,
  influenceWeight: id === "plato" || id === "aristotle" || id === "confucius" || id === "kant" ? 3 : 2,
  reviewStatus: "draft",
}));

const details = philosopherIndex.map((entry) => ({
  ...entry,
  summaryZh: `${entry.oneLineZh} 第一版先保留经过人工审核前的摘要骨架，用于验证星图、检索、关系和札记流程。`,
  works: [`${entry.id}-primary-work`],
  sourceNotes: [{ label: "seed", noteZh: "种子数据用于产品验证，进入正式内容前需要人工审核。" }],
}));

const argumentsIndex = philosopherIndex.flatMap((entry) =>
  entry.themes.slice(0, 2).map((themeId, index) => {
    const theme = themes.find((item) => item.id === themeId);
    return {
      id: `${entry.id}-${themeId}-${index + 1}`,
      philosopherId: entry.id,
      themeIds: [themeId],
      questionZh: `${theme?.zh || themeId}意味着什么？`,
      claimZh: `${entry.names.zh}围绕${theme?.zh || themeId}提出了可供第一版检索的核心观点。`,
      explanationZh: `${entry.names.zh}的这条论述先作为结构化摘要骨架，用来验证命题检索、详情面板和收藏札记流程；审核阶段需要替换为准确表述。`,
      source: { workId: `${entry.id}-primary-work`, excerptStatus: "summary_only" },
      keywordsZh: [theme?.zh || themeId, entry.names.zh],
      reviewStatus: "draft",
    };
  })
);

const relationships = [
  ["socrates", "plato", "direct_student", "柏拉图通过对话录保存并重构苏格拉底的问题意识。"],
  ["plato", "aristotle", "direct_student", "亚里士多德曾在柏拉图学园学习，并在形而上学和政治哲学上形成回应。"],
  ["confucius", "mencius", "reception", "孟子继承并发展孔子关于仁与政治正当性的讨论。"],
  ["confucius", "xunzi", "reception", "荀子在儒家框架中以礼法和学习工夫改写人性论。"],
  ["laozi", "zhuangzi", "school", "庄子发展道家关于道、无为和自由的思想方向。"],
  ["plato", "plotinus", "reception", "新柏拉图主义吸收并转化柏拉图形而上学。"],
  ["aristotle", "aquinas", "reception", "阿奎那借亚里士多德哲学重构经院哲学体系。"],
  ["hume", "kant", "influence", "康德承认休谟的因果怀疑促使他重审知识条件。"],
  ["nagarjuna", "adi-shankara", "shared_problem", "二者围绕终极实在、语言和解脱形成可对照的问题域。"],
  ["ibn-sina", "aquinas", "influence", "伊本·西那关于存在与本质的讨论影响拉丁中世纪形而上学。"]
].filter(([from, to]) => philosopherIndex.some((item) => item.id === from) && philosopherIndex.some((item) => item.id === to))
  .map(([from, to, type, noteZh], index) => ({
    id: `${from}-${to}-${type}`,
    from,
    to,
    type,
    strength: index < 2 ? 3 : 2,
    confidence: index < 8 ? "high" : "medium",
    themeIds: ["knowledge"],
    noteZh,
    reviewStatus: "draft",
  }));

fs.writeFileSync(path.join(dataDir, "themes.json"), JSON.stringify(themes, null, 2));
fs.writeFileSync(path.join(dataDir, "works.json"), JSON.stringify(works, null, 2));
fs.writeFileSync(path.join(dataDir, "arguments.index.json"), JSON.stringify(argumentsIndex, null, 2));
fs.writeFileSync(path.join(dataDir, "relationships.json"), JSON.stringify(relationships, null, 2));
fs.writeFileSync(path.join(dataDir, "philosophers.index.json"), JSON.stringify(philosopherIndex, null, 2));
for (const detail of details) {
  fs.writeFileSync(path.join(philosophersDir, `${detail.id}.json`), JSON.stringify(detail, null, 2));
}

console.log(`seeded ${philosopherIndex.length} philosophers`);
```

- [ ] **Step 3: Generate seed data and validate it**

Run:

```bash
cd <repo>
node tools/seed-initial-data.mjs
npm run validate:data
```

Expected: `seeded 20 philosophers` and `data ok: 20 philosophers`.

- [ ] **Step 4: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/tools/roster-100.json Desktop/群星闪耀时/tools/seed-initial-data.mjs Desktop/群星闪耀时/public/data
git commit -m "feat: add seed philosopher data"
```

Expected: commit succeeds with generated seed data.

## Task 4: Static Data Client And Search

**Files:**
- Create: `src/data/client.ts`
- Create: `src/data/client.test.ts`
- Create: `src/data/search/argumentSearch.ts`
- Create: `src/data/search/philosopherSearch.ts`
- Create: `src/data/search/search.test.ts`

- [ ] **Step 1: Write data client tests**

Create `src/data/client.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArgumentIndex, getPhilosopher, getPhilosopherIndex, getRelationships, getThemes, getWorks } from "./client";

const fixtures: Record<string, unknown> = {
  "/data/philosophers.index.json": [{ id: "plato", names: { zh: "柏拉图", en: "Plato" }, life: { display: "x" }, civilization: "ancient_greek", traditions: ["platonism"], periods: ["seed"], themes: ["justice"], keywordsZh: ["正义"], oneLineZh: "x", influenceWeight: 3, reviewStatus: "reviewed" }],
  "/data/philosophers/plato.json": { id: "plato", names: { zh: "柏拉图", en: "Plato" }, life: { display: "x" }, civilization: "ancient_greek", traditions: ["platonism"], periods: ["seed"], themes: ["justice"], keywordsZh: ["正义"], oneLineZh: "x", summaryZh: "柏拉图的测试摘要需要超过二十个中文字符以通过结构校验。", works: [], influenceWeight: 3, reviewStatus: "reviewed", sourceNotes: [] },
  "/data/arguments.index.json": [],
  "/data/relationships.json": [],
  "/data/themes.json": [{ id: "justice", zh: "正义", en: "Justice", aliasesZh: ["公平"] }],
  "/data/works.json": []
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({
    ok: true,
    json: async () => fixtures[url],
  })));
});

describe("static data client", () => {
  it("loads all public data endpoints", async () => {
    await expect(getPhilosopherIndex()).resolves.toHaveLength(1);
    await expect(getPhilosopher("plato")).resolves.toMatchObject({ id: "plato" });
    await expect(getArgumentIndex()).resolves.toEqual([]);
    await expect(getRelationships()).resolves.toEqual([]);
    await expect(getThemes()).resolves.toHaveLength(1);
    await expect(getWorks()).resolves.toEqual([]);
  });
});
```

- [ ] **Step 2: Run data client test and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/data/client.test.ts
```

Expected: FAIL because `src/data/client.ts` does not exist.

- [ ] **Step 3: Implement data client**

Create `src/data/client.ts`:

```ts
import {
  argumentSchema,
  philosopherIndexEntrySchema,
  philosopherSchema,
  relationshipSchema,
  themeSchema,
  workSchema,
  type Argument,
  type Philosopher,
  type PhilosopherIndexEntry,
  type Relationship,
  type Theme,
  type Work,
} from "./schemas";

async function loadJson<T>(url: string, parse: (value: unknown) => T): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  return parse(await response.json());
}

export function getPhilosopherIndex(): Promise<PhilosopherIndexEntry[]> {
  return loadJson("/data/philosophers.index.json", (value) => philosopherIndexEntrySchema.array().parse(value));
}

export function getPhilosopher(id: string): Promise<Philosopher> {
  return loadJson(`/data/philosophers/${id}.json`, (value) => philosopherSchema.parse(value));
}

export function getArgumentIndex(): Promise<Argument[]> {
  return loadJson("/data/arguments.index.json", (value) => argumentSchema.array().parse(value));
}

export function getRelationships(): Promise<Relationship[]> {
  return loadJson("/data/relationships.json", (value) => relationshipSchema.array().parse(value));
}

export function getThemes(): Promise<Theme[]> {
  return loadJson("/data/themes.json", (value) => themeSchema.array().parse(value));
}

export function getWorks(): Promise<Work[]> {
  return loadJson("/data/works.json", (value) => workSchema.array().parse(value));
}
```

- [ ] **Step 4: Write search tests**

Create `src/data/search/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { searchArgumentsLocal } from "./argumentSearch";
import { searchPhilosophersLocal } from "./philosopherSearch";
import { validArgument, validPhilosopher, validTheme } from "../fixtures";

describe("local search", () => {
  it("finds arguments through theme aliases", () => {
    const results = searchArgumentsLocal("公平是什么", [validArgument], [validTheme]);
    expect(results[0].item.id).toBe("plato-justice-soul-order");
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("finds philosophers by Chinese and English names", () => {
    expect(searchPhilosophersLocal("柏拉图", [validPhilosopher])[0].item.id).toBe("plato");
    expect(searchPhilosophersLocal("Plato", [validPhilosopher])[0].item.id).toBe("plato");
  });
});
```

- [ ] **Step 5: Run search tests and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/data/search/search.test.ts
```

Expected: FAIL because search modules do not exist.

- [ ] **Step 6: Implement local argument search**

Create `src/data/search/argumentSearch.ts`:

```ts
import type { Argument, Theme } from "../schemas";

export type ArgumentSearchResult = {
  item: Argument;
  score: number;
  matchedThemeIds: string[];
};

function normalize(input: string) {
  return input.trim().toLocaleLowerCase();
}

export function searchArgumentsLocal(query: string, argumentsIndex: Argument[], themes: Theme[]): ArgumentSearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const matchedThemeIds = themes
    .filter((theme) => [theme.zh, theme.en, ...theme.aliasesZh].some((term) => normalize(term).includes(q) || q.includes(normalize(term))))
    .map((theme) => theme.id);

  return argumentsIndex
    .map((item) => {
      let score = 0;
      const fields = [item.questionZh, item.claimZh, item.explanationZh, ...item.keywordsZh].map(normalize);
      if (fields.some((field) => field.includes(q))) score += 4;
      const themeMatches = item.themeIds.filter((themeId) => matchedThemeIds.includes(themeId));
      score += themeMatches.length * 6;
      if (item.reviewStatus === "reviewed") score += 1;
      return { item, score, matchedThemeIds: themeMatches };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 7: Implement local philosopher search**

Create `src/data/search/philosopherSearch.ts`:

```ts
import type { PhilosopherIndexEntry } from "../schemas";

export type PhilosopherSearchResult = {
  item: PhilosopherIndexEntry;
  score: number;
};

function normalize(input: string) {
  return input.trim().toLocaleLowerCase();
}

export function searchPhilosophersLocal(query: string, philosophers: PhilosopherIndexEntry[]): PhilosopherSearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  return philosophers
    .map((item) => {
      let score = 0;
      const names = [item.names.zh, item.names.en, item.names.native ?? ""].map(normalize);
      if (names.some((name) => name.includes(q))) score += 10;
      if (item.keywordsZh.some((keyword) => normalize(keyword).includes(q) || q.includes(normalize(keyword)))) score += 3;
      if (item.themes.some((theme) => normalize(theme).includes(q))) score += 2;
      if (item.reviewStatus === "reviewed") score += 1;
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 8: Verify client and search**

Run:

```bash
cd <repo>
npm run test -- src/data/client.test.ts src/data/search/search.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src/data
git commit -m "feat: add static data client and local search"
```

Expected: commit succeeds with data client and search modules.

## Task 5: Layout And Relationship Domain Logic

**Files:**
- Create: `src/domain/layout/starLayout.ts`
- Create: `src/domain/layout/starLayout.test.ts`
- Create: `src/domain/relationships/relationshipFilters.ts`
- Create: `src/domain/relationships/relationshipFilters.test.ts`

- [ ] **Step 1: Write layout tests**

Create `src/domain/layout/starLayout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { computeStarLayout } from "./starLayout";
import { validPhilosopher } from "../../data/fixtures";

describe("computeStarLayout", () => {
  it("returns stable coordinates for the same philosopher ids", () => {
    const first = computeStarLayout([validPhilosopher], []);
    const second = computeStarLayout([validPhilosopher], []);
    expect(first[0].position).toEqual(second[0].position);
  });

  it("uses relationship count to increase visual size", () => {
    const result = computeStarLayout([validPhilosopher], [{ from: "plato", to: "x" }, { from: "y", to: "plato" }]);
    expect(result[0].radius).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run layout test and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/domain/layout/starLayout.test.ts
```

Expected: FAIL because `starLayout.ts` does not exist.

- [ ] **Step 3: Implement deterministic layout**

Create `src/domain/layout/starLayout.ts`:

```ts
import type { PhilosopherIndexEntry } from "../../data/schemas";

type RelationshipLike = { from: string; to: string };

export type StarLayoutNode = {
  id: string;
  position: [number, number, number];
  colorKey: string;
  radius: number;
};

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function relationshipCount(id: string, relationships: RelationshipLike[]) {
  return relationships.filter((relationship) => relationship.from === id || relationship.to === id).length;
}

export function computeStarLayout(philosophers: PhilosopherIndexEntry[], relationships: RelationshipLike[]): StarLayoutNode[] {
  const civilizations = [...new Set(philosophers.map((item) => item.civilization))].sort();
  const angleByCivilization = new Map(civilizations.map((civilization, index) => [civilization, (Math.PI * 2 * index) / Math.max(civilizations.length, 1)]));

  return philosophers.map((philosopher) => {
    const seed = hash(philosopher.id);
    const baseAngle = angleByCivilization.get(philosopher.civilization) ?? 0;
    const jitter = ((seed % 1000) / 1000 - 0.5) * 0.9;
    const distance = 8 + (seed % 500) / 100 + philosopher.influenceWeight * 0.8;
    const y = ((Math.floor(seed / 1000) % 800) / 800 - 0.5) * 5;
    const count = relationshipCount(philosopher.id, relationships);
    return {
      id: philosopher.id,
      position: [
        Number((Math.cos(baseAngle + jitter) * distance).toFixed(4)),
        Number(y.toFixed(4)),
        Number((Math.sin(baseAngle + jitter) * distance).toFixed(4)),
      ],
      colorKey: philosopher.civilization,
      radius: Number((0.12 + philosopher.influenceWeight * 0.05 + Math.min(count, 8) * 0.015).toFixed(4)),
    };
  });
}
```

- [ ] **Step 4: Write relationship filter tests**

Create `src/domain/relationships/relationshipFilters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getDefaultVisibleRelationships, getFocusedRelationshipIds } from "./relationshipFilters";
import { validRelationship } from "../../data/fixtures";

describe("relationship filters", () => {
  it("keeps high-confidence direct relationships in default view", () => {
    expect(getDefaultVisibleRelationships([validRelationship])).toHaveLength(1);
  });

  it("finds relationships connected to selected philosopher", () => {
    expect(getFocusedRelationshipIds("plato", [validRelationship])).toEqual(["socrates-plato-direct"]);
  });
});
```

- [ ] **Step 5: Run relationship test and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/domain/relationships/relationshipFilters.test.ts
```

Expected: FAIL because `relationshipFilters.ts` does not exist.

- [ ] **Step 6: Implement relationship filters**

Create `src/domain/relationships/relationshipFilters.ts`:

```ts
import type { Relationship } from "../../data/schemas";

const defaultTypes = new Set(["direct_student", "influence", "critique"]);

export function getDefaultVisibleRelationships(relationships: Relationship[]) {
  return relationships.filter(
    (relationship) =>
      relationship.confidence === "high" &&
      relationship.strength >= 2 &&
      defaultTypes.has(relationship.type),
  );
}

export function getFocusedRelationshipIds(philosopherId: string, relationships: Relationship[]) {
  return relationships
    .filter((relationship) => relationship.from === philosopherId || relationship.to === philosopherId)
    .map((relationship) => relationship.id);
}
```

- [ ] **Step 7: Verify domain logic**

Run:

```bash
cd <repo>
npm run test -- src/domain/layout/starLayout.test.ts src/domain/relationships/relationshipFilters.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src/domain
git commit -m "feat: add star layout and relationship logic"
```

Expected: commit succeeds.

## Task 6: Local Collections And Notes

**Files:**
- Create: `src/domain/collections/localCollections.ts`
- Create: `src/domain/collections/localCollections.test.ts`

- [ ] **Step 1: Write collection repository tests**

Create `src/domain/collections/localCollections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMemoryCollectionsRepository } from "./localCollections";

describe("local collections repository", () => {
  it("saves, lists, exports, and imports notes", async () => {
    const repo = createMemoryCollectionsRepository();
    await repo.saveNote({ targetType: "philosopher", targetId: "plato", body: "读《理想国》时重看正义问题。" });
    const notes = await repo.listNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].syncStatus).toBe("local_only");

    const exported = await repo.exportJson();
    const nextRepo = createMemoryCollectionsRepository();
    await nextRepo.importJson(exported);
    expect(await nextRepo.listNotes()).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run collection tests and verify failure**

Run:

```bash
cd <repo>
npm run test -- src/domain/collections/localCollections.test.ts
```

Expected: FAIL because `localCollections.ts` does not exist.

- [ ] **Step 3: Implement memory repository and shared types**

Create `src/domain/collections/localCollections.ts`:

```ts
export type NoteTargetType = "philosopher" | "argument" | "search";

export type LocalNote = {
  id: string;
  targetType: NoteTargetType;
  targetId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  userId: null;
  syncStatus: "local_only";
};

export type SaveNoteInput = {
  targetType: NoteTargetType;
  targetId: string;
  body: string;
};

export type CollectionsRepository = {
  saveNote(input: SaveNoteInput): Promise<LocalNote>;
  listNotes(): Promise<LocalNote[]>;
  exportJson(): Promise<string>;
  importJson(serialized: string): Promise<void>;
};

function createNote(input: SaveNoteInput): LocalNote {
  const now = new Date().toISOString();
  return {
    id: `local-note-${crypto.randomUUID()}`,
    targetType: input.targetType,
    targetId: input.targetId,
    body: input.body,
    createdAt: now,
    updatedAt: now,
    userId: null,
    syncStatus: "local_only",
  };
}

export function createMemoryCollectionsRepository(): CollectionsRepository {
  let notes: LocalNote[] = [];
  return {
    async saveNote(input) {
      const note = createNote(input);
      notes = [note, ...notes];
      return note;
    },
    async listNotes() {
      return notes;
    },
    async exportJson() {
      return JSON.stringify({ version: 1, notes }, null, 2);
    },
    async importJson(serialized) {
      const parsed = JSON.parse(serialized) as { notes?: LocalNote[] };
      notes = Array.isArray(parsed.notes) ? parsed.notes : [];
    },
  };
}
```

- [ ] **Step 4: Add IndexedDB repository**

Append this code to `src/domain/collections/localCollections.ts`:

```ts
import { openDB } from "idb";

const dbName = "qunxing-shanyaoshi";
const notesStore = "notes";

async function getDb() {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(notesStore)) {
        db.createObjectStore(notesStore, { keyPath: "id" });
      }
    },
  });
}

export function createIndexedDbCollectionsRepository(): CollectionsRepository {
  return {
    async saveNote(input) {
      const note = createNote(input);
      const db = await getDb();
      await db.put(notesStore, note);
      return note;
    },
    async listNotes() {
      const db = await getDb();
      return (await db.getAll(notesStore)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async exportJson() {
      const notes = await this.listNotes();
      return JSON.stringify({ version: 1, notes }, null, 2);
    },
    async importJson(serialized) {
      const parsed = JSON.parse(serialized) as { notes?: LocalNote[] };
      const db = await getDb();
      const tx = db.transaction(notesStore, "readwrite");
      await tx.store.clear();
      for (const note of parsed.notes ?? []) await tx.store.put(note);
      await tx.done;
    },
  };
}
```

- [ ] **Step 5: Verify collections**

Run:

```bash
cd <repo>
npm run test -- src/domain/collections/localCollections.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src/domain/collections
git commit -m "feat: add local notes repository"
```

Expected: commit succeeds.

## Task 7: App State, Shell, And Theme

**Files:**
- Create: `src/store/appStore.ts`
- Create: `src/styles/theme.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Create: `src/ui/AppShell.tsx`
- Create: `src/ui/TopHud.tsx`
- Create: `src/ui/LoadingScreen.tsx`

- [ ] **Step 1: Create global store**

Create `src/store/appStore.ts`:

```ts
import { create } from "zustand";
import type { Philosopher, PhilosopherIndexEntry, Relationship, Theme } from "../data/schemas";

type Quality = "low" | "high";

type AppState = {
  loaded: boolean;
  loadError: string | null;
  philosophers: PhilosopherIndexEntry[];
  themes: Theme[];
  relationships: Relationship[];
  selectedPhilosopherId: string | null;
  selectedPhilosopher: Philosopher | null;
  searchQuery: string;
  quality: Quality;
  collectionsOpen: boolean;
  settingsOpen: boolean;
  setBootstrapData(input: { philosophers: PhilosopherIndexEntry[]; themes: Theme[]; relationships: Relationship[] }): void;
  setLoadError(message: string): void;
  selectPhilosopher(id: string | null): void;
  setSelectedPhilosopher(philosopher: Philosopher | null): void;
  setSearchQuery(query: string): void;
  setQuality(quality: Quality): void;
  toggleCollections(): void;
  toggleSettings(): void;
};

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  loadError: null,
  philosophers: [],
  themes: [],
  relationships: [],
  selectedPhilosopherId: null,
  selectedPhilosopher: null,
  searchQuery: "",
  quality: "high",
  collectionsOpen: false,
  settingsOpen: false,
  setBootstrapData: (input) => set({ ...input, loaded: true, loadError: null }),
  setLoadError: (message) => set({ loadError: message, loaded: false }),
  selectPhilosopher: (id) => set({ selectedPhilosopherId: id }),
  setSelectedPhilosopher: (philosopher) => set({ selectedPhilosopher: philosopher }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setQuality: (quality) => set({ quality }),
  toggleCollections: () => set((state) => ({ collectionsOpen: !state.collectionsOpen })),
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
}));
```

- [ ] **Step 2: Create theme CSS**

Create `src/styles/theme.css`:

```css
:root {
  color: #e8ecf4;
  background: #03040a;
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif;
  --ink: #03040a;
  --panel: rgba(8, 10, 18, 0.78);
  --panel-strong: rgba(12, 14, 24, 0.94);
  --gold: #ffd27a;
  --gold-soft: #f6dca6;
  --muted: #8b93a7;
  --line: rgba(255, 255, 255, 0.14);
  --serif: "Kaiti SC", "STKaiti", KaiTi, "Source Han Serif SC", "Noto Serif SC", serif;
}

* { box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; margin: 0; overflow: hidden; background: var(--ink); }
button, input, textarea { font: inherit; }
button { cursor: pointer; }
.app { position: fixed; inset: 0; background: radial-gradient(circle at 50% 45%, rgba(84, 70, 45, 0.28), transparent 45%), var(--ink); }
.hud-top { position: fixed; z-index: 20; top: 0; left: 0; right: 0; display: flex; gap: 12px; align-items: center; padding: 16px 20px; pointer-events: none; }
.hud-top > * { pointer-events: auto; }
.brand { color: var(--gold); letter-spacing: .18em; font-weight: 700; white-space: nowrap; }
.search-input { width: min(380px, 48vw); color: #f4f0e8; background: rgba(8,10,18,.78); border: 1px solid var(--line); border-radius: 8px; outline: none; padding: 8px 12px; }
.hud-button { color: var(--muted); background: rgba(255,255,255,.07); border: 1px solid var(--line); border-radius: 8px; padding: 7px 12px; }
.hud-button:hover { color: var(--gold); border-color: rgba(255,210,122,.55); }
.loading-screen { position: fixed; inset: 0; display: grid; place-items: center; background: var(--ink); z-index: 50; }
.loading-card { text-align: center; color: var(--muted); }
.loading-title { font-family: var(--serif); color: var(--gold); font-size: 38px; letter-spacing: .34em; margin-bottom: 12px; }
.panel { position: fixed; z-index: 25; top: 74px; right: 20px; bottom: 24px; width: min(380px, calc(100vw - 40px)); overflow: auto; background: radial-gradient(120% 60% at 50% 0, rgba(255,210,122,.11), transparent 60%), var(--panel-strong); border: 1px solid rgba(255,210,122,.25); border-radius: 14px; padding: 20px; backdrop-filter: blur(16px); box-shadow: 0 18px 60px rgba(0,0,0,.55); }
@media (max-width: 640px) {
  .hud-top { flex-wrap: wrap; padding: 10px; }
  .search-input { width: calc(100vw - 20px); order: 2; }
  .panel { top: auto; left: 0; right: 0; bottom: 0; width: auto; max-height: 72vh; border-radius: 16px 16px 0 0; }
}
```

- [ ] **Step 3: Import theme in main entry**

Modify `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 4: Create loading screen**

Create `src/ui/LoadingScreen.tsx`:

```tsx
type LoadingScreenProps = {
  error?: string | null;
};

export function LoadingScreen({ error }: LoadingScreenProps) {
  return (
    <div className="loading-screen" role={error ? "alert" : "status"}>
      <div className="loading-card">
        <div className="loading-title">群星闪耀时</div>
        <div>{error ? `数据载入失败：${error}` : "正在点亮思想星图..."}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create top HUD**

Create `src/ui/TopHud.tsx`:

```tsx
import { useAppStore } from "../store/appStore";

export function TopHud() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const toggleCollections = useAppStore((state) => state.toggleCollections);
  const toggleSettings = useAppStore((state) => state.toggleSettings);

  return (
    <header className="hud-top">
      <div className="brand">群星闪耀时</div>
      <input
        className="search-input"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        aria-label="搜索哲人、文明、命题"
      />
      <button className="hud-button" type="button" onClick={toggleCollections}>收藏</button>
      <button className="hud-button" type="button" onClick={toggleSettings}>设置</button>
    </header>
  );
}
```

- [ ] **Step 6: Create app shell**

Create `src/ui/AppShell.tsx`:

```tsx
import { useEffect } from "react";
import { getPhilosopherIndex, getRelationships, getThemes } from "../data/client";
import { useAppStore } from "../store/appStore";
import { LoadingScreen } from "./LoadingScreen";
import { TopHud } from "./TopHud";

export function AppShell() {
  const loaded = useAppStore((state) => state.loaded);
  const loadError = useAppStore((state) => state.loadError);
  const setBootstrapData = useAppStore((state) => state.setBootstrapData);
  const setLoadError = useAppStore((state) => state.setLoadError);

  useEffect(() => {
    Promise.all([getPhilosopherIndex(), getThemes(), getRelationships()])
      .then(([philosophers, themes, relationships]) => setBootstrapData({ philosophers, themes, relationships }))
      .catch((error) => setLoadError(error instanceof Error ? error.message : String(error)));
  }, [setBootstrapData, setLoadError]);

  if (loadError) return <LoadingScreen error={loadError} />;
  if (!loaded) return <LoadingScreen />;

  return (
    <main className="app">
      <TopHud />
    </main>
  );
}
```

- [ ] **Step 7: Wire `App.tsx`**

Replace `src/App.tsx`:

```tsx
import { AppShell } from "./ui/AppShell";

export default function App() {
  return <AppShell />;
}
```

- [ ] **Step 8: Verify app shell**

Run:

```bash
cd <repo>
npm run build
npm run test
```

Expected: both commands exit with code 0.

- [ ] **Step 9: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src
git commit -m "feat: add app shell and visual theme"
```

Expected: commit succeeds.

## Task 8: WebGL Star Scene

**Files:**
- Create: `src/scene/webglSupport.ts`
- Create: `src/scene/StarScene.tsx`
- Create: `src/scene/PhilosopherStars.tsx`
- Create: `src/scene/RelationshipLines.tsx`
- Create: `src/scene/CameraRig.tsx`
- Modify: `src/ui/AppShell.tsx`

- [ ] **Step 1: Create WebGL support helper**

Create `src/scene/webglSupport.ts`:

```ts
export function hasWebGlSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Create philosopher stars**

Create `src/scene/PhilosopherStars.tsx`:

```tsx
import { Html, Sphere } from "@react-three/drei";
import type { PhilosopherIndexEntry } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";

const colors: Record<string, string> = {
  chinese: "#f2c66d",
  indian: "#9bd883",
  ancient_greek: "#84b7ff",
  islamic: "#71d4c2",
  european_modern: "#d9a5ff",
  latin_christian: "#f0dfaa",
  american: "#ff9c7a",
  global_modern: "#d8e4f2",
};

type PhilosopherStarsProps = {
  philosophers: PhilosopherIndexEntry[];
  layout: StarLayoutNode[];
  selectedId: string | null;
  onSelect(id: string): void;
};

export function PhilosopherStars({ philosophers, layout, selectedId, onSelect }: PhilosopherStarsProps) {
  const byId = new Map(philosophers.map((item) => [item.id, item]));
  return (
    <>
      {layout.map((node) => {
        const philosopher = byId.get(node.id);
        if (!philosopher) return null;
        const selected = selectedId === node.id;
        return (
          <group key={node.id} position={node.position}>
            <Sphere args={[node.radius * (selected ? 1.45 : 1), 16, 16]} onClick={(event) => { event.stopPropagation(); onSelect(node.id); }}>
              <meshBasicMaterial color={colors[node.colorKey] ?? "#ffd27a"} toneMapped={false} />
            </Sphere>
            {(selected || philosopher.influenceWeight >= 3) && (
              <Html center distanceFactor={10}>
                <span style={{ color: selected ? "#ffd27a" : "#b9c2d6", fontSize: selected ? 14 : 11, whiteSpace: "nowrap", textShadow: "0 1px 8px #000" }}>
                  {philosopher.names.zh}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
```

- [ ] **Step 3: Create relationship lines**

Create `src/scene/RelationshipLines.tsx`:

```tsx
import { Line } from "@react-three/drei";
import type { Relationship } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";

type RelationshipLinesProps = {
  relationships: Relationship[];
  layout: StarLayoutNode[];
  focusedIds: string[];
};

export function RelationshipLines({ relationships, layout, focusedIds }: RelationshipLinesProps) {
  const positionById = new Map(layout.map((node) => [node.id, node.position]));
  const focused = new Set(focusedIds);
  return (
    <>
      {relationships.map((relationship) => {
        const from = positionById.get(relationship.from);
        const to = positionById.get(relationship.to);
        if (!from || !to) return null;
        const isFocused = focused.size === 0 || focused.has(relationship.id);
        return (
          <Line
            key={relationship.id}
            points={[from, to]}
            color={isFocused ? "#ffd27a" : "#5f6778"}
            opacity={isFocused ? 0.65 : 0.18}
            transparent
            lineWidth={isFocused ? 1.6 : 0.8}
          />
        );
      })}
    </>
  );
}
```

- [ ] **Step 4: Create camera rig**

Create `src/scene/CameraRig.tsx`:

```tsx
import { OrbitControls } from "@react-three/drei";

export function CameraRig() {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      minDistance={4}
      maxDistance={38}
    />
  );
}
```

- [ ] **Step 5: Create star scene**

Create `src/scene/StarScene.tsx`:

```tsx
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { computeStarLayout } from "../domain/layout/starLayout";
import { getDefaultVisibleRelationships, getFocusedRelationshipIds } from "../domain/relationships/relationshipFilters";
import { useAppStore } from "../store/appStore";
import { CameraRig } from "./CameraRig";
import { PhilosopherStars } from "./PhilosopherStars";
import { RelationshipLines } from "./RelationshipLines";

export function StarScene() {
  const philosophers = useAppStore((state) => state.philosophers);
  const relationships = useAppStore((state) => state.relationships);
  const selectedId = useAppStore((state) => state.selectedPhilosopherId);
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const quality = useAppStore((state) => state.quality);

  const visibleRelationships = getDefaultVisibleRelationships(relationships);
  const layout = computeStarLayout(philosophers, relationships);
  const focusedIds = selectedId ? getFocusedRelationshipIds(selectedId, relationships) : [];

  return (
    <Canvas camera={{ position: [0, 9, 22], fov: 52, near: 0.1, far: 100 }} dpr={quality === "high" ? [1, 2] : 1}>
      <color attach="background" args={["#03040a"]} />
      <fog attach="fog" args={["#03040a", 18, 58]} />
      <ambientLight intensity={0.25} />
      <PhilosopherStars philosophers={philosophers} layout={layout} selectedId={selectedId} onSelect={selectPhilosopher} />
      <RelationshipLines relationships={visibleRelationships} layout={layout} focusedIds={focusedIds} />
      <CameraRig />
      {quality === "high" && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.28} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
```

- [ ] **Step 6: Install postprocessing dependency**

Run:

```bash
cd <repo>
npm install @react-three/postprocessing postprocessing
```

Expected: dependencies are added.

- [ ] **Step 7: Wire scene into app shell**

Modify `src/ui/AppShell.tsx` to import and render `StarScene` and `hasWebGlSupport`:

```tsx
import { StarScene } from "../scene/StarScene";
import { hasWebGlSupport } from "../scene/webglSupport";
```

Inside `AppShell`, before the final return:

```tsx
if (!hasWebGlSupport()) return <LoadingScreen error="此设备或浏览器没有可用的 WebGL，无法渲染思想星图。" />;
```

In the final return, render:

```tsx
<main className="app">
  <StarScene />
  <TopHud />
</main>
```

- [ ] **Step 8: Verify star scene build**

Run:

```bash
cd <repo>
npm run build
```

Expected: build exits with code 0.

- [ ] **Step 9: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/package.json Desktop/群星闪耀时/package-lock.json Desktop/群星闪耀时/src
git commit -m "feat: render philosopher star scene"
```

Expected: commit succeeds.

## Task 9: Search, Detail Panels, And Selection Loading

**Files:**
- Create: `src/ui/SearchPanel.tsx`
- Create: `src/ui/PhilosopherPanel.tsx`
- Create: `src/ui/ArgumentPanel.tsx`
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/TopHud.tsx`

- [ ] **Step 1: Add selected philosopher loading effect**

Modify `src/ui/AppShell.tsx` imports:

```tsx
import { getPhilosopher, getPhilosopherIndex, getRelationships, getThemes } from "../data/client";
import { PhilosopherPanel } from "./PhilosopherPanel";
import { SearchPanel } from "./SearchPanel";
```

Inside `AppShell`, add:

```tsx
const selectedPhilosopherId = useAppStore((state) => state.selectedPhilosopherId);
const selectedPhilosopher = useAppStore((state) => state.selectedPhilosopher);
const setSelectedPhilosopher = useAppStore((state) => state.setSelectedPhilosopher);

useEffect(() => {
  if (!selectedPhilosopherId) {
    setSelectedPhilosopher(null);
    return;
  }
  getPhilosopher(selectedPhilosopherId)
    .then(setSelectedPhilosopher)
    .catch((error) => console.error("Failed to load philosopher", error));
}, [selectedPhilosopherId, setSelectedPhilosopher]);
```

Render after `TopHud`:

```tsx
<SearchPanel />
{selectedPhilosopher && <PhilosopherPanel philosopher={selectedPhilosopher} />}
```

- [ ] **Step 2: Create search panel**

Create `src/ui/SearchPanel.tsx`:

```tsx
import { useMemo } from "react";
import { searchArgumentsLocal } from "../data/search/argumentSearch";
import { searchPhilosophersLocal } from "../data/search/philosopherSearch";
import { useAppStore } from "../store/appStore";

export function SearchPanel() {
  const query = useAppStore((state) => state.searchQuery);
  const philosophers = useAppStore((state) => state.philosophers);
  const themes = useAppStore((state) => state.themes);
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const argumentIndex = useMemo(() => [], []);

  const philosopherResults = useMemo(() => searchPhilosophersLocal(query, philosophers).slice(0, 6), [query, philosophers]);
  const argumentResults = useMemo(() => searchArgumentsLocal(query, argumentIndex, themes).slice(0, 6), [query, argumentIndex, themes]);

  if (!query.trim()) return null;

  return (
    <section className="panel" style={{ left: 20, right: "auto", width: 380 }} aria-label="搜索结果">
      <h2>搜索</h2>
      {philosopherResults.length > 0 && <h3>哲人</h3>}
      {philosopherResults.map((result) => (
        <button className="hud-button" style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }} key={result.item.id} onClick={() => selectPhilosopher(result.item.id)}>
          {result.item.names.zh} <span style={{ color: "var(--muted)" }}>{result.item.names.en}</span>
        </button>
      ))}
      {argumentResults.length > 0 && <h3>论述</h3>}
      {argumentResults.map((result) => (
        <article key={result.item.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
          <strong>{result.item.questionZh}</strong>
          <p>{result.item.claimZh}</p>
        </article>
      ))}
      {philosopherResults.length === 0 && argumentResults.length === 0 && <p style={{ color: "var(--muted)" }}>没有找到结果。</p>}
    </section>
  );
}
```

- [ ] **Step 3: Create philosopher panel**

Create `src/ui/PhilosopherPanel.tsx`:

```tsx
import type { Philosopher } from "../data/schemas";
import { useAppStore } from "../store/appStore";

type PhilosopherPanelProps = {
  philosopher: Philosopher;
};

export function PhilosopherPanel({ philosopher }: PhilosopherPanelProps) {
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  return (
    <aside className="panel" aria-label={`${philosopher.names.zh}详情`}>
      <button className="hud-button" style={{ float: "right" }} onClick={() => selectPhilosopher(null)}>关闭</button>
      <h2 style={{ fontFamily: "var(--serif)", color: "var(--gold)", letterSpacing: ".08em" }}>{philosopher.names.zh}</h2>
      <p style={{ color: "var(--muted)" }}>{philosopher.names.en}{philosopher.names.native ? ` · ${philosopher.names.native}` : ""}</p>
      <p>{philosopher.life.display}</p>
      <p><strong>{philosopher.oneLineZh}</strong></p>
      <p>{philosopher.summaryZh}</p>
      <h3>关键词</h3>
      <p>{philosopher.keywordsZh.join(" · ")}</p>
      <h3>数据状态</h3>
      <p>{philosopher.reviewStatus === "reviewed" ? "已审核" : "草稿，需人工审核"}</p>
    </aside>
  );
}
```

- [ ] **Step 4: Create argument detail component**

Create `src/ui/ArgumentPanel.tsx`:

```tsx
import type { Argument } from "../data/schemas";

type ArgumentPanelProps = {
  argument: Argument;
  onClose(): void;
};

export function ArgumentPanel({ argument, onClose }: ArgumentPanelProps) {
  return (
    <aside className="panel" aria-label="论述详情">
      <button className="hud-button" style={{ float: "right" }} onClick={onClose}>关闭</button>
      <h2>{argument.questionZh}</h2>
      <p><strong>{argument.claimZh}</strong></p>
      <p>{argument.explanationZh}</p>
      <p style={{ color: "var(--muted)" }}>{argument.source.locator ?? "摘要"} · {argument.reviewStatus === "reviewed" ? "已审核" : "草稿"}</p>
    </aside>
  );
}
```

- [ ] **Step 5: Load argument index in store**

Modify `src/store/appStore.ts` to import `Argument` and add:

```ts
argumentsIndex: Argument[];
```

In initial state add:

```ts
argumentsIndex: [],
```

Modify `setBootstrapData` input to include `argumentsIndex: Argument[]`.

Modify `src/ui/AppShell.tsx` bootstrap import and call:

```tsx
import { getArgumentIndex, getPhilosopher, getPhilosopherIndex, getRelationships, getThemes } from "../data/client";

Promise.all([getPhilosopherIndex(), getThemes(), getRelationships(), getArgumentIndex()])
  .then(([philosophers, themes, relationships, argumentsIndex]) => setBootstrapData({ philosophers, themes, relationships, argumentsIndex }))
```

Modify `SearchPanel`:

```tsx
const argumentIndex = useAppStore((state) => state.argumentsIndex);
```

- [ ] **Step 6: Verify search and panels**

Run:

```bash
cd <repo>
npm run build
npm run test
```

Expected: both commands exit with code 0.

- [ ] **Step 7: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src
git commit -m "feat: add search and detail panels"
```

Expected: commit succeeds.

## Task 10: Collections Drawer, Settings, And Onboarding

**Files:**
- Create: `src/ui/CollectionsDrawer.tsx`
- Create: `src/ui/SettingsPanel.tsx`
- Create: `src/ui/Onboarding.tsx`
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/PhilosopherPanel.tsx`

- [ ] **Step 1: Create collections drawer**

Create `src/ui/CollectionsDrawer.tsx`:

```tsx
import { useEffect, useMemo, useState } from "react";
import { createIndexedDbCollectionsRepository, type LocalNote } from "../domain/collections/localCollections";
import { useAppStore } from "../store/appStore";

export function CollectionsDrawer() {
  const open = useAppStore((state) => state.collectionsOpen);
  const toggleCollections = useAppStore((state) => state.toggleCollections);
  const repo = useMemo(() => createIndexedDbCollectionsRepository(), []);
  const [notes, setNotes] = useState<LocalNote[]>([]);

  useEffect(() => {
    if (open) repo.listNotes().then(setNotes);
  }, [open, repo]);

  if (!open) return null;

  return (
    <aside className="panel" style={{ left: 20, right: "auto" }} aria-label="收藏与札记">
      <button className="hud-button" style={{ float: "right" }} onClick={toggleCollections}>关闭</button>
      <h2>收藏与札记</h2>
      {notes.length === 0 ? <p style={{ color: "var(--muted)" }}>还没有札记。</p> : notes.map((note) => (
        <article key={note.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
          <strong>{note.targetType} · {note.targetId}</strong>
          <p>{note.body}</p>
        </article>
      ))}
      <button className="hud-button" onClick={async () => {
        const blob = new Blob([await repo.exportJson()], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "qunxing-notes.json";
        anchor.click();
        URL.revokeObjectURL(url);
      }}>导出 JSON</button>
    </aside>
  );
}
```

- [ ] **Step 2: Add note button to philosopher panel**

Modify `src/ui/PhilosopherPanel.tsx` imports:

```tsx
import { useMemo, useState } from "react";
import { createIndexedDbCollectionsRepository } from "../domain/collections/localCollections";
```

Inside component add:

```tsx
const repo = useMemo(() => createIndexedDbCollectionsRepository(), []);
const [noteBody, setNoteBody] = useState("");
```

Before closing `</aside>`, add:

```tsx
<h3>札记</h3>
<textarea
  value={noteBody}
  onChange={(event) => setNoteBody(event.target.value)}
  style={{ width: "100%", minHeight: 90, color: "#e8ecf4", background: "rgba(255,255,255,.06)", border: "1px solid var(--line)", borderRadius: 8, padding: 10 }}
/>
<button
  className="hud-button"
  onClick={async () => {
    if (!noteBody.trim()) return;
    await repo.saveNote({ targetType: "philosopher", targetId: philosopher.id, body: noteBody.trim() });
    setNoteBody("");
  }}
>
  保存札记
</button>
```

- [ ] **Step 3: Create settings panel**

Create `src/ui/SettingsPanel.tsx`:

```tsx
import { useAppStore } from "../store/appStore";

export function SettingsPanel() {
  const open = useAppStore((state) => state.settingsOpen);
  const quality = useAppStore((state) => state.quality);
  const setQuality = useAppStore((state) => state.setQuality);
  const toggleSettings = useAppStore((state) => state.toggleSettings);

  if (!open) return null;

  return (
    <aside className="panel" aria-label="设置">
      <button className="hud-button" style={{ float: "right" }} onClick={toggleSettings}>关闭</button>
      <h2>设置</h2>
      <h3>画质</h3>
      <button className="hud-button" onClick={() => setQuality(quality === "high" ? "low" : "high")}>
        当前：{quality === "high" ? "高画质" : "低画质"}
      </button>
      <h3>数据说明</h3>
      <p style={{ color: "var(--muted)" }}>草稿内容用于产品验证，已审核内容才作为正式资料展示。</p>
    </aside>
  );
}
```

- [ ] **Step 4: Create onboarding**

Create `src/ui/Onboarding.tsx`:

```tsx
import { useState } from "react";

const storageKey = "qunxing-onboarded-v1";
const steps = [
  ["哲人如星", "每颗星代表一位哲人，文明、时代与主题共同塑造星图位置。"],
  ["搜命题", "搜索正义、死亡、自由等问题，可以看到相关哲人与精选论述。"],
  ["留札记", "收藏哲人和论述，在本机写下自己的思想札记。"],
];

export function Onboarding() {
  const [step, setStep] = useState(() => (localStorage.getItem(storageKey) ? -1 : 0));
  if (step < 0) return null;
  const close = () => {
    localStorage.setItem(storageKey, "1");
    setStep(-1);
  };
  const [title, body] = steps[step];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center", background: "rgba(2,3,8,.58)", backdropFilter: "blur(3px)" }}>
      <section style={{ width: "min(440px, 88vw)", background: "var(--panel-strong)", border: "1px solid rgba(255,210,122,.36)", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--muted)", letterSpacing: ".2em" }}>{step + 1} / {steps.length}</div>
        <h2 style={{ color: "var(--gold)", fontFamily: "var(--serif)" }}>{title}</h2>
        <p style={{ textAlign: "left", lineHeight: 1.8 }}>{body}</p>
        <button className="hud-button" onClick={close}>跳过</button>
        <button className="hud-button" style={{ marginLeft: 10, color: "#1a1206", background: "var(--gold)" }} onClick={() => step === steps.length - 1 ? close() : setStep(step + 1)}>
          {step === steps.length - 1 ? "开始漫游" : "下一步"}
        </button>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Wire drawer, settings, and onboarding**

Modify `src/ui/AppShell.tsx` imports:

```tsx
import { CollectionsDrawer } from "./CollectionsDrawer";
import { Onboarding } from "./Onboarding";
import { SettingsPanel } from "./SettingsPanel";
```

Render after panels:

```tsx
<CollectionsDrawer />
<SettingsPanel />
<Onboarding />
```

- [ ] **Step 6: Verify**

Run:

```bash
cd <repo>
npm run build
npm run test
```

Expected: both commands exit with code 0.

- [ ] **Step 7: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/src
git commit -m "feat: add collections settings and onboarding"
```

Expected: commit succeeds.

## Task 11: Smoke Tests And Visual Verification

**Files:**
- Create: `tests/smoke.spec.ts`
- Modify: `package.json`

- [ ] **Step 1: Write smoke test**

Create `tests/smoke.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("loads star map and basic UI", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("群星闪耀时").first()).toBeVisible();
  await expect(page.getByLabel("搜索哲人、文明、命题")).toBeVisible();
  await page.getByLabel("搜索哲人、文明、命题").fill("柏拉图");
  await expect(page.getByText("柏拉图").first()).toBeVisible();
});
```

- [ ] **Step 2: Install Playwright browser if missing**

Run:

```bash
cd <repo>
npx playwright install chromium
```

Expected: Chromium is installed or already present.

- [ ] **Step 3: Build and smoke test**

Run:

```bash
cd <repo>
npm run build
npm run test:smoke
```

Expected: build passes and Playwright test passes on desktop and mobile projects.

- [ ] **Step 4: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/tests Desktop/群星闪耀时/package.json Desktop/群星闪耀时/package-lock.json
git commit -m "test: add star map smoke coverage"
```

Expected: commit succeeds.

## Task 12: Expand Data To 100 And Final Release Gate

**Files:**
- Modify: `public/data/philosophers.index.json`
- Modify: `public/data/philosophers/*.json`
- Modify: `public/data/arguments.index.json`
- Modify: `public/data/relationships.json`
- Modify: `public/data/themes.json`
- Modify: `public/data/works.json`
- Modify: `tools/validate-data.mjs`

- [ ] **Step 1: Add release-count validation**

Modify `tools/validate-data.mjs` after `const philosopherIds = ...`:

```js
if (process.env.RELEASE_DATA === "1") {
  assert(philosopherIds.size >= 100, `release data requires at least 100 philosophers, got ${philosopherIds.size}`);
}
```

After argument validation loop, add:

```js
if (process.env.RELEASE_DATA === "1") {
  const argumentCountByPhilosopher = new Map();
  for (const argument of argumentsIndex) {
    argumentCountByPhilosopher.set(argument.philosopherId, (argumentCountByPhilosopher.get(argument.philosopherId) || 0) + 1);
  }
  for (const philosopher of philosophersIndex) {
    assert((argumentCountByPhilosopher.get(philosopher.id) || 0) >= 2, `release philosopher needs at least 2 arguments: ${philosopher.id}`);
  }
}
```

- [ ] **Step 2: Expand philosopher records from roster**

Use `tools/roster-100.json` as the exact release roster. For each roster item:

- Add one index entry to `public/data/philosophers.index.json`.
- Add one detail file to `public/data/philosophers/{id}.json`.
- Add at least two argument records to `public/data/arguments.index.json`.
- Add at least one work record to `public/data/works.json`.
- Keep `reviewStatus: "draft"` until manually checked.

Each detail file must follow this shape:

```json
{
  "id": "rawls",
  "names": { "zh": "罗尔斯", "en": "John Rawls" },
  "life": { "birth": 1921, "death": 2002, "display": "1921 - 2002" },
  "civilization": "american",
  "traditions": ["liberalism", "political_philosophy"],
  "periods": ["twentieth_century"],
  "themes": ["justice", "politics", "ethics"],
  "keywordsZh": ["正义论", "无知之幕", "公平"],
  "oneLineZh": "以公平正义理论重塑当代政治哲学的问题框架。",
  "summaryZh": "罗尔斯通过原初状态、无知之幕和两项正义原则，为现代自由主义政治哲学提供了系统论证，也激发了关于平等、自由和制度正当性的持续争论。",
  "works": ["rawls-theory-of-justice"],
  "influenceWeight": 3,
  "reviewStatus": "draft",
  "sourceNotes": [{ "label": "draft", "noteZh": "条目需要人工核对作品、年代和概念表述。" }]
}
```

- [ ] **Step 3: Add relationship coverage**

Ensure `public/data/relationships.json` contains at least these relationship ids:

```json
[
  "socrates-plato-direct_student",
  "plato-aristotle-direct_student",
  "confucius-mencius-reception",
  "confucius-xunzi-reception",
  "laozi-zhuangzi-school",
  "aristotle-aquinas-reception",
  "hume-kant-influence",
  "kant-hegel-influence",
  "hegel-marx-influence",
  "husserl-heidegger-influence",
  "heidegger-sartre-influence",
  "frege-wittgenstein-influence",
  "rawls-nozick-critique",
  "nagarjuna-adi-shankara-shared_problem",
  "ibn-sina-aquinas-influence"
]
```

Use relationship objects with the schema from the spec. Keep weak or broad comparisons as `shared_problem` or `reception`, not `direct_student`.

- [ ] **Step 4: Validate release data**

Run:

```bash
cd <repo>
npm run validate:data
RELEASE_DATA=1 npm run validate:data
```

Expected: both commands pass; release validation reports at least 100 philosophers.

- [ ] **Step 5: Final verification**

Run:

```bash
cd <repo>
npm run test
npm run build
npm run test:smoke
```

Expected: all commands pass.

- [ ] **Step 6: Commit**

Run:

```bash
cd <repo>
git add -f Desktop/群星闪耀时/public/data Desktop/群星闪耀时/tools/validate-data.mjs
git commit -m "data: expand first release philosopher atlas"
```

Expected: commit succeeds.

## Self-Review Checklist

- Spec coverage: project skeleton, data model, typed relationships, local search, star map, details, collections, onboarding, static validation, and 100-person expansion are represented.
- Red-flag scan: no deferred work markers, no unnamed files, no unscoped implementation instructions.
- Type consistency: schema names, relationship types, review statuses, search result names, and note target types match the approved spec.
- Testing: every domain module has unit tests before implementation; the UI has build checks and a Playwright smoke test.
- Scope control: user accounts, vector search, cloud sync, editorial backend, and public notes are excluded.
