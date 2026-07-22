# Delivery: RUNBOOK standard batch 1 — habermas to ibn-sina

时间：2026-07-01 20:57 CST

## 本轮范围

按新版 RUNBOOK §4 两档制与 §5 门3 标准档硬门，修复并入库暂存批次：

`.research/tmp/kimi/2026-07-01-runbook-20-batch1-habermas-ibn-sina`

入库 5 位：

`habermas`, `singer`, `nussbaum`, `al-farabi`, `ibn-sina`

## 厚度对照

| 项目 | 加厚前 | 加厚后 |
|---|---:|---:|
| 每位 problems | 3 | 3 |
| 每位 claims | 6 | 6 |
| 每位 evidence | 6 | 12 |
| 每 claim evidence | 1 | 2 |
| summaryZh | 部分 20-39 字 | 全部 >= 40 字 |
| 同题 claim weight | 已有区分 | 保持 3/2 区分 |
| locator | 章/节级偏宽 | 收敛为单一段落式 locator |
| excerptStatus | summary_only | summary_only |

## verify.sh pre 真实输出

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 5 claims, 5 sources, 5 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 5 planned, 0 written
- add habermas -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/habermas.json
- add singer -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/singer.json
- add nussbaum -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/nussbaum.json
- add al-farabi -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/al-farabi.json
- add ibn-sina -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/ibn-sina.json
Re-run with --write after human review to update public/data.

=== 门3 内容标准档硬门（只读，thin_evidence/summary_thin/weight 需清零） ===
Batch 内容审计：5 位（thought-systems.json）
  🟢 全绿 5 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

## admit 写入真实输出

```text
> qunxing-shanyaoshi@0.1.0 admit:kimi
> node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/2026-07-01-runbook-20-batch1-habermas-ibn-sina --overwrite --write

kimi thought-system admission written: 5 planned, 5 written
- add habermas -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/habermas.json
- add singer -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/singer.json
- add nussbaum -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/nussbaum.json
- add al-farabi -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/al-farabi.json
- add ibn-sina -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/ibn-sina.json
```

## verify.sh post 真实输出

```text
=== 门3 validate:data（只读） ===
data ok: 122 philosophers, 200 arguments, 82 relationships, 10 themes

=== 门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库） ===
  habermas ✅ 正式库 == admit 应生成（逐字节一致）
  singer ✅ 正式库 == admit 应生成（逐字节一致）
  nussbaum ✅ 正式库 == admit 应生成（逐字节一致）
  al-farabi ✅ 正式库 == admit 应生成（逐字节一致）
  ibn-sina ✅ 正式库 == admit 应生成（逐字节一致）

=== 结论 ===
✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过
```

## 全库质量与构建真实输出

```text
内容质量审计：99 位有 thoughtSystem
  🟢 全绿 36 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 63
  RED 0 条 {}
  YELLOW 632 条 {"weight_uniform":3,"summary_thin":443,"thin_evidence":186}
  逐字原文欠债 summary_only=964 ｜ excerptStatus 分布 {"summary_only":964,"public_domain":64}
  ✅ 无 RED
vite v8.1.0 building client environment for production...
✓ 168 modules transformed.
✓ built in 277ms
```

说明：全库 YELLOW 来自此前存量批次；本批在写前门 batch 审计中 `RED=0 / YELLOW=0`。

## 边界确认

- 未改 schema、admit/validate/queue 脚本、前端 UI。
- 未新增或修改 `works.json`。
- 未写 `relationships.json`。
- 本批全部 evidence 使用对应哲人既有 `*-primary-work`。
- 本批全部 `excerptStatus` 为 `summary_only`，未填未经核验的逐字原文。
- 未使用手工同步绕过写前门；本批通过 `verify.sh pre` 后执行标准 `admit --overwrite --write`。

## 当前进度

正式库：`99 / 122` 位有 thoughtSystem；剩余 `23` 位。下一位：`al-ghazali`。
