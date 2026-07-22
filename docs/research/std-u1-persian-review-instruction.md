# 盲审指令 — 批次 `2026-07-05-std-u1-persian`（seed→standard 升格试点）

**给盲审者（新上下文）**：你是独立复核，不知道生产过程，也不该信任生产者的自述。目标是判定本批能否入库，结论 PASS / REJECT 写进 `.research/tmp/kimi/2026-07-05-std-u1-persian/review-verdict.md`。

## 边界
只读只审：不改批次文件、不 `admit`、不动 public/data。发现问题就在 verdict 里列条目 + 原因。

## 审的对象
`.research/tmp/kimi/2026-07-05-std-u1-persian/`：`proposed-philosophers.json`、`thought-systems.json`、`proposed-works.json`（本批为空）+ `sources.md` / `notes.md` / `claims.md` 等佐证。两人：zoroaster、mani，seed 升 standard。

先读 `docs/research/review-checklist.md` 与 `seed-upgrade-plan-2026-07-05.md §2/§6`。

## 升格批盲审要点（按重要性）

1. **evidence 溯源真实性（最重）**：逐条核 `source.workId` 真实存在于 `public/data/works.json` 且属同一人；`locator` 精确到单一颂/章/段（伽萨到颂、沙卜拉干到章节），不是泛指整部书；`summaryZh` 是否准确对应该出处——**有无编造引文、张冠李戴、把二手转述当原典**。可对照 sources.md 里引的 Iranica 等条目独立复核，不信生产者一面之词。
2. **excerptStatus 口径**：本批 24 条 evidence 全标 `summary_only`、0 条 `public_domain`。核对是否恰当：古阿维斯陀语《伽萨》、中古波斯语《沙卜拉干》确无逐字公有领域中译，summary_only 合理；但若发现某条其实抄了逐字原文却标 summary_only（漏标）、或凭空造引文标成 public_domain（造假）→ REJECT。
3. **反模板**：template_claim / shared_suffix / 复述问题直接 RED。**特别核**：两人 6 个 problem 的 claim 权重清一色 `3,2`——「同 problem 内有区分」这条过了，但跨 problem 完全同构有模板味，重点扫 template_similarity 和句式复用（两人同为二元论创立者，claim 容易撞车）。
4. **新增 works 真伪**：本批 `proposed-works.json` 为空、只复用现有三部（zoroaster-gathas / mani-shabuhragan / mani-living-gospel）。确认 evidence 用到的 workId 全在这三部内、无占位 id、无越界新增。
5. **内容正确性 > 通过校验**：史实层面核 zoroaster（文本归属+断代双争议）、mani（原作多散佚）的思想归属、断代、文本流传是否**诚实标注争议**；史料薄允许 problems=3 的下限结构，但**不许灌水凑厚**。
6. **结构硬门（可快速核，不达标即 REJECT）**：每人 problems ≥3；每 problem claims ≥2；每 claim evidence ≥2（≥12/人）；每条 evidence summaryZh ≥40 字；`tier:"standard"` 且完整保留原 seed 身份层字段。

> 升格不动 relationships，故 seed 关系 ≤3 度数模拟**不再需要**审。

## 结论
写 `review-verdict.md`：PASS 或 REJECT + 逐条依据（REJECT 要指到具体 problem/claim/evidence id）。PASS 后交由 `bash scripts/verify.sh pre 2026-07-05-std-u1-persian`（含 quality-audit --require-standard 硬门）→ `admit --tier standard --overwrite --write`。
