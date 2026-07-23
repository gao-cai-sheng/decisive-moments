# Translation batch P0-025 — brief（**重译批**）

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 30 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用 `../2026-07-23-p0-batch-024/glossary.json`。

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
| george-herbert-mead | George Herbert Mead | 以主我与客我之分和角色采择建立社会自我理论。 | 社会自我 / 符号互动 / 角色采择 |
| george-santayana | George Santayana | 自然主义、怀疑论与美学的交界人物，以《理性的生命》和《存在的领域》立说。 | 自然主义 / 美学 / 本质领域 |
| georges-bataille | Georges Bataille | 以耗费、逾越和普遍经济概念探讨神圣与僭越。 | 耗费 / 逾越 / 普遍经济 |
| georges-sorel | Georges Sorel | 《论暴力》以社会神话和革命工团主义构成马克思主义内部的异端。 | 暴力 / 社会神话 / 工团主义 |
| gilbert-ryle | Gilbert Ryle | 《心的概念》以「机器中的幽灵」批判笛卡尔二元论，奠定日常语言学派。 | 日常语言 / 范畴错误 / 心的概念 |
| gilbert-simondon | Gilbert Simondon | 以个体化理论和技术物的存在方式重构技术哲学。 | 个体化 / 技术哲学 / 跨个体 |
| giovanni-gentile | Giovanni Gentile | 实际唯心主义的创立者，主张思维行动即唯一实在，因此与克罗齐分道扬镳。 | 实际唯心主义 / 意大利观念论 / 思维行动 |
| hans-jonas | Hans Jonas | 《责任原理》为技术文明提出面向未来世代的伦理律令。 | 责任伦理 / 技术批判 / 诺斯替研究 |
| heinrich-rickert | Heinrich Rickert | 以价值关联概念完善文化科学方法论，构成韦伯方法论的直接背景。 | 价值关联 / 文化科学 / 西南学派 |
| henry-sidgwick | Henry Sidgwick | 古典功利主义的系统化者，《伦理学方法》为密尔之后的伦理学奠定技术化框架。 | 功利主义 / 伦理学方法 / 直觉主义 |
| jacques-maritain | Jacques Maritain | 新托马斯主义代表，为世界人权宣言提供了哲学论证。 | 新托马斯主义 / 人权 / 整全人道主义 |
| jaimini | Jaimini | 《弥曼差经》的传统归属作者，前弥曼差的祭祀解释学由此立宗。 | 弥曼差 / 祭祀解释学 / 传统归属 |
| jan-patocka | Jan Patočka | 捷克现象学家与七七宪章发言人，以照料灵魂论述历史性存在。 | 现象学 / 照料灵魂 / 异见政治 |
| jane-addams | Jane Addams | 赫尔馆创办者，把实用主义带入社会改革与和平运动。 | 社会伦理 / 民主 / 实用主义改革 |
| jankelevitch | Vladimir Jankélévitch | 以「几乎无」和不可宽恕问题书写道德经验的细微处。 | 道德哲学 / 不可宽恕 / 几乎无 |
| jean-luc-nancy | Jean-Luc Nancy | 以无用的共通体和共在存在论回应海德格尔与巴塔耶。 | 共通体 / 共在 / 解构存在论 |
| jjc-smart | J. J. C. Smart | 心脑同一论与后果主义代表，主张一种彻底的科学实在论。 | 心脑同一论 / 后果主义 / 科学实在论 |
| jl-austin | J. L. Austin | 言语行为理论的源头，《如何以言行事》把语言从意义推向行动。 | 言语行为 / 施行话语 / 日常语言 |
| john-mcdowell | John McDowell | 《心灵与世界》主张经验本身已是概念性的，重连分析哲学与黑格尔传统。 | 概念经验 / 德性伦理 / 匹兹堡学派 |
| jose-ortega-y-gasset | José Ortega y Gasset | 生命理性与视角主义的倡导者，《大众的反叛》批判现代群众社会。 | 生命理性 / 视角主义 / 大众社会 |
| josiah-royce | Josiah Royce | 美国绝对唯心主义与共同体哲学代表，以「忠」为核心构造伦理学。 | 绝对唯心主义 / 共同体 / 忠的哲学 |
| judith-jarvis-thomson | Judith Jarvis Thomson | 以小提琴家论证和电车难题重塑应用伦理学的案例传统。 | 权利 / 生命伦理 / 电车难题 |
| judith-shklar | Judith Shklar | 以「恐惧的自由主义」和对残酷的优先关注重构自由主义。 | 恐惧自由主义 / 残酷 / 不义 |
| kanada | Kaṇāda | 《胜论经》的传统归属作者，胜论派的原子论与范畴论由此立宗。 | 胜论经 / 原子论 / 范畴论 |
| karl-lowith | Karl Löwith | 论证现代进步史观其实是基督教末世论的世俗化产物。 | 历史哲学 / 世俗化 / 现代性批判 |
| koyre | Alexandre Koyré | 《从封闭世界到无限宇宙》重写科学革命史，深刻影响库恩。 | 科学革命史 / 观念史 / 无限宇宙 |
| lacan | Jacques Lacan | 以镜像阶段和「无意识如语言般构成」重读弗洛伊德。 | 精神分析 / 镜像阶段 / 象征界 |
| leo-strauss | Leo Strauss | 古典政治哲学的复兴者，以隐微写作解释重读古今之争。 | 古典政治哲学 / 隐微写作 / 古今之争 |
| leszek-kolakowski | Leszek Kołakowski | 《马克思主义主要流派》作者，从修正主义转向对乌托邦的宗教式追问。 | 宗教哲学 / 马克思主义批判 / 东欧思想 |
| levi-strauss | Claude Lévi-Strauss | 以亲属结构和神话学分析奠定结构人类学。 | 结构人类学 / 神话学 / 亲属结构 |
