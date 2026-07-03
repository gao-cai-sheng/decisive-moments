# Expansion B4 Pre-admit Package — feng-youlan / mou-zongsan / simone-weil / mariategui

时间：2026-07-03

## 范围

B 档第四批暂存生产：

- `feng-youlan` — 冯友兰
- `mou-zongsan` — 牟宗三
- `simone-weil` — 西蒙娜·薇依
- `mariategui` — 马里亚特吉

## 暂存路径

`.research/tmp/kimi/2026-07-03-expansion-b4/`

## 生成内容

- `thought-systems.json`: 4 位，每位 3 problems / 6 claims / 12 evidence。
- `proposed-philosophers.json`: 4 个拟新增 philosopher。
- `proposed-works.json`: 20 个真实 work 条目。
- `proposed-relationships.json`: 14 条拟新增 relationship。
- `sources.md`, `claims.json`, `notes.md`, `open-questions.md`。
- `audit-data/works.json`: 供 batch quality-audit 使用的真实 works。
- `review-verdict.md`: PENDING_BLIND_REVIEW 占位，非 PASS。

## 新规范执行

- B4 起所有 evidence `summaryZh` 均概括所引文本自身的论证。
- 二手资料仅在 `notes.md` 中记录为核对来源，不进入 evidence 摘要。
- 全部 evidence 使用真实 workId，未新增 `*-primary-work` 占位。
- 全部 evidence 目前为 `summary_only`，未声明逐字公有领域中文摘录。
- 首次写入 `thought-systems.json` 时安全层拦截一处薇依/马里亚特吉相关强表述；已改为中性学术表述后写入暂存包，未触碰正式库。

## 写前门禁

```text
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-03-expansion-b4
kimi research ok: 8 claims, 8 sources, 4 thought systems, 0 timeline items
```

```text
node tools/quality-audit.mjs --data-dir .research/tmp/kimi/2026-07-03-expansion-b4/audit-data --batch .research/tmp/kimi/2026-07-03-expansion-b4/thought-systems.json --require-standard
Batch 内容审计：4 位（thought-systems.json）
  🟢 全绿 4 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

```text
feng-youlan works=5 relationships=4 problems=3 claims=6 evidence=12
mou-zongsan works=5 relationships=5 problems=3 claims=6 evidence=12
simone-weil works=5 relationships=4 problems=3 claims=6 evidence=12
mariategui works=5 relationships=4 problems=3 claims=6 evidence=12
proposed payload ok: 4 philosophers, 20 works, 14 relationships
```

## 停车状态

- 未写正式库。
- 未执行 `admit --write`。
- 未 commit。
- 未 push。
- 下一步：全新上下文盲审员按 `docs/research/review-checklist.md` 审核 `.research/tmp/kimi/2026-07-03-expansion-b4/`，给出 pre-admit PASS / REJECT。
