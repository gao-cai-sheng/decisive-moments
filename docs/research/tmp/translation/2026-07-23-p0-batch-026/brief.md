# Translation batch P0-026 — brief（**重译批**）

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 29 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用 `../2026-07-23-p0-batch-025/glossary.json`。

## 这是重译批，不是新批

这 29 位曾在 010–023 批中翻译过，盲审 PASS 但**未被 admit**。原因不在译文：当时的中文源里混着数据管线的内部标记（`身份层` / `二线哲人` / `思想史补线`）和编辑备注（`可补 X` / `接 xxx` / `身份层锚点` / `★升档候选`），忠实翻译的结果是 "identity tier"、"second-line figure"、"intellectual-history filler"、"fills X" 这类对读者无意义的英文——其中「二线哲人 → second-line figure」还是内部评级，不该出现在界面上。

**中文源已在 `23deb9b` 全部修正**：内部标签换成了各人真实的关键词，`oneLineZh` 改写为陈述其思想贡献而非入库理由。

因此：

- **旧译文一律作废**。不要参考 `2026-07-22-p0-batch-0*/patch.philosophers.json` 里这些 id 的内容，那是对旧中文的翻译。
- **以下表格中的中文为准**，它就是现库 `public/data/philosophers.index.json` 的实际值。
- 这批人以欧陆与英美现当代哲学家为主，专名与术语大多有成熟的学界英文形式（如 habitus、field、cultural capital；the normal and the pathological；descriptive metaphysics），请直接用通行译法，不要从中文回译。
- 关键词现在是真实概念而非标签，`keywordsEn` 要译出概念本身，不要笼统化。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`）

| id | names.en | oneLineZh（源，已修正） | keywordsZh（源，已修正） |
|---|---|---|---|
| louis-althusser | Louis Althusser | 结构主义马克思主义代表，提出意识形态国家机器与认识论断裂。 | 结构主义马克思主义 / 意识形态 / 认识论断裂 |
| lyotard | Jean-François Lyotard | 《后现代状况》宣告元叙事的终结。 | 后现代 / 元叙事 / 争执 |
| maurice-blanchot | Maurice Blanchot | 以文学空间、中性与灾异书写探索语言的界限。 | 文学空间 / 中性 / 灾异书写 |
| maurice-blondel | Maurice Blondel | 《行动》以行动的内在逻辑通向超越，为法国天主教现代思想开路。 | 行动哲学 / 内在方法 / 天主教现代思想 |
| max-scheler | Max Scheler | 现象学价值伦理学代表，以质料价值伦理学和人格理论回应康德的形式主义。 | 价值伦理 / 现象学 / 人格 |
| michael-dummett | Michael Dummett | 意义理论与反实在论代表，以可断言性条件重解弗雷格。 | 反实在论 / 意义理论 / 弗雷格研究 |
| michael-oakeshott | Michael Oakeshott | 以实践知识对抗政治理性主义，为英国保守主义提供了哲学表达。 | 保守主义 / 实践知识 / 政治理性主义批判 |
| michel-henry | Michel Henry | 生命现象学代表，主张生命在自身感发中直接显现。 | 生命现象学 / 内在性 / 自身感发 |
| michel-serres | Michel Serres | 以第三者和寄生者的形象打通科学史与人文传统。 | 寄生者 / 第三者 / 科学与人文 |
| miguel-de-unamuno | Miguel de Unamuno | 以《生命的悲剧意识》书写理性与信仰之间无法调和的冲突。 | 生命悲剧感 / 信仰 / 存在主义 |
| nelson-goodman | Nelson Goodman | 以「绿蓝」悖论重提归纳问题，并把符号系统理论推向艺术哲学。 | 构造主义 / 符号系统 / 新归纳之谜 |
| nicolai-hartmann | Nicolai Hartmann | 新本体论代表，以实在的层次结构调和现象学与形而上学。 | 新本体论 / 价值伦理 / 实在层次 |
| patanjali | Patañjali | 《瑜伽经》的传统归属作者，瑜伽派八支修行论由此系统化。 | 瑜伽经 / 八支瑜伽 / 修行论 |
| paul-natorp | Paul Natorp | 马堡新康德主义核心人物，把认识论推进到社会教育哲学。 | 新康德主义 / 马堡学派 / 社会教育 |
| pf-strawson | P. F. Strawson | 以《个体》确立描述形而上学，重新接通康德与分析哲学。 | 描述形而上学 / 指称 / 个体 |
| poincare | Henri Poincaré | 约定论代表，主张几何公理既非经验也非先验，而是约定。 | 约定论 / 科学方法 / 数学基础 |
| ranciere | Jacques Rancière | 以感性的分配把政治与美学置于同一问题域。 | 感性分配 / 政治美学 / 平等 |
| raymond-aron | Raymond Aron | 以《知识分子的鸦片》和历史哲学捍卫自由主义，与萨特长期论争。 | 自由主义 / 历史哲学 / 知识分子批判 |
| rene-girard | René Girard | 以模仿欲望和替罪羊机制解释暴力与神圣的起源。 | 模仿欲望 / 替罪羊 / 神圣暴力 |
| rg-collingwood | R. G. Collingwood | 历史哲学与问答逻辑代表，主张一切历史都是思想在当下的重演。 | 历史哲学 / 问答逻辑 / 艺术哲学 |
| richard-swinburne | Richard Swinburne | 以贝叶斯概率论证有神论，代表英美自然神学的当代形态。 | 宗教哲学 / 概率论证 / 自然神学 |
| rm-hare | R. M. Hare | 规定主义代表，主张道德判断兼具规定性与可普遍化性。 | 规定主义 / 元伦理学 / 可普遍化 |
| robert-brandom | Robert Brandom | 推论主义语义学代表，把意义奠基于给出与索取理由的推论实践。 | 推论主义 / 语义学 / 匹兹堡学派 |
| ruth-barcan-marcus | Ruth Barcan Marcus | 量化模态逻辑先驱，巴坎公式为后来的模态语义学铺路。 | 模态逻辑 / 巴坎公式 / 直接指称 |
| susan-stebbing | Susan Stebbing | 英国第一位女性哲学教授，以《有目的的思维》推广逻辑分析与公共说理。 | 分析哲学 / 逻辑经验主义 / 清晰思考 |
| th-green | T. H. Green | 英国新黑格尔主义与新自由主义的源头人物，以伦理国家和积极自由重构自由概念。 | 新黑格尔主义 / 积极自由 / 伦理国家 |
| thomas-nagel | Thomas Nagel | 「成为一只蝙蝠是什么感觉」的提出者，以主观视角挑战还原论。 | 主观经验 / 道德运气 / 客观性 |
| tyler-burge | Tyler Burge | 以关节炎思想实验确立心灵内容的社会外在论。 | 反个体主义 / 外在论 / 心灵内容 |
| wilhelm-windelband | Wilhelm Windelband | 西南学派创始人，以规律科学与个别科学之分奠定文化科学方法论。 | 新康德主义 / 价值哲学 / 文化科学 |
