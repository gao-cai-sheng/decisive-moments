import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const requiredFiles = ["brief.md", "sources.md", "notes.md", "claims.json", "open-questions.md"];
const claimTypes = new Set(["fact", "interpretation", "reception", "relationship", "timeline", "work", "legend", "uncertain"]);
const confidenceValues = new Set(["high", "medium", "low"]);

function assert(condition, errors, message) {
  if (!condition) errors.push(message);
}

function readJson(file, errors) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${path.basename(file)} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function sourceIdsFromMarkdown(markdown) {
  return new Set([...markdown.matchAll(/^##\s+(S\d+):/gm)].map((match) => match[1]));
}

function requireVersionedItems(value, fileName, errors) {
  assert(value && typeof value === "object" && !Array.isArray(value), errors, `${fileName} must be an object`);
  assert(value?.schemaVersion === 1, errors, `${fileName} must set schemaVersion: 1`);
  assert(Array.isArray(value?.items), errors, `${fileName} must contain an items array`);
  return Array.isArray(value?.items) ? value.items : [];
}

function assertUniqueId(item, ids, fileName, errors) {
  assert(typeof item.id === "string" && item.id.length > 0, errors, `${fileName} item has missing id`);
  if (typeof item.id === "string") {
    assert(!ids.has(item.id), errors, `${fileName} has duplicate id: ${item.id}`);
    ids.add(item.id);
  }
}

function assertKnownSourceIds(item, sourceIds, fileName, errors) {
  assert(Array.isArray(item.sourceIds) && item.sourceIds.length > 0, errors, `${fileName} ${item.id} needs sourceIds`);
  for (const sourceId of item.sourceIds ?? []) {
    assert(sourceIds.has(sourceId), errors, `${fileName} ${item.id} has unknown sourceId: ${sourceId}`);
  }
}

function validateClaims(items, sourceIds, errors) {
  const ids = new Set();
  for (const item of items) {
    assertUniqueId(item, ids, "claims.json", errors);
    assert(claimTypes.has(item.type), errors, `claims.json ${item.id} has invalid type`);
    assert(confidenceValues.has(item.confidence), errors, `claims.json ${item.id} has invalid confidence`);
    assert(item.reviewStatus === "needs_human_review", errors, `claims.json ${item.id} must use needs_human_review`);
    assertKnownSourceIds(item, sourceIds, "claims.json", errors);
  }
}

function validateTimeline(items, sourceIds, errors) {
  const ids = new Set();
  for (const item of items) {
    assertUniqueId(item, ids, "timeline.json", errors);
    assert(typeof item.date === "string" && item.date.length > 0, errors, `timeline.json ${item.id} has missing date`);
    assertKnownSourceIds(item, sourceIds, "timeline.json", errors);
  }
}

export function validateResearchBatch(batchDir) {
  const errors = [];

  for (const file of requiredFiles) {
    assert(fs.existsSync(path.join(batchDir, file)), errors, `missing required file: ${file}`);
  }

  const sourcesPath = path.join(batchDir, "sources.md");
  const sourceIds = fs.existsSync(sourcesPath)
    ? sourceIdsFromMarkdown(fs.readFileSync(sourcesPath, "utf8"))
    : new Set();
  assert(sourceIds.size > 0, errors, "sources.md must define at least one S### source");

  const briefPath = path.join(batchDir, "brief.md");
  const brief = fs.existsSync(briefPath) ? fs.readFileSync(briefPath, "utf8") : "";
  const requiresTimeline = /\btimeline\b/i.test(brief);
  const timelinePath = path.join(batchDir, "timeline.json");
  assert(!requiresTimeline || fs.existsSync(timelinePath), errors, "timeline.json is required when brief.md mentions timeline");

  const claims = requireVersionedItems(readJson(path.join(batchDir, "claims.json"), errors), "claims.json", errors);
  validateClaims(claims, sourceIds, errors);

  let timelineCount = 0;
  if (fs.existsSync(timelinePath)) {
    const timeline = requireVersionedItems(readJson(timelinePath, errors), "timeline.json", errors);
    timelineCount = timeline.length;
    validateTimeline(timeline, sourceIds, errors);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return {
    claims: claims.length,
    sources: sourceIds.size,
    timeline: timelineCount,
  };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const batchDir = process.argv[2];
  if (!batchDir) {
    console.error("Usage: node tools/validate-kimi-research.mjs <research-batch-dir>");
    process.exit(1);
  }
  const result = validateResearchBatch(path.resolve(batchDir));
  console.log(`kimi research ok: ${result.claims} claims, ${result.sources} sources, ${result.timeline} timeline items`);
}
