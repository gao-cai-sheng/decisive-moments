# Translation batch P0-018 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-017/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| karl-lowith | Karl Löwith | 世俗化历史哲学批判代表，可补海德格尔、尼采与现代历史意识线索。 | 身份层 / 二线哲人 / 思想史补线 |
| kou-qianzhi | Kou Qianzhi | 北魏道教改革者，推动新天师道与国家政治结合。 | 北天师道 / 太平真君 / 老君音诵诫经 |
| koyre | Alexandre Koyré | 科学革命史（从封闭世界到无限宇宙），接 kuhn。 | 法国哲学 / 身份层 / 思想史补线 |
| kuiji | Kuiji | 唐代法相宗大师，玄奘弟子，以唯识注疏体系著称。 | 慈恩宗 / 成唯识论述记 / 法相 |
| kukai | Kūkai | 日本真言宗奠基者，连接唐代密教与日本佛教。 | 真言宗 / 入唐求法 / 密教 |
| kuki-shuzo | Kuki Shūzō | 以“粹”的美学和偶然性问题连接日本美学与欧陆哲学。 | 粹 / 偶然性 / 京都学派 |
| kumarila-bhatta | Kumārila Bhaṭṭa | 弥曼差知识论代表，以维护吠陀权威和批评佛教量论著称。 | 弥曼差 / 量论争辩 / 经典权威 |
| la-mettrie | Julien Offray de La Mettrie | 《人是机器》将机械论推向人类身心解释，是启蒙唯物论极端形态。 | 机械唯物论 / 身心问题 / 人是机器 |
| lacan | Jacques Lacan | 结构主义精神分析，接 freud/结构语言学。★升档候选 | 法国哲学 / 身份层 / 思想史补线 |
| las-casas | Bartolomé de las Casas | 殖民早期为美洲原住民理性与权利辩护的多明我会思想家。 | 巴利亚多利德之辩 / 原住民权利 / 和平传教 |
| leo-strauss | Leo Strauss | 古典政治哲学复兴与隐微写作解释代表，可补施米特、阿伦特同代政治思想语境。 | 身份层 / 二线哲人 / 思想史补线 |
| leszek-kolakowski | Leszek Kołakowski | 马克思主义批判与宗教哲学代表，可补东欧思想转型线索。 | 宗教哲学 / 宗教哲学 / 身份层 |
| levi-strauss | Claude Lévi-Strauss | 结构人类学奠基，结构主义总源。★升档候选 | 法国哲学 / 身份层 / 思想史补线 |
| li-ao | Li Ao | 唐代儒者，以《复性书》讨论性情和恢复本性。 | 复性书 / 性命 / 唐代儒学 |
| li-gong-qing | Li Gong | 清初颜李学派代表，继承颜元实学和实践教育路线。 | 恕谷 / 颜李学派 / 实学教育 |
| li-gou | Li Gou | 北宋儒者和制度思想家，以礼制、财政和经世论著称。 | 盱江先生 / 周礼致太平论 / 礼论 |
| liu-an | Liu An | 西汉淮南王，《淮南子》编纂工程的中心人物。 | 淮南子 / 黄老 / 诸子汇编 |
| longchenpa | Longchenpa | 宁玛大圆满系统家，以《七宝藏》等著作成为藏传形而上学和修行论核心节点。 | 宁玛 / 大圆满 / 七宝藏 |
| louis-althusser | Louis Althusser | 结构主义马克思主义代表，可补马克思主义与法国理论接口。 | 结构主义马克思主义 / 身份层 / 二线哲人 |
| lu-buwei | Lü Buwei | 战国末秦相，《吕氏春秋》编纂工程的组织者。 | 吕氏春秋 / 秦相 / 杂家 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
