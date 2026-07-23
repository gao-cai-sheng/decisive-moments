# Translation batch P0-010 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-009/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| su-shi | Su Shi | 北宋文学家和思想人物，兼通儒释道，以经解、政论和人生论著称。 | 东坡易传 / 苏轼文集 / 通达 |
| sunzi | Sunzi | 《孙子兵法》所系兵学传统的核心人物。 | 兵法 / 吴国 / 谋略 |
| symeon-the-new-theologian | Symeon the New Theologian | 拜占庭神秘主义思想家，以神圣之光的亲证经验和灵性知识影响后来的静修传统。 | 新神学家 / 神圣之光 / 亲证经验 / 赞美诗 |
| tang-zhen | Tang Zhen | 清初思想家，以《潜书》批判君主权力和社会不平。 | 潜书 / 君主批判 / 经世 |
| tao-hongjing | Tao Hongjing | 南朝道教上清派宗师，兼具医药、山林和经典整理身份。 | 上清派 / 真诰 / 本草经集注 |
| tran-nhan-tong | Trần Nhân Tông | 陈朝帝王-禅师和竹林禅派开创者，统合越南诸禅派并留下禅诗文传统。 | 竹林禅派 / 居尘乐道赋 / 越南禅 / 陈朝 |
| tran-thai-tong | Trần Thái Tông | 陈朝帝王-禅师，以《课虚录》奠定越南中世禅学思想表达。 | 课虚录 / 越南禅 / 陈朝 / 帝王-禅师 |
| vladimir-solovyov | Vladimir Solovyov | 俄国宗教哲学枢纽人物，以全统一、神人类、索菲亚学和善的证明影响白银时代。 | 善的证明 / 神人类 / 索菲亚学 / 全统一 |
| wang-chong | Wang Chong | 东汉思想家，以《论衡》批判谶纬迷信和虚妄之说。 | 论衡 / 疾虚妄 / 自然论 |
| wang-gen | Wang Gen | 明代泰州学派创始人，以百姓日用即道和格物安身著称。 | 泰州学派 / 百姓日用即道 / 格物安身 |
| wang-tingxiang | Wang Tingxiang | 明代气学思想家，以气一元论和经验取向批评空疏心学。 | 慎言 / 气一元论 / 格物 |
| wei-yuan | Wei Yuan | 晚清经世思想家，以《海国图志》提出师夷长技以制夷。 | 海国图志 / 师夷长技 / 经世致用 |
| xu-heng | Xu Heng | 元初理学家和政治教育人物，推动程朱学进入元代制度。 | 鲁斋 / 元初儒学 / 小学大学直解 |
| xuanzang | Xuanzang | 唐代高僧、译经家和旅行者，奠定法相唯识学基础。 | 唯识 / 大唐西域记 / 译经 |
| yan-yuan-qing | Yan Yuan | 清初实学代表，主张实文、实行、实用，反对空谈理学。 | 习斋 / 实学 / 存学编 |
| yanshou | Yanshou | 五代宋初佛教大师，以《宗镜录》综合禅教与万善归心。 | 宗镜录 / 万善同归集 / 禅净合流 |
| ye-shi | Ye Shi | 南宋永嘉学派代表，以制度、功利和学术史批评著称。 | 永嘉学派 / 习学记言序目 / 水心 |
| zhan-ruoshui | Zhan Ruoshui | 明代甘泉学派代表，与王阳明并立而论学。 | 甘泉学派 / 随处体认天理 / 心性图说 |
| zhang-shi | Zhang Shi | 南宋理学家，湖湘学派代表，与朱熹长期论学。 | 南轩先生 / 湖湘学派 / 敬义 |
| zhang-xuecheng | Zhang Xuecheng | 清代史学理论家，以六经皆史和文史校雠理论著称。 | 文史通义 / 六经皆史 / 校雠通义 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
