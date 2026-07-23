# Translation batch P0-017 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-016/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| jean-luc-nancy | Jean-Luc Nancy | 共通体与解构性存在论，接 derrida。 | 法国哲学 / 身份层 / 思想史补线 |
| jeong-yakyong | Jeong Yakyong | 朝鲜实学集大成者，重释经学并发展经世政治思想。 | 实学 / 茶山 / 经世 |
| jia-yi | Jia Yi | 西汉初政论家，以制度改革和秦亡反思著称。 | 新书 / 过秦论 / 汉初政论 |
| jinul | Jinul | 朝鲜禅宗关键人物，以顿悟渐修和曹溪传统重组朝鲜佛教。 | 曹溪宗 / 顿悟渐修 / 朝鲜禅 |
| jjc-smart | J. J. C. Smart | 心脑同一论与功利主义代表，可补澳大利亚分析哲学。 | 心脑同一论 / 身份层 / 二线哲人 |
| jl-austin | J. L. Austin | 言语行为理论源头，可补语言哲学从意义到行动的转向。 | 言语行为 / 身份层 / 二线哲人 |
| john-mcdowell | John McDowell | 心灵与世界、德性伦理与概念经验代表，可补分析哲学与黑格尔传统接口。 | 身份层 / 二线哲人 / 思想史补线 |
| jose-enrique-rodo | José Enrique Rodó | 乌拉圭思想家，《爱丽尔》以审美—伦理教育塑造拉美精神身份论。 | 爱丽尔主义 / 反功利主义 / 青年教育 |
| jose-marti | José Martí | 古巴独立思想家，《我们的美洲》以美洲主体性回应殖民与帝国秩序。 | 我们的美洲 / 古巴独立 / 反帝国主义 |
| jose-ortega-y-gasset | José Ortega y Gasset | 生命理性、视角主义与群众社会批判代表，可补西班牙现代哲学。 | 生命理性 / 身份层 / 二线哲人 |
| jose-vasconcelos | José Vasconcelos | 墨西哥思想家与教育家，《宇宙种族》以混血宇宙论重写美洲身份。 | 宇宙种族 / 美学救赎 / 墨西哥教育 |
| joseph-albo | Joseph Albo | 《信条书》作者，重整犹太教义原则与信仰分类。 | 信条书 / 犹太教义原理 / 信仰原则 |
| joseph-soloveitchik | Joseph B. Soloveitchik | 现代正统犹太思想代表，以哈拉哈主体、创造性人格和信仰孤独构造宗教哲学。 | 哈拉哈人 / 孤独的信仰人 / 现代正统派 |
| josiah-royce | Josiah Royce | 美国绝对唯心主义与共同体哲学代表，可补实用主义同代对手盘。 | 唯心主义 / 实用主义 / 身份层 |
| judah-halevi | Judah Halevi | 《库萨里》作者，以对话体为犹太启示与历史共同体辩护。 | 库萨里 / 启示护教 / 反哲学 |
| judith-jarvis-thomson | Judith Jarvis Thomson | 权利、生命伦理与道德难题代表，可补应用伦理学核心案例线。 | 身份层 / 二线哲人 / 思想史补线 |
| judith-shklar | Judith Shklar | 恐惧自由主义与政治恶论代表，可补战后自由主义内部批判。 | 身份层 / 二线哲人 / 思想史补线 |
| kamalasila | Kamalaśīla | 桑耶论诤中渐门代表，以《修习次第》成为入藏佛教修道论节点。 | 桑耶论诤 / 修习次第 / 渐门 |
| kanada | Kaṇāda | 《胜论经》的传统归属作者，胜论派原子论和范畴论的身份层锚点。 | 胜论经 / 原子论 / 范畴论 |
| kapila-ishvarakrishna | Īśvarakṛṣṇa / Kapila tradition | 以《数论颂》系统化数论派二元论和三德理论。 | 数论 / 二元论 / 三德 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
