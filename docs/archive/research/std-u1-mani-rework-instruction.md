# Codex 返工指令 — Mani(U1 拆分后单独批)

盲审 REJECT(`.research/tmp/kimi/2026-07-05-std-u1-persian/review-verdict.md`):Mani 多条 evidence 的 locator 是**元数据/传承说明**(题名传统、献呈说明、canonical-status、跨语料传承),不是文本位置。zoroaster 已过、单独入库;Mani 返工后另起盲审。

**口径决定(已拍板,不放宽)**:维持「原典到章节/段」硬门。够不到具体文本位置的 evidence 一律**砍**,不许用元数据凑数;砍到 problems=3 / 每 problem claims≥2 / 每 claim evidence≥2 的下限即可,Mani 偏薄可接受。

## 批次
新建 `.research/tmp/kimi/2026-07-05-std-u1b-mani/`,只含 mani 的 `proposed-philosophers.json`(tier=standard,保留 seed 身份层,summaryZh≥40)+ `thought-systems.json` + `proposed-works.json`(如需)。禁碰 public/data,禁 admit/commit。

## 逐条处置现有 12 条 evidence

**保留并磨精(把 locator 落到具体见证位置)**：
- `005 / 006` —— al-Bīrūnī 对《沙卜拉干》的具名引用(先知谱系 / 巴比伦最终启示)。**这两条最强**,locator 明确到 al-Bīrūnī《遗迹之书》(al-Āthār al-bāqiya)引摩尼那一段的具体位置。
- `001 / 004 / 010` —— 《生命福音》开篇段(光明世界 / 光暗边界 / 救赎本源)。locator 落到「由吐鲁番残片复原的开篇段」并注明所据校本/残片,而非泛指。
- `003 / 009` —— 《沙卜拉干》末世审判段。落到 MacKenzie《Mani's Šābuhragān》(BSOAS 1979/1980)所编中古波斯语残片的具体 M-编号 + 行/节;**编号必须真实可查,查不到就退回具名见证或砍掉**。

**直接砍(纯元数据,不可救)**：
- `002` 题名传统「Two Principles / dedicated to Šābuhr」notice
- `007` canonical-status notice and fragment transmission
- `011` dedication/presentation notice to Šābuhr I
- `012` fragment transmission in Cologne/Turfan/Coptic materials

**`008`**（《生命福音》22 节之说）：这是 Ibn al-Nadim《书目》(Fihrist)的记述——若要留,locator 落到 Fihrist 记摩尼著述那一段(具名见证的具体位置),否则砍。

## 合法「精确位置」的三种形态(照此,别越界)
1. 具名古典见证的具体段落:al-Bīrūnī《遗迹》某处、Ibn al-Nadim《书目》某段、科隆摩尼古卷(CMC)某页——见证逐字转述该作内容处。
2. 已刊残片的编号 + 行/节:如 MacKenzie 校《沙卜拉干》的 M-编号(须真实可查)。
3. 作品可辨识的编号/命名段落 + 可复原内容:如《生命福音》开篇段。

**铁律**:内容正确性 > 通过校验。`excerptStatus` 仍为 `summary_only`(摩尼教文本无逐字公有领域中译);**严禁为凑精度编造引文或 M-编号**。核不实就退回具名见证,再不行就砍该 evidence、重构到下限结构。

## 其他
- 反模板:上一版两人 6 个 problem 权重清一色 `3,2`——本次让 claim 权重跨 problem 有真实区分。
- 完成即停,交**新上下文**按 `std-u1-persian-review-instruction.md` 同一硬门重审,结论写新批次的 `review-verdict.md`。
