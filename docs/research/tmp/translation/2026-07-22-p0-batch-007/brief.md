# Translation batch P0-007 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-006/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 取前 60，切成 007/008/009。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| basil-the-great | Basil the Great | 卡帕多西亚三杰之一，以三一神学、创世解释和修道规章构成希腊教父传统核心。 | 卡帕多西亚三杰 / 三一神学 / 六日创世 / 修道规章 |
| gregory-of-nazianzus | Gregory of Nazianzus | 卡帕多西亚三杰之一，以《神学演讲五篇》奠定东正教三一神学表达。 | 神学家 / 神学演讲 / 三位一体 / 卡帕多西亚三杰 |
| gregory-of-nyssa | Gregory of Nyssa | 卡帕多西亚三杰之一，以神秘神学、无限进展和人论深化希腊教父传统。 | 摩西的生平 / 无限进展 / 神秘神学 / 人的创造 |
| john-of-damascus | John of Damascus | 拜占庭教义系统化者，以《知识的源泉》和圣像辩护连接亚里士多德逻辑与东正教神学。 | 知识的源泉 / 正统信仰详解 / 圣像辩护 / 亚里士多德逻辑 |
| mani | Mani | 萨珊时期摩尼教创立者，以亲撰经典组织光暗二元宇宙论、救赎论与禁欲伦理。 | 摩尼教 / 光暗二元 / 救赎 / 沙卜拉干 |
| maximus-the-confessor | Maximus the Confessor | 拜占庭神学综合者，以《难题集》、两种意志论和宇宙-基督神学承接希腊教父传统。 | 难题集 / 两种意志论 / 忏悔者 / 宇宙-基督神学 |
| pseudo-dionysius | Pseudo-Dionysius the Areopagite | 约500年成书的托名作者传统，以否定神学、神圣名称和等级论深刻影响东方与拉丁中世纪。 | 托名 / 否定神学 / 神圣名称 / 天阶体系 |
| zoroaster | Zoroaster | 古伊朗先知与祆教传统核心人物，以善恶抉择、真理秩序和末世审判构成前伊斯兰波斯思想源头。 | 阿胡拉·马兹达 / 善恶二元 / 阿沙 / 伽萨 |
| michael-psellos | Michael Psellos | 拜占庭博学者和哲学家，以柏拉图主义复兴、宫廷政治观察和百科式学问连接古典与中世纪希腊传统。 | 编年史 / 柏拉图主义复兴 / 拜占庭博学者 / 杂论 |
| aleksei-khomyakov | Aleksei Khomyakov | 斯拉夫派核心理论家，以 sobornost 组织自由、共同体和东正教传统的思想口径。 | 斯拉夫派 / 聚和性 / sobornost / 东正教共同体 |
| alexander-herzen | Alexander Herzen | 俄国西化派与流亡思想家，以个人自由、农民社会主义和俄国现代化问题著称。 | 往事与随想 / 农民社会主义 / 西化派 / 自由 |
| buddhadasa | Buddhadasa | 泰国现代佛教思想家，以缘起重释、观呼吸修行和“法的社会主义”连接佛教改革与政治伦理。 | 泰国佛教改革 / 缘起 / 法的社会主义 / 观呼吸 |
| buddhaghosa | Buddhaghosa | 上座部巴利注疏传统的核心系统家，以《清净道论》综合戒定慧、阿毗达磨和解脱道路。 | 清净道论 / 巴利注疏 / 上座部 / 修道次第 |
| chen-liang | Chen Liang | 南宋永康学派代表，以事功论和朱熹王霸义利之辨著称。 | 永康学派 / 事功 / 龙川文集 |
| chen-xianzhang | Chen Xianzhang | 明代白沙学派创始人，重视心体自得和静坐涵养。 | 白沙心学 / 静坐 / 自然自得 |
| dao-an | Dao An | 东晋高僧，推动佛典目录、僧团规范和中国佛教自主化。 | 格义批判 / 僧团制度 / 经录 |
| daoxuan | Daoxuan | 唐代律宗大师和佛教史家，以律学与僧传编纂著称。 | 律宗 / 续高僧传 / 四分律行事钞 |
| dong-zhongshu | Dong Zhongshu | 西汉儒家代表，将春秋学、阴阳五行与王朝政治结合。 | 春秋繁露 / 天人感应 / 汉儒 |
| fang-yizhi | Fang Yizhi | 明清之际思想家，兼通儒释道与自然知识。 | 东西均 / 物理小识 / 质测通几 |
| fyodor-dostoevsky | Fyodor Dostoevsky | 以小说承载宗教、自由、恶与救赎问题的俄国思想家型作家。 | 卡拉马佐夫兄弟 / 地下室手记 / 自由 / 罪与救赎 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
