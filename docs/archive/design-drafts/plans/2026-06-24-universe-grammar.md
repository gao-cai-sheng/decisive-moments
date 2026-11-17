# Philosopher Universe Grammar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved A+B universe grammar: chronology controls center-to-edge radius, civilization/school controls color families and local clusters, and selected philosophers expose expandable thought-system nodes with evidence/source details.

**Architecture:** Keep the existing Vite React/R3F app shape. Put deterministic global star placement in `src/domain/layout/starLayout.ts`; keep Three.js click/render behavior in `src/scene/StarScene.tsx` and `src/scene/PhilosopherStars.tsx`; keep selection state in Zustand; keep readable source/evidence details in `src/ui/PhilosopherPanel.tsx`.

**Tech Stack:** Vite, React, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, Zustand, Zod, Vitest, Playwright.

---

## Scope Check

This plan implements one coherent feature slice from the approved spec:

- Global map grammar: time radius plus civilization/school sectors and color variants.
- Local thought-system expansion for one selected philosopher at a time.
- Claim detail display with explanation and evidence/source metadata.
- Unit and smoke coverage for the new behavior.

It does not expand the roster, add vector search, add accounts, add cloud sync, or build a content-editing backend.

## File Structure

Modify these existing files:

```text
<repo>/src/domain/layout/starLayout.ts
  Deterministic global philosopher layout, chronology buckets, radial distances, sector angles, color keys.

<repo>/src/domain/layout/starLayout.test.ts
  Unit tests for chronology radius, period fallback, stable coordinates, and tradition color keys.

<repo>/src/scene/PhilosopherStars.tsx
  Civilization/school color family lookup and star rendering.

<repo>/src/scene/StarScene.tsx
  Thought satellite rendering, problem click handling, selected-claim click handling, and visible claim expansion.

<repo>/src/store/appStore.ts
  Selected thought problem and selected thought claim state.

<repo>/src/ui/AppShell.tsx
  Bootstrap works metadata so claim evidence can display work titles when available.

<repo>/src/ui/PhilosopherPanel.tsx
  Expandable thought problems, claim focus, evidence/source metadata, and work-title display.

<repo>/src/styles/theme.css
  Thought-system button/detail styles and compact source metadata styling.

<repo>/tests/smoke.spec.ts
  End-to-end verification for search, selected philosopher detail, concept expansion, and source metadata.
```

Create these test files:

```text
<repo>/src/scene/PhilosopherStars.test.ts
  Unit tests for color-family resolution.

<repo>/src/store/appStore.test.ts
  Unit tests for thought selection state and reset behavior.
```

Because the repository root is `<repo>` and the project is under an ignored `Desktop` path, use `git add -f` for any new files in this project.

## Task 1: Make Global Layout Chronological

**Files:**
- Modify: `src/domain/layout/starLayout.ts`
- Modify: `src/domain/layout/starLayout.test.ts`

- [ ] **Step 1: Write failing chronology and color-key layout tests**

Append these tests to `src/domain/layout/starLayout.test.ts`:

```ts
function distanceXZ(position: [number, number, number]) {
  return Math.hypot(position[0], position[2]);
}

describe("chronological universe grammar", () => {
  it("places older philosophers nearer the center than modern philosophers", () => {
    const ancient = {
      ...validPhilosopher,
      id: "ancient-anchor",
      life: { birth: -500, death: -420, display: "约公元前 5 世纪" },
      civilization: "ancient_greek",
      traditions: ["platonism"],
      periods: ["classical_antiquity"],
    };
    const modern = {
      ...validPhilosopher,
      id: "modern-anchor",
      life: { birth: 1804, death: 1872, display: "1804 - 1872" },
      civilization: "european_modern",
      traditions: ["utilitarianism"],
      periods: ["modern"],
    };

    const result = computeStarLayout([ancient, modern], []);
    const ancientNode = result.find((node) => node.id === "ancient-anchor");
    const modernNode = result.find((node) => node.id === "modern-anchor");

    expect(ancientNode?.periodBucket).toBe("classical");
    expect(modernNode?.periodBucket).toBe("modern");
    expect(distanceXZ(modernNode!.position)).toBeGreaterThan(distanceXZ(ancientNode!.position) + 5);
  });

  it("uses period buckets when exact chronology is missing", () => {
    const medieval = {
      ...validPhilosopher,
      id: "medieval-anchor",
      life: { display: "年代信息待审核" },
      civilization: "islamic",
      traditions: ["falsafa"],
      periods: ["medieval"],
    };

    const [node] = computeStarLayout([medieval], []);

    expect(node.periodBucket).toBe("medieval");
    expect(distanceXZ(node.position)).toBeGreaterThan(8);
    expect(distanceXZ(node.position)).toBeLessThan(12);
  });

  it("includes the primary tradition in the color key", () => {
    const [node] = computeStarLayout(
      [
        {
          ...validPhilosopher,
          id: "confucian-color-key",
          civilization: "chinese",
          traditions: ["confucianism"],
        },
      ],
      [],
    );

    expect(node.colorKey).toBe("chinese:confucianism");
  });
});
```

- [ ] **Step 2: Run the layout tests and verify they fail**

Run:

```bash
npm test -- src/domain/layout/starLayout.test.ts
```

Expected: FAIL because `StarLayoutNode` does not yet expose `periodBucket`, current layout distance is not chronological, and `colorKey` is still only the civilization id.

- [ ] **Step 3: Implement chronology buckets, chronology distance, and tradition color keys**

Replace `src/domain/layout/starLayout.ts` with this implementation:

```ts
import type { PhilosopherIndexEntry } from "../../data/schemas";

type RelationshipLike = { from: string; to: string };

export type PeriodBucket =
  | "ancient"
  | "classical"
  | "medieval"
  | "early_modern"
  | "modern"
  | "contemporary"
  | "unknown";

export type StarLayoutNode = {
  id: string;
  position: [number, number, number];
  colorKey: string;
  periodBucket: PeriodBucket;
  radius: number;
};

const periodDistance: Record<PeriodBucket, number> = {
  ancient: 5.4,
  classical: 6.8,
  medieval: 9.6,
  early_modern: 11.4,
  modern: 14.2,
  contemporary: 16.4,
  unknown: 12.4,
};

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function relationshipCount(id: string, relationships: RelationshipLike[]) {
  return relationships.filter((relationship) => relationship.from === id || relationship.to === id).length;
}

function periodText(philosopher: PhilosopherIndexEntry) {
  return philosopher.periods.join(" ").toLowerCase();
}

export function getPeriodBucket(philosopher: PhilosopherIndexEntry): PeriodBucket {
  const birth = philosopher.life.birth;
  const death = philosopher.life.death;
  const year = typeof birth === "number" ? birth : typeof death === "number" ? death : null;

  if (typeof year === "number") {
    if (year < -600) return "ancient";
    if (year < 500) return "classical";
    if (year < 1450) return "medieval";
    if (year < 1750) return "early_modern";
    if (year < 1945) return "modern";
    return "contemporary";
  }

  const text = periodText(philosopher);
  if (text.includes("ancient")) return "ancient";
  if (text.includes("classical") || text.includes("antiquity") || text.includes("axial")) return "classical";
  if (text.includes("medieval") || text.includes("scholastic")) return "medieval";
  if (text.includes("early_modern") || text.includes("renaissance") || text.includes("enlightenment")) {
    return "early_modern";
  }
  if (text.includes("modern")) return "modern";
  if (text.includes("contemporary") || text.includes("global_modern")) return "contemporary";
  return "unknown";
}

function chronologyDistance(philosopher: PhilosopherIndexEntry, bucket: PeriodBucket) {
  const birth = philosopher.life.birth;
  const death = philosopher.life.death;
  const year = typeof birth === "number" ? birth : typeof death === "number" ? death : null;
  if (typeof year !== "number") return periodDistance[bucket];

  const normalized = clamp((year + 800) / (2026 + 800), 0, 1);
  return 5.2 + normalized * 12.2;
}

function stableUnit(seed: number, divisor: number) {
  return ((Math.floor(seed / divisor) % 1000) / 1000) * 2 - 1;
}

function primaryTradition(philosopher: PhilosopherIndexEntry) {
  return philosopher.traditions[0] ?? "default";
}

export function computeStarLayout(
  philosophers: PhilosopherIndexEntry[],
  relationships: RelationshipLike[],
): StarLayoutNode[] {
  const civilizations = [...new Set(philosophers.map((item) => item.civilization))].sort();
  const angleByCivilization = new Map(
    civilizations.map((civilization, index) => [
      civilization,
      (Math.PI * 2 * index) / Math.max(civilizations.length, 1),
    ]),
  );

  return philosophers.map((philosopher) => {
    const seed = hash(philosopher.id);
    const traditionSeed = hash(primaryTradition(philosopher));
    const themeSeed = hash(philosopher.themes[0] ?? "theme");
    const baseAngle = angleByCivilization.get(philosopher.civilization) ?? 0;
    const bucket = getPeriodBucket(philosopher);
    const traditionOffset = stableUnit(traditionSeed, 1) * 0.42;
    const themeOffset = stableUnit(themeSeed, 7) * 0.16;
    const jitter = stableUnit(seed, 1) * 0.18;
    const distance = chronologyDistance(philosopher, bucket) + stableUnit(seed, 23) * 0.35;
    const y = stableUnit(seed, 1000) * 2.2;
    const count = relationshipCount(philosopher.id, relationships);
    const angle = baseAngle + traditionOffset + themeOffset + jitter;

    return {
      id: philosopher.id,
      position: [
        Number((Math.cos(angle) * distance).toFixed(4)),
        Number(y.toFixed(4)),
        Number((Math.sin(angle) * distance).toFixed(4)),
      ],
      colorKey: `${philosopher.civilization}:${primaryTradition(philosopher)}`,
      periodBucket: bucket,
      radius: Number((0.065 + philosopher.influenceWeight * 0.018 + Math.min(count, 8) * 0.005).toFixed(4)),
    };
  });
}
```

- [ ] **Step 4: Run the layout tests and verify they pass**

Run:

```bash
npm test -- src/domain/layout/starLayout.test.ts
```

Expected: PASS for all layout tests.

- [ ] **Step 5: Commit the chronological layout change**

Run:

```bash
git add -f src/domain/layout/starLayout.ts src/domain/layout/starLayout.test.ts
git commit -m "feat: arrange stars by chronology"
```

Expected: commit succeeds with only the layout files staged.

## Task 2: Add Civilization And School Color Families

**Files:**
- Modify: `src/scene/PhilosopherStars.tsx`
- Create: `src/scene/PhilosopherStars.test.ts`

- [ ] **Step 1: Write failing color-family tests**

Create `src/scene/PhilosopherStars.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getStarColor } from "./PhilosopherStars";

describe("getStarColor", () => {
  it("uses school-specific variants inside the same civilization family", () => {
    expect(getStarColor("chinese:confucianism")).toBe("#d8a24f");
    expect(getStarColor("chinese:daoism")).toBe("#a9c96e");
    expect(getStarColor("chinese:confucianism")).not.toBe(getStarColor("chinese:daoism"));
  });

  it("falls back to the civilization base color when the tradition has no variant", () => {
    expect(getStarColor("indian:unknown_tradition")).toBe("#55d2a7");
  });

  it("falls back to warm gold when the civilization is unknown", () => {
    expect(getStarColor("unknown:unknown")).toBe("#d8a24f");
  });
});
```

- [ ] **Step 2: Run the color test and verify it fails**

Run:

```bash
npm test -- src/scene/PhilosopherStars.test.ts
```

Expected: FAIL because `getStarColor` is not exported yet.

- [ ] **Step 3: Implement color families and use them in star rendering**

In `src/scene/PhilosopherStars.tsx`, replace the `civilizationColors` export with:

```ts
export const civilizationColors: Record<string, string> = {
  chinese: "#d8a24f",
  indian: "#55d2a7",
  ancient_greek: "#8fb8ff",
  islamic: "#4cc2b4",
  european_modern: "#cf73b8",
  latin_christian: "#d8c37a",
  american: "#f27f5f",
  global_modern: "#d8e1ea",
};

const traditionColorVariants: Record<string, Record<string, string>> = {
  chinese: {
    confucianism: "#d8a24f",
    daoism: "#a9c96e",
    chinese_philosophy: "#e0b86f",
  },
  indian: {
    early_buddhism: "#55d2a7",
    indian_philosophy: "#69dfba",
    sramana_tradition: "#47b99c",
  },
  ancient_greek: {
    platonism: "#8fb8ff",
    aristotelianism: "#a8c7ff",
    stoicism: "#7ca5e6",
  },
  european_modern: {
    kantianism: "#cf73b8",
    existentialism: "#d96ea1",
    german_idealism: "#b985df",
    utilitarianism: "#e085b4",
  },
};

export function getStarColor(colorKey: string) {
  const [civilization, tradition] = colorKey.split(":");
  const base = civilizationColors[civilization] ?? "#d8a24f";
  return traditionColorVariants[civilization]?.[tradition] ?? base;
}
```

Then replace:

```ts
const color = civilizationColors[node.colorKey] ?? "#d8a24f";
```

with:

```ts
const color = getStarColor(node.colorKey);
```

- [ ] **Step 4: Run color and layout tests**

Run:

```bash
npm test -- src/scene/PhilosopherStars.test.ts src/domain/layout/starLayout.test.ts
```

Expected: PASS for both test files.

- [ ] **Step 5: Commit the color-family change**

Run:

```bash
git add -f src/scene/PhilosopherStars.tsx src/scene/PhilosopherStars.test.ts
git commit -m "feat: add school color families"
```

Expected: commit succeeds with only the star color files staged.

## Task 3: Add Thought Selection State

**Files:**
- Modify: `src/store/appStore.ts`
- Create: `src/store/appStore.test.ts`

- [ ] **Step 1: Write failing store tests**

Create `src/store/appStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./appStore";

describe("appStore thought selection", () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedPhilosopherId: null,
      selectedPhilosopher: null,
      selectedThoughtProblemId: null,
      selectedThoughtClaimId: null,
    });
  });

  it("tracks selected thought problem and claim ids", () => {
    useAppStore.getState().selectThoughtProblem("plato-forms");
    useAppStore.getState().selectThoughtClaim("plato-forms-intelligible");

    expect(useAppStore.getState().selectedThoughtProblemId).toBe("plato-forms");
    expect(useAppStore.getState().selectedThoughtClaimId).toBe("plato-forms-intelligible");
  });

  it("clears selected thought ids when selecting a different philosopher", () => {
    useAppStore.getState().selectThoughtProblem("plato-forms");
    useAppStore.getState().selectThoughtClaim("plato-forms-intelligible");
    useAppStore.getState().selectPhilosopher("buddha");

    expect(useAppStore.getState().selectedPhilosopherId).toBe("buddha");
    expect(useAppStore.getState().selectedThoughtProblemId).toBeNull();
    expect(useAppStore.getState().selectedThoughtClaimId).toBeNull();
  });
});
```

- [ ] **Step 2: Run the store tests and verify they fail**

Run:

```bash
npm test -- src/store/appStore.test.ts
```

Expected: FAIL because the store does not yet define `selectedThoughtProblemId`, `selectedThoughtClaimId`, `selectThoughtProblem`, or `selectThoughtClaim`.

- [ ] **Step 3: Add thought selection state to the store**

In `src/store/appStore.ts`, extend `AppState` with:

```ts
  selectedThoughtProblemId: string | null;
  selectedThoughtClaimId: string | null;
  selectThoughtProblem(id: string | null): void;
  selectThoughtClaim(id: string | null): void;
```

In the initial state object, add:

```ts
  selectedThoughtProblemId: null,
  selectedThoughtClaimId: null,
```

Replace the current `selectPhilosopher` implementation with:

```ts
  selectPhilosopher: (id) =>
    set({
      selectedPhilosopherId: id,
      selectedThoughtProblemId: null,
      selectedThoughtClaimId: null,
    }),
```

Add these actions:

```ts
  selectThoughtProblem: (id) =>
    set({
      selectedThoughtProblemId: id,
      selectedThoughtClaimId: null,
    }),
  selectThoughtClaim: (id) => set({ selectedThoughtClaimId: id }),
```

- [ ] **Step 4: Run the store tests and verify they pass**

Run:

```bash
npm test -- src/store/appStore.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the store change**

Run:

```bash
git add -f src/store/appStore.ts src/store/appStore.test.ts
git commit -m "feat: track thought node selection"
```

Expected: commit succeeds with only store files staged.

## Task 4: Make Thought Satellites Expandable In The Scene

**Files:**
- Modify: `src/scene/StarScene.tsx`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Write a failing smoke assertion for claim expansion**

In `tests/smoke.spec.ts`, after:

```ts
await expect(detailPanel.getByText("理念与真实")).toBeVisible();
```

add:

```ts
  await detailPanel.getByRole("button", { name: /理念与真实/ }).click();
  await expect(detailPanel.getByRole("button", { name: /理念高于可感事物/ })).toBeVisible();
  await detailPanel.getByRole("button", { name: /理念高于可感事物/ }).click();
  await expect(detailPanel.getByText("理念论让知识拥有稳定对象")).toBeVisible();
  await expect(detailPanel.getByText("《理想国》中的理念讨论")).toBeVisible();
```

This assertion is written against panel controls because Playwright should not depend on precise 3D click coordinates for every run.

- [ ] **Step 2: Run the smoke test and verify it fails**

Run:

```bash
npm run test:smoke -- --project=chromium-desktop
```

Expected: FAIL because thought problems and claims are not exposed as clickable panel buttons yet.

- [ ] **Step 3: Wire thought selection state into `StarScene`**

In `src/scene/StarScene.tsx`, read these store fields inside `StarScene`:

```ts
  const selectedThoughtProblemId = useAppStore((state) => state.selectedThoughtProblemId);
  const selectThoughtProblem = useAppStore((state) => state.selectThoughtProblem);
  const selectThoughtClaim = useAppStore((state) => state.selectThoughtClaim);
```

Change `ThoughtOrbitProps` to:

```ts
type ThoughtOrbitProps = {
  philosopher: Philosopher;
  position: [number, number, number];
  selectedProblemId: string | null;
  onSelectProblem(id: string): void;
  onSelectClaim(id: string): void;
};
```

Change the component signature to:

```ts
function ThoughtOrbit({
  philosopher,
  position,
  selectedProblemId,
  onSelectProblem,
  onSelectClaim,
}: ThoughtOrbitProps) {
```

Inside the `problem` map, define:

```ts
        const expanded = selectedProblemId === problem.id;
```

On the problem sphere, add a click handler:

```tsx
              <Sphere
                args={[0.055 + problem.weight * 0.016, 10, 10]}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectProblem(problem.id);
                }}
              >
                <meshBasicMaterial color={expanded ? "#ffd27a" : "#ffe2a0"} toneMapped={false} />
              </Sphere>
```

Wrap claim rendering so only the expanded problem shows claim satellites:

```tsx
            {expanded &&
              problem.claims.map((claim, claimIndex) => {
```

On the claim sphere, add a click handler:

```tsx
                  <Sphere
                    args={[0.032 + claim.weight * 0.008, 8, 8]}
                    position={claimPosition}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectClaim(claim.id);
                    }}
                  >
                    <meshBasicMaterial color={baseColor} toneMapped={false} />
                  </Sphere>
```

Update the call site:

```tsx
      {selectedPhilosopher && selectedLayout && (
        <ThoughtOrbit
          philosopher={selectedPhilosopher}
          position={selectedLayout.position}
          selectedProblemId={selectedThoughtProblemId}
          onSelectProblem={selectThoughtProblem}
          onSelectClaim={selectThoughtClaim}
        />
      )}
```

- [ ] **Step 4: Add orbit cursor affordance**

In `src/styles/theme.css`, update `.thought-orbit-label`:

```css
.thought-orbit-label {
  color: var(--gold-soft);
  font-size: 10px;
  white-space: nowrap;
  text-shadow: 0 1px 10px #000;
  pointer-events: none;
}
```

Expected: this keeps labels non-intercepting so sphere clicks remain reliable.

- [ ] **Step 5: Run TypeScript and the store/layout/color tests**

Run:

```bash
npm run build
npm test -- src/store/appStore.test.ts src/domain/layout/starLayout.test.ts src/scene/PhilosopherStars.test.ts
```

Expected: build passes and all listed tests pass. The smoke test still fails until the panel buttons are implemented in Task 5.

- [ ] **Step 6: Commit the scene click change**

Run:

```bash
git add -f src/scene/StarScene.tsx src/styles/theme.css tests/smoke.spec.ts
git commit -m "feat: expand thought satellites"
```

Expected: commit succeeds with scene, style, and smoke-test files staged.

## Task 5: Show Expandable Claims And Source Metadata In The Panel

**Files:**
- Modify: `src/store/appStore.ts`
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/PhilosopherPanel.tsx`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Add works to app store state**

In `src/store/appStore.ts`, update the import:

```ts
import type { Argument, Philosopher, PhilosopherIndexEntry, Relationship, Theme, Work } from "../data/schemas";
```

Extend `AppState`:

```ts
  works: Work[];
```

Extend `setBootstrapData` input:

```ts
    works: Work[];
```

Add initial state:

```ts
  works: [],
```

- [ ] **Step 2: Load works during bootstrap**

In `src/ui/AppShell.tsx`, add `getWorks` to the client import:

```ts
  getWorks,
```

Replace the bootstrap `Promise.all` with:

```ts
    Promise.all([getPhilosopherIndex(), getThemes(), getRelationships(), getArgumentIndex(), getWorks()])
      .then(([philosophers, themes, relationships, argumentsIndex, works]) =>
        setBootstrapData({ philosophers, themes, relationships, argumentsIndex, works }),
      )
      .catch((error) => setLoadError(error instanceof Error ? error.message : String(error)));
```

- [ ] **Step 3: Replace the thought-system rendering in `PhilosopherPanel`**

In `src/ui/PhilosopherPanel.tsx`, add these store selectors after `noteBody`:

```ts
  const works = useAppStore((state) => state.works);
  const selectedThoughtProblemId = useAppStore((state) => state.selectedThoughtProblemId);
  const selectedThoughtClaimId = useAppStore((state) => state.selectedThoughtClaimId);
  const selectThoughtProblem = useAppStore((state) => state.selectThoughtProblem);
  const selectThoughtClaim = useAppStore((state) => state.selectThoughtClaim);
  const workTitleById = useMemo(() => new Map(works.map((work) => [work.id, work.titleZh])), [works]);
```

Replace the current `{philosopher.thoughtSystem && (...)}` block with:

```tsx
      {philosopher.thoughtSystem && (
        <section className="thought-system" aria-label={`${philosopher.names.zh}思想星系`}>
          <h3>思想星系</h3>
          {philosopher.thoughtSystem.problems.map((problem) => {
            const expanded = selectedThoughtProblemId === problem.id;

            return (
              <article className="thought-problem" key={problem.id}>
                <button
                  className="thought-problem-button"
                  type="button"
                  onClick={() => selectThoughtProblem(expanded ? null : problem.id)}
                  aria-expanded={expanded}
                >
                  {problem.titleZh}
                </button>
                <p className="muted">{problem.questionZh}</p>
                <p>{problem.summaryZh}</p>
                {expanded &&
                  problem.claims.map((claim) => {
                    const claimSelected = selectedThoughtClaimId === claim.id;

                    return (
                      <div className="thought-claim" key={claim.id}>
                        <button
                          className="thought-claim-button"
                          type="button"
                          onClick={() => selectThoughtClaim(claimSelected ? null : claim.id)}
                          aria-expanded={claimSelected}
                        >
                          {claim.titleZh}
                        </button>
                        <p>{claim.claimZh}</p>
                        {claimSelected && (
                          <div className="thought-claim-detail">
                            <p>{claim.explanationZh}</p>
                            {claim.evidence.map((evidence) => {
                              const workTitle = evidence.source.workId
                                ? workTitleById.get(evidence.source.workId) ?? evidence.source.workId
                                : "未绑定作品";

                              return (
                                <div className="thought-evidence" key={evidence.id}>
                                  <strong>{evidence.titleZh}</strong>
                                  <p>{evidence.summaryZh}</p>
                                  <p className="muted">
                                    {workTitle}
                                    {evidence.source.locator ? ` · ${evidence.source.locator}` : ""}
                                    {" · "}
                                    {evidence.source.excerptStatus === "public_domain"
                                      ? "公版摘录"
                                      : evidence.source.excerptStatus === "summary_only"
                                        ? "摘要"
                                        : "无摘录"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </article>
            );
          })}
        </section>
      )}
```

- [ ] **Step 4: Add panel styles**

In `src/styles/theme.css`, add:

```css
.thought-problem-button,
.thought-claim-button {
  width: 100%;
  border: 0;
  padding: 0;
  color: var(--gold-soft);
  background: transparent;
  text-align: left;
  font-weight: 700;
}

.thought-problem-button:hover,
.thought-claim-button:hover {
  color: var(--gold);
}

.thought-claim-detail {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 210, 122, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}

.thought-evidence {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 5: Run smoke and unit verification**

Run:

```bash
npm test -- src/store/appStore.test.ts src/domain/layout/starLayout.test.ts src/scene/PhilosopherStars.test.ts
npm run build
npm run test:smoke -- --project=chromium-desktop
```

Expected: unit tests pass, build passes, desktop smoke test passes and confirms expandable claim details plus evidence metadata.

- [ ] **Step 6: Commit the panel/source metadata change**

Run:

```bash
git add -f src/store/appStore.ts src/ui/AppShell.tsx src/ui/PhilosopherPanel.tsx src/styles/theme.css tests/smoke.spec.ts
git commit -m "feat: show thought claim sources"
```

Expected: commit succeeds with store, app shell, panel, style, and smoke-test files staged.

## Task 6: Final Cross-Viewport Verification

**Files:**
- Modify only if verification exposes a bug.

- [ ] **Step 1: Run all local tests**

Run:

```bash
npm test
npm run build
npm run test:smoke
```

Expected: Vitest, TypeScript/Vite build, and Playwright smoke tests pass.

- [ ] **Step 2: Start the local dev server for manual verification**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 3: Verify the app manually in the browser**

Open the Vite URL and verify:

```text
1. The star field is nonblank.
2. Ancient/classical anchor figures render closer to the center than modern figures.
3. Same-civilization schools use related but distinguishable colors.
4. Searching 柏拉图 opens the detail panel.
5. Clicking 理念与真实 expands claim buttons.
6. Clicking 理念高于可感事物 shows explanation and evidence/source metadata.
7. Closing the philosopher panel clears the selected philosopher and hides local thought satellites.
```

- [ ] **Step 4: Stop the dev server**

Press `Ctrl-C` in the terminal running Vite.

Expected: the dev server exits cleanly.

- [ ] **Step 5: Commit any verification fix**

If Step 3 exposed a bug and you fixed it, run:

```bash
git add -f src tests
git commit -m "fix: polish universe grammar interactions"
```

Expected: commit succeeds only when a verification fix was needed. If no fix was needed, do not create an empty commit.

## Self-Review

Spec coverage:

- Chronology radius is covered by Task 1.
- Civilization/school color families are covered by Task 2.
- One selected philosopher's local thought system is covered by Tasks 3 and 4.
- Expandable concept-to-claim behavior is covered by Tasks 4 and 5.
- Claim explanation plus source/evidence metadata is covered by Task 5.
- Static-site compatibility and smoke verification are covered by Task 6.

Placeholder scan:

- This plan contains no unresolved placeholder markers or unnamed validation steps.
- Each code-changing task includes concrete paths, code blocks, commands, expected results, and a commit step.

Type consistency:

- `StarLayoutNode.periodBucket` is defined in Task 1 and used only by layout tests.
- `StarLayoutNode.colorKey` remains a string and is interpreted by `getStarColor` in Task 2.
- `selectedThoughtProblemId`, `selectedThoughtClaimId`, `selectThoughtProblem`, and `selectThoughtClaim` are defined in Task 3 and consumed by Tasks 4 and 5.
- `works` is added to the store in Task 5 before `PhilosopherPanel` reads it.
