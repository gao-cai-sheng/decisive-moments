# Translation batch P0-021 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-020/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| philo-of-alexandria | Philo of Alexandria | 以希腊哲学范畴解释托拉，是犹太哲学古代谱系的关键起点。 | 寓意释经 / 逻各斯 / 希腊化犹太哲学 |
| pierre-bayle | Pierre Bayle | 《历史批判辞典》以怀疑论、宽容和神义论问题影响莱布尼茨。 | 怀疑论 / 宽容 / 历史批判辞典 |
| poincare | Henri Poincaré | 约定论与科学方法论代表，接数学基础与 duhem。 | 法国哲学 / 身份层 / 思想史补线 |
| rabia-al-adawiyya | Rābiʿa al-ʿAdawiyya | 早期苏非圣徒形象，以不为天堂地狱而只为真主的纯粹神爱成为苏非爱的经典源头。 | 纯粹神爱 / 早期苏非 / 禁欲传统 |
| ranciere | Jacques Rancière | 感性的分配与政治美学，接 althusser。 | 法国哲学 / 身份层 / 思想史补线 |
| ravaisson | Félix Ravaisson | 《论习惯》影响柏格森，并通过亚里士多德研究连接法国唯灵论和古典形而上学。 | 习惯 / 亚里士多德研究 / 生命哲学 |
| raymond-aron | Raymond Aron | 自由主义政治哲学与历史哲学，接 weber/sartre。 | 法国哲学 / 身份层 / 思想史补线 |
| rene-girard | René Girard | 模仿欲望与替罪羊机制。 | 法国哲学 / 身份层 / 思想史补线 |
| renouvier | Charles Renouvier | 新批判主义重写康德问题，并对威廉·詹姆斯的自由意志论产生影响。 | 新批判主义 / 自由意志 / 康德接受 |
| rg-collingwood | R. G. Collingwood | 历史哲学与问答逻辑代表，可补英美历史认识论。 | 历史哲学 / 身份层 / 二线哲人 |
| richard-swinburne | Richard Swinburne | 概率神学与宗教哲学代表，可补英美自然神学当代线索。 | 宗教哲学 / 宗教哲学 / 身份层 |
| risieri-frondizi | Risieri Frondizi | 阿根廷价值论哲学家，以价值结构和自我理论进入20世纪拉美学院哲学谱系。 | 价值论 / 自我理论 / 拉美学院哲学 |
| rm-hare | R. M. Hare | 规范伦理学中的规定主义代表，可补元伦理学与应用伦理学过渡。 | 身份层 / 二线哲人 / 思想史补线 |
| robert-brandom | Robert Brandom | 推论主义语义学代表，可补塞拉斯之后的匹兹堡学派。 | 推论主义 / 身份层 / 二线哲人 |
| rodolfo-kusch | Rodolfo Kusch | 阿根廷思想家，以美洲在场、原住民世界和大众文化批判欧洲存在论。 | 美洲存在 / estar / 原住民思想 |
| ruan-ji | Ruan Ji | 魏晋玄学名士，以人格自由、礼法批判和庄学接受著称。 | 竹林七贤 / 达庄论 / 大人先生传 |
| rumi | Jalāl al-Dīn Rūmī | 波斯苏非诗人与神秘思想家，以《玛斯纳维》将爱、合一和灵魂转化写成影响深远的诗性哲学。 | 玛斯纳维 / 爱与合一 / 波斯苏非诗 |
| ruth-barcan-marcus | Ruth Barcan Marcus | 量化模态逻辑先驱，可补克里普克之前的模态语义背景。 | 模态逻辑 / 身份层 / 二线哲人 |
| sakya-pandita | Sakya Paṇḍita | 萨迦派系统家，以《量理宝藏论》推进藏传量论传统。 | 萨迦派 / 量论 / 量理宝藏论 |
| salazar-bondy | Augusto Salazar Bondy | 秘鲁哲学家，以拉美哲学真实性问题开启与 Zea 的经典争论。 | 我们美洲有哲学吗 / 真实性 / 依附 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
