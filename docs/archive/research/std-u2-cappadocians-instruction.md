# Codex 生产指令 — U2 东正教·卡帕多西亚三杰（seed→standard 升格）

承接 `seed-upgrade-plan-2026-07-05.md` 批次表 U2。口径对齐 `std-u1-mani-rework-instruction.md`（locator 硬门）与已升格的 `public/data/philosophers/zoroaster.json`（结构范本）。

## 角色与边界
- 你是生产者。**只写** `.research/tmp/kimi/2026-07-06-std-u2-cappadocians/`。
- **禁碰** `public/data`、**禁** admit/`--write`、**禁** commit/push。产完即停，交新上下文盲审。
- 前置：U1b-mani 升格已入库三绿并 commit 后，本批才允许 admit（但你现在就可以产到 tmp，不受阻）。

## 批次与交付物
新建 `.research/tmp/kimi/2026-07-06-std-u2-cappadocians/`，含：
- `proposed-philosophers.json`（`schemaVersion:1`，`items:[3]`；`tier:"standard"`，**保留原 seed 身份层全部字段**，`summaryZh` 在现有基础上加厚到能覆盖三 problem 主线，≥40 字）
- `thought-systems.json`（`schemaVersion:1`，`items:[3]`，`philosopherId` 对应；**本批重头**）
- `proposed-works.json`（仅当 evidence 需要现有 works 之外的作品时才加；见下"works 扩充"）
- 例行：`brief.md / sources.md / notes.md / open-questions.md`

三人 id（照抄勿改）：`basil-the-great`、`gregory-of-nazianzus`、`gregory-of-nyssa`

三人现有种子档基线（供参考）：
- `basil-the-great` 约330—379｜themes `religion,ethics,metaphysics`｜works `basil-hexaemeron`《六日创世讲道集》、`basil-longer-rules`《大规程》
- `gregory-of-nazianzus` 约329—390｜themes `religion,metaphysics`｜works `gregory-nazianzus-theological-orations`《神学演讲五篇》
- `gregory-of-nyssa` 约335—395｜themes `metaphysics,religion,life_death`｜works `gregory-nyssa-life-of-moses`《摩西的生平》、`gregory-nyssa-making-of-man`《论人的创造》

## 结构硬门（每人，= 标准档写前门，照 zoroaster 已升格结构）
- `problems ≥3`；每 problem `claims ≥2`；每 claim `evidence ≥2` → **每人 ≥12 条 evidence**。
- 每条 evidence `summaryZh ≥40 字`；**同一 problem 内 claim weight 必须有真实区分**（禁清一色 3,2）。
- 字段形态照 zoroaster：
  - problem 键：`id,titleZh,questionZh,summaryZh,themeIds,weight,sourceIds,claims`
  - claim 键：`id,titleZh,claimZh,explanationZh,themeIds,weight,sourceIds,evidence`
  - evidence 键：`id,titleZh,summaryZh,sourceIds,source{workId,locator,excerptStatus}`
- id 命名：`<philId>:problem:00X` / `<philId>:claim:00X` / `<philId>:evidence:00X`。

## locator 精度（铁律，比 mani 更严——这三人原典完整存世、有标准分段编号，不许拿元数据凑）
- `source.locator` 必须落到**具体文本位置**，不许用题名传统/献呈/canonical-status/传承说明凑数（这是 mani 第一版被 REJECT 的原因）。
- 各作品的合法定位形态：
  - **basil-hexaemeron《六日创世讲道集》**：`Hexaemeron, Homily N, §M`（九篇讲道，落到第几篇+段）
  - **basil-longer-rules《大规程》**：`Longer Rules, Question N`（编号问答）
  - **gregory-nazianzus-theological-orations《神学演讲五篇》**：`Oration 27–31, §M`（第 27–31 篇，落到篇+节，NPNF 有标准节号）
  - **gregory-nyssa-life-of-moses《摩西的生平》**：`Life of Moses, Book I/II, §M`（两卷+段号）
  - **gregory-nyssa-making-of-man《论人的创造》**：`On the Making of Man, ch. N`（三十章，落到章）
- **excerptStatus**：希腊教父原典无逐字公有领域**中译** → 一律 `summary_only`；**严禁为凑精度编造节号/章号**。核不实就退回具名见证（NPNF 版所标节号可用于定位，但内容用 summaryZh 转述，不伪造中文引文）。
- 有可查的公有领域英译（NPNF）**只用于校准 locator 节号**，不作为中文逐字 excerpt。

## themes（白名单，越界直接 REJECT）
只能取：`justice / ethics / knowledge / politics / metaphysics / language / freedom / life_death / religion / aesthetics`。
建议映射：
- basil：`religion, ethics, metaphysics`（六日创世→metaphysics/宇宙论；修道规章→ethics）
- gregory-of-nazianzus：`religion, metaphysics, language`（神性语言/不可言说→language）
- gregory-of-nyssa：`metaphysics, religion, life_death`（灵魂上升/无限进展/人被造→life_death/metaphysics）
- **生死 id 是 `life_death` 不是 `death`。**

## works 扩充（按需，谨慎）
- 现有 works 已覆盖主线（见上基线）。
- 若某 problem 必须引主线外作品（如 basil《论圣灵》De Spiritu Sancto、nyssa《大要理问答》Oratio Catechetica），经 `proposed-works.json` 新增：**真实作品、归属正确、禁占位 id**；新增 works 属扩边界，盲审重点核。能用现有 works 覆盖就别扩。

## 反模板（三人同传统，风险高）
- 三人连续产出易共享句式 → 盲审会查 `shared_suffix` / `template_similarity` / `template_claim`。
- 每人 problem 切口要贴其**真实思想差异**：basil=创世宇宙论+修道伦理；naz=三一/神学语言的可说与不可说；nyssa=灵魂无限上升(epektasis)+人论。别把三人写成同一套三一模板。
- claim weight 跨 problem 有真实梯度，别全 3/2。

## 不动的东西
- **禁改 relationships**：升格批不碰关系文件。把变量隔离在 `philosophers/*.json`（经升格脚本）+ `works.json` + index。给升格后枢纽补边另起单独批。

## 完成即停
产完自查结构后**停车**。交新上下文按 `docs/research/std-u1-persian-review-instruction.md` 同一硬门盲审，结论写本批 `review-verdict.md`。**盲审 PASS 前不许任何人 admit。**

## admit 口径（盲审 PASS 后，由本机/主循环执行，非 codex）
升格用专用脚本，逐人：
```
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-06-std-u2-cappadocians basil-the-great --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-06-std-u2-cappadocians gregory-of-nazianzus --write
node tools/oneoff-promote-upgrade.mjs .research/tmp/kimi/2026-07-06-std-u2-cappadocians gregory-of-nyssa --write
```
随后 `validate-data` + `quality-audit --require-standard` + `vitest` 全绿 → `npm run sync:dist` → 本机 commit（勿 push）→ 记 `LOOP-LEDGER.md`。预期入库后 standard +3。
