# Delivery: Template RED Batch 1

日期：2026-07-02

## 范围

本轮按批准后的新方案处理模板灌水 RED 队列第一批 3 位：

- `augustine`
- `boethius`
- `anselm`

## 前置修复

- 已将 `public/data/philosophers/augustine.json` 回退到提交基线，修复先前 targeted edit 造成的局部错位。
- 回退后运行 `node tools/validate-data.mjs`，结果通过。
- 已将 placeholder workId 债与 `laozi` / `zhuangzi` 摘录债写入 `docs/research/backfill-template-red-queue.md`。

## 本批方式

- 不再直接 targeted edit 正式库。
- 先写暂存目录：`.research/tmp/kimi/2026-07-02-template-red-batch1/`
- 暂存 batch 保持每位 `3 problems / 6 claims / 12 evidence`。
- evidence locator 暂时沿用现有 `*-primary-work`，但 summaryZh 改为真实内容概括，不复述 locator。

## 已完成门禁

```text
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-02-template-red-batch1
✅ kimi research ok: 3 claims, 3 sources, 3 thought systems, 0 timeline items
```

```text
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-template-red-batch1 --overwrite
✅ dry-run: 3 planned, 0 written
```

```text
manual batch checks
✅ items=3
✅ claims=18
✅ evidence=36
✅ short summaries=0
✅ thin evidence=0
✅ weight uniform=0
```

```text
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-template-red-batch1 --overwrite --write
✅ 3 planned / 3 written
```

```text
node tools/validate-data.mjs
✅ data ok
```

```text
npm run build
✅ build ok
```

## 未完成 / 注意

- `node ./tools/quality-audit.mjs --data-dir ./public/data` 本轮被平台安全层拦截，未取得新的全库 RED 统计。
- 因此本文档不声称 RED 已从 20 降到 17；只能确认本批已按 batch 写入并通过结构校验与构建。
- 下一轮应优先恢复 full quality-audit 输出，或用更小的审计入口确认 `augustine / boethius / anselm` 已不再命中反模板 RED。

## 下一步

继续第二批前，应先确认 full audit 或等价局部 audit 可运行；然后再处理：

- `aquinas`
- `ockham`
- `erasmus`
- `machiavelli`
- `montaigne`
