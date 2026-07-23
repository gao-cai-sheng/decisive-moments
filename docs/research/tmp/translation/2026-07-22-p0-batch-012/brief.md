# Translation batch P0-012 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-011/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| alexius-meinong | Alexius Meinong | 对象论代表，可补语言、存在与非存在对象问题。 | 对象论 / 身份层 / 二线哲人 |
| alvin-plantinga | Alvin Plantinga | 改革宗认识论与模态本体论证代表，可补当代宗教哲学。 | 宗教哲学 / 宗教哲学 / 身份层 |
| andres-bello | Andrés Bello | 委内瑞拉—智利思想家，以法律、教育和语言工程参与独立后国家建构。 | 法律 / 语言规范 / 教育 |
| anibal-quijano | Aníbal Quijano | 秘鲁社会理论家，提出‘权力的殖民性’并影响去殖民理论。 | 权力的殖民性 / 现代性/殖民性 / 去殖民 |
| antonio-caso | Antonio Caso | 墨西哥反实证主义思想家，以生命、伦理和人格问题反拨孔德式知识秩序。 | 青年学会 / 反实证主义 / 生命哲学 |
| atisa | Atiśa Dīpaṃkara Śrījñāna | 噶当派关键人物，以《菩提道灯论》影响藏传道次第传统。 | 噶当派 / 菩提道灯论 / 道次第 |
| aurobindo | Sri Aurobindo | 整体瑜伽与进化灵性思想代表，连接吠檀多、瑜伽和现代印度思想。 | 整体瑜伽 / 进化灵性 / 近现代印度 |
| baal-shem-tov | Baal Shem Tov | 哈西德派创始人物，以灵性喜乐、虔敬生活和神圣临在感影响东欧犹太教。 | 哈西德派 / 灵性喜乐 / 神圣临在 |
| bachelard | Gaston Bachelard | 认识论断裂与科学精神，接 foucault 知识考古学源头。★升档候选 | 法国哲学 / 身份层 / 思想史补线 |
| badarayana | Bādarāyaṇa | 《梵经》的传统归属作者，吠檀多根本经和三大注家共同锚点。 | 吠檀多 / 梵经 / 传统归属 |
| badiou | Alain Badiou | 存在与事件、集合论本体论。 | 法国哲学 / 身份层 / 思想史补线 |
| bahya-ibn-paquda | Bahya ibn Paquda | 《心之义务》作者，把内在虔敬、伦理修养与犹太律法生活结合起来。 | 心之义务 / 内在虔敬 / 犹太伦理 |
| baudrillard | Jean Baudrillard | 拟像与消费社会。 | 法国哲学 / 身份层 / 思想史补线 |
| bhartrhari | Bhartṛhari | 《句词论》作者，印度语言哲学与语法传统的关键节点。 | 句词论 / 语言哲学 / 声常 |
| bourdieu | Pierre Bourdieu | 惯习/场域/文化资本，社会实践理论。★升档候选 | 法国哲学 / 身份层 / 思想史补线 |
| boutroux | Émile Boutroux | 以自然律偶然性批判严格决定论，连接法国科学哲学与唯灵论。 | 偶然性 / 自然律 / 决定论批判 |
| bruno-latour | Bruno Latour | 行动者网络与科学人类学，接 canguilhem/koyre。 | 法国哲学 / 身份层 / 思想史补线 |
| brunschvicg | Léon Brunschvicg | 判断哲学与科学精神史，法国认识论学院枢纽。 | 法国哲学 / 身份层 / 思想史补线 |
| buton | Butön Rinchen Drub | 藏传佛教史家和大藏经编定关键人物。 | 佛教史 / 大藏经 / 布顿佛教史 |
| canguilhem | Georges Canguilhem | 正常与病态、生命科学史，foucault 直系导师。★升档候选 | 法国哲学 / 身份层 / 思想史补线 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
