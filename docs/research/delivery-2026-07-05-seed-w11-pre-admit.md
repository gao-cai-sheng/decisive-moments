# Seed W11 预产交付（pre-admit）

日期：2026-07-05  
范围：斯拉夫 / 俄罗斯文明（革命前传统）  
状态：PRE-ADMIT standby，等待新上下文盲审。

## 生产范围

按 `docs/research/seed-w11-candidates.md` 与 `docs/research/seed-w11-production-spec.md` 执行，生成 3 个 seed 暂存批：

- `.research/tmp/kimi/2026-07-05-seed-w11-b1`：7 位，19世纪知识分子。
- `.research/tmp/kimi/2026-07-05-seed-w11-b2`：5 位，文学-宗教思想与 Solovyov。
- `.research/tmp/kimi/2026-07-05-seed-w11-b3`：4 位，白银时代宗教哲学。

合计：16 philosophers，27 works，31 relationships，0 claims，0 thought systems。

未生产：`georgy-plekhanov` / `vladimir-lenin` / `mikhail-bakhtin`，均按 W11 裁决排除或暂缓。

## 批次摘要

### b1 — 19世纪知识分子

人物：

- `pyotr-chaadaev`
- `aleksei-khomyakov`
- `ivan-kireevsky`
- `alexander-herzen`
- `mikhail-bakunin`
- `nikolai-chernyshevsky`
- `peter-kropotkin`

实跑：

- `validate-kimi-research`：ok，0 claims，8 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，7 philosophers，11 works，13 relationships。

### b2 — 文学-宗教思想 + Solovyov

人物：

- `fyodor-dostoevsky`
- `leo-tolstoy`
- `vladimir-solovyov`
- `nikolai-fedorov`
- `lev-shestov`

实跑：

- `validate-kimi-research`：ok，0 claims，7 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，5 philosophers，9 works，10 relationships。

### b3 — 白银时代宗教哲学

人物：

- `nikolai-berdyaev`
- `sergei-bulgakov`
- `pavel-florensky`
- `semyon-frank`

实跑：

- `validate-kimi-research`：ok，0 claims，6 sources，0 thought systems，0 timeline items。
- 单独 `admit-kimi-batch --tier seed` dry-run 未作为失败内容处理：b3 按生产口径必须引用 b2 新 seed `vladimir-solovyov`，而 b2 尚未 admit --write，故单批 dry-run 报 `unknown to: vladimir-solovyov`。这是跨批 pre-admit 依赖，不是 b3 schema/content 失败。

## 合并模拟专项检查

对 b1+b2+b3 的 proposed philosophers / works / relationships 做只读合并模拟，使用正式库 506 位 + 本波 16 位作为 id 空间检查引用完整性和 seed 度数。

结果：PASS。

- proposed philosophers：16
- proposed works：27
- proposed relationships：31
- 每位 works：1–2
- 每位 relationships：2–3
- 每位 sourceNoteURLs：≥1
- 每位 tier：seed
- 每位 thoughtSystem：none
- `vladimir-solovyov` relationships = 3
- `fyodor-dostoevsky` relationships = 3
- `lev-shestov` relationships = 3
- `georgy-plekhanov` / `vladimir-lenin` / `mikhail-bakhtin`：absent

## 关键约束落实

- Solovyov 自身关系：`schelling` + `hegel` + `sergei-bulgakov`，总数 3，未超限。
- 白银时代继承者中只有 `sergei-bulgakov` 挂 `vladimir-solovyov`。
- `nikolai-berdyaev` 改挂 `nietzsche` + `kant`。
- `pavel-florensky` 改挂 `schelling` + `cusa`。
- `semyon-frank` 改挂 `schelling` + `lev-shestov`。
- `fyodor-dostoevsky` 以思想家身份收，关系数 3，已满员。
- `leo-tolstoy` 以思想家身份收，不作纯文学条目。
- `sergei-bulgakov` 与 `marx` 的关系标为早年接收后转向宗教哲学，不作为俄国马克思主义延续波。

## 正式库现状校验

本轮未写正式库。当前正式库实跑结果：

- `npm run validate:data`：ok，506 philosophers（standard 195 | seed 311），200 arguments，964 relationships，10 themes。
- `quality-audit --require-standard`：标准档 195 全绿，RED 0，YELLOW 0。

## 边界

本轮未执行 `admit --write`，未写 `public/data/**`，未 commit/push。按 seed 门禁，下一步需新上下文盲审 W11 三个暂存批；PASS 后再执行正式 admit write、post-check、vitest 与 `npm run sync:dist`。
