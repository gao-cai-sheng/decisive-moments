# Seed W10 生产口径（给 codex · 前伊斯兰波斯 / 祆教层）

状态：**名单已由 gao 审核通过（2026-07-05）**。上游名单：`docs/research/seed-w10-candidates.md`（含逐位锚点表 + 范围界定）。纪律：review-checklist §2.5。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w10-b1`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（Encyclopædia Iranica / SEP / IEP / Encyclopaedia of Islam + URL）。
- `themes`/`themeIds` 只用 10 主题白名单 id（**照抄勿改**）：`justice`/`ethics`/`knowledge`/`politics`/`metaphysics`/`language`/`freedom`/`life_death`/`religion`/`aesthetics`。注意「生死」id 是 `life_death`（非 `death`），越界值 admit 门直接 REJECT。

## 批次 & 名单（共 2 位，b1 单批）
- **b1（核心，2）**：`zoroaster` / `mani`

| id | 中文名 | 生卒 | 著作口径 | 主题范围（10 主题内选） | 关系锚点 |
|---|---|---|---|---|---|
| zoroaster | 琐罗亚斯德（查拉图斯特拉） | 约前1000 | 《伽萨》(Gāthās，《阿维斯陀》最古层)——**部分可归属本人**，非全部《阿维斯陀》。 | metaphysics（善恶二元/阿胡拉·马兹达）、ethics（善思善言善行）、freedom（善恶自由抉择）、justice（asha 真理秩序 vs druj）、life_death（末世审判/来世）、religion | suhrawardi（照明学派明认复兴古波斯 khusrawani 光智先贤）、nietzsche（《查拉图斯特拉如是说》后世借名/再诠释，noteZh 须标明是借用而非师承）、mani（批内，摩尼教承祆教二元论） |
| mani | 摩尼 | 216—274 | 摩尼**亲撰**经典（如《沙卜拉干》Šābuhragān 等）——刻意自著以防篡改，非身后结集。 | metaphysics（光暗二元宇宙论）、religion、life_death（灵魂救赎/轮回解脱）、ethics（禁欲三印） | augustine（皈依前做过九年摩尼教「听者」、后著《驳福斯图斯》等反摩尼教）、plotinus（同代新柏拉图主义《驳诺斯替派》语境，noteZh 标为思想论争背景）、zoroaster（批内） |

## 收录判据提醒（务必写进条目口径）
- `zoroaster`：**双重争议必须在 sourceNotes 标注**——①断代（约前1000±一世纪，另有前1750 说及「亚历山大前258年」≈前6世纪说）；②**作者身份本身有争议**（多数学者归《伽萨》于其本人，但 Kellens/Skjærvø 质疑，学界无共识，Kellens 甚至疑无单一作者）。著作限《伽萨》(Old Avestan) 层、勿把整部《阿维斯陀》都归他名下。属「最古颂诗部分可归属的宗教创立者」——按佛陀/孔子先例收，诚实标注归属边界。
- `mani`：本库最硬的创立者案例（亲撰），无须结集说明；但残卷散佚、多经他人转录/译传，sourceNotes 标注文本流传状况。
- nietzsche、plotinus 两处为**后世/异域论争**关系，noteZh 明确不是师承或直接影响，避免误导。

## ⚠ 关系上限（本波无雷，仍需复核）
- 全部锚点 suhrawardi / augustine / plotinus / nietzsche 均为**既有标准档**，当前 seedDeg=0，**无 ≤3 上限风险**。
- 批内互挂 zoroaster↔mani 各计入两位新 seed 自身度数；每位总关系 2–3，合并后全图复核 seed≤3（本波仅 2 位，风险极低，仍按流程模拟）。

## 排除登记（勿生产）
- `mazdak`：gao 定登记排除（无可归属著述、仅敌方转述），已录 `excluded-patrons-rulers.md`。**不得**建条目，如需只作 zoroaster/mani 关系背景。
- `bardaisan` / `paul-the-persian`：本波默认不收（地理/名气），如后续要收另议。

## 门禁
- validate-kimi → admit dry-run --tier seed（含 theme 白名单 + seed 关系上限双校验）→ 新上下文盲审 PASS → --write → validate-data + quality-audit --require-standard + vitest 全绿 → `npm run sync:dist`。
- 盲审须含：机械项、身份真伪、断代标注到位、后世关系 noteZh 不误导、全图 seed≤3。
- 每步记 `LOOP-LEDGER.md`；本机 commit（勿 push）。
