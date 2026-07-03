# Expansion B2 Pre-admit Package — eckhart / cusa / vico / herder

时间：2026-07-03

## 解锁说明

用户指令“解锁B2”按人工/外部解锁记录处理：解除 `western-medieval-modern-20` 修复待复审对 B2 的冻结。

该解锁不是 B2 盲审 PASS。B2 仍必须执行 pre-admit 盲审，PASS 前不得写入 `public/data/**/*.json`。

## 范围

B 档第二批暂存生产：

- `eckhart` — 埃克哈特
- `cusa` — 库萨的尼古拉
- `vico` — 维柯
- `herder` — 赫尔德

## 暂存路径

`.research/tmp/kimi/2026-07-03-expansion-b2/`

## 生成内容

- `thought-systems.json`: 4 位，每位 3 problems / 6 claims / 12 evidence。
- `proposed-philosophers.json`: 4 个拟新增 philosopher。
- `proposed-works.json`: 20 个真实 work 条目。
- `proposed-relationships.json`: 10 条拟新增 relationship。
- `sources.md`, `claims.json`, `notes.md`, `open-questions.md`。
- `review-verdict.md`: PENDING_BLIND_REVIEW 占位，非 PASS。

## 新增关系草案

- `aquinas-eckhart-shared_problem`
- `eckhart-heidegger-reception`
- `eckhart-cusa-reception`
- `cusa-leibniz-reception`
- `descartes-vico-critique`
- `vico-dilthey-reception`
- `vico-herder-shared_problem`
- `rousseau-herder-reception`
- `kant-herder-critique`
- `herder-dilthey-reception`

## 写前门禁

```text
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-03-expansion-b2
kimi research ok: 8 claims, 8 sources, 4 thought systems, 0 timeline items
```

第一次质量门出现 7 条 `summary_thin`，均已在暂存 batch 中加厚后复验。

```text
node tools/quality-audit.mjs --data-dir .research/tmp/kimi/2026-07-03-expansion-b2/audit-data --batch .research/tmp/kimi/2026-07-03-expansion-b2/thought-systems.json --require-standard
Batch 内容审计：4 位（thought-systems.json）
  🟢 全绿 4 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

```text
proposed payload ok: 4 philosophers, 20 works, 10 relationships
```

## 停车状态

- 未写正式库。
- 未执行 `admit --write`。
- 未 commit。
- 未 push。
- 下一步：新上下文盲审员按 `docs/research/review-checklist.md` 审核 `.research/tmp/kimi/2026-07-03-expansion-b2/`，给出 pre-admit PASS / REJECT。
