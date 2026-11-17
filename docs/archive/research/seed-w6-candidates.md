# Seed W6 候选名单（草拟 · 藏传佛教文明）

状态：**草拟，待 gao 审核**。名单批准前不得生成 seed batch，不得写 public/data。

去重基线：现库 `public/data/philosophers.index.json` = **397 位**（注：W5 若已入库需以最新库再核，但 W6 锚点均为既有标准档，不依赖 W5）。下列 14 位已对 397 去重（零碰撞）。

口径：补**藏传佛教文明**——现库几乎空白（只有印度中观/唯识源头与汉传禅净）。收入藏地四大教派（宁玛/噶举/萨迦/格鲁）+ 觉囊 + 利美的奠基者与系统家，及入藏的印度祖师。走 Plan B seed 双轨制（身份层、`tier:"seed"`、禁 thoughtSystem、1–2 真实作品、2–3 关系挂靠、sourceNotes≥1）。前 7 位为试点批。

## 关联与锚点说明
藏传全部源出印度中观（nagarjuna）、唯识/俱舍（vasubandhu）、量论（dignaga/dharmakirti），这些**均为现库标准档、无关系上限**，故 W6 挂靠无顶爆风险。桑耶论诤一环可挂 huineng（代表汉传顿门）。

---

## b1 — 入藏祖师 + 早期教派（试点，7）
| 试点 | id | 中文名 | 生卒(约) | 理由 | 建议锚点 |
|---|---|---|---|---|---|
| 试点 | santaraksita | 寂护 | 725—788 | 瑜伽行中观，入藏建桑耶寺。 | nagarjuna, vasubandhu |
| 试点 | kamalasila | 莲花戒 | 740—795 | 桑耶论诤代表渐门，《修习次第》。 | santaraksita(批内), huineng |
| 试点 | atisa | 阿底峡 | 982—1054 | 噶当派，《菩提道灯论》。 | nagarjuna, tsongkhapa(批内) |
| 试点 | milarepa | 密勒日巴 | 1052—1135 | 噶举瑜伽士，道歌。 | buddha, gampopa(批内) |
| 试点 | gampopa | 冈波巴 | 1079—1153 | 达波噶举，融噶当与大手印。 | nagarjuna, milarepa(批内) |
| 试点 | sakya-pandita | 萨迦班智达 | 1182—1251 | 萨迦派，《量理宝藏论》系统化量论。 | dharmakirti, dignaga |
| 试点 | longchenpa | 隆钦饶绛巴 | 1308—1364 | 宁玛大圆满，《七宝藏》。 | nagarjuna, vasubandhu |

## b2 — 系统家 + 利美/近现代（7）
| id | 中文名 | 生卒(约) | 理由 | 建议锚点 |
|---|---|---|---|---|
| tsongkhapa | 宗喀巴 | 1357—1419 | 格鲁派创立，应成中观、《菩提道次第广论》。 | nagarjuna, dharmakirti |
| dolpopa | 多波巴 | 1292—1361 | 觉囊派他空见。 | vasubandhu, nagarjuna |
| gorampa | 果然巴 | 1429—1489 | 萨迦派，批宗喀巴中观解释。 | nagarjuna, tsongkhapa(批内) |
| buton | 布顿 | 1290—1364 | 佛教史家、大藏经编定。 | vasubandhu, sakya-pandita(批内) |
| jamgon-kongtrul | 蒋贡康楚 | 1813—1899 | 利美运动，《知识总汇》。 | vasubandhu, longchenpa(批内) |
| mipham | 米滂 | 1846—1912 | 宁玛利美，中观量论注疏。 | dharmakirti, longchenpa(批内) |
| dalai-lama-14 | 第十四世达赖喇嘛 | 1935— | 格鲁派领袖，当代中观与科学对话。 | nagarjuna, tsongkhapa(批内) |

---

## 批次建议
- b1 入藏祖师+早期教派（7，试点）｜ b2 系统家+利美/近现代（7）。

## 红线
- 只汇编，不生产。名单批准前零生产、不写 public/data。
- 半传说/密续人物以传统归属根本著作为代表作，sourceNotes 注明学界断代；藏文著作可用通行汉译/英译名。
- 生产后每批走 §2.5 seed 门 + 新上下文盲审 PASS 才 admit；禁 commit/push。
- admit 双前置校验（theme 白名单 + seed 关系上限≤3）在。W6 锚点均标准档，无顶爆风险；批内互挂（如 gampopa↔milarepa、gorampa→tsongkhapa）注意每位新 seed 自身 2–3 条。
- **待议**：是否纳入印度中观祖师 candrakirti（藏传应成派核心，现库缺）——属印度文明，可并入本波或留印度补白波。
