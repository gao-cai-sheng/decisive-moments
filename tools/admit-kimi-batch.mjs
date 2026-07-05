import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  philosopherIndexEntrySchema,
  philosopherSchema,
  relationshipSchema,
  workSchema,
} from "../src/data/schemas.ts";
import { validateResearchBatch } from "./validate-kimi-research.mjs";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readVersionedItems(file, label) {
  assert(fs.existsSync(file), "missing required file: " + label);
  const value = readJson(file);
  assert(value && typeof value === "object" && !Array.isArray(value), label + " must be an object");
  assert(value.schemaVersion === 1, label + " must set schemaVersion: 1");
  assert(Array.isArray(value.items), label + " must contain an items array");
  return value.items;
}

function uniqueById(items, label) {
  const seen = new Set();
  for (const item of items) {
    assert(typeof item.id === "string" && item.id.length > 0, label + " item has missing id");
    assert(!seen.has(item.id), label + " has duplicate id: " + item.id);
    seen.add(item.id);
  }
}

function normalizeOptions(options) {
  const batchDir = path.resolve(options.batchDir);
  const dataDir = path.resolve(options.dataDir ?? path.join(process.cwd(), "public", "data"));
  const tier = options.tier ?? "standard";
  assert(["standard", "seed"].includes(tier), "--tier must be standard or seed");
  return {
    batchDir,
    dataDir,
    tier,
    write: options.write === true,
    overwrite: options.overwrite === true,
  };
}

function indexEntryFromPhilosopher(proposed) {
  const { summaryZh, works, sourceNotes, thoughtSystem, ...indexEntry } = proposed;
  return philosopherIndexEntrySchema.parse(indexEntry);
}

function replaceOrAppend(existingItems, incomingItems, label, overwrite) {
  const result = [...existingItems];
  const indexById = new Map(result.map((item, index) => [item.id, index]));
  const planned = [];

  for (const item of incomingItems) {
    const existingIndex = indexById.get(item.id);
    if (existingIndex === undefined) {
      indexById.set(item.id, result.length);
      result.push(item);
      planned.push({ id: item.id, action: "add", label });
    } else {
      assert(overwrite, label + " already has id: " + item.id + "; use --overwrite to replace it");
      result[existingIndex] = item;
      planned.push({ id: item.id, action: "replace", label });
    }
  }

  return { result, planned };
}

function assertKnownWorkIds(philosopher, worksById) {
  for (const problem of philosopher.thoughtSystem?.problems ?? []) {
    for (const claim of problem.claims ?? []) {
      for (const evidence of claim.evidence ?? []) {
        const workId = evidence.source?.workId;
        if (!workId) continue;
        const work = worksById.get(workId);
        assert(work, philosopher.id + " references unknown workId: " + workId);
        assert(
          work.philosopherId === philosopher.id,
          philosopher.id + " references workId belongs to another philosopher: " + workId,
        );
      }
    }
  }
}

function isPlaceholderWorkId(id) {
  return /(?:primary-work|placeholder|candidate)$/i.test(id || "");
}

function assertSeedIdentity(philosopher, relationships, worksById) {
  assert(!philosopher.thoughtSystem, "seed tier cannot include thoughtSystem: " + philosopher.id);
  assert(Array.isArray(philosopher.sourceNotes) && philosopher.sourceNotes.length > 0, philosopher.id + " seed tier needs sourceNotes");
  assert(Array.isArray(philosopher.works) && philosopher.works.length >= 1 && philosopher.works.length <= 2, philosopher.id + " seed tier needs 1-2 works");
  for (const workId of philosopher.works) {
    assert(!isPlaceholderWorkId(workId), philosopher.id + " seed tier uses placeholder work: " + workId);
    const work = worksById.get(workId);
    assert(work, philosopher.id + " lists unknown work: " + workId);
    assert(work.philosopherId === philosopher.id, philosopher.id + " lists work belonging to another philosopher: " + workId);
  }
  const relationshipCount = relationships.filter((relationship) => relationship.from === philosopher.id || relationship.to === philosopher.id).length;
  assert(relationshipCount >= 2 && relationshipCount <= 3, philosopher.id + " seed tier needs 2-3 relationships, got " + relationshipCount);
}

function readThoughtSystemsForTier(thoughtSystemsPath, tier) {
  if (tier === "seed") {
    if (!fs.existsSync(thoughtSystemsPath)) return [];
    const items = readVersionedItems(thoughtSystemsPath, "thought-systems.json");
    assert(items.length === 0, "seed tier batch cannot include thoughtSystem payloads");
    return [];
  }
  return readVersionedItems(thoughtSystemsPath, "thought-systems.json");
}

export function admitKimiBatch(options) {
  const normalized = normalizeOptions(options);
  const thoughtSystemsPath = path.join(normalized.batchDir, "thought-systems.json");
  const thoughtSystems = readThoughtSystemsForTier(thoughtSystemsPath, normalized.tier);
  validateResearchBatch(normalized.batchDir);

  const philosophersPath = path.join(normalized.batchDir, "proposed-philosophers.json");
  const worksPath = path.join(normalized.batchDir, "proposed-works.json");
  const relationshipsPath = path.join(normalized.batchDir, "proposed-relationships.json");

  const proposedPhilosophers = readVersionedItems(philosophersPath, "proposed-philosophers.json").map((item) => {
    assert(!item.tier || item.tier === normalized.tier, item.id + " tier does not match --tier " + normalized.tier);
    return { ...item, tier: normalized.tier };
  });
  const proposedWorks = readVersionedItems(worksPath, "proposed-works.json").map((item) => workSchema.parse(item));
  const proposedRelationships = readVersionedItems(relationshipsPath, "proposed-relationships.json").map((item) =>
    relationshipSchema.parse(item),
  );

  uniqueById(proposedPhilosophers, "proposed-philosophers.json");
  uniqueById(proposedWorks, "proposed-works.json");
  uniqueById(proposedRelationships, "proposed-relationships.json");

  const thoughtByPhilosopherId = new Map(thoughtSystems.map((item) => [item.philosopherId, item]));
  const proposedPhilosopherIds = new Set(proposedPhilosophers.map((item) => item.id));

  if (normalized.tier === "standard") {
    for (const item of proposedPhilosophers) {
      assert(thoughtByPhilosopherId.has(item.id), "missing thought-system for proposed philosopher: " + item.id);
    }
    for (const item of thoughtSystems) {
      assert(proposedPhilosopherIds.has(item.philosopherId), "thought-system has no proposed philosopher: " + item.philosopherId);
    }
  }
  for (const work of proposedWorks) {
    assert(proposedPhilosopherIds.has(work.philosopherId), "proposed work has unknown proposed philosopher: " + work.id);
  }

  const philosophersIndexFile = path.join(normalized.dataDir, "philosophers.index.json");
  const worksFile = path.join(normalized.dataDir, "works.json");
  const relationshipsFile = path.join(normalized.dataDir, "relationships.json");
  const philosophersDir = path.join(normalized.dataDir, "philosophers");

  const philosophersIndex = readJson(philosophersIndexFile);
  const works = readJson(worksFile);
  const relationships = readJson(relationshipsFile);

  const existingPhilosopherIds = new Set(philosophersIndex.map((item) => item.id));
  const allPhilosopherIds = new Set([...existingPhilosopherIds, ...proposedPhilosopherIds]);
  for (const relationship of proposedRelationships) {
    assert(allPhilosopherIds.has(relationship.from), "relationship " + relationship.id + " has unknown from: " + relationship.from);
    assert(allPhilosopherIds.has(relationship.to), "relationship " + relationship.id + " has unknown to: " + relationship.to);
  }

  const workIds = new Set(works.map((item) => item.id));
  const incomingWorksById = new Map(proposedWorks.map((item) => [item.id, item]));
  const worksById = new Map([...works.map((item) => [item.id, item]), ...incomingWorksById]);

  const proposedDetails = proposedPhilosophers.map((item) => {
    const thought = thoughtByPhilosopherId.get(item.id);
    for (const workId of item.works ?? []) {
      assert(workIds.has(workId) || incomingWorksById.has(workId), item.id + " lists unknown work: " + workId);
    }
    const payload = normalized.tier === "standard"
      ? {
          ...item,
          thoughtSystem: {
            problems: thought.problems,
          },
        }
      : { ...item, thoughtSystem: undefined };
    const parsed = philosopherSchema.parse(payload);
    if (normalized.tier === "standard") assertKnownWorkIds(parsed, worksById);
    else assertSeedIdentity(parsed, proposedRelationships, worksById);
    return parsed;
  });

  const proposedIndexEntries = proposedDetails.map((item) => indexEntryFromPhilosopher(item));

  const indexMerge = replaceOrAppend(philosophersIndex, proposedIndexEntries, "philosophers.index.json", normalized.overwrite);
  const worksMerge = replaceOrAppend(works, proposedWorks, "works.json", normalized.overwrite);
  const relationshipsMerge = replaceOrAppend(relationships, proposedRelationships, "relationships.json", normalized.overwrite);

  const detailPlans = proposedDetails.map((detail) => {
    const file = path.join(philosophersDir, detail.id + ".json");
    const exists = fs.existsSync(file);
    assert(!exists || normalized.overwrite, detail.id + " detail already exists; use --overwrite to replace it");
    return { philosopherId: detail.id, action: exists ? "replace" : "add", file, detail };
  });

  if (normalized.write) {
    writeJson(philosophersIndexFile, indexMerge.result);
    writeJson(worksFile, worksMerge.result);
    writeJson(relationshipsFile, relationshipsMerge.result);
    for (const item of detailPlans) {
      writeJson(item.file, item.detail);
    }
  }

  return {
    dryRun: !normalized.write,
    planned: [
      ...indexMerge.planned,
      ...worksMerge.planned,
      ...relationshipsMerge.planned,
      ...detailPlans.map((item) => ({ id: item.philosopherId, action: item.action, label: "philosopher detail" })),
    ],
    counts: {
      philosophers: proposedDetails.length,
      works: proposedWorks.length,
      relationships: proposedRelationships.length,
    },
  };
}

function parseArgs(argv) {
  const args = [...argv];
  const options = {};
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--write") {
      options.write = true;
    } else if (arg === "--overwrite") {
      options.overwrite = true;
    } else if (arg === "--data-dir") {
      options.dataDir = args.shift();
      assert(options.dataDir, "--data-dir needs a value");
    } else if (arg === "--tier") {
      options.tier = args.shift();
      assert(options.tier, "--tier needs a value");
    } else if (!options.batchDir) {
      options.batchDir = arg;
    } else {
      throw new Error("unknown argument: " + arg);
    }
  }
  return options;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (!options.batchDir) {
      console.error("Usage: node tools/admit-kimi-batch.mjs <research-batch-dir> [--write] [--overwrite] [--tier standard|seed] [--data-dir public/data]");
      process.exit(1);
    }
    const result = admitKimiBatch(options);
    const mode = result.dryRun ? "dry run" : "written";
    console.log(
      "kimi batch admission " +
        mode +
        ": " +
        result.counts.philosophers +
        " philosophers, " +
        result.counts.works +
        " works, " +
        result.counts.relationships +
        " relationships",
    );
    for (const item of result.planned) {
      console.log("- " + item.action + " " + item.label + " " + item.id);
    }
    if (result.dryRun && result.planned.length > 0) {
      console.log("Re-run with --write after human review to update public/data.");
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
