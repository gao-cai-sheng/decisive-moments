# Review verdict — P0-017

**审核方:** Claude（新上下文盲审，未参与生产）
**批次:** `2026-07-22-p0-batch-017`　**条目:** 20
**生产方:** Grok (xAI)，见 `notes.md` Producer 行

## 结论

| 维度 | 判定 |
|---|---|
| 翻译质量 | **PASS** |
| 可 admit | **11 / 20** |
| 阻塞（源数据债，非翻译问题） | **9** |

## 机械门（本批 100% 覆盖，非抽样）

- [x] `items` id 集合与 `brief.md` 精确一致——无跳过、无多余、无错拼
- [x] 每个 id 存在于 `philosophers.index.json`，且原本无 En 值（无重复覆盖）
- [x] `keywordsEn` 与源 `keywordsZh` 等长同序，元素非空
- [x] `oneLineEn` 非空且 ≤120 字符
- [x] 无 `TODO`/`TBD`/占位符，无 CJK 字符残留
- [x] 无越界字段（仅 `oneLineEn`/`keywordsEn`）
- [x] `notes.md` 顶部 Producer 行就位
- [x] `glossary.json` 相对上一批 append-only，无冲突重定义

跨全部 14 批统计：**598 个跨条目共享术语，实际译法分歧 0 组**；`oneLineEn` 开头/结尾三词无模板化聚集。

## 内容审（本批 100% 逐条核读 zh/en 对照）

翻译质量高。专名依学界通行形式且与 `names.en` 一致，变音符号完整（如 `Vākyapadīya`、`Ḥanbalī`、`Śāntarakṣita`、`Muʿtazilī`）；书名用通行英译或罗马化+直译括注；音译术语首见有括注（`gewu`、`shu`、`shi`、`hwajaeng`、`iki`、`mono no aware`）。未见编造引文、编造章节号或源文没有的史实断言。断代不确处忠实保留限定（如 `dhammapala` 的 "ca. 6th–7th c., uncertain"）。源 `oneLineZh` 末尾的 `★升档候选` 编辑标记被正确丢弃而非译出。

## 阻塞项 — 源数据（中文）债务，翻译方无责

**keywordsZh 含数据管线内部标签，被忠实译出（8）**

- `jean-luc-nancy` — 身份层 → identity tier；思想史补线 → intellectual-history filler
- `jjc-smart` — 身份层 → identity tier；二线哲人 → second-line figure
- `jl-austin` — 身份层 → identity tier；二线哲人 → second-line figure
- `john-mcdowell` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler
- `jose-ortega-y-gasset` — 身份层 → identity tier；二线哲人 → second-line figure
- `josiah-royce` — 身份层 → identity tier
- `judith-jarvis-thomson` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler
- `judith-shklar` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler

**oneLineZh 含编辑备注（选人理由/关联备注），被忠实译出（8）**

- `jean-luc-nancy` — 「接 derrida」
- `jjc-smart` — 「可补澳大利亚分析哲学」
- `jl-austin` — 「可补语言哲学从意义到行动的转向」
- `john-mcdowell` — 「可补分析哲学与黑格尔传统接口」
- `jose-ortega-y-gasset` — 「可补西班牙现代哲学」
- `josiah-royce` — 「可补实用主义同代对手盘」
- `judith-jarvis-thomson` — 「可补应用伦理学核心案例线」
- `judith-shklar` — 「可补战后自由主义内部批判」

**oneLineZh 正文含内部术语「身份层锚点」（1）**

- `kanada` — EN 作 "identity-tier anchor"

这些条目的英文若 admit，前端会显示 "identity tier"、"second-line figure"、"intellectual-history filler"、"fills X"、"identity-tier anchor" 等内容——对读者无意义；且「二线哲人 → second-line figure」是内部评级，公开显示不妥。

**处置建议：先修中文源，再重译这 9 条。** 本批其余 11 条可直接 admit。
