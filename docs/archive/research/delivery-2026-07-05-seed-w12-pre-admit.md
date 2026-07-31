# Seed W12 预产交付（pre-admit）

日期：2026-07-05  
范围：东正教 / 希腊基督教传统  
状态：PRE-ADMIT standby，等待新上下文盲审。

## 生产范围

按 `docs/research/seed-w12-candidates.md` 与 `docs/research/seed-w12-production-spec.md` 执行，生成 3 个 seed 暂存批：

- `.research/tmp/kimi/2026-07-05-seed-w12-b1`：4 位，希腊教父奠基。
- `.research/tmp/kimi/2026-07-05-seed-w12-b2`：4 位，拜占庭盛期。
- `.research/tmp/kimi/2026-07-05-seed-w12-b3`：2 位，静修派论争与文艺复兴桥梁。

合计：10 philosophers，18 works，19 relationships，0 claims，0 thought systems。

未生产：`nicholas-cabasilas` / `bessarion`，均按 W12 口径作为可选延伸默认不收。

## 定案参数落实

- `civilization` 统一为 `eastern_orthodox`。
- `periods`：
  - `greek_patristic`：b1 四位。
  - `byzantine`：b2 四位 + `gregory-palamas`。
  - `late_byzantine`：`gemistos-plethon`。
- `pseudo-dionysius` sourceNotes 和 summaryZh 已明确标注：佚名作者、约 500 年成书、托名《使徒行传》中的亚略巴古的丢尼修；按有可归属系统性文本的托名先例收录，不误作使徒时代人物。

## 批次摘要

### b1 — 希腊教父奠基

人物：

- `basil-the-great`
- `gregory-of-nazianzus`
- `gregory-of-nyssa`
- `pseudo-dionysius`

实跑：

- `validate-kimi-research`：ok，0 claims，6 sources，0 thought systems，0 timeline items。
- `admit-kimi-batch --tier seed` dry-run：ok，4 philosophers，7 works，7 relationships。

### b2 — 拜占庭盛期

人物：

- `maximus-the-confessor`
- `john-of-damascus`
- `symeon-the-new-theologian`
- `michael-psellos`

实跑：

- `validate-kimi-research`：ok，0 claims，6 sources，0 thought systems，0 timeline items。
- 单独 `admit-kimi-batch --tier seed` dry-run 未作为失败内容处理：b2 按生产口径必须引用 b1 新 seed `pseudo-dionysius`，而 b1 尚未 admit --write，故单批 dry-run 报 `unknown to: pseudo-dionysius`。这是跨批 pre-admit 依赖，不是 b2 schema/content 失败。

### b3 — 静修派论争 + 文艺复兴桥梁

人物：

- `gregory-palamas`
- `gemistos-plethon`

实跑：

- `validate-kimi-research`：ok，0 claims，4 sources，0 thought systems，0 timeline items。
- 单独 `admit-kimi-batch --tier seed` dry-run 未作为失败内容处理：b3 按生产口径必须引用 b2 新 seed `symeon-the-new-theologian`，而 b2 尚未 admit --write，故单批 dry-run 报 `unknown to: symeon-the-new-theologian`。这是跨批 pre-admit 依赖，不是 b3 schema/content 失败。

## 合并模拟专项检查

对 b1+b2+b3 的 proposed philosophers / works / relationships 做只读合并模拟，使用正式库 506 位 + 本波 10 位作为 id 空间检查引用完整性、theme 白名单、真实 works 与 seed 度数。

结果：PASS。

- proposed philosophers：10
- proposed works：18
- proposed relationships：19
- 每位 works：1–2
- 每位 relationships：2–3
- 每位 sourceNoteURLs：≥1
- 每位 tier：seed
- 每位 thoughtSystem：none
- philosopher themes 与 relationship themeIds 均在 10 主题白名单内
- 未发现 placeholder / primary-work / candidate workId
- `basil-the-great` relationships = 3
- `pseudo-dionysius` relationships = 3
- `maximus-the-confessor` relationships = 3
- `symeon-the-new-theologian` relationships = 3
- `nicholas-cabasilas` / `bessarion`：absent

## 关键约束落实

- Basil 自身关系：`plotinus` + `gregory-of-nazianzus` + `gregory-of-nyssa`，总数 3，未超限。
- Pseudo-Dionysius 自身关系：`plotinus` + `cusa` + `maximus-the-confessor`，总数 3，未超限。
- Maximus 自身关系：`pseudo-dionysius` + `augustine` + `symeon-the-new-theologian`，总数 3，未超限。
- Symeon 自身关系：`maximus-the-confessor` + `augustine` + `gregory-palamas`，总数 3，未超限。
- Palamas 未挂 `pseudo-dionysius` 或 `maximus-the-confessor`，避免枢纽超限。
- John of Damascus ↔ Aquinas 关系 noteZh 已标明方向为后世拉丁经院接收 John。
- Plethon ↔ Cusa 关系 noteZh 已标明为后世/同场接收语境，不写成 Plethon 受 Cusa 影响。

## 正式库现状校验

本轮未写正式库。当前正式库实跑结果：

- `npm run validate:data`：ok，506 philosophers（standard 195 | seed 311），200 arguments，964 relationships，10 themes。
- `quality-audit --require-standard`：标准档 195 全绿，RED 0，YELLOW 0。

## 边界

本轮未执行 `admit --write`，未写 `public/data/**`，未 commit/push。按 seed 门禁，下一步需新上下文盲审 W12 三个暂存批；PASS 后再执行正式 admit write、post-check、vitest 与 `npm run sync:dist`。
