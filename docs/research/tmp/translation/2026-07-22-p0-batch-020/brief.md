# Translation batch P0-020 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-019/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| mir-damad | Mīr Dāmād | 伊斯法罕学派核心人物和萨德拉之师，以时间、永恒和创生问题构成萨法维哲学的重要节点。 | 伊斯法罕学派 / 萨德拉之师 / 时间创生 |
| miskawayh | Aḥmad ibn Muḥammad Miskawayh | 伊斯兰伦理学系统家，以《性理之净化》把希腊德性伦理转化为灵魂训练和品格教育方案。 | 性理之净化 / 品格修养 / 亚里士多德伦理学 |
| montesquieu | Montesquieu | 《论法的精神》以分权与政体类型学成为现代政治哲学关键节点。 | 分权 / 政体论 / 法精神 |
| mordecai-kaplan | Mordecai M. Kaplan | 重建主义犹太教奠基者，将犹太教解释为演化中的宗教文明。 | 重建主义 / 犹太文明 / 宗教自然主义 |
| moses-de-leon | Moses de León | 《光辉之书》传播与作者问题的核心人物，是中世纪卡巴拉谱系关键节点。 | 光辉之书 / 佐哈尔 / 中世纪卡巴拉 |
| moses-mendelssohn | Moses Mendelssohn | 犹太启蒙关键人物，以《耶路撒冷》讨论宗教权力、宽容与犹太公民身份。 | 哈斯卡拉 / 耶路撒冷 / 宗教宽容 |
| motoori-norinaga | Motoori Norinaga | 日本国学代表，围绕古典文本和“物哀”重构审美与身份论述。 | 国学 / 物哀 / 古事记传 |
| muhammad-abduh | Muḥammad ʿAbduh | 埃及现代主义改革者，以宗教教育、法学改革和理性化诠释推动伊斯兰与现代社会的协调。 | 埃及现代主义 / 宗教教育改革 / 理性诠释 |
| nachmanides | Nachmanides | 拉姆班以释经、哈拉卡与早期卡巴拉参与迈蒙尼德之争。 | 拉姆班 / 迈蒙尼德之争 / 早期卡巴拉 |
| nasir-al-din-tusi | Naṣīr al-Dīn al-Ṭūsī | 哲学家、伦理学家和天文学家，在后伊本·西那哲学、什叶神学和数学天文学之间建立关键连接。 | 伊本·西那传统 / 阿赫拉格·纳西里 / 马拉盖天文台 |
| nasir-khusraw | Nāṣir-i Khusraw | 伊斯玛仪派诗人和思想家，以波斯语哲学诗文表达宇宙论、启示解释和灵魂归返问题。 | 伊斯玛仪派 / 新柏拉图主义 / 波斯哲学诗 |
| nelson-goodman | Nelson Goodman | 构造主义认识论、符号系统与艺术哲学代表，可补奎因周边线索。 | 身份层 / 二线哲人 / 思想史补线 |
| nichiren | Nichiren | 日莲佛教奠基者，以法华经信仰和护国论形成独特日本佛教路线。 | 法华信仰 / 日莲宗 / 护国论 |
| nicolai-hartmann | Nicolai Hartmann | 新本体论代表，可补现象学与形而上学之间的德国线索。 | 新本体论 / 身份层 / 二线哲人 |
| octavio-paz | Octavio Paz | 墨西哥诗人兼思想家，以《孤独的迷宫》分析墨西哥身份、孤独与现代性。 | 孤独的迷宫 / 墨西哥性 / 诗与现代性 |
| ogyu-sorai | Ogyū Sorai | 江户儒学代表，以古文辞学和礼乐制度论批评朱子学。 | 古文辞学 / 礼乐制度 / 江户儒学 |
| patanjali | Patañjali | 《瑜伽经》的传统归属作者，瑜伽派八支修行论的身份层锚点。 | 瑜伽经 / 八支瑜伽 / 修行论 |
| paul-natorp | Paul Natorp | 马堡新康德主义核心人物，可补科恩之后的认识论与社会教育哲学。 | 新康德主义 / 身份层 / 二线哲人 |
| pei-wei | Pei Wei | 西晋思想家，以《崇有论》反思贵无玄学。 | 崇有论 / 反贵无 / 西晋玄学 |
| pf-strawson | P. F. Strawson | 描述形而上学与普通语言传统代表，可补康德与分析哲学接口。 | 身份层 / 二线哲人 / 思想史补线 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
