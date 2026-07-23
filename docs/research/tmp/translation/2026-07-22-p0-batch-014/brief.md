# Translation batch P0-014 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-013/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| ernst-cassirer | Ernst Cassirer | 符号形式哲学代表，可连接新康德主义、文化哲学与科学哲学。 | 符号形式 / 新康德主义 / 身份层 |
| ernst-troeltsch | Ernst Troeltsch | 历史主义与宗教哲学代表，可补狄尔泰、韦伯与神学现代性接口。 | 宗教哲学 / 宗教哲学 / 身份层 |
| etienne-gilson | Étienne Gilson | 中世纪哲学史与托马斯主义复兴，接 aquinas/maritain。 | 法国哲学 / 身份层 / 思想史补线 |
| fakhr-al-din-al-razi | Fakhr al-Dīn al-Rāzī | 集大成教义学家和哲学神学家，在吸收并批判伊本·西那之后重塑后期 kalam 的问题格局。 | 后伊本·西那哲学神学 / 艾什尔里教义学 / 经注与形而上学 |
| fan-zhen | Fan Zhen | 南朝思想家，以《神灭论》批判神不灭和因果报应观。 | 神灭论 / 形神关系 / 反佛论 |
| fazlur-rahman | Fazlur Rahman | 新现代主义伊斯兰思想家，以“双重运动”诠释学和古兰经伦理重构现代改革方法。 | 新现代主义 / 双重运动诠释学 / 古兰经伦理 |
| fh-bradley | F. H. Bradley | 英国绝对唯心主义代表，可补罗素与摩尔反叛前的靶心。 | 唯心主义 / 身份层 / 二线哲人 |
| francisco-romero | Francisco Romero | 阿根廷哲学家，推动专业哲学制度化并发展人格与精神生命理论。 | 人的理论 / 阿根廷哲学 / 奥尔特加受容 |
| frank-ramsey | Frank Ramsey | 真理、概率、决策与经济哲学的早期枢纽，可补剑桥分析传统。 | 剑桥分析 / 身份层 / 二线哲人 |
| franz-brentano | Franz Brentano | 意向性复兴的枢纽，可连接亚里士多德、经院心理学、胡塞尔与分析心灵哲学。 | 意向性 / 身份层 / 二线哲人 |
| fukuzawa-yukichi | Fukuzawa Yukichi | 明治启蒙代表，以文明论和独立观念推动日本现代思想转型。 | 明治启蒙 / 文明论 / 独立自尊 |
| gabino-barreda | Gabino Barreda | 墨西哥孔德式实证主义代表，把教育制度改革作为社会秩序重建工具。 | 墨西哥实证主义 / 国民预科学校 / 秩序与进步 |
| gabriel-marcel | Gabriel Marcel | 基督教存在主义代表，可补萨特之外的存在主义分支。 | 存在主义 / 身份层 / 二线哲人 |
| gampopa | Gampopa | 达波噶举奠基者，融合噶当道次第和大手印传统。 | 达波噶举 / 大手印 / 解脱庄严宝论 |
| gangesa | Gaṅgeśa | 新正理派核心人物，以《真理宝珠》推进精密逻辑和知识论分析。 | 新正理 / 逻辑 / 知识论 |
| gao-panlong | Gao Panlong | 晚明东林领袖，兼重静坐工夫与政治名节。 | 东林 / 静坐 / 高子遗书 |
| gassendi | Pierre Gassendi | 复兴伊壁鸠鲁原子论，并在《沉思》诘难中成为笛卡尔同时代批评者。 | 原子论 / 伊壁鸠鲁复兴 / 笛卡尔批评 |
| georg-simmel | Georg Simmel | 形式社会学与文化哲学代表，可连接生命哲学、现代性与社会理论。 | 身份层 / 二线哲人 / 思想史补线 |
| george-herbert-mead | George Herbert Mead | 社会行为主义与自我理论代表，可补实用主义社会心理学线索。 | 身份层 / 二线哲人 / 思想史补线 |
| george-santayana | George Santayana | 自然主义、怀疑论与美学交界人物，可补美国哲学的非实用主义线索。 | 实用主义 / 美学 / 身份层 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
