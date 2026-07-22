# delivery-2026-06-27-adi-shankara

## 范围

- 哲人：`adi-shankara` / 商羯罗
- 触发：`npm run kimi:queue -- run-next` 在 `adi-shankara / sources-notes` 阶段返回 Kimi usage limit / 403；按 RUNBOOK §9 先记账，再由 ChatGPT 接手暂存研究与入库。
- 正式库写入：`public/data/philosophers/adi-shankara.json` 新增 `thoughtSystem`。
- 暂存目录：`.research/tmp/kimi/people/adi-shankara/`

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

1. `adi-shankara:problem:001`：梵我同一如何可能？
2. `adi-shankara:problem:002`：无明与叠置如何生成经验世界？
3. `adi-shankara:problem:003`：为什么解脱依赖知识而不是行动？

所有 problem 均达到 RUNBOOK §4：每个 problem 至少 2 claims、每个 problem evidence 合计至少 2、claim weight 有 3/2 区分、evidence summaryZh 均超过 20 字。

## 写前门真实输出

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 11 claims, 8 sources, 1 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 1 planned, 0 written
- add adi-shankara -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/adi-shankara.json
Re-run with --write after human review to update public/data.

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

## 写入真实输出

```text
> qunxing-shanyaoshi@0.1.0 admit:kimi
> node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/people/adi-shankara --overwrite --write

kimi thought-system admission written: 1 planned, 1 written
- add adi-shankara -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/adi-shankara.json
```

## 写后门 / 质量 / 测试真实输出

```text
=== 门3 validate:data（只读） ===
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

=== 门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库） ===
  adi-shankara ✅ 正式库 == admit 应生成（逐字节一致）

=== 结论 ===
✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过
内容质量审计：18 位有 thoughtSystem
  🟢 全绿 18 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
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
- evidence 的 `workId` 均为正式库已有且同属该哲人的 `adi-shankara-primary-work`。
- 已更新 `.research/tmp/kimi/person-queue/manifest.json`，使下一个队列推进到 `ramanuja / sources-notes`。

## 下一步

- `npm run kimi:queue -- next` 当前指向：`ramanuja / sources-notes`。
- 若 Kimi 仍限额，可继续按 RUNBOOK §9/§13 由 ChatGPT 接手。
