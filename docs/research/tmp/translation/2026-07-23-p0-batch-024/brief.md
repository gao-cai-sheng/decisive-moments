# Translation batch P0-024 — brief（**重译批**）

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 30 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用 `../2026-07-22-p0-batch-023/glossary.json`。

## 这是重译批，不是新批

这 30 位曾在 010–023 批中翻译过，盲审 PASS 但**未被 admit**。原因不在译文：当时的中文源里混着数据管线的内部标记（`身份层` / `二线哲人` / `思想史补线`）和编辑备注（`可补 X` / `接 xxx` / `身份层锚点` / `★升档候选`），忠实翻译的结果是 "identity tier"、"second-line figure"、"intellectual-history filler"、"fills X" 这类对读者无意义的英文——其中「二线哲人 → second-line figure」还是内部评级，不该出现在界面上。

**中文源已在 `23deb9b` 全部修正**：内部标签换成了各人真实的关键词，`oneLineZh` 改写为陈述其思想贡献而非入库理由。

因此：

- **旧译文一律作废**。不要参考 `2026-07-22-p0-batch-0*/patch.philosophers.json` 里这些 id 的内容，那是对旧中文的翻译。
- **以下表格中的中文为准**，它就是现库 `public/data/philosophers.index.json` 的实际值。
- 这批人以欧陆与英美现当代哲学家为主，专名与术语大多有成熟的学界英文形式（如 habitus、field、cultural capital；the normal and the pathological；descriptive metaphysics），请直接用通行译法，不要从中文回译。
- 关键词现在是真实概念而非标签，`keywordsEn` 要译出概念本身，不要笼统化。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`）

| id | names.en | oneLineZh（源，已修正） | keywordsZh（源，已修正） |
|---|---|---|---|
| aj-ayer | A. J. Ayer | 《语言、真理与逻辑》把维也纳学派带入英语世界。 | 逻辑实证主义 / 可证实原则 / 情感主义 |
| alain-locke | Alain Locke | 哈莱姆文艺复兴的哲学阐释者，以价值多元主义论述文化差异。 | 价值多元主义 / 哈莱姆文艺复兴 / 文化多元 |
| alexandre-kojeve | Alexandre Kojève | 以主奴辩证法讲授《精神现象学》，塑造了整整一代法国思想家。 | 黑格尔解释 / 主奴辩证法 / 历史终结 |
| alexius-meinong | Alexius Meinong | 对象论创立者，主张非存在的对象亦有其所是，深刻影响指称理论与本体论争论。 | 对象论 / 非存在对象 / 格拉茨学派 |
| alvin-plantinga | Alvin Plantinga | 改革宗认识论与模态本体论证代表，主张有神论信念可以是基础信念。 | 宗教哲学 / 改革宗认识论 / 模态本体论证 |
| bachelard | Gaston Bachelard | 以认识论断裂和认识论障碍重构科学史，同时写物质想象的诗学。 | 认识论断裂 / 认识论障碍 / 想象诗学 |
| badiou | Alain Badiou | 《存在与事件》以集合论建构本体论和事件性的真理观。 | 事件 / 集合论本体论 / 真理程序 |
| baudrillard | Jean Baudrillard | 以拟像与超真实理论剖析消费社会的符号逻辑。 | 拟像 / 消费社会 / 超真实 |
| bourdieu | Pierre Bourdieu | 以惯习、场域和文化资本构建社会实践理论。 | 惯习 / 场域 / 文化资本 |
| bruno-latour | Bruno Latour | 以行动者网络理论把物一并纳入社会分析。 | 行动者网络 / 科学人类学 / 非人行动者 |
| brunschvicg | Léon Brunschvicg | 以判断哲学和科学精神史成为法国认识论学院的枢纽。 | 判断哲学 / 科学精神史 / 法国认识论 |
| canguilhem | Georges Canguilhem | 《正常与病态》以生命的规范性重写医学哲学，是福柯的直系导师。 | 正常与病态 / 生命科学史 / 医学哲学 |
| cavailles | Jean Cavaillès | 以概念哲学对抗意识哲学，参加抵抗运动而被处决。 | 概念哲学 / 数学哲学 / 抵抗运动 |
| cd-broad | C. D. Broad | 心灵哲学、伦理学与形而上学的剑桥综合者，以细致分类和折衷立场著称。 | 剑桥分析 / 心灵哲学 / 批判哲学史 |
| ci-lewis | C. I. Lewis | 概念实用主义与模态逻辑代表，以严格蕴涵回应实质蕴涵悖论。 | 模态逻辑 / 概念实用主义 / 严格蕴涵 |
| claude-lefort | Claude Lefort | 以权力的空位界定民主，并系统批判极权主义。 | 民主的空位 / 极权批判 / 政治哲学 |
| cornelius-castoriadis | Cornelius Castoriadis | 以社会想象性建制和自治理论构成西方马克思主义的异端。 | 自治 / 社会想象 / 社会主义或野蛮 |
| cournot | Antoine Augustin Cournot | 以概率、经济学与偶然性理论连接实证论与法国认识论传统。 | 概率哲学 / 偶然性 / 科学哲学 |
| david-armstrong | D. M. Armstrong | 澳大利亚唯物论代表，以共相实在论和心脑同一论构造形而上学系统。 | 科学实在论 / 共相 / 心脑同一论 |
| duhem | Pierre Duhem | 提出迪昂命题：假说无法孤立检验，为奎因的整体论开路。 | 整体论 / 不充分决定 / 科学史 |
| emmanuel-mounier | Emmanuel Mounier | 人格主义运动创始人，创办《精神》杂志倡导位格与共同体。 | 人格主义 / 位格 / 共同体 |
| eric-voegelin | Eric Voegelin | 以政治宗教和秩序哲学诊断现代性，把灵知主义视作病根。 | 政治宗教 / 秩序哲学 / 灵知主义批判 |
| ernst-cassirer | Ernst Cassirer | 符号形式哲学的创立者，把神话、语言与科学统一为人的符号化活动。 | 符号形式 / 新康德主义 / 文化哲学 |
| ernst-troeltsch | Ernst Troeltsch | 历史主义与宗教哲学代表，处理狄尔泰、韦伯与神学现代性的交汇。 | 宗教哲学 / 历史主义 / 基督教社会史 |
| etienne-gilson | Étienne Gilson | 以存在（esse）为核心重释托马斯，推动中世纪哲学史研究。 | 中世纪哲学史 / 托马斯主义 / 存在形而上学 |
| fh-bradley | F. H. Bradley | 英国绝对唯心主义代表，以关系的内在性论证成为罗素与摩尔反叛的靶心。 | 绝对唯心主义 / 内在关系 / 现象与实在 |
| frank-ramsey | Frank Ramsey | 真理、概率、决策与经济学的早期枢纽，二十六岁早逝仍留下多重奠基性工作。 | 剑桥分析 / 概率 / 真理紧缩论 |
| franz-brentano | Franz Brentano | 意向性概念的复兴者，以描述心理学连接亚里士多德、经院传统与胡塞尔现象学。 | 意向性 / 描述心理学 / 布伦塔诺学派 |
| gabriel-marcel | Gabriel Marcel | 基督教存在主义代表，以「奥秘」与「问题」之分和希望现象学立说。 | 存在主义 / 奥秘 / 希望 |
| georg-simmel | Georg Simmel | 形式社会学与文化哲学代表，以互动形式和货币哲学剖析现代性经验。 | 形式社会学 / 文化哲学 / 现代性 |
