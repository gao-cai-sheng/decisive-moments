# Translation batch P0-006 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-005/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| radhakrishnan | Sarvepalli Radhakrishnan | 以现代吠檀多和比较哲学方式重述印度思想，并把宗教经验置于世界哲学对话中。 | 印度哲学 / 比较宗教 / 吠檀多 / 直觉 / 精神人文主义 |
| madhva | Madhva | 以二元论吠檀多反对不二论，强调神、灵魂和世界之间真实差异。 | 二元论吠檀多 / 毗湿奴信仰 / 差异 / 注疏 / 解脱 |
| charles-taylor | Charles Taylor | 以现代自我、承认政治和世俗化理论重塑政治哲学、伦理学与宗教现代性研究。 | 承认政治 / 现代自我 / 世俗时代 / 强评价 / 社群主义 |
| bentham | Jeremy Bentham | 以最大幸福原则和制度化法改革把伦理学、立法学与现代政治计算连接起来。 | 功利原则 / 最大幸福 / 法改革 / 刑罚 / 权利批判 |
| comte | Auguste Comte | 以三阶段律、科学分类和社会学构想把现代知识秩序与社会重组方案结合起来。 | 实证主义 / 三阶段律 / 科学分类 / 社会学 / 人类宗教 |
| schleiermacher | Friedrich Schleiermacher | 以宗教感情理论和普遍诠释学把现代神学、解释理论与主体个体性连接起来。 | 诠释学 / 宗教感情 / 绝对依赖 / 个体性 / 浪漫主义神学 |
| reid | Thomas Reid | 以常识原则和直接实在论回应怀疑论，并把认识论延伸到行动、责任和自由问题。 | 常识哲学 / 直接实在论 / 反怀疑论 / 知觉 / 主动能力 |
| tocqueville | Alexis de Tocqueville | 以民主平等条件、结社生活和中央集权批判分析现代自由社会的脆弱条件。 | 民主 / 平等条件 / 结社 / 地方自治 / 温和专制 |
| gramsci | Antonio Gramsci | 以霸权、市民社会和有机知识分子理论重写马克思主义革命策略与文化政治。 | 霸权 / 市民社会 / 有机知识分子 / 阵地战 / 被动革命 |
| lukacs | György Lukács | 以物化、总体性和阶级意识理论奠定西方马克思主义与批判理论的重要前史。 | 物化 / 阶级意识 / 总体性 / 辩证法 / 现实主义 |
| bloch | Ernst Bloch | 以希望原则和尚未意识把马克思主义解放政治、宗教象征和乌托邦想象连接起来。 | 希望原则 / 乌托邦 / 尚未意识 / 预期意识 / 弥赛亚意象 |
| marcuse | Herbert Marcuse | 以技术理性、欲望解放和发达工业社会批判推进法兰克福学派政治哲学。 | 单向度社会 / 技术理性 / 爱欲 / 压抑性宽容 / 解放 |
| fromm | Erich Fromm | 以人本精神分析和马克思主义异化理论解释现代自由、人格和社会病理。 | 逃避自由 / 社会性格 / 异化 / 人本伦理 / 占有与存在 |
| berlin | Isaiah Berlin | 以两种自由概念和价值多元论重塑二十世纪自由主义的反乌托邦论证。 | 消极自由 / 积极自由 / 价值多元 / 反决定论 / 思想史 |
| hayek | Friedrich Hayek | 以分散知识和自发秩序理论批判计划理性，并重构自由主义法治论。 | 自发秩序 / 知识问题 / 法治 / 计划批判 / 市场秩序 |
| schmitt | Carl Schmitt | 以主权决断、例外状态和敌友区分揭示现代政治秩序的危机，同时必须置于反自由主义和纳粹牵连的批判语境中。 | 主权 / 例外状态 / 敌友区分 / 政治神学 / 议会制批判 |
| croce | Benedetto Croce | 以表现美学、历史主义和自由史观重构意大利唯心主义，并推动维柯的现代复兴。 | 表现美学 / 历史主义 / 自由史观 / 精神哲学 / 维柯复兴 |
| yan-hui | Yan Hui | 孔门弟子中以德行著称的颜渊，后世常以其代表儒家修身典范。 | 孔门 / 仁学 / 安贫乐道 |
| zengzi | Zengzi | 孔门后学中以孝道、慎独与修身传承著称的儒家人物。 | 孝道 / 孔门 / 大学 |
| zisi | Zisi | 孔子之孙、战国早期儒家传承中连接孔孟的重要人物。 | 中庸 / 孔门后学 / 性命 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。
