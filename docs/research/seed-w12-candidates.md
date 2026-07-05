# Seed W12 候选名单（草拟 · 拜占庭 / 东正教（希腊基督教）传统）

状态：**gao 授权直接定案（2026-07-05，不逐条审）**。核心 10 位。civ=`eastern_orthodox`；`byzantine` 降级为 periods 标签；伪狄奥尼修斯按托名/半传说落到可考文本先例**收**、sourceNotes 诚实标注。生产口径见 `seed-w12-production-spec.md`。

去重基线：现库 **506 位**（W10/W11 未计）。下列人物均已对 506 去重（零碰撞）。

## 范围界定

现库 `latin_christian` 全是**西方拉丁经院**一系（奥古斯丁/安瑟尔谟/阿奎那/波爱修斯/库萨/司各脱/埃克哈特/奥卡姆）——**希腊教父、拜占庭、东正教一个都没有**。古希腊（33）到欧洲近代之间那一千年的希腊基督教思想是断的。本波补这条脉：**希腊教父奠基（卡帕多西亚三杰+伪狄奥尼修斯）→ 拜占庭盛期 → 静修派论争与文艺复兴桥梁**。作为完整文明块，名家集中、性价比高，仅次于俄罗斯。

civ 归属建议：统一 `byzantine`（或 `eastern_orthodox`，请 gao 定标签名）。卡帕多西亚三杰虽属 4c 罗马晚期、技术上「前拜占庭」，但为东正教神学之源头，归入本脉最自洽。

---

## b1 — 希腊教父奠基（4）
| id | 中文名 | 生卒 | 理由 | 建议锚点（既有标准档，除批内） |
|---|---|---|---|---|
| basil-the-great | 大巴西尔（该撒利亚的巴西尔） | 约330—379 | 卡帕多西亚三杰，三一神学、修道规章。 | plotinus, gregory-of-nazianzus（批内） |
| gregory-of-nazianzus | 拿先斯的格里高利 | 约329—390 | 「神学家」，三位一体神学。 | plato, basil-the-great（批内） |
| gregory-of-nyssa | 尼撒的格里高利 | 约335—395 | 《摩西的生平》，神秘神学、无限进展（epektasis）。 | plotinus, basil-the-great（批内） |
| pseudo-dionysius | 伪狄奥尼修斯（亚略巴古的丢尼修） | 约500（成书） | 《神秘神学》《神圣名称》否定神学、等级论。**托名**使徒时代丢尼修，佚名作者、约成书 500 年——按托名/半传说落到可考文本先例收，sourceNotes 须诚实标注托名与断代。 | plotinus, cusa（后世接受） |

## b2 — 拜占庭盛期（4）
| id | 中文名 | 生卒 | 理由 | 建议锚点 |
|---|---|---|---|---|
| maximus-the-confessor | 忏悔者马克西姆 | 约580—662 | 《难题集》，两种意志论、宇宙-基督神学、集希腊教父之大成。 | pseudo-dionysius（批内）, augustine |
| john-of-damascus | 大马士革的约翰 | 约675—749 | 《知识的源泉》系统化教义、圣像辩护、承亚里士多德逻辑。 | aristotle, aquinas（后世引用） |
| symeon-the-new-theologian | 新神学家西门 | 949—1022 | 神秘主义、神圣之光的亲证经验。 | maximus-the-confessor（批内）, pseudo-dionysius（批内） |
| michael-psellos | 米海尔·普塞洛斯 | 约1018—1078 | 拜占庭博学者，复兴柏拉图主义、《编年史》。 | plato, plotinus |

## b3 — 静修派论争 + 文艺复兴桥梁（2 + 可选）
| id | 中文名 | 生卒 | 理由 | 建议锚点 |
|---|---|---|---|---|
| gregory-palamas | 格里高利·帕拉马斯 | 1296—1359 | 静修主义（hesychasm），本质/能质之分，《为静修者辩护》。 | pseudo-dionysius（批内）, maximus-the-confessor（批内） |
| gemistos-plethon | 格弥斯托斯·普勒东 | 约1355—1452 | 新柏拉图主义复兴、《法律篇》，佛罗伦萨大公会议影响意大利文艺复兴。 | plato, cusa |

**可选延伸（默认不收，名气次之，备查）**
| id | 中文名 | 生卒 | 说明 |
|---|---|---|---|
| nicholas-cabasilas | 尼古拉·卡巴西拉斯 | 约1322—约1392 | 圣事神学《在基督里的生命》，静修派同代。 |
| bessarion | 贝萨里翁 | 1403—1472 | 普勒东弟子，希腊学问传入意大利、柏拉图-亚里士多德之争。 |

---

## 批次建议（核心 10 位）
- b1 希腊教父奠基(4) ｜ b2 拜占庭盛期(4) ｜ b3 静修派+文艺复兴桥梁(2)。cabasilas/bessarion 默认不入,视 gao 意见可补。

## 红线
- 只汇编，不生产。名单批准前零生产、不写 public/data。
- **pseudo-dionysius 托名性质**必须在 sourceNotes 诚实标注（佚名、约500成书、托名使徒时代丢尼修）——属「有可归属系统性文本、作者半隐」的收录案例，非排除。
- 卡帕多西亚三杰断代（4c）与「拜占庭」标签的关系在文档/sourceNotes 说明；civ 标签名（byzantine / eastern_orthodox）待 gao 定。
- 锚点全用既有标准档（plato/plotinus/aristotle/augustine/aquinas/cusa，均 seedDeg=0，无上限风险）；批内互挂计入各新 seed ≤3，合并后全图复核。
- 生产后每批走 §2.5 seed 门 + 新上下文盲审 PASS 才 admit；禁 commit/push。
