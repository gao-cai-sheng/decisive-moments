# Kimi Research Bridge

**Project:** Decisive Moments in History  
**Purpose:** Use Kimi CLI as a research collector for historical, philosophical, and intellectual-history material. Kimi gathers sources, extracts structured notes, and records uncertainty. Codex or a human reviewer decides what enters the app data model.

---

## 1. Boundary

Kimi may:

- Search for sources.
- Summarize sources in Chinese.
- Extract factual or interpretive claims into JSON.
- Mark disputes, weak evidence, and open questions.
- Save temporary research files under `.research/tmp/kimi/`.

Kimi must not:

- Edit `src/`, `public/data/`, `tools/`, or tests.
- Rewrite project specs or plans.
- Treat Wikipedia or unsourced pages as final authority.
- Copy long copyrighted passages.
- Turn uncertain material into confident app copy.

---

## 2. Temporary Storage Path

All Kimi output goes here:

```text
/Users/gao/Desktop/Decisive Moments in History/.research/tmp/kimi/YYYY-MM-DD-topic-slug/
```

Example:

```text
/Users/gao/Desktop/Decisive Moments in History/.research/tmp/kimi/2026-06-26-plato-justice/
```

Each research folder must contain:

```text
brief.md
sources.md
notes.md
claims.json
open-questions.md
```

Conditional files:

```text
quotes.md
names.json
timeline.json
thought-systems.json
works-candidates.json
```

`timeline.json` is required when `brief.md` says the intended use includes `timeline`, or when the user explicitly asks for a chronological chain. It is optional for a standalone `event card`.

`thought-systems.json` is required when the intended use includes `thoughtSystem`. It should mirror the app shape in `src/data/schemas.ts`: `problems[] -> claims[] -> evidence[]`, with temporary `sourceIds` at each level for review.

`.research/` is temporary working material. Do not move it into `public/data/` until reviewed.

### Queue Mode For Philosopher Thought Systems

For the 100-philosopher content pipeline, do not use 4-5 person batch prompts. Use the resumable person queue instead:

```bash
npm run kimi:queue -- init
npm run kimi:queue -- next
npm run kimi:queue -- run-next
```

Queue policy:

- One Kimi session handles one philosopher only.
- One Kimi session handles one stage only: `sources-notes`, `claims`, or `thought-system`.
- Stage output goes under `.research/tmp/kimi/people/<philosopher-id>/`.
- Logs and state live under `.research/tmp/kimi/person-queue/`.
- If Kimi output contains `429`, `usage limit`, or `rate_limit_reached_error`, the runner marks the stage `blocked_rate_limit` even when the CLI exits successfully.
- Resume by running `npm run kimi:queue -- run-next` after quota returns; it picks the next `pending` stage from `manifest.json`.

---

## 3. Source Priority

Use sources in this order:

1. Primary sources: original texts, archives, legal records, speeches, letters, inscriptions, public-domain editions.
2. Institutional sources: universities, libraries, museums, national archives, academic encyclopedias.
3. Scholarly sources: SEP, IEP, JSTOR pages, Project MUSE pages, publisher pages, DOI records, academic book previews.
4. High-quality reference sources: Britannica, Oxford Reference pages if accessible, library guides.
5. Discovery-only sources: Wikipedia, blogs, forum posts, SEO pages, generic AI-generated pages.

Wikipedia can be used to find leads, names, dates, and bibliography. It should not be the final cited source for an app claim.

---

## 4. Collection Rules

- Every important claim needs at least one source.
- Disputed dates, disputed attributions, or interpretive claims need two or more sources when possible.
- Separate `fact`, `interpretation`, `reception`, `legend`, and `uncertain`.
- Preserve original names and titles when useful.
- Keep Chinese summaries concise.
- Prefer paraphrase over quotation.
- Modern copyrighted text: quote only very short excerpts when necessary.
- If evidence is weak, set `confidence` to `low`.
- If sources conflict, record the conflict in `open-questions.md`.

---

## 5. Required Files

### JSON Contract

`claims.json`, `timeline.json`, and `thought-systems.json` use a versioned object root:

```json
{
  "schemaVersion": 1,
  "items": []
}
```

Item IDs must be stable and namespaced:

```text
topic-slug:type:NNN
```

Examples:

```text
tennis-court-oath:fact:001
tennis-court-oath:timeline:001
plato-justice:interpretation:001
```

Rules:

- Do not use bare `topic-slug-NNN` ids.
- Do not reuse an id for a different claim.
- If a new batch touches the same subject, note possible duplicates in `open-questions.md` instead of silently duplicating material.
- Every `sourceIds` value must match an `S###` heading in `sources.md`.
- In `thought-systems.json`, `evidence.source.workId` may only reference an existing ID in `public/data/works.json`, and it must belong to the same `philosopherId`.
- Candidate works belong in `works-candidates.json`; never invent `*-candidate` work IDs inside `thought-systems.json`.
- Run `npm run validate:kimi -- <batch-dir>` before handoff.

### `brief.md`

The user-facing task brief.

```markdown
# Research Brief: <topic>

Date: YYYY-MM-DD
Researcher: Kimi CLI
Project: Decisive Moments in History

## Topic
<one or two sentences>

## Intended Use
<philosopher profile, thought system, relationship, timeline, event card, etc.>

## Questions To Answer
- <question 1>
- <question 2>
- <question 3>

## Output Contract
- sources.md
- notes.md
- claims.json
- open-questions.md
```

### `sources.md`

One entry per source.

```markdown
# Sources

## S001: <title>

- Author/Organization:
- URL:
- Accessed:
- Source type: primary | institutional | scholarly | reference | discovery
- Reliability: high | medium | low
- Useful for:
- Limits:
```

### `notes.md`

Short Chinese research notes grouped by topic.

```markdown
# Notes

## <Theme>

- <summary point, with source ids like S001/S002>
- <summary point, with source ids like S003>
```

### `claims.json`

Machine-readable claim cards.

```json
{
  "schemaVersion": 1,
  "items": [
    {
      "id": "plato-justice:interpretation:001",
      "subject": "Plato",
      "subjectZh": "柏拉图",
      "claimZh": "柏拉图将正义理解为灵魂与城邦内部秩序的对应关系。",
      "type": "interpretation",
      "timeRange": "c. 380 BCE",
      "sourceIds": ["S001", "S002"],
      "confidence": "medium",
      "reviewStatus": "needs_human_review",
      "notesZh": "可作为思想星系候选命题，仍需人工压缩和校验措辞。"
    }
  ]
}
```

Allowed `type` values:

```text
fact
interpretation
reception
relationship
timeline
work
legend
uncertain
```

Allowed `confidence` values:

```text
high
medium
low
```

### `thought-systems.json`

Candidate material for `public/data/philosophers/<id>.json`. The core shape must match `philosopherThoughtSystemSchema`; temporary `sourceIds` are kept only for review and are stripped by `npm run admit:kimi`. `evidence.source.workId` must use a real work ID from `public/data/works.json`; if the evidence depends on a not-yet-modeled work, omit `workId` and record the candidate in `works-candidates.json`.

```json
{
  "schemaVersion": 1,
  "items": [
    {
      "philosopherId": "laozi",
      "problems": [
        {
          "id": "laozi:problem:001",
          "titleZh": "道与命名",
          "questionZh": "道能否被固定语言完整把握？",
          "summaryZh": "说明该问题为什么构成此哲人的核心问题。",
          "themeIds": ["metaphysics", "language"],
          "weight": 3,
          "sourceIds": ["S001"],
          "claims": [
            {
              "id": "laozi:claim:001",
              "titleZh": "道不可被定名穷尽",
              "claimZh": "道不是普通对象，不能被固定名称完全把握。",
              "explanationZh": "说明主张含义与语境。",
              "themeIds": ["metaphysics", "language"],
              "weight": 3,
              "sourceIds": ["S001"],
              "evidence": [
                {
                  "id": "laozi:evidence:001",
                  "titleZh": "《老子》开篇",
                  "summaryZh": "概括证据，不要长引现代版权文本。",
                  "source": {
                    "workId": "laozi-primary-work",
                    "locator": "第一章",
                    "excerptStatus": "summary_only"
                  },
                  "sourceIds": ["S001"]
                }
              ]
            }
          ]
        }
      ],
      "sourceIds": ["S001"]
    }
  ]
}
```

### `open-questions.md`

Record uncertainty instead of hiding it.

```markdown
# Open Questions

## Q001: <question>

- Problem:
- Conflicting sources:
- Current best reading:
- Needed next step:
```

---

## 6. Kimi CLI Prompt Template

Paste this into Kimi CLI and fill the placeholders.

```text
你是 Decisive Moments in History 项目的资料研究员。
你只负责查资料、整理来源、抽取结构化事实和疑点。
不要写代码，不要修改正式项目数据，不要把未审核内容写入 public/data。

项目目录：
/Users/gao/Desktop/Decisive Moments in History

暂存目录：
/Users/gao/Desktop/Decisive Moments in History/.research/tmp/kimi/<YYYY-MM-DD-topic-slug>/

研究主题：
<topic>

目标用途：
<用于 philosopher profile / thoughtSystem / relationship / timeline / event card>

请生成这些文件：
1. brief.md
2. sources.md
3. notes.md
4. claims.json
5. open-questions.md

如果目标用途包含 thoughtSystem，也必须生成：
6. thought-systems.json
7. works-candidates.json

如果目标用途包含 timeline，或任务要求整理事件前后链条，也必须生成：
8. timeline.json

采集规范：
- claims.json、thought-systems.json 和 timeline.json 必须使用 { "schemaVersion": 1, "items": [...] } 结构。
- item id 必须使用 topic-slug:type:NNN；thoughtSystem 批次用 philosopher-id:type:NNN，例如 laozi:problem:001。
- sourceIds 必须引用 sources.md 里的 S### 编号。
- thought-systems.json 的 evidence.source.workId 只能使用 public/data/works.json 已存在且属于该哲人的正式 workId。
- 不要创造新的 workId，不要在 thought-systems.json 使用 *-candidate；候选作品只写入 works-candidates.json。
- 教学网站和博客不得作为 high-confidence claim 的主来源。
- 优先一手资料、大学、博物馆、档案馆、学术百科、学术出版社。
- Wikipedia 只能用于发现线索，不能作为最终依据。
- 每条关键事实至少给一个来源；争议事实尽量给两个以上来源。
- 明确区分事实、解释、后世评价、传说和不确定内容。
- 不复制现代版权文本长段落，只做摘要或极短引用。
- 中文输出，保留关键人名、作品名、机构名的英文或原文。
- 不确定就写 confidence: low，不要编。

最后给一个简短结论：
- 可直接采用的高置信材料
- 需要人工判断的材料
- 不建议采用的材料
```

---

## 7. Handoff Back To Codex

For person-queue research, first inspect `.research/tmp/kimi/person-queue/manifest.json`. A person is ready for review when all three stages are `done` or `done_legacy`, and the person status is `research_complete_needs_review`.

When Kimi finishes, Codex should read only the relevant temporary folder and perform these checks:

1. Run `npm run validate:kimi -- <batch-dir>`.
2. `sources.md`: remove weak or circular sources.
3. `claims.json` and `thought-systems.json`: verify claim quality after the machine shape/source-id check passes.
4. `open-questions.md`: decide whether uncertainty blocks use.
5. For approved thought systems, dry-run `npm run admit:kimi -- <batch-dir>`; this also rejects unknown or cross-philosopher `workId` references.
6. After human approval, write with `npm run admit:kimi -- <batch-dir> --write`, then run `npm run validate:data`.
7. Add tests when the accepted data affects validation, search, layout, or UI behavior.

Do not bulk-import Kimi output. The bridge is for research intake, not automatic publication.

---

## 8. Minimal Acceptance Checklist

A Kimi research batch is acceptable when:

- It has all required files.
- `npm run validate:kimi -- <batch-dir>` passes.
- `claims.json`, any `thought-systems.json`, and any `timeline.json` set `schemaVersion: 1`.
- Item ids use `topic-slug:type:NNN` and are unique within the file.
- Every claim and thought-system problem/claim/evidence has at least one `sourceId`.
- Every `sourceId` exists in `sources.md`.
- Every thought-system `workId` is an existing same-philosopher ID from `public/data/works.json`, or the evidence omits `workId`.
- `sources.md` includes source type and reliability.
- Conflicts are listed instead of hidden.
- The output does not include long copyrighted excerpts.
- The batch can be deleted without affecting the app.

