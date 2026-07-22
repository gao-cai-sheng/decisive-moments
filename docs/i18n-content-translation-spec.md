# 内容层英译规范（codex 流水线用）— 2026-07-22

分工：**codex 产翻译，Claude 盲审，维护者 admit**。本文是内容规范与交付契约；UI 层 i18n 已完成（`src/i18n/`），schema 已 En-ready（`src/data/schemas.ts`），前端 fallback 已接好（En 缺失显示 Zh），翻译可以按批渐进落地，任何一批合入后立即在 en locale 下生效。

## 1. 范围与优先级

按展示价值排序，逐批推进（**不要求一次全量**）：

| 优先级 | 数据 | 字段（Zh → En） | 量级 |
|---|---|---|---|
| P0 | `philosophers.index.json` | `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn` | 542 条 |
| P1 | `philosophers/{id}.json`（standard 档优先） | `summaryZh → summaryEn`；thoughtSystem 全树：problem `titleEn/questionEn/summaryEn`、claim `titleEn/claimEn/explanationEn`、evidence `titleEn/summaryEn` | standard ~204 |
| P2 | `arguments.index.json` | `questionEn/claimEn/explanationEn/keywordsEn` | 全量 |
| P3 | `relationships.json` | `noteEn` | ~全量 |
| P4 | `works.json` / `themes.json` / sourceNotes | `titleEn`（补缺）/`noteEn`；`aliasesEn`；sourceNote `noteEn` | 补齐 |

`names.en` 已全量存在，不在本次范围。`life.display` 暂不翻（格式化字符串，后续单独处理）。

## 2. 硬性规则（validate 会拒绝违反项）

1. **En 字段可缺失，但填了必须非空**（空串/空数组直接被 `npm run validate:data` 拒绝）。
2. 不得改动任何既有 Zh 字段、id、结构字段——翻译批次是**纯增量 patch**。
3. `excerptStatus` 为 `public_domain` 的引文，`publicDomainExcerptEn` 只能用**公版英译**（注明译本，如 Jowett 译《理想国》）；找不到公版英译就不填，**禁止自译逐字引文**。`summary_only` 的证据不填 excerpt。
4. 占位内容禁止：不得出现 "TODO"、"TBD"、机翻残留符号。

## 3. 翻译质量规范

- **专名**：用学界通行英文名（Zhu Xi 不是 Zhuxi；Ibn Sina 用 Avicenna 需与 `names.en` 一致——以现库 `names.en` 为准绳）。
- **书名**：用通行英译名（Republic、Analects）；无通行英译的用学界罗马化 + 直译括注。
- **术语**：同一批次内术语一致（理 = principle/pattern 二选一后全批统一；仁 = humaneness/benevolence 统一）。每批交付需附 `glossary.json`（本批术语 → 英译选择），跨批沿用已有 glossary。
- **文风**：面向普通读者的清晰学术散文；不逐字直译中文句式；长度与 Zh 源大致相当（summary 类 ±40%）。
- **oneLineEn**：一句话、不超过 ~120 字符。

## 4. 交付格式

每批一个目录：`docs/research/tmp/translation/<YYYY-MM-DD>-<batch-name>/`

```
brief.md                  # 本批范围（哪些 id、哪些字段）
glossary.json             # 本批术语表 {"理": "principle", ...}
patch.philosophers.json   # { "<id>": { "oneLineEn": "...", "summaryEn": "...", "thoughtSystem": {...仅 id + En 字段的镜像结构...} } }
patch.arguments.json      # { "<argument-id>": { "questionEn": "..." } }（按需）
patch.relationships.json  # 同上（按需）
notes.md                  # 拿不准的译名/术语，列出候选与理由
```

patch 采用 **id → 增量字段** 映射；thoughtSystem 内部按 problem/claim/evidence 的 id 定位（镜像结构只含 id + En 字段）。合并脚本由 Claude 侧提供（admit 工具链扩展，沿用 `tools/admit-kimi-*` 模式）。

## 5. 审核门

1. 机器门：合并到工作副本后 `npm run validate:data` + `npm test` 全绿。
2. 盲审门：Claude 按批抽样 ≥20%（P1 的 thoughtSystem 批次抽样 ≥30%），核对：专名正确性、术语一致性（对 glossary）、无漏译/错位（**En 内容对应错 id 是最危险错误**）、引文公版合规。
3. verdict 写入批次目录 `review-verdict.md`（沿用现有格式：pass / rework + 逐条问题）。
4. rework 循环直至 pass，才 admit 进 `public/data`。

## 6. 批次建议

- P0 一批 60–80 条；P1 每批 15–25 位（thoughtSystem 树大）；P2/P3 每批 ~100 条。
- 每批 brief.md 由 Claude 侧出（指定 id 清单 + 沿用 glossary），codex 只做填充，不自选范围。
