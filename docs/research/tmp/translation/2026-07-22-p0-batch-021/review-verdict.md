# Review verdict — P0-021

**审核方:** Claude（新上下文盲审，未参与生产）
**批次:** `2026-07-22-p0-batch-021`　**条目:** 20
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

**keywordsZh 含数据管线内部标签，被忠实译出（9）**

- `poincare` — 身份层 → identity tier；思想史补线 → intellectual-history filler
- `ranciere` — 身份层 → identity tier；思想史补线 → intellectual-history filler
- `raymond-aron` — 身份层 → identity tier；思想史补线 → intellectual-history filler
- `rene-girard` — 身份层 → identity tier；思想史补线 → intellectual-history filler
- `rg-collingwood` — 身份层 → identity tier；二线哲人 → second-line figure
- `richard-swinburne` — 身份层 → identity tier
- `rm-hare` — 身份层 → identity tier；二线哲人 → second-line figure；思想史补线 → intellectual-history filler
- `robert-brandom` — 身份层 → identity tier；二线哲人 → second-line figure
- `ruth-barcan-marcus` — 身份层 → identity tier；二线哲人 → second-line figure

**oneLineZh 含编辑备注（选人理由/关联备注），被忠实译出（7）**

- `ranciere` — 「接 althusser」
- `raymond-aron` — 「接 weber/sartre」
- `rg-collingwood` — 「可补英美历史认识论」
- `richard-swinburne` — 「可补英美自然神学当代线索」
- `rm-hare` — 「可补元伦理学与应用伦理学过渡」
- `robert-brandom` — 「可补塞拉斯之后的匹兹堡学派」
- `ruth-barcan-marcus` — 「可补克里普克之前的模态语义背景」

**源 keywordsZh 自身重复，导致 keywordsEn 出现同值（1）**

- `richard-swinburne` — keywordsZh 重复「宗教哲学」

这些条目的英文若 admit，前端会显示 "identity tier"、"second-line figure"、"intellectual-history filler"、"fills X"、"identity-tier anchor" 等内容——对读者无意义；且「二线哲人 → second-line figure」是内部评级，公开显示不妥。

**处置建议：先修中文源，再重译这 9 条。** 本批其余 11 条可直接 admit。

## 翻译方需修正项（本批 1 条）

- `raymond-aron` — 源 `oneLineZh` 作「自由主义政治哲学与历史哲学，接 weber/sartre」，EN 作 "Liberal political philosophy and philosophy of history; **after Weber and against Sartre**"。源文只说「接」（承接/关联），未含对立判断。阿隆与萨特的论争虽是史实，但该判断由译者添加而非源文所有，违反「禁改源、纯增量」边界。**建议改为** "after Weber and Sartre"。这是全部 284 条中唯一一处实质性内容添加。

## 信息损失（轻微，不阻塞）

- `risieri-frondizi` — 源含「进入 **20 世纪**拉美学院哲学谱系」，EN 未保留世纪限定。不影响正确性，可选修。
