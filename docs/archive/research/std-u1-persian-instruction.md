# Codex 指令 — 批次 `2026-07-05-std-u1-persian`（seed→standard 升格试点）

承接 `seed-upgrade-plan-2026-07-05.md`（P1/U1 波斯试点）与 `HANDOFF-2026-07-05-v3.md`。

> **前置（本机，不动不开工）**：先按 HANDOFF v3 §7 在本机 commit W10–W13 的 36 位入库改动（`rm -f .git/index.lock` → `git add public/data docs/research` → commit，勿 push），再开本批。避免升格改动与入库改动混在同一工作树。沙箱因 `.git/index.lock` FUSE 限制无法提交。

---

## 批次：`2026-07-05-std-u1-persian`｜升格 seed→standard｜zoroaster, mani（2 人打样）

项目 `~/Desktop/Decisive Moments in History`，分支 `kimi-research-bridge`。这是 seed→standard 升格计划的第一批，小批打样：跑通 tier 翻转、works 扩充、summary_only 口径后再放量。先读 `RUNBOOK-kimi-autonomous-loop.md §4`、`review-checklist.md`、`seed-upgrade-plan-2026-07-05.md §2/§3/§6`。

### 边界（铁律）
只写 `.research/tmp/kimi/2026-07-05-std-u1-persian/`。禁碰 `public/data`、禁 `admit --write`、禁 commit/push。不动 relationships。

### 产物三文件
1. `thought-systems.json` —— 两人各一条 thoughtSystem，problems/claims/evidence 结构照 `adi-shankara` 现档（id 形如 `mani:problem:001` / `mani:claim:001` / `mani:evidence:001`）。
2. `proposed-philosophers.json` —— 两人身份层，`tier:"standard"`，保留现 seed 档全部字段（names/life/civilization/traditions/themes/keywordsZh/oneLineZh/influenceWeight/sourceNotes），把 `summaryZh` 加厚到 ≥40 字标准档口径，`reviewStatus` 保持。
3. `proposed-works.json` —— 仅在 evidence 需要而现 works 不足时新增；禁占位 id，新增即扩边界，盲审重点核真伪。

### 现有可复用 workId（属同一人，勿改属主）
- zoroaster → `zoroaster-gathas`
- mani → `mani-shabuhragan`、`mani-living-gospel`

evidence 的 `source.workId` 必须落在这些或你新增的 works 上。

### 质量硬门（低于即 RED/YELLOW，过不了写前门）
- 每人 problems ≥3；每 problem claims ≥2；每 claim evidence ≥2 → 每人 ≥12 条 evidence。
- 每条 evidence `summaryZh` ≥40 字；同一 problem 内 claim 的 `weight` 要有区分（禁全同权）。
- `source.locator` 精确到单一颂/章/段（伽萨到颂、沙卜拉干到章节）。
- `excerptStatus`：**只有拿到逐字公有领域原文才标 `public_domain`，否则 `summary_only` / `none`。** 古阿维斯陀语《伽萨》、中古波斯语《沙卜拉干》的中译多无公有领域版本，**预期大量 summary_only，绝不许编造引文**（内容正确性 > 通过校验）。
- 反模板全生效：template_claim / shared_suffix / 复述问题 = RED。两人同为二元论创立者，claim 句式易撞车，主动错开。

### 史料薄的处理
zoroaster（文本归属+断代双争议）、mani（原作多散佚）允许 problems=3 的下限结构 + 诚实标注争议，不许灌水凑厚。

### 收尾
**完成即停**，产出后交新上下文盲审（结论写 `<batch>/review-verdict.md`），不要自审自入库。

---

### 盲审 PASS 后的入库链（非 codex 职责，供参考）
`bash scripts/verify.sh pre 2026-07-05-std-u1-persian`（含 quality-audit --batch --require-standard 硬门）→ `admit --tier standard --overwrite --write` → `validate-data`(542) + `quality-audit --require-standard`(RED0/YELLOW0) + `vitest` 全绿 → `npm run sync:dist` → 本机 commit（勿 push）→ 记 `LOOP-LEDGER.md` → 星图 Cmd+Shift+R 抽查两星卫星已浮现（镜头 <7.5）。
