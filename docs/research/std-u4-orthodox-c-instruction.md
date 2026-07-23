# Codex 生产指令 — U4 东正教 c（seed→standard 升格，3 人）

承接 `HANDOFF-2026-07-22.md` 与 `seed-upgrade-plan-2026-07-05.md` 批次表 U4。口径对齐 `std-u2-cappadocians-instruction.md`、`std-u3-orthodox-b-instruction.md`（已 PASS 入库）与已升格结构范本 `public/data/philosophers/zoroaster.json`。**U4 是东正教块收尾批，locator 与反模板硬门不放宽。**

## 角色与边界
- 你是生产者。**只写** `.research/tmp/kimi/2026-07-22-std-u4-orthodox-c/`。
- **禁碰** `public/data`、**禁** admit/`--write`、**禁** commit/push、**禁改 relationships**。产完即停，交新上下文盲审。

## 批次与交付物
新建 `.research/tmp/kimi/2026-07-22-std-u4-orthodox-c/`，含：
- `proposed-philosophers.json`（`schemaVersion:1`，`items:[3]`；`tier:"standard"`，**保留原 seed 身份层全部字段**，`summaryZh` 加厚覆盖三 problem 主线，≥40 字）
- `thought-systems.json`（`schemaVersion:1`，`items:[3]`，`philosopherId` 对应；本批重头）
- `proposed-works.json`（仅当 evidence 需要现有 works 之外的真实作品时才加；见"works 扩充"）
- 例行：`brief.md / sources.md / notes.md / open-questions.md`

三人 id（照抄勿改）：`symeon-the-new-theologian`、`gregory-palamas`、`gemistos-plethon`

现有种子档基线（作品固定，locator 优先落在这些 workId 上）：
- `symeon-the-new-theologian` 949—1022｜themes `religion,knowledge`｜works `symeon-theological-ethical-discourses`《神学与伦理论文集》、`symeon-hymns-divine-love`《神圣之爱赞美诗》
- `gregory-palamas` 1296—1359｜themes `religion,metaphysics,knowledge`｜works `palamas-triads`《为静修者辩护》
- `gemistos-plethon` 约1355—1452｜themes `metaphysics,politics,religion`｜works `plethon-nomoi`《法律篇》、`plethon-differences-aristotle-plato`《论亚里士多德与柏拉图之别》

## 结构硬门（每人，= 标准档写前门）
- `problems ≥3`；每 problem `claims ≥2`；每 claim `evidence ≥2` → **每人 ≥12 条 evidence**。
- 每条 evidence `summaryZh ≥40 字`；**同 problem 内 claim weight 有区分、跨 problem 有梯度**（禁清一色 3,2）。
- 字段形态照 zoroaster/U2/U3：
  - problem 键：`id,titleZh,questionZh,summaryZh,themeIds,weight,sourceIds,claims`
  - claim 键：`id,titleZh,claimZh,explanationZh,themeIds,weight,sourceIds,evidence`
  - evidence 键：`id,titleZh,summaryZh,sourceIds,source{workId,locator,excerptStatus}`
- id 命名：`<philId>:problem:00X` / `:claim:00X` / `:evidence:00X`。

## locator 精度（铁律，落到具体文本位置，禁元数据凑数）
各作品合法定位形态：
- **symeon-theological-ethical-discourses《神学与伦理论文集》**：locator 必须点明子部 + 篇章/段行，禁只写书名：
  - `Theological and Ethical Discourses, Theological Discourse N, §M` 或 `lines X-Y`
  - `Theological and Ethical Discourses, Ethical Discourse N, §M` 或 `lines X-Y`
- **symeon-hymns-divine-love《神圣之爱赞美诗》**：`Hymns of Divine Love, Hymn N, lines X-Y`（或 `vv. X-Y`）。能落到 hymn + 行号就别只写 hymn。
- **palamas-triads《为静修者辩护》**：`Triads, I.1, §N` / `Triads, II.3, §N` / `Triads, III.1, §N`（三组×三篇；可用等价 `I.iii.23` 形态，但全批保持一致）。禁只写 `Triads` 或"本质-能质之分相关章节"。
- **plethon-nomoi《法律篇》**：因正文大量佚失，locator 必须诚实标注存世形态：
  - `Nomoi, Book N, ch. M, paragraph K`（若用 Alexandre/Opsopaus 编排）
  - `Nomoi, Summary of the Doctrines of Zoroaster and Plato, §N`（若用摘要文本）
  - 只能用章题/后人转述时不够作核心 evidence，宁可砍 claim 或换现存文本。
- **plethon-differences-aristotle-plato《论亚里士多德与柏拉图之别》**：`On the Differences Between Aristotle and Plato, ch. N`（通行 0—19 章/节编号），按具体章论证柏拉图与亚里士多德的神、形式、宇宙秩序差异。

**excerptStatus**：拜占庭希腊文本无逐字公有领域**中译** → 一律 `summary_only`；**严禁编造章节号、行号、佚失文本引文**。公有领域英译/现代校勘只用于校准 locator，不作中文逐字 excerpt。

## themes（白名单，越界直接 REJECT）
只能取：`justice / ethics / knowledge / politics / metaphysics / language / freedom / life_death / religion / aesthetics`。建议映射：
- symeon-the-new-theologian：`religion, knowledge, ethics, life_death`（亲证经验=knowledge/religion；悔改、灵修生活=ethics；末世/神化可按需 life_death）
- gregory-palamas：`religion, metaphysics, knowledge`（本质/能质之分=metaphysics；静修与神圣之光=religion/knowledge。**别硬塞 aesthetics**）
- gemistos-plethon：`metaphysics, politics, religion, knowledge`（柏拉图主义复兴=metaphysics/knowledge；法制与城邦改革=politics；异教化神学=religion）
- **生死 id 是 `life_death` 不是 `death`。**

## 反模板（本批最高风险：三人都容易被写成"神秘主义/神圣之光"）
1. **禁与 U2/U3 撞模板**：
   - Symeon ≠ Nyssa 的 epektasis，也 ≠ Pseudo-Dionysius 的否定神学方法论。Symeon 的切口是**亲历经验、悔改、圣灵恩典、属灵父权威**。
   - Palamas ≠ Symeon 的第一人称神秘经验抒写。Palamas 的切口是**静修论争中的论证结构、本质/能质之分、未受造光、神化如何可经验但不等于把握神本质**。
   - Plethon ≠ 东正教神秘神学。Plethon 的切口是**晚期拜占庭柏拉图主义、反亚里士多德、法制/城邦改革、异教化宗教政治构想与文艺复兴传递**。
2. 三人连续产出 → 盲审会查 `shared_suffix` / `template_similarity` / `template_claim`（RED 即毙）。每人 problem 标题、claim 句法、summaryZh 叙述重心都要分立。
3. Palamas 的"本质不可知、能质可参与"要和 Pseudo-Dionysius 的"肯定/否定神学阶梯"分开写；Plethon 的"神/必然/秩序"要按柏拉图主义政治-宗教工程写，不要写成一般基督教神学。

## works 扩充（按需，谨慎）
- Symeon 两部现有 works 已覆盖经验神学与赞美诗主线；若必须引《实修、神学与诺斯替篇章》等，才经 `proposed-works.json` 新增真实作品。
- Palamas 优先只用 `palamas-triads`。若必须引《一百五十章》或《圣山宣言》承载 technical claim，才新增真实 work；新增后 locator 必须可核。
- Plethon 优先用《法律篇》现存片段/摘要 +《论亚里士多德与柏拉图之别》。若政治改革 claim 必须引给曼努埃尔二世/狄奥多尔的备忘录，才新增真实 work。**禁新增 `*-primary-work` 占位。**

## 史实诚实标注
- Symeon：可写"神圣之光亲证"与"属灵知识"，但不要把后期静修主义系统直接倒灌给他；他是 Palamas 的传统背景，不是 Palamas 体系本人。
- Palamas：本质/能质之分服务于静修经验与神化可参与性的辩护；不要写成纯抽象形上学，也不要把"能质"误写成受造媒介。
- Plethon：《法律篇》大量佚失且有异教倾向；写作时必须区分存世片段、摘要、后人记述。不要把他写成正统东正教神学家。

## 完成即停
产完自查结构后**停车**。交新上下文按 `docs/research/std-u1-persian-review-instruction.md` 同一硬门盲审，结论写本批 `review-verdict.md`。**盲审 PASS 前不许任何人 admit。**

## admit 口径（盲审 PASS 后，由本机/主循环执行，非 codex）
逐人升格：
```
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u4-orthodox-c symeon-the-new-theologian --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u4-orthodox-c gregory-palamas --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-22-std-u4-orthodox-c gemistos-plethon --write
```
随后 `validate-data` + `quality-audit --require-standard` + `vitest` 全绿 → `npm run sync:dist` → 本机 commit+push（按 `HANDOFF-2026-07-22.md` 新授权）→ 记 `LOOP-LEDGER.md`。预期入库后 standard 204 → 207，东正教块升格完成。
