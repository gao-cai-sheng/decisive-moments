# Translation batch P0-019 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-018/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| lu-jia | Lu Jia | 汉初政论家，以《新语》说明秦亡汉兴和文治秩序。 | 新语 / 汉初儒生 / 马上治天下 |
| lu-longqi | Lu Longqi | 清初程朱学者和循吏，以尊朱、讲学和地方治理著称。 | 三鱼堂 / 朱子学 / 清初循吏 |
| lu-xiujing | Lu Xiujing | 南朝道士和道教制度整理者，推动灵宝经典与三洞目录体系。 | 灵宝派 / 三洞目录 / 斋仪 |
| luo-congyan | Luo Congyan | 宋代理学人物，承接程门并影响李侗、朱熹学脉。 | 豫章先生 / 程门后学 / 闽学前驱 |
| luo-rufang | Luo Rufang | 晚明泰州学派人物，以赤子良心、日用教化和平民讲学著称。 | 近溪 / 泰州学派 / 赤子良心 |
| lyotard | Jean-François Lyotard | 后现代状况与元叙事之终结。 | 法国哲学 / 身份层 / 思想史补线 |
| maine-de-biran | Maine de Biran | 努力与意志的内在经验开启法国唯灵论，连接笛卡尔反思传统和柏格森。 | 意志 / 努力 / 内在经验 |
| malebranche | Nicolas Malebranche | 偶因论与“在上帝中看见万物”使笛卡尔主义进入神学形而上学争论。 | 偶因论 / 笛卡尔主义 / 神学形而上学 |
| mao-qiling | Mao Qiling | 清初经学家，以博辨考据和反朱子《四书》解释著称。 | 经问 / 四书改错 / 反朱子 |
| maria-lugones | María Lugones | 阿根廷裔女性主义哲学家，以性别殖民性理论推进去殖民女性主义。 | 性别殖民性 / 去殖民女性主义 / 交叉压迫 |
| maurice-blanchot | Maurice Blanchot | 文学空间与中性、灾异书写，接 levinas/bataille。 | 法国哲学 / 身份层 / 思想史补线 |
| maurice-blondel | Maurice Blondel | 行动哲学代表，可补法国天主教现代思想与现象学前史。 | 行动哲学 / 身份层 / 二线哲人 |
| max-scheler | Max Scheler | 现象学价值伦理学代表，可补胡塞尔之后的价值与人格线索。 | 价值伦理 / 身份层 / 二线哲人 |
| michael-dummett | Michael Dummett | 意义理论与反实在论代表，可补弗雷格解释与分析哲学后期线索。 | 反实在论 / 身份层 / 二线哲人 |
| michael-oakeshott | Michael Oakeshott | 实践知识与政治理性主义批判代表，可补英国保守主义哲学。 | 身份层 / 二线哲人 / 思想史补线 |
| michel-henry | Michel Henry | 生命现象学代表，可补法国现象学的非海德格尔分支。 | 生命现象学 / 身份层 / 二线哲人 |
| michel-serres | Michel Serres | 科学与人文的第三者/寄生者哲学。 | 法国哲学 / 身份层 / 思想史补线 |
| miguel-de-unamuno | Miguel de Unamuno | 生命悲剧感与信仰焦虑代表，可补存在主义前史的西班牙线索。 | 存在主义 / 身份层 / 二线哲人 |
| milarepa | Milarepa | 噶举派瑜伽士，以道歌传统代表藏传修行文学和解脱叙事。 | 噶举 / 瑜伽士 / 道歌 |
| mipham | Mipham Gyatso | 宁玛利美代表人物，以中观和量论注疏成为近现代藏传系统家。 | 宁玛 / 利美 / 中观量论 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
