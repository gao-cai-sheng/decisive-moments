# Delivery: Anti-template Audit Correction

时间：2026-07-02 10:03 CST

## 触发原因

对 commit `219a4d1` 与当前工作区复核后，确认旧门3只能识别结构性薄项，不能识别模板化灌水。`augustine` 到 `mill` 这批 20 位满足旧规则，却缺少实质内容。

## 已完成修正

### 1. 新增 RED 规则

在 `tools/quality-audit.mjs` 中新增：

- `template_claim`
- `template_evidence_summary`

命中模板 claim 或复述 locator 的 evidence summary 时，直接判为 RED。

### 2. 增加单测

在 `tools/quality-audit.test.mjs` 中新增两条测试：

- 模板化 claim 必须被抓到。
- 复述 locator/用于支撑命题的 evidence summary 必须被抓到。

测试结果：

```text
npx vitest run tools/quality-audit.test.mjs
✅ 28 passed
```

### 3. 复核当前全库

新规则下当前全库质量审计：

```text
108 位有 thoughtSystem
🟢 全绿 88
🔴 有RED 20
🟡 仅YELLOW 0
RED 360 条 {"template_claim":120,"template_evidence_summary":240}
```

## RED 队列

已新建：

```text
docs/research/backfill-template-red-queue.md
```

包含需重做的 20 位：

```text
augustine / boethius / anselm / aquinas / ockham
 Erasmus / machiavelli / montaigne / bacon / hobbes
 descartes / spinoza / locke / leibniz / hume
 rousseau / hegel / schopenhauer / kierkegaard / mill
```

## 文档同步

已同步：

- `docs/research/backfill-queue-standard-tier.md`
- `docs/research/LOOP-LEDGER.md`
- `docs/research/backfill-template-red-queue.md`

## 当前结论

旧口径的“108 全绿”已经作废。当前可信口径是：

```text
结构性薄项：已清零
模板灌水 RED：20 位
当前全库：88 绿 / 20 RED / 0 YELLOW
```

下一步应优先重做这 20 位，而不是继续新增 `watsuji`。
