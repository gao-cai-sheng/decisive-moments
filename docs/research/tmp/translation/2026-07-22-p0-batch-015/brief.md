# Translation batch P0-015 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-014/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| georges-bataille | Georges Bataille | 耗费/逾越/普遍经济，接 nietzsche/blanchot。 | 法国哲学 / 身份层 / 思想史补线 |
| georges-sorel | Georges Sorel | 神话、暴力与革命工团主义理论代表，可补马克思主义异端谱系。 | 暴力 / 身份层 / 二线哲人 |
| gershom-scholem | Gershom Scholem | 现代卡巴拉研究奠基者，以历史—文献方法重塑犹太神秘主义研究。 | 卡巴拉研究 / 犹太神秘主义 / 本雅明 |
| gersonides | Gersonides | 《主的战争》作者，将亚里士多德—阿威罗伊传统推进到犹太哲学内部。 | 主的战争 / 亚里士多德主义 / 阿威罗伊传统 |
| gilbert-ryle | Gilbert Ryle | 日常语言哲学与行为主义心灵哲学代表，可补牛津分析传统。 | 日常语言 / 身份层 / 二线哲人 |
| gilbert-simondon | Gilbert Simondon | 个体化与技术哲学代表，可补德勒兹、斯蒂格勒等后续线索。 | 技术哲学 / 身份层 / 二线哲人 |
| giovanni-gentile | Giovanni Gentile | 实际唯心主义代表，可补意大利观念论与克罗齐同代分歧。 | 唯心主义 / 身份层 / 二线哲人 |
| gongsun-long | Gongsun Long | 战国名家代表，以白马非马等名实论辩著称。 | 名家 / 白马非马 / 辩学 |
| gorampa | Gorampa Sonam Senge | 萨迦派中观系统家，以对宗喀巴解释的批评成为藏传中观内部重要节点。 | 萨迦派 / 中观 / 宗喀巴批评 |
| gu-xiancheng | Gu Xiancheng | 晚明东林学派代表，重建东林书院并强调士人公共责任。 | 东林书院 / 顾端文公遗书 / 讲学 |
| gustavo-gutierrez | Gustavo Gutiérrez | 秘鲁神学家，《解放神学》奠定拉美解放神学的问题框架。 | 解放神学 / 穷人优先选项 / 实践 |
| hakuin | Hakuin Ekaku | 江户时期临济禅中兴人物，强化公案训练体系。 | 临济禅 / 公案 / 禅宗中兴 |
| hans-jonas | Hans Jonas | 责任伦理与技术文明批判代表，可补海德格尔弟子线及环境伦理前史。 | 责任伦理 / 身份层 / 二线哲人 |
| hasdai-crescas | Hasdai Crescas | 《主之光》作者，系统批判中世纪亚里士多德主义并重估神爱与无限性。 | 主之光 / 反亚里士多德主义 / 斯宾诺莎前史 |
| he-yan | He Yan | 曹魏玄学人物，主持《论语集解》并推动贵无论讨论。 | 玄学 / 论语集解 / 贵无 |
| heinrich-rickert | Heinrich Rickert | 价值关联与文化科学方法论代表，可补韦伯方法论背景。 | 文化科学 / 身份层 / 二线哲人 |
| helvetius | Claude Adrien Helvétius | 感觉论伦理与功利主义前史，连接洛克经验论和边沁功利主义。 | 感觉论伦理 / 功利 / 教育 |
| henry-sidgwick | Henry Sidgwick | 古典功利主义系统化者，可补密尔之后的伦理学技术化过渡。 | 功利主义 / 身份层 / 二线哲人 |
| holbach | Baron d’Holbach | 《自然的体系》代表法国启蒙的彻底唯物论与决定论。 | 唯物论 / 决定论 / 无神论 |
| honen | Hōnen | 日本净土宗奠基者，以专修念佛重组净土传统。 | 净土宗 / 专修念佛 / 日本佛教 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
