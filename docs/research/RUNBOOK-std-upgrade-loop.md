# 常驻循环手册：种子档→标准档全线升格（Standing Upgrade Loop）

**执行者**：codex ｜ **性质**：常驻手册，不是单批指令
**立于**：2026-07-24 ｜ **承接**：`seed-upgrade-plan-2026-07-05.md`、`RUNBOOK-kimi-autonomous-loop.md`

> **与旧 RUNBOOK 的关系**：旧手册的 §2（用 `kimi:queue` 逐人选目标）和 §3（单人三阶段流水线）已不适用——项目早已转为 U 线批次升格。本文件取代那两节。旧手册的 **§10 红线**、**§12 戳记与停车协议**、**§14 调用合并守则**继续有效，不在此重复。
>
> **本手册的目标**：把全库 326 位种子档哲人推完，让每颗星都长出卫星。你自己选批、自己过门、自己判通过与否，不必等逐批指令。

---

## 1. 当前状况（2026-07-24 实测）

```
全库 542 位 ＝ 标准档 216 ＋ 种子档 326
```

- **标准档**＝有 `thoughtSystem`＝星图上有环绕行星（`src/scene/NearbyOrbits.tsx` 按 `thoughtSystem.problems` 逐条渲染轨道）。
- **种子档**＝只有身份层，星图上是一颗光秃的恒星。这是 `plan-b-seed-tier-proposal.md` 的刻意设计，不是缺陷；升格是把它逐步补厚。
- 升格不改总数，只改配比：每批 `standard +N / seed −N`。

**已完成**：U1 波斯 2 ｜ U2 卡帕多西亚 3 ｜ U3 东正教 b 4 ｜ U4 东正教 c 3 ｜ U5 俄 a 3/4 ｜ U6 俄 b 3/3 ｜ U7 俄 c 3/5。

**上一轮盲审的教训（本手册的立法理由）**：U5/U6/U7 十二人在三道旧门下**全绿**，盲审仍打回三人——赫尔岑把两部独立著作挂在《往事与随想》名下、费奥多罗夫六个篇名文集目录里查不到、布尔加科夫十二条里只有两条是真位置。**门全绿不等于货是对的**。第 4 节的第四道门就是为堵这个缺口新建的。

---

## 2. 缺口：326 位怎么构成

| 文明块 | 剩余 | 状态 |
|---|---:|---|
| 俄罗斯 | 7 | 3 位待返工（见 §6）＋ 白银时代 4 位待产 |
| 上座部佛教 | 5 | U9 已排期 |
| 越南 | 3 | U9 已排期 |
| 中华 | 100 | 48 位 w3 已排期（C1–C11）；52 位 w2/w1 待决策 |
| 西方（欧陆/英美） | 102 | 待决策 |
| 伊斯兰 | 24 | 待决策 |
| 拉美 | 22 | 待决策 |
| 犹太 ＋ 欧洲近现代 | 21 | 待决策 |
| 东亚（日/韩） | 15 | 待决策 |
| 藏传佛教 | 14 | 待决策 |
| 印度 | 13 | 待决策 |
| **合计** | **326** | 其中 **63 位已排期**，**263 位待 §3 决策** |

明细见 `seed-inventory-2026-07-24.md`（该文件按 2026-07-24 上午状态生成，标注 338 位／标准 204，比现状旧 12 人；**名单本身有效，人数以本节为准**）。

---

## 3. 计划：三段

### 近端（63 位，已排期，直接开工不必再问）

| 批 | 内容 | 人数 |
|---|---|---:|
| **U5b** | 返工重审：`alexander-herzen` | 1 |
| **U7b** | 返工重审：`nikolai-fedorov`、`sergei-bulgakov` | 2 |
| **U8** | 俄罗斯白银时代：`lev-shestov`、`nikolai-berdyaev`、`pavel-florensky`、`semyon-frank` | 4 |
| **U9a** | 上座部：`buddhaghosa`、`dhammapala`、`ledi-sayadaw`、`mahasi-sayadaw` | 4 |
| **U9b** | 上座部＋越南：`buddhadasa`、`tran-thai-tong`、`tran-nhan-tong`、`le-quy-don` | 4 |
| **C1–C11** | 中华 w3 存量 48 位，按学脉分组，批次表见 `seed-upgrade-plan-2026-07-05.md` §4 | 48 |

**顺序**：先 U5b/U7b 清欠（返工优先于新产，别让旧账挂着），再 U8 收尾俄罗斯块，再 U9 收尾上座部/越南块，然后进 C 系。

**C 系有个特殊红利**：中文原典公有领域文本充足，`publicDomainExcerptZh` 应尽量补逐字原文——这是全库「逐字原文欠债」下降最快的一段，别浪费。

### 中端（263 位，先决策后动工）

`seed-upgrade-plan-2026-07-05.md` §5 留了两个方案，**C 系收尾时才定，你不要自行决定**：

- **方案甲（计划推荐）**：按名气抽升，每文明挑 w2 中最有名者，估 60–90 位，其余长期留在种子档——「亮星有卫星、暗星只是星」本身是可接受的产品形态。
- **方案乙**：全量升格，预估 50＋批，数月量级。

走到 C11 完成时，在账本里记 `needs_human：P3 方案待定`，停车等人。

### 阶段验收线

```
近端做完：标准档 216 → 279 ／ 种子档 326 → 263
```

---

## 4. 每批自检：四道门

**产完不要自己宣布完成，先把四道门跑完，贴真实输出。**

### 门 1–3：既有写前门（一条命令）

```bash
bash scripts/verify.sh pre .research/tmp/kimi/<batch>
```

内含 `validate-kimi-research` → `admit dry-run` → `quality-audit --batch --require-standard`。期望末尾 `✅ 写前门全绿`。

### 门 4：locator 形态与举证（2026-07-24 新增）

```bash
node tools/locator-lint.mjs .research/tmp/kimi/<batch>
```

这道门专治「机器全绿但内容是错的」。它查两类东西：

**（a）形态 RED——直接判未过**

| 码 | 含义 | 反面教材 |
|---|---|---|
| `locator_not_a_position` | 无编号锚且含 background／context／in relation to 等描述词 | `Unfading Light, religious consciousness and world sections as background to Godmanhood` |
| `locator_vague_plural` | 无编号锚却用 chapters／sections／passages 复数 | `The Disarmament and Regulation passages`（自带「passages」字样，等于自曝不是篇名） |
| `chapter_without_number` | 写了 `ch.` 但后面跟的是 on／about 而非编号 | `The Lamb of God, ch. on Divine Sophia` |
| `locator_work_mismatch` | 首段书名与 workId 所指作品对不上 | —— |
| `unknown_workid` / `locator_empty` | 作品不存在／定位为空 | —— |

**（b）举证缺口——同样判未过**

机器判不了「这个篇名真不真」，所以改判**你有没有留下可核对的出处**。凡靠篇名、章题、卷次、页码定位的，必须在 `<batch>/sources.md` 写一节：

```markdown
## locator 版本声明

- `kropotkin-conquest-of-bread` | The Conquest of Bread, Chapman & Hall 1906 英译本 | 章题依该本目录
  - "Our Riches" → ch. I 章题
  - "Well-Being for All" → ch. II 章题
- `kireevsky-european-culture-russia` | 该长文无标准分章，依段落主题定位
```

声明可用 `workId` 或书名任一作键。**没有这一节，整批不许 admit。**

**凡以章题定位者，声明须给出页码或页码区间**（2026-07-24 增补）：

```markdown
- `bulgakov-lamb-of-god` | Boris Jakim 英译，Eerdmans 2008 | 章题与页码依该本目录
  - "The Divine Sophia" → ch. N, pp. XXX-XXX
```

理由：目录在手则页码在手，写页码不增加成本；而页码比章题更难编造，也更易被第三方一击复核。**取不到实物目录就别写章题**——改用该书实际分部，或删掉这条改引可定位的材料。

这条规则的用意要说透：如果篇名是真的，你翻一次目录就能写完，成本极低（克鲁泡特金十二条只需两行）；如果篇名是你按主题拟的，你要么被迫编造一个版次——版次是可查的，盲审一击就穿——要么自己在写声明的过程中发现找不到，主动删掉。**这道门的价值不在于拦住你，在于让你自己先发现。**

### 门 5：机器永远查不了的，靠你自查

跑完前四道，在 `<batch>/self-review.md` 逐条回答，**答不上来就是没做完**：

1. **切口分离**：本批每两人之间，谁最容易被写成同一套？你实际怎么切开的？举出各自 problem 标题为证。
   - 已有正面样板：巴枯宁走否定路径（国家形式必然再生统治）／克鲁泡特金走实证路径（互助是进化事实）；索洛维约夫从道德经验起步／布尔加科夫从宗教意识起步。
2. **每条 evidence 的 `summaryZh` 概括的是所引文本自身的论证**，不是二手转述（禁「SEP 指出」「学界一般认为」）。
3. **本批新增的 works 每一部都真实存世**，`proposed-works.json` 里没有占位 id。
4. **本批有没有对同一部书连号引用**（ch. 1/2/3/4/5 这种）？逐条说明你是从哪个目录查到的。
   - 2026-07-24 布尔加科夫批的教训：前次十二条主题描述被打回后，改成 `ch. 1` 到 `ch. 5` 连号，四道门全绿，仍被 HOLD。
   - **真实取证是跳跃的**——托尔斯泰引 ch. I/II/VII/VIII-IX/XII，克鲁泡特金引 ch. I/II/III/VIII/X/XI/XIII，陀思妥耶夫斯基跨三卷取五章。你引的是论证需要的那几章，不会正好是开头连续五章。**整齐反而反常。**
   - 门查不了这个：`ch. on Divine Sophia` 补个编号变成 `ch. 1, The Divine Sophia`，形态就合格了。**补编号比查目录省事，所以这条只能靠你自己交代。**
   - （审核方评估过「连号 ≥4 章即告警」的机器规则并否决：托尔斯泰《忏悔录》展开含 9,10,11,12,13 连续五章，规则一上先误伤全批最扎实的样本。）
5. **哪几条你自己心里没底**？写进 `open-questions.md`——**主动标出存疑不扣分，藏着被盲审抓到才扣分**。U5 那批你自己在交接里写了「重点查 Herzen 第六卷政治文本 workId 口径」，那正是后来被打回的那条；写出来是对的，下次请在写出来的同时**直接改掉或降级**。

---

## 5. 节奏

```
选批（§3 顺序）→ 产 batch → 四道门自跑 → 写 self-review → 停车交盲审
                                    ↑ 未过就地修，别提交
```

- **批量**：3–6 人。标准档每人 ≥12 条 evidence，贪多必薄。
- **每回合**：连续推 3–5 项再停（一批产出算 1 项，一次返工算 1 项），别干一件就收。
- **停车必写原因**，四选一：`turn_budget`（活干够了，还有剩余，人说声继续即可）／`needs_human`（撞红线或史料判不了）／`backlog_empty`（近端清空）／`quota`（额度将尽，交接另一方）。
- **每次停车打戳记**，格式照旧 RUNBOOK §12.2，追加到 `docs/research/LOOP-LEDGER.md`。
- **盲审是外部的**，你产完即停，**不要自己写 `review-verdict.md`，不要自己 admit**。

### 红线（照旧 RUNBOOK §10，此处只提最常踩的三条）

1. **只写** `.research/tmp/kimi/<batch>/`。**禁碰** `public/data/` 任何文件。
2. **禁执行** `admit --write`、`oneoff-promote-upgrade.mjs --write`、commit、push。
3. **禁改** `src/data/schemas.ts`、`tools/*`、`scripts/*`、`relationships.json`。需要新作品走 `proposed-works.json`，由本机手工并入 `works.json`——注意 `oneoff-promote-upgrade.mjs` **不会**自动合并它（U4 普勒东踩过，报 `unknown_workid` RED ＋ ASSERT FAIL）。

---

## 6. 首批任务：三人返工（U5b / U7b）

三人的机器门当时全绿，问题各不相同，**分开处理，不要合成一批**。

### 6.1 `alexander-herzen`——作品归属错误

四条 evidence 把两部**独立著作**写成了《往事与随想》的第六卷：

| 现状 locator | 问题 |
|---|---|
| `My Past and Thoughts, vol. VI, From the Other Shore, ch. I-II` | 《彼岸书》(С того берега, 1850) 是独立著作 |
| `My Past and Thoughts, vol. VI, The Russian People and Socialism, final pages on laws and decrees` | 《俄国人民与社会主义》(1851 致米什莱公开信) 是独立文本 |
| `My Past and Thoughts, vol. VI, The Russian People and Socialism, pp. 180-185` | 同上，且页码未标版本 |
| `My Past and Thoughts, vol. VI, The Russian People and Socialism, note on Prince Kozlovsky's commune` | 同上 |

部分英译合订本把《彼岸书》作附录收入，但即便如此也不能写成 vol. VI——Garnett 六卷本 vol. VI 是 *England*。

**返工要求（推荐方案甲）**：经 `proposed-works.json` 新增两部真实作品，相关 evidence 改引之：

```
herzen-from-the-other-shore              《彼岸书》(From the Other Shore / С того берега, 1850)
herzen-russian-people-and-socialism      《俄国人民与社会主义》(The Russian People and Socialism / Русский народ и социализм, 1851)
```

按 `works.json` 现有条目结构填：`id` / `philosopherId` / `titleZh` / `titleEn` / `noteZh`（**无 `yearDisplay` 字段，别加**）。locator 形态用 `From the Other Shore, ch. N` / `The Russian People and Socialism, §N`。

备选方案乙：不扩 works，四条改引 `herzen-russian-revolutionary-ideas` 或《往事与随想》中确实讨论该主题的部分。缺点是 1848 年后欧洲经验与农民公社社会主义两条主线被迫压缩。

### 6.2 `nikolai-fedorov`——篇名逐条核实

《共同事业的哲学》是遗著文集（Peterson、Kozhevnikov 编订），篇目结构复杂。

**已核实为真、保留**：`The Question of Brotherhood or Kinship`（Вопрос о братстве или родстве）、`The Museum, Its Meaning and Mission`（Музей, его смысл и назначение）、`Supramoralism`（Супраморализм）。

**须逐条核实或改写**：`The Common Task of Humanity`、`Resurrection as a Task`、`The Regulation of Nature`、`Astronomy and the Common Task`、`Cosmic Expansion and Resurrection`、`The Disarmament and Regulation passages`。

对照 Peterson–Kozhevnikov 编本（或 Koutaissoff & Minto 英译 *What Was Man Created For?*）的实际篇目：核实为真的，在 `sources.md` 版本声明里标明编本；核实不到的，改落到已确证的三篇内的具体节，或明标 `fragment`。**在任一编本目录中都找不到的篇名，一律不许保留。**

> 内容判断本身没问题——把死亡改写为儿女对父辈的共同义务、博物馆作为复活准备机关，是全库辨识度最高的条目之一。**返工只针对 locator，别推翻思路重写。**

### 6.3 `sergei-bulgakov`——多数定位要重做

十二条里只有两条算真正定位（`Unfading Light, Introduction, The Nature of Religious Consciousness`、`Unfading Light, section The World`）。其余是主题描述，最严重的一条指向「作为……背景的那些部分」。

**返工要求**：
- 《不暮之光》按实际分部与节次定位：导论／第一部 神圣的虚无／第二部 世界／第三部 教会、国家、文化。
- 《神的羔羊》按实际章次定位（该书有明确分章）。
- 某条内容确实定位不到具体章节的，**删掉该条改引可定位的材料——宁可换证据，不可留一个查不到的位置**。

### 6.4 交付

三人各自独立成批：`2026-07-XX-std-u5b-herzen`、`2026-07-XX-std-u7b-fedorov`、`2026-07-XX-std-u7b-bulgakov`。每批照 §4 跑完四道门再停。

---

## 7. 存量债登记（不倒查，但要知道）

第四道门是 2026-07-24 立的，**只对新批生效，不回溯已入库的人**。已知存量：

- `vladimir-solovyov`（已入库）：3 条会亮 RED——`The Justification of the Good, Part II, ch. on the Family` 与 `ch. on the Moral Organization of Humanity` 无章号，`final chapters on the moral order and religion` 是复数范围。另 `Lectures on Divine Humanity, Lectures 1-3` / `5-7` 跨三讲，建议收窄到单讲。
- `khomyakov-sobornost-essays`：题名「论聚和性文集」是种子期的汇编登记名，非单一实体著作，后续可考虑拆出《教会是一》独立条目。

哪天专门起一批清存量债，从这两条开始。
