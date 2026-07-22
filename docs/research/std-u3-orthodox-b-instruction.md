# Codex 生产指令 — U3 东正教 b（seed→standard 升格，4 人）

承接 `seed-upgrade-plan-2026-07-05.md` 批次表 U3。口径对齐 `std-u2-cappadocians-instruction.md`（已 PASS 入库）与已升格结构范本 `public/data/philosophers/zoroaster.json`。**U2 三杰已入库，本批 locator 硬门标准同 U2，不放宽。**

## 角色与边界
- 你是生产者。**只写** `.research/tmp/kimi/2026-07-22-std-u3-orthodox-b/`。
- **禁碰** `public/data`、**禁** admit/`--write`、**禁** commit/push、**禁改 relationships**。产完即停，交新上下文盲审。

## 批次与交付物
新建 `.research/tmp/kimi/2026-07-22-std-u3-orthodox-b/`，含：
- `proposed-philosophers.json`（`schemaVersion:1`，`items:[4]`；`tier:"standard"`，**保留原 seed 身份层全部字段**，`summaryZh` 加厚覆盖三 problem 主线，≥40 字）
- `thought-systems.json`（`schemaVersion:1`，`items:[4]`，`philosopherId` 对应；本批重头）
- `proposed-works.json`（仅 Psellos 可能需要；见"works 扩充"）
- 例行：`brief.md / sources.md / notes.md / open-questions.md`

四人 id（照抄勿改）：`pseudo-dionysius`、`maximus-the-confessor`、`john-of-damascus`、`michael-psellos`

现有种子档基线（作品固定，locator 只能落在这些 workId 上，除 Psellos 外禁扩）：
- `pseudo-dionysius` 约500佚名｜themes `metaphysics,religion,knowledge`｜works `pseudo-dionysius-mystical-theology`《神秘神学》、`pseudo-dionysius-divine-names`《神圣名称》
- `maximus-the-confessor` 约580—662｜themes `metaphysics,freedom,religion`｜works `maximus-ambigua`《难题集》、`maximus-questions-thalassius`《致塔拉修问答》
- `john-of-damascus` 约675—749｜themes `religion,knowledge,metaphysics`｜works `john-damascus-fount-of-knowledge`《知识的源泉》、`john-damascus-divine-images`《论神圣图像》
- `michael-psellos` 约1018—约1078｜themes `knowledge,metaphysics,politics`｜works `psellos-chronographia`《编年史》、`psellos-de-omnifaria-doctrina`《杂论》

## 结构硬门（每人，= 标准档写前门）
- `problems ≥3`；每 problem `claims ≥2`；每 claim `evidence ≥2` → **每人 ≥12 条 evidence**。
- 每条 evidence `summaryZh ≥40 字`；**同 problem 内 claim weight 有区分、跨 problem 有梯度**（禁清一色 3,2）。
- 字段形态照 zoroaster/U2：
  - problem 键：`id,titleZh,questionZh,summaryZh,themeIds,weight,sourceIds,claims`
  - claim 键：`id,titleZh,claimZh,explanationZh,themeIds,weight,sourceIds,evidence`
  - evidence 键：`id,titleZh,summaryZh,sourceIds,source{workId,locator,excerptStatus}`
- id 命名：`<philId>:problem:00X` / `:claim:00X` / `:evidence:00X`。

## locator 精度（铁律，落到具体文本位置，禁元数据凑数）
各作品合法定位形态：
- **pseudo-dionysius-mystical-theology《神秘神学》**：`Mystical Theology, ch. N`（全 5 章，短篇；可加 §）
- **pseudo-dionysius-divine-names《神圣名称》**：`Divine Names, ch. N, §M`（13 章）
- **maximus-ambigua《难题集》**：`Ambigua N`（编号难题，如 Ambigua 7/10/41 等宇宙论-逻各斯核心篇）
- **maximus-questions-thalassius《致塔拉修问答》**：`Questions to Thalassius, Q. N`（65 问）
- **john-damascus-fount-of-knowledge《知识的源泉》= 三部合一**：locator **必须点明子部 + 章**，禁只写"Fount of Knowledge, ch. N"：
  - `Fount of Knowledge, Dialectica (Philosophical Chapters), ch. N`（逻辑/哲学导论）
  - `Fount of Knowledge, On Heresies, §N`（异端论）
  - `Fount of Knowledge, Exposition of the Orthodox Faith, Book I–IV, ch. N`（正统信仰阐述，100 章通行编号）
- **john-damascus-divine-images《论神圣图像》**：`On the Divine Images, Treatise I–III, §N`（三篇护教）
- **psellos-de-omnifaria-doctrina《杂论》**：`De omnifaria doctrina, ch. N`（约 200 短章，其哲学立场主载体）
- **psellos-chronographia《编年史》**：`Chronographia, Book N, §M`（按帝王卷）——**仅当某 claim 确需其智识自述/哲学与宫廷关系时才引，禁把纯叙事史当思想凑 problem**。

**excerptStatus**：希腊教父/拜占庭原典无逐字公有领域**中译** → 一律 `summary_only`；**严禁编造章节号/难题号**。核不实退回具名见证或砍。公有领域英译（NPNF/Luibheid CWS/Migne PG）仅用于校准段号，不作中文逐字 excerpt。

## themes（白名单，越界直接 REJECT）
只能取：`justice / ethics / knowledge / politics / metaphysics / language / freedom / life_death / religion / aesthetics`。建议映射：
- pseudo-dionysius：`metaphysics, religion, language, knowledge`（否定/肯定神学=language；神圣名称=knowledge/metaphysics）
- maximus：`metaphysics, freedom, religion`（逻各斯宇宙论=metaphysics；自然意志 vs gnomic 意志=freedom；神化=religion。可按需 life_death）
- john-of-damascus：`religion, knowledge, metaphysics`（系统神学=knowledge；圣像辩护=religion。**别硬塞 aesthetics**，圣像论证是神学非美学）
- michael-psellos：`knowledge, metaphysics, politics`（百科博学=knowledge；柏拉图主义复兴=metaphysics；哲人与宫廷=politics）
- **生死 id 是 `life_death` 不是 `death`。**

## 反模板（本批最高风险——否定神学易撞车）
1. **禁与 U2 Nyssa 撞模板**：Nyssa 已入库的"幽暗认识/无限上升(epektasis)"是既有内容。pseudo-Dionysius 与 Maximus 的否定神学**不许复述 Nyssa 那套幽暗-上升句式**。切口必须各自独立：
   - pseudo-Dionysius = **否定/肯定神学的方法层级** + 神圣名称如何既可说又超越（cataphatic↔apophatic 的方法论），非"灵魂上升"。
   - maximus = **逻各斯(logoi)宇宙中介 + 意志/神化**（自然意志与 gnomic 意志之分、基督双意志），非否定神学抒情。
   - john-of-damascus = **系统集成 + 圣像可敬论证**（原型-图像的荣誉传递、道成肉身使物质可敬），偏教义体系与护教逻辑。
   - michael-psellos = **哲学与基督教教义的张力 + 柏拉图主义复兴 + 博学者的知识组织**，偏世俗学问定位。
2. 四人连续产出 → 盲审会查 `shared_suffix` / `template_similarity` / `template_claim`（RED 即毙）。claim 权重跨 problem 有真实梯度。

## works 扩充（仅 Psellos，谨慎）
- 前三人用现有两部足够，**禁扩**。
- Psellos 若三 problem 实在无法用《杂论》+《编年史》覆盖其哲学立场，可经 `proposed-works.json` 新增**一部真实哲学作品**（如其对亚里士多德/柏拉图的评注或哲学短论集，真实、归属正确、禁占位 id），盲审重点核真伪。能覆盖就别扩。

## 史实诚实标注
- pseudo-Dionysius：托名、约500成书、佚名——身份层已诚实标注，thoughtSystem 内引其文本时按"该托名文集"处理，勿误作使徒时代丢尼修。
- maximus《难题集》双意志/基督论口径按其反单意志论(monothelitism)立场，勿时代错置。

## 完成即停
产完自查结构后**停车**。交新上下文按 `docs/research/std-u1-persian-review-instruction.md` 同一硬门盲审，结论写本批 `review-verdict.md`。**盲审 PASS 前不许任何人 admit。**

## admit 口径（盲审 PASS 后，由本机/主循环执行，非 codex）
逐人升格：
```
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u3-orthodox-b pseudo-dionysius --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u3-orthodox-b maximus-the-confessor --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u3-orthodox-b john-of-damascus --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u3-orthodox-b michael-psellos --write
```
随后 `validate-data` + `quality-audit --require-standard` + `vitest` 全绿 → `npm run sync:dist` → 本机 commit → 记 `LOOP-LEDGER.md`。预期入库后 standard 200 → 204。
