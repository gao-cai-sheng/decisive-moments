# Expansion B3 Pre-admit Package — iqbal / dharmakirti / shinran / cheng-yi

时间：2026-07-03

## 范围

B 档第三批暂存生产：

- `iqbal` — 伊克巴尔
- `dharmakirti` — 法称
- `shinran` — 亲鸾
- `cheng-yi` — 程颐

## 暂存路径

`.research/tmp/kimi/2026-07-03-expansion-b3/`

## 生成内容

- `thought-systems.json`: 4 位，每位 3 problems / 6 claims / 12 evidence。
- `proposed-philosophers.json`: 4 个拟新增 philosopher。
- `proposed-works.json`: 20 个真实 work 条目。
- `proposed-relationships.json`: 14 条拟新增 relationship。
- `sources.md`, `claims.json`, `notes.md`, `open-questions.md`。
- `audit-data/works.json`: 供 batch quality-audit 使用的真实 works。
- `review-verdict.md`: PENDING_BLIND_REVIEW 占位，非 PASS。

## 写前门禁

```text
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-03-expansion-b3
kimi research ok: 8 claims, 8 sources, 4 thought systems, 0 timeline items
```

第一次质量门出现 15 条 `summary_thin`，均已在暂存 batch 中加厚后复验。

```text
node tools/quality-audit.mjs --data-dir .research/tmp/kimi/2026-07-03-expansion-b3/audit-data --batch .research/tmp/kimi/2026-07-03-expansion-b3/thought-systems.json --require-standard
Batch 内容审计：4 位（thought-systems.json）
  🟢 全绿 4 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

```text
iqbal works=5 relationships=3 problems=3 claims=6 evidence=12
dharmakirti works=5 relationships=3 problems=3 claims=6 evidence=12
shinran works=5 relationships=4 problems=3 claims=6 evidence=12
cheng-yi works=5 relationships=4 problems=3 claims=6 evidence=12
proposed payload ok: 4 philosophers, 20 works, 14 relationships
```

## 停车状态

- 未写正式库。
- 未执行 `admit --write`。
- 未 commit。
- 未 push。
- 下一步：新上下文盲审员按 `docs/research/review-checklist.md` 审核 `.research/tmp/kimi/2026-07-03-expansion-b3/`，给出 pre-admit PASS / REJECT。
