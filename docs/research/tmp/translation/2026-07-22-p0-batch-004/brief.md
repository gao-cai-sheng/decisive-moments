# Translation batch P0-004 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-003/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| suhrawardi | Shihab al-Din Suhrawardi | 以照明哲学把伊本·西那传统、柏拉图主义光形而上学和临现知识改造成伊斯兰哲学新路线。 | 照明哲学 / 光 / 临现知识 / 伊本·西那批判 / 东方哲学 |
| ibn-arabi | Ibn ʿArabi | 以存在一性、完人、想象和神名理论塑造伊斯兰神秘形而上学，并深刻影响穆拉·萨德拉。 | 存在一性 / 完人 / 想象 / 神名 / 麦加启示 |
| han-feizi | Han Fei | 综合法、术、势与刑名之学，构成战国末期法家政治哲学的系统表达。 | 法 / 术 / 势 / 刑名 / 君主集权 |
| huineng | Huineng | 以《坛经》中的顿悟、自性、无念和定慧不二塑造中国禅宗南宗经典形象。 | 顿悟 / 无念 / 自性 / 定慧不二 / 坛经 |
| zhang-zai | Zhang Zai | 以太虚即气、民胞物与和成德工夫奠定北宋道学气本论传统。 | 气 / 太虚 / 民胞物与 / 横渠四句 / 正蒙 |
| dignaga | Dignāga | 以《集量论》奠定佛教量论，把有效认知限定为现量与比量，并提出遮诠语言理论。 | 量论 / 现量 / 比量 / 因明 / 遮诠 |
| wollstonecraft | Mary Wollstonecraft | 以女性理性教育和公民平等批判启蒙时代的性别秩序。 | 女性权利 / 理性教育 / 卢梭批判 / 公民德性 |
| anscombe | G. E. M. Anscombe | 以意向行动分析和现代道德哲学批判推动德性伦理复兴。 | 意向 / 行动哲学 / 德性伦理 / 维特根斯坦 |
| rosenzweig | Franz Rosenzweig | 以《救赎之星》反击总体体系，并开出现代犹太对话哲学路线。 | 救赎之星 / 启示 / 对话 / 反黑格尔 |
| fanon | Frantz Fanon | 以殖民心理分析和民族解放理论连接存在主义与后殖民思想。 | 殖民心理 / 主体形成 / 民族解放 / 后殖民 |
| freire | Paulo Freire | 以对话、意识化和银行式教育批判奠定批判教育学。 | 被压迫者教育学 / 意识化 / 对话 / 银行式教育批判 |
| horkheimer | Max Horkheimer | 以批判理论和工具理性批判把马克思主义社会哲学改造为现代性诊断。 | 批判理论 / 工具理性 / 法兰克福学派 / 启蒙辩证法 |
| adorno | Theodor W. Adorno | 以否定辩证法、文化工业批判和现代主义美学揭示同一性思维中的社会支配。 | 否定辩证法 / 文化工业 / 现代主义艺术 / 同一性批判 |
| benjamin | Walter Benjamin | 以机械复制时代艺术、历史哲学和城市碎片书写重塑现代性批判的媒介维度。 | 灵韵 / 机械复制 / 历史天使 / 拱廊计划 / 弥赛亚时间 |
| cohen | Hermann Cohen | 以马堡新康德主义和犹太理性宗教哲学连接康德传统与罗森茨维格。 | 马堡学派 / 新康德主义 / 纯粹认识 / 纯粹意志 / 理性宗教 |
| eckhart | Meister Eckhart | 以离执、灵魂贫乏和神秘合一把经院神学推进到德语神秘主义核心。 | 离执 / 灵魂贫乏 / 神在灵魂中诞生 / 否定神学 / 泰然任之 |
| cusa | Nicholas of Cusa | 以有学问的无知、对立相合和无限者问题把中世纪神学推向文艺复兴形而上学。 | 有学问的无知 / 对立相合 / 无限最大者 / 猜测 / 宗教和平 |
| vico | Giambattista Vico | 以 verum factum 原则和《新科学》开出历史、法、神话和语言的人类自造世界。 | 新科学 / verum factum / 诗性智慧 / 民族世界 / 反笛卡尔 |
| herder | Johann Gottfried Herder | 以语言、民族精神和历史个体性批判抽象普遍主义，塑造德国历史主义与浪漫主义前史。 | 语言起源 / 民族精神 / 历史主义 / 人道 / 文化多样性 |
| iqbal | Muhammad Iqbal | 以自我哲学、伊斯兰思想重构和诗性政治想象回应现代性中的宗教与主体问题。 | 自我 / 胡迪 / 伊斯兰重构 / 创造性进程 / 精神民主 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。
