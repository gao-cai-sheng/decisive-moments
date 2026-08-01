# Translation batch P0-002 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-001/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| laozi | Laozi | 以道、无为和反强制秩序开辟道家思想。 | 形而上学 / 政治 / 生死 |
| zhuangzi | Zhuangzi | 以逍遥、齐物和语言怀疑展开自由哲学。 | 自由 / 语言 / 生死 |
| cleanthes | Cleanthes | 芝诺之后的斯多葛学派领袖，以《宙斯赞歌》和顺从宇宙理性的虔敬伦理著称。 | 伦理 / 形而上学 / 知识 |
| chrysippus | Chrysippus | 系统化早期斯多葛逻辑、物理学和伦理学，使斯多葛主义成为严整哲学体系。 | 伦理 / 形而上学 / 知识 |
| diogenes-sinope | Diogenes of Sinope | 犬儒学派代表人物，用贫穷、自足和公开挑衅把哲学变成生活批判。 | 伦理 / 政治 / 自由 |
| antisthenes | Antisthenes | 苏格拉底弟子之一，强调德性、自足和艰苦训练，被视为犬儒传统的重要先驱。 | 伦理 / 政治 / 自由 |
| pythagoras | Pythagoras | 毕达哥拉斯传统把数、宇宙秩序、灵魂净化和共同体生活连接起来。 | 形而上学 / 伦理 / 知识 |
| anaximander | Anaximander | 米利都学派代表人物，以 apeiron、宇宙生成和自然化解释推进早期希腊哲学。 | 形而上学 / 知识 / 生死 |
| anaximenes | Anaximenes | 米利都学派哲人，以气、凝聚和稀薄化解释自然变化与宇宙结构。 | 形而上学 / 知识 / 生死 |
| xenophanes | Xenophanes | 前苏格拉底诗哲，批判拟人神观，并提出关于神、自然和人类知识限度的早期反思。 | 宗教 / 知识 / 形而上学 |
| empedocles | Empedocles | 以四根、爱与争斗、宇宙循环和灵魂净化综合自然哲学与宗教伦理。 | 形而上学 / 生死 / 宗教 |
| anaxagoras | Anaxagoras | 把无限种子、万物相含和 Nous 引入自然哲学，并把爱奥尼亚自然解释带入雅典。 | 形而上学 / 知识 / 政治 |
| zeno-elea | Zeno of Elea | 爱利亚学派哲人，以反多和反运动悖论捍卫巴门尼德式存在论。 | 形而上学 / 知识 / 语言 |
| democritus | Democritus | 古代原子论代表人物，以原子与虚空解释自然，并提出感知、约定和安宁伦理问题。 | 形而上学 / 知识 / 伦理 |
| protagoras | Protagoras | 智者运动代表人物，以“人是万物尺度”、德性教育和城邦实践理性著称。 | 知识 / 政治 / 伦理 |
| gorgias | Gorgias | 智者和修辞家，以激进的存在论论证、语言力量和说服技艺闻名。 | 语言 / 知识 / 政治 |
| pyrrho | Pyrrho | 皮浪主义源头人物，以悬置判断和心灵安宁的传统影响古代怀疑论。 | 知识 / 伦理 / 自由 |
| theophrastus | Theophrastus | 亚里士多德继承者，扩展逍遥学派自然研究、植物学、性格描写和学术制度。 | 知识 / 伦理 / 生死 |
| carneades | Carneades | 新学园怀疑主义代表，以反斯多葛知识论、概率性判断和罗马正义演说闻名。 | 知识 / 伦理 / 政治 |
| cicero | Cicero | 罗马政治家和哲学作者，把希腊哲学翻译进拉丁公共理性、共和伦理和自然法传统。 | 政治 / 伦理 / 知识 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。
