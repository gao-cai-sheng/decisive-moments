# Seed W13 生产口径（给 codex · 上座部/巴利佛教 + 越南）

状态：**gao 授权直接定案（2026-07-05，不逐条审）**。上游名单：`docs/research/seed-w13-candidates.md`。纪律：review-checklist §2.5。

## 定案参数
- **两个 civ**：`theravada_buddhist`（觉音/护法/雷迪/马哈希/佛使）；`vietnamese`（陈太宗/陈仁宗/黎贵惇）。
- periods：`theravada_classical`（觉音/护法）、`theravada_modern`（雷迪/马哈希/佛使）；`vietnamese_medieval`（陈太宗/陈仁宗）、`vietnamese_early_modern`（黎贵惇）。星位仍靠 life.birth。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w13-b1..b3`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（权威条目 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单 id（**照抄勿改**）：`justice`/`ethics`/`knowledge`/`politics`/`metaphysics`/`language`/`freedom`/`life_death`/`religion`/`aesthetics`。「生死」id 是 `life_death`。

## ⚠ 关系上限硬约束
- **buddhaghosa（新 seed 枢纽）**：buddha（标准）+ vasubandhu（标准）+ dhammapala（批内）= 3，**满，锁定**。
- **ledi-sayadaw（新 seed）**：buddha（标准）+ vasubandhu（标准）+ mahasi-sayadaw（批内）= 3，**满，锁定**。
- ledi/mahasi/buddhadasa **不得挂 buddhaghosa**；改挂标准档。
- 标准档锚点 buddha/nagarjuna/vasubandhu/huineng/zhu-xi/confucius 均 seedDeg=0，无上限。

## 批次 & 名单（共 8 位）

### b1 — 巴利注疏古典（civ=theravada_buddhist，periods=theravada_classical，2）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | 关系锚点 |
|---|---|---|---|---|---|
| buddhaghosa | 觉音 | 5世纪（fl. 约420，锡兰 Anuradhapura 大寺，Mahānāma 王时） | 《清净道论》(Visuddhimagga) | metaphysics, ethics, knowledge, life_death | buddha, vasubandhu |
| dhammapala | 护法 | 约6—7世纪（断代不确，**须 sourceNotes 标注**） | 《胜义灯疏》(Paramatthadīpanī，小部注疏) | metaphysics, ethics, knowledge | buddhaghosa（批内）, buddha |

### b2 — 上座部近现代复兴（civ=theravada_buddhist，periods=theravada_modern，3）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | 关系锚点 |
|---|---|---|---|---|---|
| ledi-sayadaw | 雷迪长老（U Ñāṇadhaja） | 1846—1923 | 《胜义要义手册》(Paramattha-dīpanī)《法之手册》(Manuals of Dhamma) | metaphysics, ethics, knowledge | buddha, vasubandhu |
| mahasi-sayadaw | 马哈希长老（U Sobhana） | 1904—1982 | 《内观手册》(Manual of Vipassana Meditation)；缅译《清净道论》 | ethics, knowledge, life_death | ledi-sayadaw（批内）, buddha |
| buddhadasa | 佛使比丘 | 1906—1993 | 《观呼吸》(Mindfulness With Breathing)《无我》(No Religion)《缘起》 | religion, metaphysics, politics | buddha, nagarjuna |

### b3 — 越南禅-儒（civ=vietnamese，3）
| id | 中文名 | 生卒 | 著作口径 | 主题范围 | periods | 关系锚点 |
|---|---|---|---|---|---|---|
| tran-thai-tong | 陈太宗 | 1218—1277 | 《课虚录》(Khóa hư lục) | religion, ethics, life_death | vietnamese_medieval | huineng, buddha |
| tran-nhan-tong | 陈仁宗 | 1258—1308 | 竹林禅派开创（Trúc Lâm），禅诗文/《居尘乐道赋》等 | religion, ethics | vietnamese_medieval | tran-thai-tong（批内）, huineng |
| le-quy-don | 黎贵惇 | 1726—1784 | 《芸台类语》(Vân đài loại ngữ，1773) | knowledge, metaphysics, ethics | vietnamese_early_modern | zhu-xi, confucius |

## 收录判据提醒
- 陈太宗/陈仁宗为帝王-禅师，但有可归属禅学著作（《课虚录》/竹林禅），按「有可考文本的政治家/承载思想的作者」先例收（同管仲/密勒日巴），非纯护法君主。
- dhammapala 断代不确、觉音名下部分注疏归属学界有争议——sourceNotes 诚实标注。
- ledi/mahasi 均属缅甸内观-阿毗达磨复兴线，noteZh 标师承/法脉方向；buddhadasa↔nagarjuna 为思想对话（空/缘起），非师承。

## 门禁
- 每批：validate-kimi → admit dry-run --tier seed（theme 白名单 + seed 关系上限双校验）→ 新上下文盲审 PASS → --write → validate-data + quality-audit --require-standard + vitest 全绿 → `npm run sync:dist`。
- **盲审模拟 b1+b2 合并后全图 seed**：确认 buddhaghosa=3、ledi-sayadaw=3 未越界。
- 每步记 `LOOP-LEDGER.md`；本机 commit（勿 push）。
