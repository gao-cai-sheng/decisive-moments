# delivery-2026-06-27-ramanuja

## 范围

- 哲人：`ramanuja` / 罗摩奴阇
- 触发：`npm run kimi:queue -- run-next` 在 `ramanuja / sources-notes` 阶段返回 Kimi usage limit / 403；按 RUNBOOK §9 先记账，再由 ChatGPT 接手暂存研究与入库。
- 正式库写入：`public/data/philosophers/ramanuja.json` 新增 `thoughtSystem`。
- 暂存目录：`.research/tmp/kimi/people/ramanuja/`

## 改前 / 改后厚度

| 项 | 改前 | 改后 |
|---|---:|---:|
| thoughtSystem | 无 | 有 |
| problems | 0 | 3 |
| claims | 0 | 6 |
| evidence | 0 | 12 |
| sources | 0 | 8 |
| claims.json items | 0 | 11 |

## 内容结构

1. `ramanuja:problem:001`：最高真实能否既统一又有属性？
2. `ramanuja:problem:002`：灵魂与世界如何真实而依附于神？
3. `ramanuja:problem:003`：解脱为何需要虔信与皈依？

所有 problem 均达到 RUNBOOK §4：每个 problem 至少 2 claims、每个 problem evidence 合计至少 2、claim weight 有 3/2 区分、evidence summaryZh 均超过 20 字。

## 写前门真实输出

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 11 claims, 8 sources, 1 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 1 planned, 0 written
- add ramanuja -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/ramanuja.json
Re-run with --write after human review to update public/data.

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

## 写入真实输出

```text
> qunxing-shanyaoshi@0.1.0 admit:kimi
> node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/people/ramanuja --overwrite --write

kimi thought-system admission written: 1 planned, 1 written
- add ramanuja -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/ramanuja.json
```

## 写后门 / 质量 / 测试真实输出

```text
=== 门3 validate:data（只读） ===
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

=== 门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库） ===
  ramanuja ✅ 正式库 == admit 应生成（逐字节一致）

=== 结论 ===
✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过
内容质量审计：19 位有 thoughtSystem
  🟢 全绿 19 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 无 RED

Test Files  15 passed (15)
Tests       81 passed (81)
```

## 摘录状态

- `publicDomainExcerptZh`: 0 条。
- `excerptStatus: summary_only`: 12 条。
- 原因：本轮未核定可逐字录入的中文公有领域译文；为避免误填现代译文或二次翻译，全部保留摘要型证据。

## 边界确认

- 未修改 `public/data/works.json`；具体作品只写入 `works-candidates.json`，待人工审核。
- 未修改 schema、admit/validate 脚本、前端 UI、正式 relationships。
- evidence 的 `workId` 均为正式库已有且同属该哲人的 `ramanuja-primary-work`。
- 已更新 `.research/tmp/kimi/person-queue/manifest.json`，使下一个队列推进到 `tagore / sources-notes`。

## 下一步

- `npm run kimi:queue -- next` 当前指向：`tagore / sources-notes`。
- 若 Kimi 仍限额，可继续按 RUNBOOK §9/§13 由 ChatGPT 接手。
