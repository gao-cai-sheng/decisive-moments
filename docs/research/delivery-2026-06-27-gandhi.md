# 交付说明：gandhi / 甘地 thoughtSystem 入库

时间：2026-06-27 12:15 CST

## 1. 本轮背景

- RUNBOOK 队列起点：`gandhi / sources-notes`。
- 实跑 `npm run kimi:queue -- run-next` 后，Kimi 返回 `blocked_rate_limit`，未由 Kimi 生成暂存研究。
- 按 RUNBOOK §9/§13，ChatGPT 接手非 Kimi 待办：只写 `.research/tmp/kimi/people/gandhi/` 暂存研究，并走标准写前门、admit、写后门。

## 2. 暂存产物

目录：`.research/tmp/kimi/people/gandhi/`

- `brief.md`
- `sources.md`
- `notes.md`
- `open-questions.md`
- `works-candidates.json`
- `claims.json`
- `thought-systems.json`

来源：8 个来源；原典优先，现代研究只作语境校正。

## 3. 厚度对照

| 项 | 入库前 | 入库后 |
|---|---:|---:|
| 正式库 thoughtSystem | 0 | 1 |
| problems | 0 | 3 |
| claims | 0 | 6 |
| evidence | 0 | 12 |
| publicDomainExcerptZh | 0 | 0 |
| summary_only evidence | 0 | 12 |

## 4. 写前门实跑输出

命令：

```bash
bash scripts/verify.sh pre .research/tmp/kimi/people/gandhi
```

输出：

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 10 claims, 8 sources, 1 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 1 planned, 0 written
- add gandhi -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/gandhi.json
Re-run with --write after human review to update public/data.

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

## 5. 入库写入实跑输出

命令：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/gandhi --overwrite --write
```

输出：

```text
kimi thought-system admission written: 1 planned, 1 written
- add gandhi -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/gandhi.json
```

## 6. 写后门与质量审计实跑输出

命令：

```bash
bash scripts/verify.sh post .research/tmp/kimi/people/gandhi gandhi
node tools/quality-audit.mjs --data-dir public/data
npm run validate:data
npm test
```

输出摘要：

```text
=== 门3 validate:data（只读） ===
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

=== 门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库） ===
  gandhi ✅ 正式库 == admit 应生成（逐字节一致）

=== 结论 ===
✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过

内容质量审计：21 位有 thoughtSystem
  🟢 全绿 21 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 无 RED

data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

Test Files  15 passed (15)
Tests  81 passed (81)
```

## 7. 边界确认

- 未修改 `public/data/works.json`；正式库仍只有 `gandhi-primary-work`，候选作品只写入 `works-candidates.json`。
- 未写正式 `relationships.json`。
- 未改 schema、工具脚本或前端 UI。
- 未填逐字中文公有领域摘录；12 条 evidence 全部 `summary_only`，避免未核译文入库。
- 队列 manifest 已手工推进：`gandhi` 三阶段标记为 done，下一队列为 `ambedkar / sources-notes`。

## 8. 下一个断点

```text
next Kimi stage: ambedkar / sources-notes
prompt: .research/tmp/kimi/person-queue/prompts/ambedkar/sources-notes.prompt.txt
output: .research/tmp/kimi/people/ambedkar
log: .research/tmp/kimi/person-queue/logs/ambedkar/sources-notes.log
```
