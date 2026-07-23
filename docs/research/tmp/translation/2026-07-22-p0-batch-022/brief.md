# Translation batch P0-022 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-021/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| samuel-ramos | Samuel Ramos | 墨西哥身份哲学代表，《墨西哥人的轮廓》分析民族性格与文化自我认识。 | 墨西哥人的轮廓 / 墨西哥性 / 民族性格 |
| santaraksita | Śāntarakṣita | 瑜伽行中观代表，入藏建桑耶寺，是印度佛教入藏的关键节点。 | 瑜伽行中观 / 桑耶寺 / 入藏祖师 |
| sarmiento | Domingo Faustino Sarmiento | 阿根廷思想家，《法昆多》以文明/野蛮框架塑造19世纪拉美现代化论述。 | 文明与野蛮 / 教育 / 国家建设 |
| schneur-zalman | Shneur Zalman of Liadi | 哈巴德创始人，《坦尼亚》作者，将哈西德灵修组织为智性化神学体系。 | 哈巴德 / 坦尼亚 / 智性哈西德 |
| seo-gyeongdeok | Seo Gyeongdeok | 朝鲜儒学中气一元论代表，连接张载气论和退溪语境。 | 气一元论 / 朝鲜儒学 / 花潭 |
| seyyed-hossein-nasr | Seyyed Hossein Nasr | 当代伊斯兰传统学派思想家，以伊斯兰科学、形而上学和灵性传统批判现代世俗化知识观。 | 传统学派 / 伊斯兰科学 / 灵性与现代性批判 |
| shen-buhai | Shen Buhai | 战国韩国相，以“术”与官僚控制问题著称的法家人物。 | 术 / 法家 / 官僚制 |
| shen-dao | Shen Dao | 战国稷下学者，常被视为法家“势”论代表。 | 势 / 黄老 / 稷下 |
| sima-tan | Sima Tan | 西汉太史令，以六家分类奠定《史记》思想框架。 | 论六家要旨 / 太史令 / 史记前史 |
| simon-rodriguez | Simón Rodríguez | 委内瑞拉教育思想家，以美洲共和国和大众教育方案回应独立后的社会重建。 | 玻利瓦尔之师 / 大众教育 / 美洲共和国 |
| susan-stebbing | Susan Stebbing | 早期分析哲学与逻辑经验主义传播者，可补女性分析哲学前史。 | 身份层 / 二线哲人 / 思想史补线 |
| tabatabai | Sayyid Muḥammad Ḥusayn Ṭabāṭabāʾī | 当代什叶哲学家和经注家，以萨德拉传统、哲学认识论和《古兰经》诠释连接现代伊朗思想。 | 当代什叶哲学 / 原理与方法 / 古兰经经注 |
| tanabe-hajime | Tanabe Hajime | 京都学派核心人物，以种的逻辑和忏悔道形成独特哲学体系。 | 京都学派 / 种的逻辑 / 忏悔道 |
| tanluan | Tanluan | 北魏至东魏净土思想高僧，以《往生论注》阐发他力往生。 | 净土 / 往生论注 / 他力 |
| th-green | T. H. Green | 英国新黑格尔主义与新自由主义源头人物，可补伦理国家与积极自由线索。 | 身份层 / 二线哲人 / 思想史补线 |
| thomas-nagel | Thomas Nagel | 主观经验、道德运气与自由主义批判代表，可补心灵与伦理接口。 | 主观经验 / 身份层 / 二线哲人 |
| tsongkhapa | Tsongkhapa | 格鲁派创立者，以应成中观解释和道次第体系影响藏传佛教。 | 格鲁派 / 应成中观 / 菩提道次第广论 |
| tyler-burge | Tyler Burge | 反个体主义与心灵内容外在论代表，可补普特南之后的心灵语言线索。 | 身份层 / 二线哲人 / 思想史补线 |
| udayana | Udayana | 正理派代表，系统论证神存在并回应佛教哲学批评。 | 正理派 / 神存在论证 / 反佛教论证 |
| victor-cousin | Victor Cousin | 折衷主义和法国学院哲学建制，吸收德国观念论与批判哲学。 | 折衷主义 / 学院哲学 / 观念论接受 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
