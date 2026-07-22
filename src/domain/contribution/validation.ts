import type { RelationshipType } from "../../data/schemas";

// 开放投稿（seed 档）的前端校验：镜像 tools/validate-data.mjs 的 seed 硬门
// + kimi 流水线的 id/占位/溯源约束。保持纯 TS（无 React/i18n 依赖），
// 以便同一模块将来在 CI（GitHub Action）里对投稿 Issue 复跑。
// 文案由 UI 侧按 code 映射 i18n 键（contribute.issue.<code>）。

export type ContributionWork = {
  id: string;
  titleZh: string;
  titleEn?: string;
  originalTitle?: string;
  yearDisplay?: string;
  noteZh: string;
};

export type ContributionRelationship = {
  // direction=outgoing: 新哲人 → target；incoming: target → 新哲人
  direction: "outgoing" | "incoming";
  targetId: string;
  type: RelationshipType;
  strength: 1 | 2 | 3;
  confidence: "high" | "medium" | "low";
  themeIds: string[];
  noteZh: string;
};

export type ContributionSourceNote = {
  label: string;
  url?: string;
  noteZh: string;
};

export type ContributionDraft = {
  philosopher: {
    id: string;
    names: { zh: string; en: string; native?: string };
    life: { birth?: number; death?: number; display: string };
    civilization: string;
    traditions: string[];
    periods: string[];
    themes: string[];
    keywordsZh: string[];
    oneLineZh: string;
    summaryZh: string;
  };
  works: ContributionWork[];
  relationships: ContributionRelationship[];
  sourceNotes: ContributionSourceNote[];
};

export type ContributionContext = {
  philosopherIds: Set<string>;
  workIds: Set<string>;
  themeIds: Set<string>;
};

export type ContributionIssue = {
  level: "error" | "warning";
  field: string;
  code: string;
  params?: Record<string, string | number>;
};

const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const PLACEHOLDER_ID = /(?:primary-work|placeholder|candidate)$/i;
const RELATIONSHIP_TYPES: RelationshipType[] = [
  "direct_student",
  "influence",
  "school",
  "shared_problem",
  "critique",
  "reception",
];

export const SEED_WORKS_MIN = 1;
export const SEED_WORKS_MAX = 2;
export const SEED_RELATIONSHIPS_MIN = 2;
export const SEED_RELATIONSHIPS_MAX = 3;
export const SUMMARY_MIN_LENGTH = 20;

export function validateContribution(
  draft: ContributionDraft,
  context: ContributionContext,
): ContributionIssue[] {
  const issues: ContributionIssue[] = [];
  const error = (field: string, code: string, params?: ContributionIssue["params"]) =>
    issues.push({ level: "error", field, code, params });
  const warning = (field: string, code: string, params?: ContributionIssue["params"]) =>
    issues.push({ level: "warning", field, code, params });

  const p = draft.philosopher;

  // —— 身份 ——
  if (!p.id.trim()) error("philosopher.id", "id_required");
  else {
    if (!ID_PATTERN.test(p.id)) error("philosopher.id", "id_format");
    if (PLACEHOLDER_ID.test(p.id)) error("philosopher.id", "id_placeholder");
    if (context.philosopherIds.has(p.id)) error("philosopher.id", "id_taken", { id: p.id });
  }
  if (!p.names.zh.trim()) error("philosopher.names.zh", "name_zh_required");
  if (!p.names.en.trim()) error("philosopher.names.en", "name_en_required");
  if (!p.life.display.trim()) error("philosopher.life.display", "life_display_required");
  if (p.life.birth !== undefined && p.life.death !== undefined && p.life.birth >= p.life.death) {
    warning("philosopher.life", "life_range_suspect");
  }
  if (!p.civilization.trim()) error("philosopher.civilization", "civilization_required");
  if (p.traditions.filter((item) => item.trim()).length === 0) {
    error("philosopher.traditions", "traditions_required");
  }
  if (p.periods.filter((item) => item.trim()).length === 0) {
    error("philosopher.periods", "periods_required");
  }

  // —— 主题（白名单） ——
  const themes = p.themes.filter((item) => item.trim());
  if (themes.length === 0) error("philosopher.themes", "themes_required");
  for (const theme of themes) {
    if (!context.themeIds.has(theme)) error("philosopher.themes", "theme_unknown", { theme });
  }

  const keywords = p.keywordsZh.filter((item) => item.trim());
  if (keywords.length < 3 || keywords.length > 8) {
    warning("philosopher.keywordsZh", "keywords_count", { min: 3, max: 8, count: keywords.length });
  }
  if (!p.oneLineZh.trim()) error("philosopher.oneLineZh", "oneline_required");
  else if (p.oneLineZh.length > 60) warning("philosopher.oneLineZh", "oneline_long", { max: 60 });
  if (p.summaryZh.trim().length < SUMMARY_MIN_LENGTH) {
    error("philosopher.summaryZh", "summary_short", { min: SUMMARY_MIN_LENGTH });
  }

  // —— 作品（seed 档 1–2 部，禁占位） ——
  if (draft.works.length < SEED_WORKS_MIN || draft.works.length > SEED_WORKS_MAX) {
    error("works", "works_count", { min: SEED_WORKS_MIN, max: SEED_WORKS_MAX });
  }
  draft.works.forEach((work, index) => {
    const field = `works[${index}]`;
    if (!work.id.trim()) error(`${field}.id`, "work_id_required", { index: index + 1 });
    else {
      if (!ID_PATTERN.test(work.id)) error(`${field}.id`, "work_id_format", { index: index + 1 });
      if (PLACEHOLDER_ID.test(work.id)) error(`${field}.id`, "work_id_placeholder", { index: index + 1 });
      if (context.workIds.has(work.id)) error(`${field}.id`, "work_id_taken", { id: work.id });
      if (p.id && !work.id.startsWith(`${p.id}-`)) {
        warning(`${field}.id`, "work_id_prefix", { index: index + 1, prefix: `${p.id}-` });
      }
    }
    if (!work.titleZh.trim()) error(`${field}.titleZh`, "work_title_required", { index: index + 1 });
    if (!work.noteZh.trim()) error(`${field}.noteZh`, "work_note_required", { index: index + 1 });
  });

  // —— 关系（seed 档 2–3 条，指向现库哲人） ——
  if (
    draft.relationships.length < SEED_RELATIONSHIPS_MIN ||
    draft.relationships.length > SEED_RELATIONSHIPS_MAX
  ) {
    error("relationships", "relationships_count", {
      min: SEED_RELATIONSHIPS_MIN,
      max: SEED_RELATIONSHIPS_MAX,
    });
  }
  const seenRelationshipKeys = new Set<string>();
  draft.relationships.forEach((relationship, index) => {
    const field = `relationships[${index}]`;
    const target = relationship.targetId.trim();
    if (!target) error(`${field}.targetId`, "relationship_target_required", { index: index + 1 });
    else {
      if (!context.philosopherIds.has(target)) {
        error(`${field}.targetId`, "relationship_target_unknown", { id: target });
      }
      if (target === p.id) error(`${field}.targetId`, "relationship_target_self");
      const key = `${relationship.direction}:${target}:${relationship.type}`;
      if (seenRelationshipKeys.has(key)) {
        error(`${field}`, "relationship_duplicate", { id: target });
      }
      seenRelationshipKeys.add(key);
    }
    if (!RELATIONSHIP_TYPES.includes(relationship.type)) {
      error(`${field}.type`, "relationship_type_invalid");
    }
    for (const theme of relationship.themeIds) {
      if (!context.themeIds.has(theme)) {
        error(`${field}.themeIds`, "relationship_theme_unknown", { theme });
      }
    }
    if (relationship.noteZh.trim().length < 10) {
      warning(`${field}.noteZh`, "relationship_note_short", { index: index + 1, min: 10 });
    }
  });

  // —— 溯源（≥1 条，URL 鼓励） ——
  if (draft.sourceNotes.length === 0) error("sourceNotes", "sourcenotes_required");
  draft.sourceNotes.forEach((note, index) => {
    const field = `sourceNotes[${index}]`;
    if (!note.label.trim()) error(`${field}.label`, "sourcenote_label_required", { index: index + 1 });
    if (!note.noteZh.trim()) error(`${field}.noteZh`, "sourcenote_note_required", { index: index + 1 });
    if (note.url && !/^https?:\/\/.+/.test(note.url)) {
      error(`${field}.url`, "sourcenote_url_invalid", { index: index + 1 });
    }
    if (!note.url) warning(`${field}.url`, "sourcenote_url_missing", { index: index + 1 });
  });

  return issues;
}

// —— 产出：与 .research/tmp/kimi/* 的 proposed-* 信封完全同构，admit 工具链可直接吃 ——

type Envelope<T> = { schemaVersion: 1; items: T[] };

export type SubmissionFiles = {
  "proposed-philosophers.json": Envelope<Record<string, unknown>>;
  "proposed-works.json": Envelope<Record<string, unknown>>;
  "proposed-relationships.json": Envelope<Record<string, unknown>>;
};

function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== ""),
  ) as T;
}

export function buildSubmissionFiles(draft: ContributionDraft): SubmissionFiles {
  const p = draft.philosopher;
  const philosopherItem = compact({
    id: p.id,
    names: compact({ zh: p.names.zh, en: p.names.en, native: p.names.native }),
    life: compact({ birth: p.life.birth, death: p.life.death, display: p.life.display }),
    civilization: p.civilization,
    traditions: p.traditions.filter((item) => item.trim()),
    periods: p.periods.filter((item) => item.trim()),
    themes: p.themes.filter((item) => item.trim()),
    keywordsZh: p.keywordsZh.filter((item) => item.trim()),
    oneLineZh: p.oneLineZh,
    influenceWeight: 1,
    reviewStatus: "draft",
    summaryZh: p.summaryZh,
    works: draft.works.map((work) => work.id),
    sourceNotes: draft.sourceNotes.map((note) =>
      compact({ label: note.label, url: note.url, noteZh: note.noteZh }),
    ),
  });

  const workItems = draft.works.map((work) =>
    compact({
      id: work.id,
      philosopherId: p.id,
      titleZh: work.titleZh,
      titleEn: work.titleEn,
      originalTitle: work.originalTitle,
      yearDisplay: work.yearDisplay,
      noteZh: work.noteZh,
    }),
  );

  const relationshipItems = draft.relationships.map((relationship) => {
    const from = relationship.direction === "outgoing" ? p.id : relationship.targetId;
    const to = relationship.direction === "outgoing" ? relationship.targetId : p.id;
    return compact({
      id: `${from}-${to}-${relationship.type.replace(/_/g, "-")}`,
      from,
      to,
      type: relationship.type,
      strength: relationship.strength,
      confidence: relationship.confidence,
      themeIds: relationship.themeIds,
      noteZh: relationship.noteZh,
      reviewStatus: "draft",
    });
  });

  return {
    "proposed-philosophers.json": { schemaVersion: 1, items: [philosopherItem] },
    "proposed-works.json": { schemaVersion: 1, items: workItems },
    "proposed-relationships.json": { schemaVersion: 1, items: relationshipItems },
  };
}

export const CONTRIBUTION_REPO_URL = "https://github.com/gao-cai-sheng/qunxing-shanyaoshi";

export function buildIssueMarkdown(draft: ContributionDraft): string {
  const files = buildSubmissionFiles(draft);
  const sections = (Object.keys(files) as (keyof SubmissionFiles)[]).map(
    (name) => `### ${name}\n\n\`\`\`json\n${JSON.stringify(files[name], null, 2)}\n\`\`\``,
  );
  return [
    `## Seed 档哲人投稿：${draft.philosopher.names.zh}（${draft.philosopher.id}）`,
    "",
    "由投稿向导生成，已通过客户端预校验（seed 硬门）。维护者流程：validate-kimi → quality-audit → 盲审 → admit。",
    "",
    ...sections,
  ].join("\n");
}

export function buildIssueUrl(draft: ContributionDraft): string {
  const title = `[投稿] seed: ${draft.philosopher.id}`;
  const body = buildIssueMarkdown(draft);
  return `${CONTRIBUTION_REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
