# Seed W13 候选名单（上座部/巴利佛教 + 越南）

状态：**gao 授权直接定案（2026-07-05，不逐条审）**。核心 8 位。名家生卒/著作均已 web 核实。

去重基线：现库 **506 位**（W10/W11/W12 未计）。下列 8 位对 506 零碰撞（已核）。

## 范围界定（一波补两块缺失）

按「补齐文明板块」原则，本波一次填两处真空：

- **上座部/巴利佛教（civ=`theravada_buddhist`）**：现库有大乘（龙树/世亲）、藏传（14 位）、东亚佛教（禅/华严/天台），**独缺上座部这一整支**。对偶现库 `tibetan_buddhist`。收巴利注疏传统的系统家 + 近现代复兴者。
- **越南（civ=`vietnamese`）**：现库有 `japanese`/`korean`，**越南整国缺失**。越南属汉字圈（禅 Thiền + 儒），收禅-儒代表。

Theravada 与 Vietnam 是**两个独立传统**，故分设两个 civ（不混为一个「东南亚」块——觉音实为印度生/锡兰工作属南亚，越南属汉字圈，「东南亚」作 civ 不自洽）。

---

## A. 上座部/巴利佛教（civ=`theravada_buddhist`，5）

### b1 — 巴利注疏古典（2，periods: theravada_classical）
| id | 中文名 | 生卒 | 理由/著作 | 建议锚点 |
|---|---|---|---|---|
| buddhaghosa | 觉音 | 5世纪(fl. 约420 锡兰大寺) | 《清净道论》(Visuddhimagga)，上座部教理集大成、巴利注疏传统奠基。 | buddha, vasubandhu（阿毗达磨对参） |
| dhammapala | 护法 | 约6—7世纪(断代不确，须标注) | 《胜义灯疏》(Paramatthadīpanī)，小部注疏。 | buddhaghosa（批内）, buddha |

### b2 — 上座部近现代复兴（3，periods: theravada_modern）
| id | 中文名 | 生卒 | 理由/著作 | 建议锚点 |
|---|---|---|---|---|
| ledi-sayadaw | 雷迪长老 | 1846—1923 | 缅甸阿毗达磨复兴、内观普及；《胜义要义手册》《法之手册》等。 | buddha, vasubandhu |
| mahasi-sayadaw | 马哈希长老 | 1904—1982 | 缅甸内观(vipassana)体系、影响全球；著约七十卷、译《清净道论》、《内观手册》。 | ledi-sayadaw（批内）, buddha |
| buddhadasa | 佛使比丘 | 1906—1993 | 泰国最具影响的现代佛教哲学家；「法的社会主义」、重解缘起；《观呼吸》《无我》等。 | buddha, nagarjuna（空/缘起对话） |

## B. 越南（civ=`vietnamese`，3）

### b3 — 越南禅-儒（3，periods: vietnamese_medieval / vietnamese_early_modern）
| id | 中文名 | 生卒 | 理由/著作 | 建议锚点 |
|---|---|---|---|---|
| tran-thai-tong | 陈太宗 | 1218—1277 | 陈朝禅学开篇，《课虚录》(Khóa hư lục)；越南禅思想根基。 | huineng, buddha |
| tran-nhan-tong | 陈仁宗 | 1258—1308 | 竹林禅派(Trúc Lâm)开创者(1299)，统合越南诸禅派。 | tran-thai-tong（批内）, huineng |
| le-quy-don | 黎贵惇 | 1726—1784 | 越南最大百科《芸台类语》(1773)，宋明理学脉。 | zhu-xi, confucius |

---

## 关系上限（已排雷）
- **buddhaghosa 是新 seed 枢纽**（护法/雷迪/马哈希都近它）：自身 buddha+vasubandhu(标准) + **仅 1 批内继承者 dhammapala** = 3，满。ledi/mahasi **不得挂 buddhaghosa**，改挂标准档 buddha/vasubandhu；mahasi 可挂批内 ledi。
- ledi-sayadaw：buddha+vasubandhu+mahasi(批内)=3，满，勿再加。
- 其余锚点 buddha/nagarjuna/vasubandhu/huineng/zhu-xi/confucius 全既有**标准档** seedDeg=0，无上限。

## 红线
- 只汇编，不生产（本波由 gao 授权直接定案，仍走生产→盲审→admit 全流程）。
- dhammapala 断代不确、觉音名下部分注疏归属有争议——sourceNotes 诚实标注。
- 主题 id 用 10 白名单（`life_death` 非 death 等）。
- 生产后每批走 §2.5 seed 门 + 新上下文盲审 PASS 才 admit + sync:dist；禁 commit/push。
