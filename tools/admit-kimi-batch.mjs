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
  return {
    batchDir,
    dataDir,
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

export function admitKimiBatch(options) {
  const normalized = normalizeOptions(options);
  validateResearchBatch(normalized.batchDir);

  const philosophersPath = path.join(normalized.batchDir, "proposed-philosophers.json");
  const worksPath = path.join(normalized.batchDir, "proposed-works.json");
  const relationshipsPath = path.join(normalized.batchDir, "proposed-relationships.json");
  const thoughtSystemsPath = path.join(normalized.batchDir, "thought-systems.json");

  const proposedPhilosophers = readVersionedItems(philosophersPath, "proposed-philosophers.json");
  const proposedWorks = readVersionedItems(worksPath, "proposed-works.json").map((item) => workSchema.parse(item));
  const proposedRelationships = readVersionedItems(relationshipsPath, "proposed-relationships.json").map((item) =>
    relationshipSchema.parse(item),
  );
  const thoughtSystems = readVersionedItems(thoughtSystemsPath, "thought-systems.json");

  uniqueById(proposedPhilosophers, "proposed-philosophers.json");
  uniqueById(proposedWorks, "proposed-works.json");
  uniqueById(proposedRelationships, "proposed-relationships.json");

  const thoughtByPhilosopherId = new Map(thoughtSystems.map((item) => [item.philosopherId, item]));
  const proposedPhilosopherIds = new Set(proposedPhilosophers.map((item) => item.id));

  for (const item of proposedPhilosophers) {
    assert(thoughtByPhilosopherId.has(item.id), "missing thought-system for proposed philosopher: " + item.id);
  }
  for (const item of thoughtSystems) {
    assert(proposedPhilosopherIds.has(item.philosopherId), "thought-system has no proposed philosopher: " + item.philosopherId);
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
    const parsed = philosopherSchema.parse({
      ...item,
      thoughtSystem: {
        problems: thought.problems,
      },
    });
    assertKnownWorkIds(parsed, worksById);
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
      console.error("Usage: node tools/admit-kimi-batch.mjs <research-batch-dir> [--write] [--overwrite] [--data-dir public/data]");
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
