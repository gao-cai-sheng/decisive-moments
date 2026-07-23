# Translation batch P0-008 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-007/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 取前 60，切成 007/008/009。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| ge-hong | Ge Hong | 东晋道教思想家和炼养理论家，以《抱朴子》著称。 | 抱朴子 / 神仙传 / 道教 |
| gemistos-plethon | Gemistos Plethon | 晚期拜占庭柏拉图主义者，以《法律篇》和佛罗伦萨大公会议影响意大利文艺复兴的古典哲学复兴。 | 法律篇 / 柏拉图主义复兴 / 佛罗伦萨大公会议 / 文艺复兴桥梁 |
| gong-zizhen | Gong Zizhen | 晚清思想家和文学家，以经世改革、个体精神和制度批判著称。 | 己亥杂诗 / 明良论 / 经世改革 |
| gregory-palamas | Gregory Palamas | 晚期拜占庭静修主义神学家，以本质/能质之分和《为静修者辩护》组织东正教神秘经验论证。 | 静修主义 / 本质/能质之分 / 为静修者辩护 / 神圣之光 |
| gu-yanwu | Gu Yanwu | 明清之际经世考据学者，以《日知录》开清代实学风气。 | 日知录 / 经世致用 / 考据 |
| guan-zhong | Guan Zhong | 春秋齐国政治家，传统上被视为富国强兵和制度治理先驱。 | 齐桓公 / 霸政 / 管子 |
| han-yu | Han Yu | 唐代儒家复兴和古文运动代表，以《原道》重申儒家道统。 | 原道 / 古文运动 / 排佛 |
| hu-hong | Hu Hong | 南宋湖湘学派代表，以《知言》讨论性体和修养。 | 知言 / 湖湘学派 / 性体 |
| huang-zongxi | Huang Zongxi | 明清之际思想家和史学家，以君主批判与学术史书写著称。 | 明夷待访录 / 明儒学案 / 浙东学术 |
| huiyuan | Huiyuan | 东晋庐山高僧，围绕沙门独立、净土信仰和佛教共同体形成影响。 | 庐山 / 沙门不敬王者论 / 净土 |
| ji-kang | Ji Kang | 魏晋玄学名士，以自然、音乐和养生论著称。 | 竹林七贤 / 声无哀乐论 / 养生论 |
| jiao-xun | Jiao Xun | 清代经学家和数学家，以孟子学、易学和逻辑分析著称。 | 孟子正义 / 易通释 / 扬州学派 |
| jizang | Jizang | 隋唐三论宗大师，以中观二谛和破邪显正著称。 | 三论宗 / 中观 / 二谛 |
| le-quy-don | Lê Quý Đôn | 越南早期近世儒学与百科传统代表，以《芸台类语》承接宋明理学和博物知识体系。 | 芸台类语 / 越南儒学 / 百科 / 宋明理学 |
| ledi-sayadaw | Ledi Sayadaw | 缅甸上座部阿毗达磨与内观复兴代表，以通俗手册推动教理学习和修行普及。 | 缅甸内观 / 阿毗达磨 / 胜义要义手册 / 法之手册 |
| leo-tolstoy | Leo Tolstoy | 以基督教伦理、非暴力和良心批判组织社会思想的俄国作家思想家。 | 天国在你心中 / 忏悔录 / 非暴力 / 基督教伦理 |
| lev-shestov | Lev Shestov | 俄国宗教存在主义思想家，以《雅典与耶路撒冷》对抗理性必然性与信仰自由。 | 雅典与耶路撒冷 / 反理性 / 存在主义 / 信仰 |
| li-si | Li Si | 秦帝国制度建设核心官僚，承接荀学与法家治理。 | 秦制 / 小篆 / 谏逐客书 |
| li-zhi | Li Zhi | 晚明思想家，以童心说、反伪道学和个体真诚著称。 | 焚书 / 童心说 / 异端 |
| liu-xiang | Liu Xiang | 西汉经学家、目录学家和故事编纂者，整理典籍并重塑儒家政治记忆。 | 说苑 / 新序 / 校书 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
