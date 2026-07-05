# Seed W6 补充 · 藏传（候选+生产口径，gao 已原则批准）

状态：**gao 已原则批准（2026-07-05，据 Shoo 意见）**，可交 codex 生产。纪律：review-checklist §2.5。
批目录：`.research/tmp/kimi/2026-07-05-seed-w6sup-b1`。

## 缘由（Shoo 意见落实）
- 利美运动是**三人共推**：蒋贡康楚（噶举，已在库）+ 蒋扬钦哲旺波（萨迦）+ 秋吉林巴（宁玛）。补齐后两位。
- 后弘期补大译师**仁钦桑布**（上路弘传核心）。
- 前弘期三王（松赞干布/赤松德赞/古格王智光）**不收**，见 `docs/research/excluded-patrons-rulers.md`。

## 候选（6 位 = 后弘/利美 3 + 噶举印度祖师 3）
| id | 中文名 | 生卒(约) | 分期 | 理由 | periods 标签 |
|---|---|---|---|---|---|
| rinchen-zangpo | 仁钦桑布 | 958—1055 | 后弘期 | 大译师，上路弘传核心，译传密续与中观。 | ["medieval","tibetan_later_dissemination"] |
| jamyang-khyentse-wangpo | 蒋扬钦哲旺波 | 1820—1892 | 近现代·利美 | 萨迦派，利美三杰之一，编《大宝伏藏》。 | ["modern","tibetan_modern"] |
| chokgyur-lingpa | 秋吉林巴 | 1829—1870 | 近现代·利美 | 宁玛掘藏师(tertön)，利美三杰之一，「秋林新伏藏」。 | ["modern","tibetan_modern"] |
| tilopa | 蒂洛巴 | 988—1069 | 前弘/印度源头 | 印度大成就者，噶举传承（历史）起点。资料稀少，需辨真伪。 | ["medieval","tibetan_indian_origin"] |
| naropa | 那洛巴 | 1016—1100 | 前弘/印度源头 | 那烂陀学者转大成就者，那洛六法。资料稀少。 | ["medieval","tibetan_indian_origin"] |
| marpa | 玛尔巴 | 1012—1097 | 后弘期 | 大译师，入印求法，噶举奠基，密勒日巴之师。 | ["medieval","tibetan_later_dissemination"] |

> 噶举法脉（据 Shoo）：金刚总持(本初佛，**不收**，见备案) → 蒂洛巴 → 那洛巴 → 玛尔巴 → 密勒日巴(已在库) → 冈波巴(已在库)。本波补前四位中有其人的三位。
> **资料警示**（Shoo）：蒂洛巴/那洛巴中文资料尤缺，codex 须以权威英文/藏学来源为准，生卒与事迹争议在 sourceNotes 标注，宁缺毋滥。

## ⚠ 关系上限（精算，各满员 seed 只剩一格）
现有藏传 seed 中 **jamgon-kongtrul/tsongkhapa/santaraksita/kamalasila/mipham 已满 3**，不得再挂。剩一格的：**atisa/longchenpa/sakya-pandita/milarepa/gampopa**（各 2→最多 3）。分派：
- `rinchen-zangpo` → **atisa**（古格协作，atisa 用其唯一格→3）+ `nagarjuna`（标准档，译传中观）
- `jamyang-khyentse-wangpo` → **sakya-pandita**（萨迦法脉，用其唯一格→3）+ `chokgyur-lingpa`（批内，利美协作）
- `chokgyur-lingpa` → **longchenpa**（宁玛大圆满法脉，用其唯一格→3）+ `jamyang-khyentse-wangpo`（批内）
- `marpa` → **milarepa**（其著名弟子，用 milarepa 唯一格→3）+ `naropa`（批内，入印师承）
- `naropa` → `vasubandhu`（标准档，那烂陀学统）+ `tilopa`（批内师）+ `marpa`（批内徒）
- `tilopa` → `nagarjuna`（标准档，中观/密续源流）+ `naropa`（批内徒）
> 各满员 seed（jamgon-kongtrul/tsongkhapa/santaraksita/kamalasila/mipham）不得挂；剩一格的 atisa/sakya-pandita/longchenpa/milarepa 各只被分派一条，gampopa 留空。标准档 nagarjuna/vasubandhu 无上限。

## 作品口径（诚实标注）
- rinchen-zangpo 以**译师**身份，代表作为其最著名译传文本（如瑜伽密续译本），sourceNotes 注明其译师角色（类似结集/托名之诚实处理）。
- jamyang-khyentse-wangpo：《大宝伏藏》(Rinchen Terdzö，与康楚合编) 等可考著述。
- chokgyur-lingpa：「秋林新伏藏」(mchog gling gter gsar) 掘藏法类，sourceNotes 注明掘藏(terma)性质。

## 门禁
validate-kimi → admit dry-run --tier seed(含 theme 白名单 + seed 关系上限双校验) → 新上下文盲审 PASS → --write → validate-data + audit + vitest 全绿 → `npm run sync:dist`。
