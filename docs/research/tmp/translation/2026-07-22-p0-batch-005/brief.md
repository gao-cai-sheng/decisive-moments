# Translation batch P0-005 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-004/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| dharmakirti | Dharmakīrti | 以量论、因明和语言排除论把陈那之后的佛教认识论推向印度与藏传传统的高峰。 | 量论 / 现量 / 比量 / apoha / 刹那灭 |
| shinran | Shinran | 以他力信心、念佛感恩和凡夫自觉重塑日本净土传统，奠定净土真宗。 | 他力 / 信心 / 念佛 / 恶人正机 / 净土真宗 |
| cheng-yi | Cheng Yi | 以天理、格物和敬的修养论奠定程朱理学的核心方向，成为朱熹思想直接源头。 | 天理 / 格物 / 敬 / 性即理 / 程朱理学 |
| feng-youlan | Feng Youlan | 以现代哲学史写作和新理学体系把中国传统义理转译为二十世纪哲学问题。 | 新理学 / 中国哲学史 / 人生境界 / 理 / 现代儒学 |
| mou-zongsan | Mou Zongsan | 以康德批判、智的直觉和儒家良知论建立现代新儒家的道德形上学。 | 道德形上学 / 智的直觉 / 良知 / 两层存有论 / 圆善 |
| simone-weil | Simone Weil | 以注意力、苦难、力量、义务和扎根思想连接神秘主义、伦理学与现代政治批判。 | 注意力 / 苦难 / 重力与恩典 / 根 / 义务 |
| mariategui | José Carlos Mariátegui | 以秘鲁现实分析、印第安土地问题和创造性社会主义构成拉丁美洲马克思主义的重要源头。 | 秘鲁现实 / 土地问题 / 印第安问题 / 创造性社会主义 / 阿毛塔 |
| zera-yacob | Zera Yacob | 以《探究》把信仰、理性、自然光和伦理平等组织为埃塞俄比亚理性主义传统。 | 探究 / 理性 / 自然光 / 宗教宽容 / 平等 |
| walda-heywat | Walda Heywat | 承接泽拉·雅各布的理性探究，把自然理性推进到教育、家庭、劳动和社会责任问题。 | 探究 / 社会伦理 / 教育 / 理性宗教 / 实践智慧 |
| edward-blyden | Edward Wilmot Blyden | 以非洲人格、宗教比较和教育批判奠定泛非思想与非洲现代主体性的早期语言。 | 非洲人格 / 泛非主义 / 教育 / 伊斯兰 / 殖民批判 |
| nkrumah | Kwame Nkrumah | 以良知主义、泛非统一和新殖民主义批判构成独立后非洲政治哲学的重要节点。 | 良知主义 / 泛非统一 / 新殖民主义 / 非洲社会主义 / 反帝国主义 |
| macintyre | Alasdair MacIntyre | 以德性、实践和传统构成现代道德哲学中反自由主义与反情感主义的重要方案。 | 德性伦理 / 实践 / 传统 / 叙事统一 / 现代道德碎片化 |
| rorty | Richard Rorty | 以反表象主义和新实用主义把分析哲学、德威传统和自由民主文化重新连接。 | 新实用主义 / 反表象主义 / 词汇 / 自由主义反讽 / 民主希望 |
| kripke | Saul Kripke | 以模态逻辑、刚性指称和命名理论重塑二十世纪后期语言哲学与形而上学。 | 刚性指称 / 必然性 / 可能世界 / 命名 / 规则遵循 |
| putnam | Hilary Putnam | 以语义外在论、实在论转向和事实价值纠缠贯穿语言、心灵、科学与伦理哲学。 | 语义外在论 / 内在实在论 / 双生地球 / 事实价值纠缠 / 多重可实现性 |
| davidson | Donald Davidson | 以真理论语义学、激进解释和行动理论重塑后蒯因时代的语言哲学与心灵哲学。 | 真理论语义学 / 激进解释 / 行动理由 / 反常一元论 / 三角测量 |
| deleuze | Gilles Deleuze | 以差异、重复、生成和内在性重写形而上学、欲望理论与后结构主义政治想象。 | 差异 / 重复 / 内在性 / 欲望 / 生成 |
| ricoeur | Paul Ricoeur | 在现象学和解释学之间发展象征、隐喻、叙事和自我身份理论。 | 解释学 / 象征 / 隐喻 / 叙事身份 / 承认 |
| weber | Max Weber | 以理解社会学、理性化和支配类型分析现代资本主义、官僚制与政治责任。 | 理性化 / 新教伦理 / 科层制 / 支配类型 / 志业 |
| nishitani | Keiji Nishitani | 在京都学派中以佛教空回应现代虚无主义、宗教经验与欧洲存在论。 | 虚无 / 空 / 宗教哲学 / 京都学派 / 自我超克 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。
