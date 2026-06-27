import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { philosopherSchema } from "../src/data/schemas.ts";
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

function loadWorksById(dataDir) {
  const file = path.join(dataDir, "works.json");
  assert(fs.existsSync(file), "missing required file: works.json");
  const works = readJson(file);
  assert(Array.isArray(works), "works.json must be an array");
  return new Map(works.map((work) => [work.id, work]));
}

function assertKnownWorkIds(item, worksById) {
  for (const problem of item.problems ?? []) {
    for (const claim of problem.claims ?? []) {
      for (const evidence of claim.evidence ?? []) {
        const workId = evidence.source?.workId;
        if (!workId) continue;
        const work = worksById.get(workId);
        assert(work, item.philosopherId + " references unknown workId: " + workId);
        assert(
          work.philosopherId === item.philosopherId,
          item.philosopherId + " references workId belongs to another philosopher: " + workId,
        );
      }
    }
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
    philosopherIds: options.philosopherIds ? new Set(options.philosopherIds) : undefined,
  };
}

export function admitThoughtSystems(options) {
  const normalized = normalizeOptions(options);
  validateResearchBatch(normalized.batchDir);

  const thoughtSystemsPath = path.join(normalized.batchDir, "thought-systems.json");
  const items = readVersionedItems(thoughtSystemsPath, "thought-systems.json").filter((item) => {
    return !normalized.philosopherIds || normalized.philosopherIds.has(item.philosopherId);
  });

  const worksById = loadWorksById(normalized.dataDir);
  const seen = new Set();
  const planned = [];
  const writes = [];

  for (const item of items) {
    assert(typeof item.philosopherId === "string" && item.philosopherId.length > 0, "thought-system item has missing philosopherId");
    assert(!seen.has(item.philosopherId), "duplicate philosopherId in thought-systems.json: " + item.philosopherId);
    seen.add(item.philosopherId);

    const file = path.join(normalized.dataDir, "philosophers", item.philosopherId + ".json");
    assert(fs.existsSync(file), "unknown philosopher detail: " + item.philosopherId);
    const detail = readJson(file);
    assert(detail.id === item.philosopherId, "detail id mismatch for " + item.philosopherId);
    assert(!detail.thoughtSystem || normalized.overwrite, item.philosopherId + " already has thoughtSystem; use --overwrite to replace it");
    assertKnownWorkIds(item, worksById);

    const next = philosopherSchema.parse({
      ...detail,
      thoughtSystem: {
        problems: item.problems,
      },
    });
    const action = detail.thoughtSystem ? "replace" : "add";
    planned.push({ philosopherId: item.philosopherId, action, file });
    writes.push({ philosopherId: item.philosopherId, file, detail: next });
  }

  const written = [];
  if (normalized.write) {
    for (const item of writes) {
      writeJson(item.file, item.detail);
      written.push({ philosopherId: item.philosopherId, file: item.file });
    }
  }

  return {
    dryRun: !normalized.write,
    planned,
    written,
  };
}

function parseArgs(argv) {
  const args = [...argv];
  const options = { philosopherIds: [] };
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--write") {
      options.write = true;
    } else if (arg === "--overwrite") {
      options.overwrite = true;
    } else if (arg === "--data-dir") {
      options.dataDir = args.shift();
      assert(options.dataDir, "--data-dir needs a value");
    } else if (arg === "--philosopher") {
      const id = args.shift();
      assert(id, "--philosopher needs a value");
      options.philosopherIds.push(id);
    } else if (!options.batchDir) {
      options.batchDir = arg;
    } else {
      throw new Error("unknown argument: " + arg);
    }
  }
  if (options.philosopherIds.length === 0) delete options.philosopherIds;
  return options;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (!options.batchDir) {
      console.error("Usage: node tools/admit-kimi-thought-systems.mjs <research-batch-dir> [--write] [--overwrite] [--data-dir public/data] [--philosopher id]");
      process.exit(1);
    }
    const result = admitThoughtSystems(options);
    const mode = result.dryRun ? "dry run" : "written";
    console.log("kimi thought-system admission " + mode + ": " + result.planned.length + " planned, " + result.written.length + " written");
    for (const item of result.planned) {
      console.log("- " + item.action + " " + item.philosopherId + " -> " + item.file);
    }
    if (result.dryRun && result.planned.length > 0) {
      console.log("Re-run with --write after human review to update public/data.");
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
