# Translation batch P0-011 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-010/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| zheng-xuan | Zheng Xuan | 东汉经学大师，以综合今古文经学和经注体系著称。 | 经学 / 郑笺 / 汉末注疏 |
| zongmi | Zongmi | 唐代华严五祖与禅教会通思想家，兼具宗派判教和儒释道比较。 | 华严宗 / 禅源诸诠集都序 / 原人论 |
| abhinavagupta | Abhinavagupta | 克什米尔湿婆派与印度美学代表，连接宗教形而上学和味论传统。 | 克什米尔湿婆派 / 味论 / 美学 |
| abraham-abulafia | Abraham Abulafia | 先知/迷狂卡巴拉代表，以字母组合、神名默想和预言经验理论著称。 | 先知卡巴拉 / 字母冥想 / 迷狂神秘主义 |
| abraham-ibn-daud | Abraham Ibn Daud | 《崇高信仰》作者，是迈蒙尼德之前犹太亚里士多德主义的重要节点。 | 崇高信仰 / 犹太亚里士多德主义 / 理性与传统 |
| abraham-joshua-heschel | Abraham Joshua Heschel | 20世纪犹太神学家，以敬畏、先知伦理与宗教经验论连接灵修和公共正义。 | 敬畏 / 先知精神 / 安息日 |
| abu-bakr-al-razi | Abū Bakr Muḥammad ibn Zakariyyāʾ al-Rāzī | 医师—哲学家和自由思想家，以理性自然主义、医学百科和对宗教权威的激进批判著称。 | 医师哲学家 / 理性自然主义 / 批先知论 |
| aj-ayer | A. J. Ayer | 逻辑实证主义在英国的传播代表，可补维也纳学派到英美分析哲学的桥梁。 | 逻辑实证主义 / 身份层 / 二线哲人 |
| aksapada-gautama | Akṣapāda Gautama | 《正理经》的传统归属作者，正理派逻辑与知识论源头。 | 正理经 / 逻辑 / 知识论 |
| al-afghani | Jamāl al-Dīn al-Afghānī | 泛伊斯兰政治活动家和现代主义先声，以反殖民、宗教改革和穆斯林公共政治动员影响近现代伊斯兰思想。 | 泛伊斯兰主义 / 现代主义改革 / 反殖民政治 |
| al-ashari | Abū al-Ḥasan al-Ashʿarī | 艾什尔里派创立者，在反穆尔太齐赖与维护逊尼教义之间重塑理性神学。 | 艾什尔里派 / kalam / 理性与传统 |
| al-baqillani | Abū Bakr al-Bāqillānī | 艾什尔里派系统化者，以教义论证、原子论时间观和《古兰经》不可模仿性论证著称。 | 艾什尔里派系统化 / 原子论 / 古兰经不可模仿性 |
| al-hallaj | al-Ḥallāj | 以“我即真理”形象和殉道结局成为苏非神秘合一、言说边界与宗教权威冲突的核心节点。 | 我即真理 / 苏非殉道 / 神秘合一 |
| al-junayd | al-Junayd of Baghdad | 巴格达苏非“清醒派”核心人物，以在神秘体验与教法边界之间保持纪律化表达著称。 | 巴格达苏非 / 清醒派 / 神秘合一 |
| al-juwayni | Imām al-Ḥaramayn al-Juwaynī | “两圣地伊玛目”，安萨里之师，在艾什尔里教义学和法学原理中强化证明结构。 | 两圣地伊玛目 / 安萨里之师 / 教义学证明 |
| al-maturidi | Abū Manṣūr al-Māturīdī | 马图里迪派奠基者，在哈乃斐语境中发展关于理性、启示和人类责任的逊尼教义学。 | 马图里迪派 / 哈乃斐传统 / 理性认识 |
| alain-locke | Alain Locke | 哈莱姆文艺复兴与价值多元主义代表，可补非裔美国哲学传统。 | 身份层 / 二线哲人 / 思想史补线 |
| alberdi | Juan Bautista Alberdi | 阿根廷自由主义与宪政思想家，提出国家组织和美洲哲学的现实任务。 | 阿根廷宪政 / 治理即移民 / 美洲哲学 |
| alejandro-korn | Alejandro Korn | 阿根廷反实证主义思想家，以创造性自由和价值问题重构哲学任务。 | 创造性自由 / 阿根廷反实证主义 / 价值 |
| alexandre-kojeve | Alexandre Kojève | 黑格尔《精神现象学》法国解释的关键人物，可补法国存在主义与后结构主义前史。 | 身份层 / 二线哲人 / 思想史补线 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
