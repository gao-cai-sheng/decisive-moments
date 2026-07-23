# Review verdict — P0-022

**审核方:** Claude（新上下文盲审，未参与生产）
**批次:** `2026-07-22-p0-batch-022`　**条目:** 20
**生产方:** Grok (xAI)，见 `notes.md` Producer 行

## 结论

| 维度 | 判定 |
|---|---|
| 翻译质量 | **PASS** |
| 可 admit | **16 / 20** |
| 阻塞（源数据债，非翻译问题） | **4** |

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

**keywordsZh 含数据管线内部标签，被忠实译出（4）**

- `susan-stebbing` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler
- `th-green` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler
- `thomas-nagel` — 身份层 → identity tier；二线哲人 → second-line figure
- `tyler-burge` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler

**oneLineZh 含编辑备注（选人理由/关联备注），被忠实译出（4）**

- `susan-stebbing` — 「可补女性分析哲学前史」
- `th-green` — 「可补伦理国家与积极自由线索」
- `thomas-nagel` — 「可补心灵与伦理接口」
- `tyler-burge` — 「可补普特南之后的心灵语言线索」

这些条目的英文若 admit，前端会显示 "identity tier"、"second-line figure"、"intellectual-history filler"、"fills X"、"identity-tier anchor" 等内容——对读者无意义；且「二线哲人 → second-line figure」是内部评级，公开显示不妥。

**处置建议：先修中文源，再重译这 4 条。** 本批其余 16 条可直接 admit。

## 信息损失（轻微，不阻塞）

- `sarmiento` — 源含「塑造 **19 世纪**拉美现代化论述」，EN 作 "framed Latin American modernization as civilization vs. barbarism"，未保留世纪限定。不影响正确性，可选修。
