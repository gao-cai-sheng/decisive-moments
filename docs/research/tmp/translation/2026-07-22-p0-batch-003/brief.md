# Translation batch P0-003 — brief

**Priority tier:** P0（index 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 20 位
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`
**术语基线:** 沿用上一批 `../2026-07-22-p0-batch-002/glossary.json`（缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`，以 index 实际值为准）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| lucretius | Lucretius | 罗马伊壁鸠鲁主义诗人，以《物性论》用原子论治疗宗教恐惧和死亡恐惧。 | 形而上学 / 宗教 / 生死 |
| seneca | Seneca the Younger | 罗马斯多葛哲人和政治家，以书信、论怒、论仁慈和有限生命训练展开实践伦理。 | 伦理 / 自由 / 生死 |
| epictetus | Epictetus | 罗马斯多葛教师，以控制二分、同意训练和内在自由构成最具实践性的斯多葛手册传统。 | 伦理 / 自由 / 知识 |
| marcus-aurelius | Marcus Aurelius | 罗马皇帝和斯多葛作者，以《沉思录》把宇宙秩序、职责和自我训练结合起来。 | 伦理 / 政治 / 生死 |
| fichte | Johann Gottlieb Fichte | 以知识学把康德批判哲学推进为从自我活动出发的自由体系。 | 自我 / 知识学 / 自由 / 法权 / 民族教育 |
| schelling | Friedrich Wilhelm Joseph Schelling | 把自然、精神、艺术和自由组织为德国观念论内部最具生成性的体系实验。 | 自然哲学 / 同一哲学 / 自由 / 艺术 / 启示 |
| feuerbach | Ludwig Andreas Feuerbach | 把黑格尔思辨神学倒转为人本学宗教批判，并成为马克思早期异化批判的近端入口。 | 宗教批判 / 投射 / 人本学 / 青年黑格尔派 / 马克思 |
| pascal | Blaise Pascal | 以人的脆弱、理性的限度和信仰赌注重塑早期现代基督教护教与存在论感受。 | 思想录 / 赌注 / 心灵 / 几何精神 / 蒙田 |
| peirce | Charles Sanders Peirce | 以探究逻辑、实用主义准则和三元符号学奠定美国实用主义的科学形态。 | 实用主义 / 符号学 / 溯因 / 范畴 / 科学共同体 |
| james | William James | 把心理学、宗教经验、自由意志和实用主义真理观连接成经验多元论。 | 意识流 / 实用主义 / 信仰意志 / 宗教经验 / 多元宇宙 |
| du-bois | W. E. B. Du Bois | 以双重意识、色线和废奴民主把种族经验推进为现代政治哲学和社会科学问题。 | 色线 / 双重意识 / 面纱 / 废奴民主 / 黑色重建 |
| moore | George Edward Moore | 以伦理非自然主义、反观念论和常识实在论推动剑桥分析哲学成形。 | 自然主义谬误 / 善不可定义 / 反观念论 / 常识 / 外部世界 |
| popper | Karl Popper | 以可证伪性、批判理性主义和开放社会论重塑二十世纪科学哲学与政治哲学。 | 可证伪性 / 批判理性主义 / 开放社会 / 历史主义批判 / 客观知识 |
| kuhn | Thomas Kuhn | 以范式、常规科学和科学革命改写科学进步的历史哲学图景。 | 范式 / 常规科学 / 科学革命 / 不可通约性 / 历史科学哲学 |
| dilthey | Wilhelm Dilthey | 以精神科学、体验和理解理论把历史生命世界纳入哲学方法论。 | 精神科学 / 理解 / 体验 / 历史世界 / 世界观 |
| gadamer | Hans-Georg Gadamer | 以效果历史、视域融合和语言性把解释学从方法论扩展为哲学本体论。 | 哲学解释学 / 效果历史 / 视域融合 / 语言 / 真理与方法 |
| jaspers | Karl Jaspers | 以生存哲学、界限处境和轴心时代思想连接克尔凯郭尔、尼采、海德格尔与阿伦特。 | 生存 / 界限处境 / 包围者 / 轴心时代 / 罪责问题 |
| sextus-empiricus | Sextus Empiricus | 以《皮浪主义纲要》和《反学者》保存古代皮浪主义，并成为近代怀疑论复兴的文本枢纽。 | 悬搁判断 / 等势论证 / 宁静 / 皮浪主义 / 反独断论 |
| duns-scotus | John Duns Scotus | 以存在单义性、形式区别和个体性理论构成阿奎那与奥卡姆之间的经院哲学关键中环。 | 存在单义性 / 个体性 / 形式区别 / 意志优先 / 无染原罪 |
| al-kindi | al-Kindi | 作为阿拉伯哲学源头人物，把希腊哲学翻译运动、第一哲学和伊斯兰一神论组织到同一项目中。 | 阿拉伯哲学 / 第一哲学 / 翻译运动 / 理智 / 创造 |

## 要写的字段
每个 id 产出 `oneLineEn`（≤120 字符、清晰学术散文、不逐字直译）与 `keywordsEn`（与源等长、同序）。不改任何 Zh 字段/id/结构。
