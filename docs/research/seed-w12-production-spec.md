# Seed W12 生产口径（给 codex · 东正教 / 希腊基督教传统）

状态：**gao 授权直接定案（2026-07-05，不逐条审）**。上游名单：`docs/research/seed-w12-candidates.md`。纪律：review-checklist §2.5。

## 定案参数（gao 授权）
- **civ = `eastern_orthodox`**（与西方对偶 `latin_christian` 同为传统-信仰口径；`byzantine` 不作 civ）。
- **periods 标签**（丰富筛选，星位仍靠 life.birth）：
  - `greek_patristic`：basil / gregory-of-nazianzus / gregory-of-nyssa / pseudo-dionysius
  - `byzantine`：maximus / john-of-damascus / symeon / psellos / palamas
  - `late_byzantine`：plethon
- **pseudo-dionysius 按托名先例收**：sourceNotes 必标「佚名作者、约 500 年成书、托名《使徒行传》中的亚略巴古的丢尼修」——属有可归属系统性文本、作者半隐的收录案例。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w12-b1..b3`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/Stanford + 权威条目 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单 id（**照抄勿改**）：`justice`/`ethics`/`knowledge`/`politics`/`metaphysics`/`language`/`freedom`/`life_death`/`religion`/`aesthetics`。「生死」id 是 `life_death`。

## ⚠ 关系上限硬约束（本波关键雷区）
希腊教父-拜占庭是强谱系，多位新 seed 会争挂同几个源头（**pseudo-dionysius / maximus / basil**）。三者均为新 seed，各自总关系必须 ≤3。已分派如下，codex 照此，勿再加挂：
- **basil-the-great**：plotinus（标准）+ gregory-of-nazianzus（批内）+ gregory-of-nyssa（批内）= 3，**满**。
- **pseudo-dionysius**：plotinus（标准）+ cusa（标准）+ maximus（批内）= 3，**满**。
- **maximus-the-confessor**：pseudo-dionysius（批内）+ augustine（标准）+ symeon（批内）= 3，**满**。
- **symeon-the-new-theologian**：maximus（批内）+ augustine（标准）+ palamas（批内）= 3，**满**。
- 其余（john-of-damascus / psellos / plethon / palamas / 两个 gregory）挂**标准档**（plato/plotinus/aristotle/augustine/aquinas/cusa，均 seedDeg=0 无上限）或上述已列批内边。**不得**给 basil/pseudo-dionysius/maximus/symeon 再加任何新边。

## 批次 & 名单（共 10 位）

### b1 — 希腊教父奠基（4，periods: greek_patristic）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | 关系锚点 |
|---|---|---|---|---|---|
| basil-the-great | 大巴西尔 | 约330—379 | 《六日创世讲道集》《大规程》 | religion, ethics, metaphysics | plotinus, gregory-of-nazianzus（批内） |
| gregory-of-nazianzus | 拿先斯的格里高利 | 约329—390 | 《神学演讲五篇》 | religion, metaphysics | plato, basil-the-great（批内） |
| gregory-of-nyssa | 尼撒的格里高利 | 约335—395 | 《摩西的生平》《论人的创造》 | metaphysics, religion, life_death | plotinus, basil-the-great（批内） |
| pseudo-dionysius | 伪狄奥尼修斯（亚略巴古的丢尼修） | 约500（成书） | 《神秘神学》《神圣名称》《天阶体系》 | metaphysics, religion, knowledge | plotinus, cusa |

### b2 — 拜占庭盛期（4，periods: byzantine）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | 关系锚点 |
|---|---|---|---|---|---|
| maximus-the-confessor | 忏悔者马克西姆 | 约580—662 | 《难题集》(Ambigua)《致塔拉修问答》 | metaphysics, freedom, religion | pseudo-dionysius（批内）, augustine |
| john-of-damascus | 大马士革的约翰 | 约675—749 | 《知识的源泉》（含《正统信仰详解》） | religion, knowledge, metaphysics | aristotle, aquinas（后世引用，noteZh 标方向） |
| symeon-the-new-theologian | 新神学家西门 | 949—1022 | 《神学与伦理论文集》《赞美诗》 | religion, knowledge | maximus（批内）, augustine |
| michael-psellos | 米海尔·普塞洛斯 | 约1018—1078 | 《编年史》《杂论》(De omnifaria doctrina) | knowledge, metaphysics, politics | plato, plotinus |

### b3 — 静修派论争 + 文艺复兴桥梁（2，periods: byzantine / late_byzantine）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | 关系锚点 |
|---|---|---|---|---|---|
| gregory-palamas | 格里高利·帕拉马斯 | 1296—1359 | 《为静修者辩护》(Triads) | religion, metaphysics, knowledge | symeon（批内）, augustine |
| gemistos-plethon | 格弥斯托斯·普勒东 | 约1355—1452 | 《法律篇》(Nomoi)《论亚里士多德与柏拉图之别》 | metaphysics, politics, religion | plato, cusa |

## 收录判据提醒
- pseudo-dionysius 托名性质**必标**（见定案参数）。
- 卡帕多西亚三杰为 4c 晚期罗马、东正教神学源头，sourceNotes 说明「前拜占庭、归希腊基督教/东正教传统」，periods=greek_patristic。
- john-of-damascus↔aquinas、plethon↔cusa 等**后世引用/影响**关系，noteZh 标方向，勿误作师承。

## 门禁
- 每批：validate-kimi → admit dry-run --tier seed（theme 白名单 + seed 关系上限双校验）→ 新上下文盲审 PASS → --write → validate-data + quality-audit --require-standard + vitest 全绿 → `npm run sync:dist`。
- **盲审务必模拟 b1+b2+b3 合并后全图 seed 关系数**：确认 basil/pseudo-dionysius/maximus/symeon 各 =3 未越界、跨批叠加无 seed>3。
- 每步记 `LOOP-LEDGER.md`；本机 commit（勿 push）。
