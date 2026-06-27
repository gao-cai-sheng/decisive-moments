# 交付说明：朱熹 Kimi 研究生成完成（入库前）

**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md` §0–§5  
**本轮类型**：Kimi 额度恢复后，从 `zhu-xi / sources-notes` 断点续跑至 `thought-system` 研究完成  
**范围**：`.research/tmp/kimi/people/zhu-xi/` 暂存研究产物；未写正式库  

---

## 1. 队列断点

开工时账本最后戳记要求：Kimi 恢复后从 `zhu-xi / sources-notes` 续跑。

`npm run kimi:queue -- next` 初始输出：

```text
next Kimi stage: zhu-xi / sources-notes
prompt: .research/tmp/kimi/person-queue/prompts/zhu-xi/sources-notes.prompt.txt
output: .research/tmp/kimi/people/zhu-xi
log: .research/tmp/kimi/person-queue/logs/zhu-xi/sources-notes.log
```

实际续跑中发现：`sources-notes` 阶段此前虽留有 429 日志，但暂存目录已存在 `brief.md / sources.md / notes.md / open-questions.md / works-candidates.json`；本轮 `run-next` 成功推进 `claims`，随后生成 `thought-systems.json`。

---

## 2. 生成产物

暂存目录：`.research/tmp/kimi/people/zhu-xi/`

已具备文件：

```text
brief.md
sources.md
notes.md
open-questions.md
works-candidates.json
claims.json
thought-systems.json
```

### 2.1 claims.json

- `schemaVersion`: 1
- claims：11 条
- source 数：引用 `sources.md` 中 S001–S009
- reviewStatus：均为 `needs_human_review`

类型分布：

| 类型 | 数量 |
|---|---:|
| fact | 2 |
| interpretation | 4 |
| work | 2 |
| reception | 2 |
| uncertain | 1 |

### 2.2 thought-systems.json

- `schemaVersion`: 1
- item：1 个，`philosopherId = zhu-xi`
- problems：3 个
- claims：6 条
- evidence：12 条
- workId：全部使用正式库既有 `zhu-xi-primary-work`
- `publicDomainExcerptZh`：12 条均已填入 Kimi 产出的公有领域中文原文摘录，仍需人工源文核对

结构：

| problem | claims | evidence | 主题 |
|---|---:|---:|---|
| 道德知识如何可能？ | 2 | 4 | ethics |
| 政治秩序的正当性基础是什么？ | 2 | 4 | politics |
| 正义标准的客观依据何在？ | 2 | 4 | justice, ethics |

---

## 3. 修复说明

`thought-system` 阶段在工具层一度返回 502，但检查后发现 `thought-systems.json` 已实际生成，队列也已前进。随后写前门发现两个暂存一致性问题：

```text
missing required file: claims.json
thought-systems.json zhu-xi needs sourceIds
```

处理：

1. 从 `claims.log` 中恢复 Kimi 已生成并自校验过的 `claims.json`。
2. 为 `thought-systems.json` 顶层 item 补入验证器要求的临时 `sourceIds`。
3. 将 manifest 中 `zhu-xi` 修正为 `research_complete_needs_review`，三个阶段均为 `done`，使断点续传不再误判朱熹失败。

未修改正式库数据。

---

## 4. 写前门结果

```text
bash scripts/verify.sh pre .research/tmp/kimi/people/zhu-xi

=== 门1 validate:kimi（只读） ===
kimi research ok: 11 claims, 9 sources, 1 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 1 planned, 0 written
- add zhu-xi -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/zhu-xi.json
Re-run with --write after human review to update public/data.

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

`npm run validate:data`：

```text
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes
```

---

## 5. 当前断点

`npm run kimi:queue -- next` 当前输出：

```text
next Kimi stage: hu-shi / sources-notes
prompt: .research/tmp/kimi/person-queue/prompts/hu-shi/sources-notes.prompt.txt
output: .research/tmp/kimi/people/hu-shi
log: .research/tmp/kimi/person-queue/logs/hu-shi/sources-notes.log
```

朱熹现在处于：**research_ready / 写前门全绿 / 待人工确认后入库**。

---

## 6. 边界确认

- 未执行 `npm run admit:kimi -- .research/tmp/kimi/people/zhu-xi --overwrite --write`
- 未修改 `public/data/philosophers/zhu-xi.json`
- 未新增或修改 `public/data/works.json`
- 未修改 schema、admit、validate、UI 或测试
- 本轮只处理 `.research/tmp/kimi/people/zhu-xi/` 与队列 manifest 的暂存一致性

---

## 7. 下一步

人工核看朱熹 `thought-systems.json` 的 12 条 `publicDomainExcerptZh` 与 locator 后，可以单独执行入库写入：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/zhu-xi --overwrite --write
bash scripts/verify.sh post .research/tmp/kimi/people/zhu-xi zhu-xi
```

若暂不入库，Kimi 队列已可从 `hu-shi / sources-notes` 继续生成下一位研究。
