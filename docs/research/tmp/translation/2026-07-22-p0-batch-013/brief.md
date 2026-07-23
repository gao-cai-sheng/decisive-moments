# Translation batch P0-013 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-012/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| cavailles | Jean Cavaillès | 概念哲学与数学哲学，接 canguilhem/foucault。 | 法国哲学 / 身份层 / 思想史补线 |
| cd-broad | C. D. Broad | 心灵哲学、伦理学与形而上学的剑桥综合人物，可补摩尔之后的英国分析线。 | 身份层 / 二线哲人 / 思想史补线 |
| chen-que | Chen Que | 明清之际儒者，以《大学辨》质疑经典权威和理学解释。 | 大学辨 / 反理学教条 / 清初儒学 |
| cheng-xuanying | Cheng Xuanying | 唐代道教学者，以老庄义疏和重玄思想著称。 | 重玄学 / 老子义疏 / 庄子疏 |
| ci-lewis | C. I. Lewis | 概念实用主义与模态逻辑代表，可补皮尔士—奎因之间的美国分析线索。 | 模态逻辑 / 身份层 / 二线哲人 |
| claude-lefort | Claude Lefort | 民主的空位与极权批判，接 castoriadis。 | 法国哲学 / 身份层 / 思想史补线 |
| condillac | Étienne Bonnot de Condillac | 感觉论把洛克经验论推向系统化，雕像譬喻成为认识论史线索。 | 感觉论 / 经验论 / 语言起源 |
| condorcet | Marquis de Condorcet | 进步史观与社会数学连接启蒙政治哲学和后来的实证主义叙事。 | 进步史观 / 社会数学 / 启蒙政治 |
| cornelius-castoriadis | Cornelius Castoriadis | 社会想象与自治理论代表，可补西方马克思主义异端与政治哲学线索。 | 自治理论 / 身份层 / 二线哲人 |
| cournot | Antoine Augustin Cournot | 概率/经济与科学哲学枢纽，接 comte 实证论与后续法国认识论。 | 法国哲学 / 身份层 / 思想史补线 |
| cui-shu | Cui Shu | 清代考据学者，以《考信录》辨析上古史传可信度。 | 考信录 / 疑古 / 经史考辨 |
| dalai-lama-14 | 14th Dalai Lama | 格鲁派当代领袖，以中观解释、伦理和科学对话进入全球哲学语境。 | 格鲁派 / 当代中观 / 科学对话 |
| daosheng | Daosheng | 东晋刘宋僧人，以顿悟成佛和一阐提成佛争论著称。 | 顿悟成佛 / 一阐提 / 涅槃学 |
| david-armstrong | D. M. Armstrong | 澳大利亚实在论与心灵物理主义代表，可补当代形而上学板块。 | 身份层 / 二线哲人 / 思想史补线 |
| dhammapala | Dhammapala | 上座部巴利注疏家，传统上与《胜义灯疏》系列小部注疏相连，断代约6—7世纪但不确。 | 胜义灯疏 / 小部注疏 / 巴利注疏 / 断代不确 |
| diderot | Denis Diderot | 《百科全书》主编，连接启蒙知识工程、唯物论与美学批评。 | 百科全书 / 唯物论 / 美学 |
| dolpopa | Dolpopa Sherab Gyaltsen | 觉囊派系统家，以他空见构成藏传中观解释的重要分歧。 | 觉囊派 / 他空见 / 山法 |
| duhem | Pierre Duhem | 整体论与不充分决定论（Duhem 命题），接 quine。 | 法国哲学 / 身份层 / 思想史补线 |
| emmanuel-mounier | Emmanuel Mounier | 人格主义，接 maritain/marcel。 | 法国哲学 / 身份层 / 思想史补线 |
| eric-voegelin | Eric Voegelin | 政治宗教与秩序哲学代表，可补现代性批判的保守谱系。 | 政治宗教 / 身份层 / 二线哲人 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
