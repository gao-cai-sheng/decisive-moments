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

const philosopherIds = assertUnique(
  philosophersIndex,
  (item) => item.id,
  "philosophers.index.json",
);

for (const entry of philosophersIndex) {
  assertOptionalEnglish(entry, ["oneLineEn", "keywordsEn"], `index ${entry.id}`);
}
for (const work of works) {
  assertOptionalEnglish(work, ["titleEn", "noteEn"], `work ${work.id}`);
}
for (const theme of themes) {
  assertOptionalEnglish(theme, ["aliasesEn"], `theme ${theme.id}`);
}
const argumentIds = assertUnique(argumentsIndex, (item) => item.id, "arguments.index.json");
const themeIds = assertUnique(themes, (item) => item.id, "themes.json");
const workIds = assertUnique(works, (item) => item.id, "works.json");

if (process.env.RELEASE_DATA === "1") {
  assert(
    philosopherIds.size >= 100,
    `release data requires at least 100 philosophers, got ${philosopherIds.size}`,
  );
}

const relationshipCountByPhilosopher = new Map();
for (const relationship of relationships) {
  if (typeof relationship.from === "string") {
    relationshipCountByPhilosopher.set(relationship.from, (relationshipCountByPhilosopher.get(relationship.from) || 0) + 1);
  }
  if (typeof relationship.to === "string") {
    relationshipCountByPhilosopher.set(relationship.to, (relationshipCountByPhilosopher.get(relationship.to) || 0) + 1);
  }
}

function isPlaceholderWorkId(id) {
  return /(?:primary-work|placeholder|candidate)$/i.test(id || "");
}

// En 字段是 optional 的（内容翻译渐进推进），但填了就不许是空串/空数组——
// 空值会让前端 fallback 失效（显示空白而非回退中文）。
function assertOptionalEnglish(obj, fields, label) {
  if (!obj) return;
  for (const field of fields) {
    const value = obj[field];
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      assert(
        value.length > 0 && value.every((item) => typeof item === "string" && item.trim().length > 0),
        `${label}: ${field} must be a non-empty string array when present`,
      );
    } else {
      assert(
        typeof value === "string" && value.trim().length > 0,
        `${label}: ${field} must be a non-empty string when present`,
      );
    }
  }
}

const thoughtSystemPhilosopherIds = [];
const tierCounts = { standard: 0, seed: 0 };


for (const philosopher of philosophersIndex) {
  const detailPath = path.join(dataDir, "philosophers", `${philosopher.id}.json`);
  assert(fs.existsSync(detailPath), `missing philosopher detail: ${philosopher.id}`);
  const detail = readJson(detailPath);
  assert(detail.id === philosopher.id, "detail id mismatch: " + philosopher.id);
  assert(["standard", "seed"].includes(philosopher.tier), "invalid tier on index " + philosopher.id);
  assert(["standard", "seed"].includes(detail.tier), "invalid tier on " + detail.id);
  assert(detail.tier === philosopher.tier, "tier mismatch on " + detail.id + ": index=" + philosopher.tier + " detail=" + detail.tier);
  tierCounts[detail.tier] += 1;
  for (const theme of detail.themes) {
    assert(themeIds.has(theme), `unknown theme ${theme} on ${detail.id}`);
  }
  for (const work of detail.works) {
    assert(workIds.has(work), `unknown work ${work} on ${detail.id}`);
  }
  if (detail.tier === "seed") {
    assert(!detail.thoughtSystem, "seed philosopher cannot carry thoughtSystem: " + detail.id);
    assert(Array.isArray(detail.sourceNotes) && detail.sourceNotes.length > 0, "seed philosopher needs sourceNotes: " + detail.id);
    assert(Array.isArray(detail.works) && detail.works.length >= 1 && detail.works.length <= 2, "seed philosopher needs 1-2 works: " + detail.id);
    for (const work of detail.works) {
      assert(!isPlaceholderWorkId(work), "seed philosopher uses placeholder work: " + detail.id + " " + work);
    }
    const relationCount = relationshipCountByPhilosopher.get(detail.id) || 0;
    assert(relationCount >= 2 && relationCount <= 3, "seed philosopher needs 2-3 relationships: " + detail.id + " has " + relationCount);
  }
  assertOptionalEnglish(detail, ["oneLineEn", "summaryEn", "keywordsEn"], detail.id);
  for (const note of detail.sourceNotes ?? []) {
    assertOptionalEnglish(note, ["noteEn"], `${detail.id} sourceNote`);
  }
  if (detail.thoughtSystem) {
    thoughtSystemPhilosopherIds.push(detail.id);
    assert(
      detail.thoughtSystem.problems.length >= 3,
      `thoughtSystem on ${detail.id} needs at least 3 problems`,
    );
    for (const problem of detail.thoughtSystem.problems) {
      assertOptionalEnglish(problem, ["titleEn", "questionEn", "summaryEn"], problem.id);
      for (const theme of problem.themeIds) {
        assert(themeIds.has(theme), `thought problem ${problem.id} has unknown theme ${theme}`);
      }
      assert(problem.claims.length > 0, `thought problem ${problem.id} needs at least 1 claim`);
      for (const claim of problem.claims) {
        assertOptionalEnglish(claim, ["titleEn", "claimEn", "explanationEn"], claim.id);
        for (const theme of claim.themeIds) {
          assert(themeIds.has(theme), `thought claim ${claim.id} has unknown theme ${theme}`);
        }
        assert(claim.evidence.length > 0, `thought claim ${claim.id} needs at least 1 evidence item`);
        for (const evidence of claim.evidence) {
          assertOptionalEnglish(evidence, ["titleEn", "summaryEn"], evidence.id);
          assertOptionalEnglish(evidence.source, ["publicDomainExcerptEn"], evidence.id);
          if (evidence.source?.workId) {
            assert(
              workIds.has(evidence.source.workId),
              `thought evidence ${evidence.id} has unknown work ${evidence.source.workId}`,
            );
          }
          assert(
            ["none", "public_domain", "summary_only"].includes(evidence.source.excerptStatus),
            `thought evidence ${evidence.id} has invalid excerptStatus`,
          );
        }
      }
    }
  }
  assert(["draft", "reviewed"].includes(detail.reviewStatus), `invalid reviewStatus on ${detail.id}`);
}

if (process.env.RELEASE_DATA === "1") {
  assert(
    thoughtSystemPhilosopherIds.length >= 5,
    `release data requires at least 5 thought systems, got ${thoughtSystemPhilosopherIds.length}`,
  );
  for (const id of ["plato", "confucius"]) {
    assert(thoughtSystemPhilosopherIds.includes(id), `release data requires a thoughtSystem for ${id}`);
  }
}

for (const argument of argumentsIndex) {
  assertOptionalEnglish(argument, ["questionEn", "claimEn", "explanationEn", "keywordsEn"], argument.id);
  assertOptionalEnglish(argument.source, ["publicDomainExcerptEn"], argument.id);
  assert(
    philosopherIds.has(argument.philosopherId),
    `argument ${argument.id} has unknown philosopher ${argument.philosopherId}`,
  );
  for (const theme of argument.themeIds) {
    assert(themeIds.has(theme), `argument ${argument.id} has unknown theme ${theme}`);
  }
  if (argument.source?.workId) {
    assert(workIds.has(argument.source.workId), `argument ${argument.id} has unknown work ${argument.source.workId}`);
  }
  assert(
    ["none", "public_domain", "summary_only"].includes(argument.source.excerptStatus),
    `argument ${argument.id} has invalid excerptStatus`,
  );
  assert(["draft", "reviewed"].includes(argument.reviewStatus), `argument ${argument.id} has invalid reviewStatus`);
}

if (process.env.RELEASE_DATA === "1") {
  const argumentCountByPhilosopher = new Map();
  for (const argument of argumentsIndex) {
    argumentCountByPhilosopher.set(
      argument.philosopherId,
      (argumentCountByPhilosopher.get(argument.philosopherId) || 0) + 1,
    );
  }
  for (const philosopher of philosophersIndex) {
    assert(
      (argumentCountByPhilosopher.get(philosopher.id) || 0) >= 2,
      `release philosopher needs at least 2 arguments: ${philosopher.id}`,
    );
  }
}

const relationshipConnectedPhilosopherIds = new Set();
const relationshipThemeIds = new Set();
const relationshipTypes = new Set();

for (const relationship of relationships) {
  assertOptionalEnglish(relationship, ["noteEn"], relationship.id);
  assert(philosopherIds.has(relationship.from), `relationship ${relationship.id} has unknown from ${relationship.from}`);
  assert(philosopherIds.has(relationship.to), `relationship ${relationship.id} has unknown to ${relationship.to}`);
  relationshipConnectedPhilosopherIds.add(relationship.from);
  relationshipConnectedPhilosopherIds.add(relationship.to);
  relationshipTypes.add(relationship.type);
  for (const theme of relationship.themeIds) {
    assert(themeIds.has(theme), `relationship ${relationship.id} has unknown theme ${theme}`);
    relationshipThemeIds.add(theme);
  }
  assert(
    ["direct_student", "influence", "school", "shared_problem", "critique", "reception"].includes(
      relationship.type,
    ),
    `relationship ${relationship.id} has invalid type`,
  );
  assert([1, 2, 3].includes(relationship.strength), `relationship ${relationship.id} has invalid strength`);
  assert(
    ["high", "medium", "low"].includes(relationship.confidence),
    `relationship ${relationship.id} has invalid confidence`,
  );
  assert(
    ["draft", "reviewed"].includes(relationship.reviewStatus),
    `relationship ${relationship.id} has invalid reviewStatus`,
  );
}

if (process.env.RELEASE_DATA === "1") {
  assert(
    relationships.length >= 50,
    `release data requires at least 50 relationships, got ${relationships.length}`,
  );
  assert(
    relationshipConnectedPhilosopherIds.size >= 50,
    `release data relationships must connect at least 50 philosophers, got ${relationshipConnectedPhilosopherIds.size}`,
  );
  for (const theme of themeIds) {
    assert(relationshipThemeIds.has(theme), `release relationships must cover theme ${theme}`);
  }
  for (const type of ["direct_student", "influence", "school", "shared_problem", "critique", "reception"]) {
    assert(relationshipTypes.has(type), `release relationships must include type ${type}`);
  }
}

console.log(
  `data ok: ${philosopherIds.size} philosophers (standard ${tierCounts.standard} | seed ${tierCounts.seed}), ${argumentIds.size} arguments, ${relationships.length} relationships, ${themeIds.size} themes`,
);
