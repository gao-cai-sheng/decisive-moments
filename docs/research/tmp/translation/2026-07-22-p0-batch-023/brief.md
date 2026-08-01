# Translation batch P0-023 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 24 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**执行指令:** `docs/research/p0-translation-execution-instruction.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-022/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
**选取规则:** 未覆盖 & `oneLineZh` 为真实内容者，按 `tier(standard→seed) → influenceWeight 降序 → id 升序` 顺次切批。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| vivekananda | Swami Vivekananda | 新吠檀多与印度现代宗教思想传播的代表人物。 | 新吠檀多 / 印度现代思想 / 宗教传播 |
| voltaire | Voltaire | 启蒙旗手，宽容、理性与反教权论争，接洛克经验论并与卢梭构成同代张力。 | 启蒙 / 宽容 / 反教权 |
| wang-fu | Wang Fu | 东汉政论家，以《潜夫论》批评时政与士风。 | 潜夫论 / 隐士批判 / 东汉政论 |
| wasil-ibn-ata | Wāṣil ibn ʿAṭāʾ | 早期穆尔太齐赖派奠基者，以理性神学、自由意志和“介于两种地位之间”问题开启 kalam 传统分歧。 | 穆尔太齐赖派 / 自由意志 / 两种地位之间 |
| wilhelm-windelband | Wilhelm Windelband | 价值哲学与文化科学方法论代表，可补新康德主义西南学派源头。 | 新康德主义 / 文化科学 / 身份层 |
| wonhyo | Wonhyo | 朝鲜佛教代表人物，以和诤思想统合不同佛教教义。 | 和诤 / 中观 / 唯识 |
| wu-cheng | Wu Cheng | 元代理学家和经学家，调和朱陆并重整经学。 | 草庐先生 / 礼记纂言 / 元代理学 |
| wu-qi | Wu Qi | 战国军事家和改革者，兼具兵家与法家制度色彩。 | 兵家 / 变法 / 吴子 |
| wu-yubi | Wu Yubi | 明初理学家，以康斋学派和居敬实践影响陈献章。 | 康斋 / 明代理学 / 静坐读书 |
| xiang-xiu | Xiang Xiu | 魏晋玄学人物，以《庄子注》和自然名教讨论著称。 | 庄子注 / 竹林七贤 / 自然名教 |
| xu-gan | Xu Gan | 东汉末建安思想家，以《中论》讨论治国、修身和名实问题。 | 中论 / 建安七子 / 名实 |
| xue-xuan | Xue Xuan | 明代理学家，河东学派代表，强调复性和笃实践履。 | 河东学派 / 读书录 / 复性 |
| xun-yue | Xun Yue | 东汉末史学家和政论家，以《申鉴》《汉纪》著称。 | 申鉴 / 汉纪 / 荀氏 |
| yan-ying | Yan Ying | 春秋齐国政治家，以节俭、机智和谏诤形象著称。 | 齐国 / 谏诤 / 晏子春秋 |
| yang-xiong | Yang Xiong | 西汉末思想家和文学家，以《法言》《太玄》拟经著称。 | 法言 / 太玄 / 拟经 |
| yang-zhu | Yang Zhu | 战国思想人物，因“为我”“贵己”传统而在儒墨之间成为重要参照。 | 为我 / 贵己 / 孟子批判 |
| yeshayahu-leibowitz | Yeshayahu Leibowitz | 以色列犹太思想家，强调信仰即服从诫命，并以尖锐公共批评著称。 | 诫命中心论 / 迈蒙尼德诠释 / 以色列公共思想 |
| yi-ik | Yi Ik | 朝鲜实学重要人物，连接退溪朱子学传统与社会经世问题。 | 实学 / 星湖 / 朝鲜儒学 |
| zhongchang-tong | Zhongchang Tong | 汉末政论家，以《昌言》表达制度批判和士人自立意识。 | 昌言 / 汉末政论 / 士人独立 |
| zigong | Zigong | 以言语、政事与外交能力著称的孔门弟子。 | 孔门 / 外交 / 言语科 |
| zou-yan | Zou Yan | 战国阴阳家代表，以五德终始和大九州说著称。 | 阴阳家 / 五德终始 / 稷下 |
| song-xing | Song Xing | 战国稷下思想人物，常与尹文并称，主张节欲与非斗。 | 稷下 / 兼爱非斗 / 寡欲 |
| xu-xing | Xu Xing | 战国农家代表人物，以并耕主张见于《孟子》。 | 农家 / 并耕 / 孟子辩论 |
| yin-wen | Yin Wen | 战国稷下人物，常与名实、刑名和尹文子传统相连。 | 名实 / 稷下 / 尹文子 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。

## Producer
翻译由指定 AI 工具执行；产出后在本批 `notes.md` 顶部写 `**Producer:** <tool> (<vendor>)`。
