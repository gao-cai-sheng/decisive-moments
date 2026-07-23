# Translation batch P0-016 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-015/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| hostos | Eugenio María de Hostos | 波多黎各教育家与伦理思想家，以社会伦理和安的列斯解放方案连接实证主义与反殖民政治。 | 社会伦理 / 教育改革 / 安的列斯联邦 |
| hu-yuan | Hu Yuan | 北宋教育家和儒者，以安定学派、经义治事教育著称。 | 安定先生 / 苏湖教法 / 经世教育 |
| huan-tan | Huan Tan | 两汉之际思想家，以《新论》与反谶纬立场著称。 | 新论 / 反谶纬 / 东汉思想 |
| hui-shi | Hui Shi | 战国名家代表，与庄子同时并以辩学和合同异命题著称。 | 名家 / 辩者 / 合同异 |
| ibn-bajja | Ibn Bājja / Avempace | 安达卢斯哲学家，以《孤独者之治理》讨论哲人如何在不完善城邦中保存理智完善。 | 阿文帕塞 / 孤独者之治理 / 安达卢斯哲学 |
| ibn-gabirol | Solomon Ibn Gabirol | 以《生命之源》提出新柏拉图主义形而上学，在拉丁经院传统中以 Avicebron 著称。 | 生命之源 / 阿维斯布朗 / 普遍质料 |
| ibn-hazm | Ibn Ḥazm | 安达卢斯查希里派思想家，兼具法学、逻辑、宗教论辩和爱情文学写作。 | 查希里派 / 逻辑与法学 / 鸽子的项圈 |
| ibn-taymiyya | Ibn Taymiyya | 罕百里派法学家和神学批判者，以反哲学、反kalam、反苏非一元论和政治神学影响后世。 | 罕百里派 / 批判哲学与kalam / 反苏非一元论 |
| ibn-tufayl | Ibn Ṭufayl / Abubacer | 安达卢斯哲学家，以《哈义·本·叶格赞》叙述孤岛理性如何从自然观察上升到形而上学与宗教真理。 | 哈义·本·叶格赞 / 自然理性 / 哲学小说 |
| ignacio-ellacuria | Ignacio Ellacuría | 萨尔瓦多耶稣会哲学家，以历史现实概念连接解放哲学、神学与政治实践。 | 历史现实 / 解放哲学 / 萨尔瓦多 |
| isaac-israeli | Isaac Israeli | 早期中世纪犹太新柏拉图主义者，将阿拉伯哲学与犹太思想相接。 | 犹太新柏拉图主义 / 定义之书 / 流溢论 |
| isaac-luria | Isaac Luria | 卢里亚卡巴拉核心人物，以收缩、器皿破碎和修复理论重塑近世犹太神秘主义。 | 收缩 / 破碎 / 修复 |
| ito-jinsai | Itō Jinsai | 江户古学派代表，主张回到孔孟文本并批评朱子学。 | 古学派 / 孔孟 / 朱子学批评 |
| ivan-kireevsky | Ivan Kireevsky | 斯拉夫派共同奠基者之一，以整全知识和东正教传统反思西欧理性主义。 | 整全知识 / 斯拉夫派 / 欧洲文化 / 东正教传统 |
| jacques-maritain | Jacques Maritain | 新托马斯主义与人权哲学代表，可补天主教政治哲学现代线索。 | 新托马斯主义 / 身份层 / 二线哲人 |
| jaimini | Jaimini | 《弥曼差经》的传统归属作者，前弥曼差祭祀解释学的身份层锚点。 | 弥曼差 / 祭祀解释学 / 传统归属 |
| jamgon-kongtrul | Jamgön Kongtrul Lodrö Tayé | 利美运动核心人物，以《知识总汇》等整合藏传多传统。 | 利美运动 / 知识总汇 / 五大藏 |
| jan-patocka | Jan Patočka | 捷克现象学与异见政治思想代表，可补胡塞尔—海德格尔东欧线索。 | 身份层 / 二线哲人 / 思想史补线 |
| jane-addams | Jane Addams | 社会伦理、民主与实用主义改革思想代表，可补美国女性哲学线索。 | 身份层 / 二线哲人 / 思想史补线 |
| jankelevitch | Vladimir Jankélévitch | 道德的不可名状与不可宽恕，接 bergson。 | 法国哲学 / 身份层 / 思想史补线 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
