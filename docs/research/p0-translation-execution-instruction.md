# P0 翻译执行指令（oneLineEn / keywordsEn）— 2026-07-22

给**执行方 AI**（工具名由维护者指定，可换厂牌）的可移植指令。读完即可执行，无需回溯对话。
分工：**你产翻译，Claude 盲审，维护者 admit**。规范母文档以 `docs/i18n-content-translation-spec.md` 为准，本文是其在 P0 翻译线上的执行落地。

## 你的角色与边界

- **只做 P0 字段**：为指定 id 填 `oneLineEn` 与 `keywordsEn`。不碰 P1–P4。
- **不自选范围**：范围由各批 `brief.md`（Claude 侧范围契约）锁定，只填充。
- **禁改源**：不改任何 Zh 字段、`id`、结构——交付是**纯增量 patch**。
- **禁碰 `public/data/`**：产出只写各批 tmp 目录；不 admit、不 `--write`、不 commit/push。
- 产完停车，交回 Claude 盲审。

## 本轮批次

| 批 | 目录 | 人数 | 术语基线 |
|---|---|---|---|
| P0-024 | `docs/research/tmp/translation/2026-07-23-p0-batch-024/` | 30 | 023 glossary |
| P0-025 | `docs/research/tmp/translation/2026-07-23-p0-batch-025/` | 30 | 024 glossary |
| P0-026 | `docs/research/tmp/translation/2026-07-23-p0-batch-026/` | 29 | 025 glossary |

每批 `brief.md` 已就位，列出该批 id、`names.en`、源 `oneLineZh`、源 `keywordsZh`。
**source of truth 是现库 `public/data/philosophers.index.json` 的实际值**，brief 表格仅为便读镜像；有出入以 index 为准。

### 本轮是重译批 —— 必读

这 89 位在 010–023 批里已经翻译过一遍，盲审 PASS，但**没有被 admit**。原因不在你的译文，而在当时的中文源：

- `keywordsZh` 里混着数据管线的内部标签 `身份层` / `二线哲人` / `思想史补线`，它们夹在「政治」「伦理」这类真关键词中间，看不出是标签；
- `oneLineZh` 里带着选人时的编辑备注 `可补 X` / `接 xxx` / `身份层锚点`，以及尾注 `★升档候选`。

忠实翻译这些内容，得到的是 `identity tier`、`second-line figure`、`intellectual-history filler`、`fills contemporary philosophy of religion`、`identity-tier anchor`——对读者毫无意义。其中「二线哲人 → second-line figure」是内部评级，公开显示等于当面贬低该哲学家。（顺带一提：当时你**正确地丢弃了** `★升档候选` 尾注而没有译出，那个判断是对的。）

**中文源已在 `23deb9b` 全部修正**：内部标签换成了各人真实的关键词（有 20 位三个关键词全是标签，已按其自身内容重写），`oneLineZh` 改写为陈述其思想贡献而非入库理由。

对你的要求：

1. **旧译文一律作废。** 不要参考 `2026-07-22-p0-batch-0*/patch.philosophers.json` 里这些 id 的内容——那是对旧中文的翻译，与新中文逐字对不上。
2. **以各批 brief 表格中的中文为准**，它就是现库 index 的实际值。
3. 这批以欧陆与英美现当代哲学家为主，专名与术语大多有成熟的学界英文形式（`habitus` / `field` / `cultural capital`、`the normal and the pathological`、`descriptive metaphysics`、`speech act`、`mimetic desire`）。**直接用通行译法，不要从中文回译。**
4. 关键词现在是真实概念而非标签，`keywordsEn` 要译出概念本身，不要笼统化——「认识论障碍」应作 `epistemological obstacle`，不可写成 `epistemology`。
5. 上一轮全部 284 条里只有一处实质越界：`raymond-aron` 的「接 weber/sartre」被译成 "after Weber and **against** Sartre"，对立判断是源文没有的。本轮该条中文已改为「与萨特长期论争」，可以照译；但**原则不变——不要补充源文没有的判断**，哪怕它是史实。

## 每批交付物（写进该批目录）

```
patch.philosophers.json   # { "schemaVersion": 1, "items": { "<id>": { "oneLineEn": "...", "keywordsEn": ["...", ...] } } }
glossary.json             # { "terms": { "<zh 术语>": "<en 选择>", ... } }
notes.md                  # 顶部 Producer 行 + 拿不准的译名/术语候选与理由
```

`patch.philosophers.json` 形态照 batch-001 的实产（`schemaVersion:1` + `items` 映射）。示例：

```json
{
  "schemaVersion": 1,
  "items": {
    "basil-the-great": {
      "oneLineEn": "…",
      "keywordsEn": ["…", "…", "…", "…"]
    }
  }
}
```

`notes.md` 顶部必须有一行 provenance：

```
**Producer:** <tool> (<vendor>) — translation content.
```

## 硬性规则（Claude 盲审 + validate 会拒违反项）

1. **填了必须非空**：空串/空数组会被 `npm run validate:data` 拒绝；不确定就整条别填（En 缺失前端回退显示 Zh）。
2. **`keywordsEn` 与源 `keywordsZh` 等长、同序**——一一对应，顺序不得打乱。这是最易翻车项。
3. **`oneLineEn` ≤ 120 字符**（按字符数，非单词数），一句话，清晰学术散文，不逐字直译中文句式。
4. **专名**用学界通行英文名，且与现库 `names.en` 一致（以 `names.en` 为准绳）。
5. **书名/篇名**用通行英译（如 Republic、Analects）；无通行英译的用学界罗马化 + 直译括注（如 `Cleansing the Way (Visuddhimagga)`）。
6. **术语一致**：同一术语全批统一译法；音译专名首见可加括注（如 `ren (humaneness)`、`li (principle)`）。
7. **禁占位**：不得出现 "TODO"、"TBD"、机翻残留符号。**内容正确性 > 通过校验**：宁可整条留空，不可编造。

## Glossary 纪律（跨批链式）

- 起点是**上一批** `glossary.json`（见上表；缺则回退 `../2026-07-22-p0-batch-001/glossary.seed.json`）。
- **已定术语必须沿用**，不得在本批改译（append-only，跨批零冲突重定义）。
- 本批新术语追加进本批 `glossary.json`，并在 `notes.md` 说明取舍。

## 交回前自检（务必自跑一遍）

对每批：
- [ ] `items` 的 id 集合与 `brief.md` **精确一致**：无跳过、无多余、无错拼。
- [ ] 每个 id 都在 `philosophers.index.json` 中存在。
- [ ] 每个 `keywordsEn` 长度 == 源 `keywordsZh` 长度，元素非空。
- [ ] 每个 `oneLineEn` 非空且 ≤120 字符。
- [ ] `glossary.json` 相对上一批只增不改（无冲突重定义）。
- [ ] `notes.md` 顶部有 `**Producer:**` 行。

**最危险错误：En 内容对应错 id。** 交回前逐条核对 id ↔ 译文对齐。

## 交回后（Claude 侧，非你职责）

Claude 新上下文盲审：抽样 ≥20% 核对专名/术语一致性/无漏译错位/公版引文合规 → `review-verdict.md`（PASS/REWORK）→ rework 循环至 PASS → 维护者 admit 进 `public/data`。

## 范围溯源（可复算）

024–026 = 010–023 轮中因中文源含内部标记而**挂起未 admit** 的 89 位，即「在 010–023 各批 `patch.philosophers.json` 中出现、但 index 至今无 `oneLineEn`/`keywordsEn`」者。中文已修正，故整体重译。排序仍按 `tier(standard→seed) → influenceWeight 降序 → id 升序`，切成 30/30/29 三批（前几轮为 20/批，本轮因是重译且术语集中而放宽）。

历史：001–009 共 166 位、010–023 中通过的 195 位，已 admit 进 index（合计 361/542）。另有约 92 位 `oneLineZh` 仍为占位模板，属中文内容债，**不在 P0 范围**，需先补中文。
