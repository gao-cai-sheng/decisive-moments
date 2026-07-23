# Translation batch P0-009 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-008/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 取前 60，切成 007/008/009。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| liu-xin | Liu Xin | 西汉末至新莽时期经学家和目录学家，推动古文经学与目录体系。 | 七略 / 古文经学 / 校书 |
| liu-zongyuan | Liu Zongyuan | 唐代思想家和文学家，以天人、封建与政治制度论著称。 | 天说 / 封建论 / 永州八记 |
| liu-zongzhou | Liu Zongzhou | 明末大儒，蕺山学派创始人，以慎独和诚意工夫著称。 | 蕺山学派 / 慎独 / 人谱 |
| luo-qinshun | Luo Qinshun | 明代理学家，以《困知记》讨论理气、心性并批评王学。 | 困知记 / 理气一物 / 反王学 |
| mahasi-sayadaw | Mahasi Sayadaw | 缅甸内观体系代表人物，以念处实践和马哈希方法影响现代全球上座部禅修。 | 内观 / 念处 / 马哈希体系 / 内观手册 |
| mikhail-bakunin | Mikhail Bakunin | 俄国无政府主义代表人物，以自由、国家批判和集体主义政治理论著称。 | 无政府主义 / 国家制度与无政府状态 / 上帝与国家 / 自由 |
| nikolai-berdyaev | Nikolai Berdyaev | 白银时代宗教哲学家，以自由、人格、创造和反奴役问题为核心。 | 自由哲学 / 人格主义 / 奴役与自由 / 创造 |
| nikolai-chernyshevsky | Nikolai Chernyshevsky | 俄国唯物主义与社会思想代表，以理性利己、现实美学和《怎么办？》影响19世纪激进传统。 | 怎么办？ / 理性利己 / 现实美学 / 社会思想 |
| nikolai-fedorov | Nikolai Fedorov | 俄国宇宙主义先驱，以《共同事业的哲学》把人类联合、科学与复活论联结起来。 | 共同事业 / 宇宙主义 / 复活论 / 父辈 |
| pavel-florensky | Pavel Florensky | 白银时代神学家和哲学家，以《真理的柱石与根基》连接东正教、知识论和象征思想。 | 真理的柱石与根基 / 神学 / 数学 / 象征 |
| peter-kropotkin | Peter Kropotkin | 俄国无政府共产主义思想家，以《互助论》把合作、进化与自由共同体组织为政治伦理。 | 互助论 / 面包与自由 / 无政府共产主义 / 合作 |
| pyotr-chaadaev | Pyotr Chaadaev | 19世纪俄国思想家，《哲学书简》引发关于俄国历史使命与文明道路的论争。 | 哲学书简 / 西化派 / 俄国使命 / 历史哲学 |
| ruan-yuan | Ruan Yuan | 清代经学家、官员和学术组织者，乾嘉考据集大成者之一。 | 经籍纂诂 / 揅经室集 / 乾嘉学术 |
| semyon-frank | Semyon Frank | 俄国宗教哲学家，以全一、不可测度者和直觉主义知识论连接形而上学与社会哲学。 | 不可测度者 / 全一 / 直觉主义 / 社会的精神基础 |
| sergei-bulgakov | Sergei Bulgakov | 白银时代宗教哲学家，早年接收马克思主义，后转向索菲亚学和神人类宗教哲学。 | 索菲亚学 / 不暮之光 / 神人类 / 从马克思主义转向宗教 |
| shandao | Shandao | 唐代净土宗大师，以《观经疏》系统阐发凡夫往生与称名念佛。 | 净土宗 / 观经疏 / 称名念佛 |
| shang-yang | Shang Yang | 战国法家改革者，秦国制度转型的关键人物。 | 法家 / 变法 / 秦国 |
| shao-yong | Shao Yong | 北宋理学先驱，以象数宇宙论和观物思想著称。 | 皇极经世 / 观物 / 象数学 |
| sima-guang | Sima Guang | 北宋史学家和政治家，以《资治通鉴》与政治秩序论著称。 | 资治通鉴 / 潜虚 / 保守政治 |
| sima-qian | Sima Qian | 西汉史学家，《史记》作者，开创纪传体通史典范。 | 史记 / 太史公 / 究天人之际 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
