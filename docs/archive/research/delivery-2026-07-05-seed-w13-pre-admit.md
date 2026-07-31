# Seed W13 预产交付（pre-admit）

日期：2026-07-05  
范围：上座部/巴利佛教 + 越南  
状态：PRE-ADMIT standby，等待新上下文盲审。

## 生产范围

按 `docs/research/seed-w13-candidates.md` 与 `docs/research/seed-w13-production-spec.md` 执行，生成 3 个 seed 暂存批：

- `.research/tmp/kimi/2026-07-05-seed-w13-b1`：2 位，巴利注疏古典。
- `.research/tmp/kimi/2026-07-05-seed-w13-b2`：3 位，上座部近现代复兴。
- `.research/tmp/kimi/2026-07-05-seed-w13-b3`：3 位，越南禅-儒。

合计：8 philosophers，11 works，16 relationships，0 claims，0 thought systems。

当前正式库检查显示 W13 8 位仍 absent，未写入正式库。

## 定案参数落实

- `buddhaghosa` / `dhammapala` / `ledi-sayadaw` / `mahasi-sayadaw` / `buddhadasa`：`civilization=theravada_buddhist`。
- `tran-thai-tong` / `tran-nhan-tong` / `le-quy-don`：`civilization=vietnamese`。
- periods：
  - `theravada_classical`：`buddhaghosa` / `dhammapala`。
  - `theravada_modern`：`ledi-sayadaw` / `mahasi-sayadaw` / `buddhadasa`。
  - `vietnamese_medieval`：`tran-thai-tong` / `tran-nhan-tong`。
  - `vietnamese_early_modern`：`le-quy-don`。
- `dhammapala` sourceNotes 已标注约6—7世纪断代不确。
- `buddhaghosa` sourceNotes 已标注不把全部传统注疏无条件归其名下。
- 陈太宗/陈仁宗按有可归属禅学文本的帝王-禅师收录，非纯护法君主。

## 批次摘要

### b1 — 巴利注疏古典

人物：

- `buddhaghosa`
- `dhammapala`

实跑：

- `validate-kimi-research`：ok，0 claims，4 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，2 philosophers，2 works，4 relationships。

### b2 — 上座部近现代复兴

人物：

- `ledi-sayadaw`
- `mahasi-sayadaw`
- `buddhadasa`

实跑：

- `validate-kimi-research`：ok，0 claims，6 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，3 philosophers，6 works，6 relationships。

### b3 — 越南禅-儒

人物：

- `tran-thai-tong`
- `tran-nhan-tong`
- `le-quy-don`

实跑：

- `validate-kimi-research`：ok，0 claims，5 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，3 philosophers，3 works，6 relationships。

## 合并模拟专项检查

对 b1+b2+b3 的 proposed philosophers / works / relationships 做只读合并模拟，使用当前正式库 + 本波 8 位作为 id 空间检查引用完整性、theme 白名单、真实 works 与 seed 度数。

结果：PASS。

- proposed philosophers：8
- proposed works：11
- proposed relationships：16
- 每位 works：1–2
- 每位 relationships：2–3
- 每位 sourceNoteURLs：≥1
- 每位 tier：seed
- 每位 thoughtSystem：none
- philosopher themes 与 relationship themeIds 均在 10 主题白名单内
- 未发现 placeholder / primary-work / candidate workId
- `buddhaghosa` relationships = 3
- `ledi-sayadaw` relationships = 3
- `ledi-sayadaw` / `mahasi-sayadaw` / `buddhadasa` 均未挂 `buddhaghosa`

## 关键约束落实

- Buddhaghosa 自身关系：`buddha` + `vasubandhu` + `dhammapala`，总数 3，未超限。
- Ledi 自身关系：`buddha` + `vasubandhu` + `mahasi-sayadaw`，总数 3，未超限。
- Mahasi 挂 `ledi-sayadaw` + `buddha`，未挂 Buddhaghosa。
- Buddhadasa 挂 `buddha` + `nagarjuna`，关系 noteZh 明确为缘起/空的问题对话，不写成师承。
- 陈太宗/陈仁宗以禅学文本和竹林禅派身份收录，非纯君主条目。
- 黎贵惇挂 `zhu-xi` + `confucius`，表达越南儒学与宋明理学脉络。

## 正式库现状校验

本轮未写正式库。当前正式库实跑结果：

- `npm run validate:data`：ok，516 philosophers（standard 195 | seed 321），200 arguments，983 relationships，10 themes。
- `quality-audit --require-standard`：标准档 195 全绿，RED 0，YELLOW 0。

注：W13 开始生产时曾按候选口径检查 8 位对正式库 free；收尾时正式库已显示 516 位，但 W13 8 位仍 absent。本轮未执行 `admit --write`，未写 `public/data/**`。

## 边界

本轮未执行 `admit --write`，未写 `public/data/**`，未 commit/push。按 seed 门禁，下一步需新上下文盲审 W13 三个暂存批；PASS 后再执行正式 admit write、post-check、vitest 与 `npm run sync:dist`。
