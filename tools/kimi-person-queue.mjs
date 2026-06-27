import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateResearchBatch } from "./validate-kimi-research.mjs";

export const STAGES = [
  {
    id: "sources-notes",
    label: "sources and notes",
    expectedFiles: ["brief.md", "sources.md", "notes.md", "open-questions.md", "works-candidates.json"],
  },
  {
    id: "claims",
    label: "claims",
    expectedFiles: ["claims.json"],
  },
  {
    id: "thought-system",
    label: "thought system",
    expectedFiles: ["thought-systems.json"],
  },
];

const DEFAULT_QUEUE_ROOT = ".research/tmp/kimi/person-queue";
const PEOPLE_ROOT = ".research/tmp/kimi/people";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function relativeToProject(projectRoot, file) {
  return toPosix(path.relative(projectRoot, file));
}

function resolveProjectPath(projectRoot, maybeRelative) {
  return path.isAbsolute(maybeRelative) ? maybeRelative : path.join(projectRoot, maybeRelative);
}

function nowIso() {
  return new Date().toISOString();
}

function loadPhilosophers(projectRoot) {
  const index = readJson(path.join(projectRoot, "public/data/philosophers.index.json"));
  return index.map((entry) => ({
    entry,
    detail: readJson(path.join(projectRoot, "public/data/philosophers", entry.id + ".json")),
  }));
}

function loadWorksByPhilosopher(projectRoot) {
  const works = readJson(path.join(projectRoot, "public/data/works.json"));
  const byPhilosopher = new Map();
  for (const work of works) {
    if (!byPhilosopher.has(work.philosopherId)) byPhilosopher.set(work.philosopherId, []);
    byPhilosopher.get(work.philosopherId).push(work);
  }
  return byPhilosopher;
}

function findLegacyThoughtSystemResearch(projectRoot) {
  const root = path.join(projectRoot, ".research/tmp/kimi");
  const completed = new Map();
  if (!fs.existsSync(root)) return completed;

  for (const name of fs.readdirSync(root)) {
    if (["queue", "person-queue", "people"].includes(name)) continue;
    const candidateDir = path.join(root, name);
    if (!fs.statSync(candidateDir).isDirectory()) continue;
    const thoughtSystemsPath = path.join(candidateDir, "thought-systems.json");
    if (!fs.existsSync(thoughtSystemsPath)) continue;
    try {
      const value = readJson(thoughtSystemsPath);
      for (const item of value.items ?? []) {
        if (typeof item.philosopherId === "string" && item.philosopherId.length > 0) {
          completed.set(item.philosopherId, relativeToProject(projectRoot, candidateDir));
        }
      }
    } catch {
      // Temporary research is allowed to stay messy until validate:kimi reviews it.
    }
  }

  return completed;
}

function workLinesForPrompt(works) {
  if (works.length === 0) {
    return "- 当前 public/data/works.json 没有该哲人的作品；thought-system 阶段如需 workId，必须先人工补正式 works.json。";
  }
  return works
    .map((work) => "- " + work.id + " | " + work.titleZh + (work.titleEn ? " / " + work.titleEn : ""))
    .join("\n");
}

function promptHeader(detail, works, outputDir) {
  return [
    "你是 Decisive Moments in History 项目的资料研究员。",
    "",
    "硬性规则：",
    "- 只研究 1 位哲人：" + detail.names.zh + " / " + detail.names.en + " (" + detail.id + ")。",
    "- 不要一次处理多位哲人，不要继续上一个 Kimi 会话的上下文。",
    "- 不要修改 src/、public/data/、tools/ 或测试。",
    "- 所有输出只写入暂存目录：" + outputDir + "/",
    "- 使用中文整理研究结论，来源 ID 必须引用 sources.md 里的 S###。",
    "",
    "哲人资料：",
    "- id: " + detail.id,
    "- 中文名: " + detail.names.zh,
    "- 英文名: " + detail.names.en,
    "- 生卒: " + detail.life.display,
    "- civilization: " + detail.civilization,
    "- traditions: " + detail.traditions.join(", "),
    "- themes: " + detail.themes.join(", "),
    "- oneLineZh: " + detail.oneLineZh,
    "",
    "现有正式作品 workId（thought-system 证据只能使用这些 workId）：",
    workLinesForPrompt(works),
    "",
  ].join("\n");
}

function sourcesNotesPrompt(detail, works, outputDir) {
  return (
    promptHeader(detail, works, outputDir) +
    [
      "本阶段只做 sources + notes，不生成 claims.json 或 thought-systems.json。",
      "",
      "请在暂存目录生成：",
      "1. brief.md",
      "2. sources.md",
      "3. notes.md",
      "4. open-questions.md",
      "5. works-candidates.json",
      "",
      "采集要求：",
      "- 使用 6-10 个高质量来源，优先 primary / institutional / scholarly。",
      "- Wikipedia 只能 discovery，不作为最终 claim 依据。",
      "- notes.md 按核心问题分组，每条笔记带 S###。",
      "- works-candidates.json 只记录候选作品信息；不要把候选作品 ID 当成正式 workId。",
      "",
    ].join("\n")
  );
}

function claimsPrompt(detail, works, outputDir) {
  return (
    promptHeader(detail, works, outputDir) +
    [
      "本阶段只生成 claims.json。请读取同一暂存目录已有的 sources.md、notes.md、open-questions.md。",
      "",
      "claims.json 必须是：",
      "{",
      '  "schemaVersion": 1,',
      '  "items": []',
      "}",
      "",
      "要求：",
      "- 生成 8-12 条 claim，覆盖 fact / interpretation / reception / work / uncertain 中适合的类型。",
      "- id 形如 " + detail.id + ":fact:001 或 " + detail.id + ":interpretation:001。",
      '- 每条 claim 必须有 sourceIds、confidence、reviewStatus: "needs_human_review"。',
      "- 不要生成 thought-systems.json。",
      "",
    ].join("\n")
  );
}

function thoughtSystemPrompt(detail, works, outputDir) {
  return (
    promptHeader(detail, works, outputDir) +
    [
      "本阶段只生成 thought-systems.json。请读取同一暂存目录已有的 sources.md、notes.md、claims.json、open-questions.md。",
      "",
      "thought-systems.json 必须是：",
      "{",
      '  "schemaVersion": 1,',
      '  "items": [',
      "    {",
      '      "philosopherId": "' + detail.id + '",',
      '      "problems": []',
      "    }",
      "  ]",
      "}",
      "",
      "要求：",
      "- 只生成 1 个 item，philosopherId 必须是 " + detail.id + "。",
      "- problems 2-3 个，每个 problem 下 claims 2-3 条，每条 claim 下 evidence 1-2 条。",
      "- problems -> claims -> evidence 的核心字段要匹配 src/data/schemas.ts 的 philosopherThoughtSystemSchema。",
      "- 每层都保留临时 sourceIds，供人工审核；admit:kimi 会在落库时剥离。",
      "- evidence.source.workId 只能使用上面列出的正式 workId。不要创造新的 workId，不要使用 *-candidate。",
      "- 如果某条证据来自未落库作品，可以写 locator 和 summary，把作品建议保留在 works-candidates.json，不要在 thought-systems.json 中放候选 workId。",
      "",
    ].join("\n")
  );
}

function stagePrompt(stage, detail, works, outputDir) {
  if (stage.id === "sources-notes") return sourcesNotesPrompt(detail, works, outputDir);
  if (stage.id === "claims") return claimsPrompt(detail, works, outputDir);
  return thoughtSystemPrompt(detail, works, outputDir);
}

function buildPersonEntry({ projectRoot, queueRoot, detail, works, legacyDir }) {
  const outputDir = toPosix(path.join(PEOPLE_ROOT, detail.id));
  fs.mkdirSync(path.join(projectRoot, outputDir), { recursive: true });

  const promptDir = path.join(queueRoot, "prompts", detail.id);
  const logDir = path.join(queueRoot, "logs", detail.id);
  fs.mkdirSync(promptDir, { recursive: true });
  fs.mkdirSync(logDir, { recursive: true });

  const stages = STAGES.map((stage) => {
    const promptPath = path.join(promptDir, stage.id + ".prompt.txt");
    const logPath = path.join(logDir, stage.id + ".log");
    fs.writeFileSync(promptPath, stagePrompt(stage, detail, works, outputDir));
    return {
      id: stage.id,
      status: legacyDir ? "done_legacy" : "pending",
      promptPath: relativeToProject(projectRoot, promptPath),
      logPath: relativeToProject(projectRoot, logPath),
      expectedFiles: stage.expectedFiles,
    };
  });

  return {
    philosopherId: detail.id,
    names: detail.names,
    civilization: detail.civilization,
    traditions: detail.traditions,
    themes: detail.themes,
    outputDir,
    status: legacyDir ? "research_complete_needs_review" : "pending",
    legacyResearchDir: legacyDir,
    stages,
  };
}

function writeQueueReadme(queueRoot, manifest) {
  const readme = [
    "# Kimi Person Queue",
    "",
    "This queue uses one philosopher per session and one stage per Kimi call.",
    "",
    "Run order:",
    "",
    "1. sources-notes",
    "2. claims",
    "3. thought-system",
    "",
    "Commands:",
    "",
    "- npm run kimi:queue -- init regenerates this queue.",
    "- npm run kimi:queue -- next prints the next pending stage.",
    "- npm run kimi:queue -- run-next runs one Kimi stage and writes status back to manifest.json.",
    "",
    "Current people in queue: " + manifest.people.length,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(queueRoot, "README.md"), readme);
}

export function buildPersonQueue(options = {}) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  const queueRoot = path.resolve(options.queueRoot ?? path.join(projectRoot, DEFAULT_QUEUE_ROOT));
  const createdAt = options.createdAt ?? nowIso();
  const philosophers = loadPhilosophers(projectRoot);
  const worksByPhilosopher = loadWorksByPhilosopher(projectRoot);
  const legacy = findLegacyThoughtSystemResearch(projectRoot);

  fs.mkdirSync(queueRoot, { recursive: true });
  const people = philosophers
    .filter(({ detail }) => !detail.thoughtSystem)
    .map(({ detail }) =>
      buildPersonEntry({
        projectRoot,
        queueRoot,
        detail,
        works: worksByPhilosopher.get(detail.id) ?? [],
        legacyDir: legacy.get(detail.id),
      }),
    );

  const manifest = {
    schemaVersion: 1,
    queueVersion: 2,
    createdAt,
    projectRoot,
    unitPolicy: "one philosopher per session; one stage per Kimi session; do not carry Kimi context across stages",
    stages: STAGES,
    people,
  };
  writeJson(path.join(queueRoot, "manifest.json"), manifest);
  writeQueueReadme(queueRoot, manifest);
  return manifest;
}

export function detectKimiRateLimit(output) {
  return /429|rate_limit_reached_error|usage limit/i.test(output);
}

export function findNextStage(manifest) {
  for (const person of manifest.people) {
    for (const stage of person.stages) {
      if (stage.status === "pending" || stage.status === "blocked_rate_limit") {
        return { philosopherId: person.philosopherId, stageId: stage.id, person, stage };
      }
    }
  }
  return undefined;
}

function derivePersonStatus(person) {
  if (person.stages.some((stage) => stage.status === "blocked_rate_limit")) return "blocked_rate_limit";
  if (person.stages.some((stage) => stage.status === "running")) return "running";
  if (person.stages.some((stage) => stage.status === "failed")) return "failed";
  if (person.stages.every((stage) => stage.status === "done" || stage.status === "done_legacy")) {
    return "research_complete_needs_review";
  }
  return "pending";
}

function updateStage(manifest, philosopherId, stageId, patch) {
  const person = manifest.people.find((item) => item.philosopherId === philosopherId);
  assert(person, "unknown queue philosopher: " + philosopherId);
  const stage = person.stages.find((item) => item.id === stageId);
  assert(stage, "unknown queue stage: " + philosopherId + " / " + stageId);
  Object.assign(stage, patch, { updatedAt: nowIso() });
  person.status = derivePersonStatus(person);
  manifest.updatedAt = nowIso();
  return { person, stage };
}

function missingExpectedFiles(projectRoot, person, stage) {
  const outputDir = path.join(projectRoot, person.outputDir);
  return stage.expectedFiles.filter((file) => !fs.existsSync(path.join(outputDir, file)));
}

export function runNextStage(options = {}) {
  const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
  const queueRoot = path.resolve(options.queueRoot ?? path.join(projectRoot, DEFAULT_QUEUE_ROOT));
  const manifestPath = path.join(queueRoot, "manifest.json");
  assert(fs.existsSync(manifestPath), "missing person queue manifest; run npm run kimi:queue -- init first");
  const manifest = readJson(manifestPath);
  const next = findNextStage(manifest);
  if (!next) return { status: "idle", message: "no pending Kimi stages" };

  updateStage(manifest, next.philosopherId, next.stageId, { status: "running", startedAt: nowIso(), lastError: undefined });
  writeJson(manifestPath, manifest);

  const promptPath = resolveProjectPath(projectRoot, next.stage.promptPath);
  const logPath = resolveProjectPath(projectRoot, next.stage.logPath);
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const result = spawnSync(options.kimiCommand ?? "kimi-cli", ["--work-dir", projectRoot, "--print", "--input-format", "text"], {
    input: fs.readFileSync(promptPath, "utf8"),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n");
  fs.writeFileSync(logPath, output);

  if (detectKimiRateLimit(output)) {
    updateStage(manifest, next.philosopherId, next.stageId, {
      status: "blocked_rate_limit",
      finishedAt: nowIso(),
      lastError: "Kimi rate limit detected in CLI output",
    });
    writeJson(manifestPath, manifest);
    return { status: "blocked_rate_limit", philosopherId: next.philosopherId, stageId: next.stageId, logPath };
  }

  if (result.error || result.status !== 0) {
    updateStage(manifest, next.philosopherId, next.stageId, {
      status: "failed",
      finishedAt: nowIso(),
      lastError: result.error?.message ?? "Kimi exited with code " + result.status,
    });
    writeJson(manifestPath, manifest);
    return { status: "failed", philosopherId: next.philosopherId, stageId: next.stageId, logPath };
  }

  const missing = missingExpectedFiles(projectRoot, next.person, next.stage);
  if (missing.length > 0) {
    updateStage(manifest, next.philosopherId, next.stageId, {
      status: "failed",
      finishedAt: nowIso(),
      lastError: "missing expected files: " + missing.join(", "),
    });
    writeJson(manifestPath, manifest);
    return { status: "failed", philosopherId: next.philosopherId, stageId: next.stageId, logPath, missing };
  }

  if (next.stageId === "thought-system") {
    try {
      validateResearchBatch(path.join(projectRoot, next.person.outputDir));
    } catch (error) {
      updateStage(manifest, next.philosopherId, next.stageId, {
        status: "failed",
        finishedAt: nowIso(),
        lastError: error.message,
      });
      writeJson(manifestPath, manifest);
      return { status: "failed", philosopherId: next.philosopherId, stageId: next.stageId, logPath, validationError: error.message };
    }
  }

  updateStage(manifest, next.philosopherId, next.stageId, { status: "done", finishedAt: nowIso() });
  writeJson(manifestPath, manifest);
  return { status: "done", philosopherId: next.philosopherId, stageId: next.stageId, logPath };
}

function readManifest(projectRoot, queueRoot) {
  const manifestPath = path.join(queueRoot, "manifest.json");
  assert(fs.existsSync(manifestPath), "missing person queue manifest; run npm run kimi:queue -- init first");
  return readJson(manifestPath);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = { command: args.shift() ?? "help" };
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === "--project-root") {
      options.projectRoot = args.shift();
      assert(options.projectRoot, "--project-root needs a value");
    } else if (arg === "--queue-root") {
      options.queueRoot = args.shift();
      assert(options.queueRoot, "--queue-root needs a value");
    } else if (arg === "--kimi-command") {
      options.kimiCommand = args.shift();
      assert(options.kimiCommand, "--kimi-command needs a value");
    } else {
      throw new Error("unknown argument: " + arg);
    }
  }
  return options;
}

function printNext(projectRoot, queueRoot) {
  const manifest = readManifest(projectRoot, queueRoot);
  const next = findNextStage(manifest);
  if (!next) {
    console.log("kimi person queue idle: no pending stages");
    return;
  }
  console.log("next Kimi stage: " + next.philosopherId + " / " + next.stageId);
  console.log("prompt: " + next.stage.promptPath);
  console.log("output: " + next.person.outputDir);
  console.log("log: " + next.stage.logPath);
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const projectRoot = path.resolve(options.projectRoot ?? process.cwd());
    const queueRoot = path.resolve(options.queueRoot ?? path.join(projectRoot, DEFAULT_QUEUE_ROOT));
    if (options.command === "init") {
      const manifest = buildPersonQueue({ projectRoot, queueRoot });
      console.log("kimi person queue ready: " + manifest.people.length + " philosophers");
      console.log("manifest: " + path.join(queueRoot, "manifest.json"));
    } else if (options.command === "next") {
      printNext(projectRoot, queueRoot);
    } else if (options.command === "run-next") {
      const result = runNextStage({ projectRoot, queueRoot, kimiCommand: options.kimiCommand });
      console.log("kimi person queue stage " + result.status);
      if (result.philosopherId) console.log("unit: " + result.philosopherId + " / " + result.stageId);
      if (result.logPath) console.log("log: " + result.logPath);
      if (result.message) console.log(result.message);
      if (result.status === "blocked_rate_limit" || result.status === "failed") process.exit(2);
    } else {
      console.log("Usage: node tools/kimi-person-queue.mjs <init|next|run-next> [--project-root dir] [--queue-root dir] [--kimi-command kimi-cli]");
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
