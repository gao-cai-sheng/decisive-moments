# Delivery: Standard Tier Rescue for Batch3–5

日期：2026-07-02

## 背景

外部报告 §八指出：模板 RED 第 3–5 批虽清除了 RED，但 11 位仍为 YELLOW，且对应 batch 文件在 `--require-standard` 下未通过。问题不是内容失实，而是标准档硬门被静默降级为“无 RED”。

本次按报告处置意见执行 T2 式补救，不重做思想系统：

- 加厚 `summaryZh` 到标准档目标。
- 修正同一 problem 内 claim 权重全同的问题。
- 同步修正原 Batch3/4/5 暂存文件。
- 重新以 `--require-standard` 作为硬门入库。

## 范围

11 位：

- `descartes`
- `hegel`
- `hobbes`
- `hume`
- `kierkegaard`
- `leibniz`
- `locke`
- `mill`
- `rousseau`
- `schopenhauer`
- `spinoza`

## 执行方式

修正原暂存批次：

```text
.research/tmp/kimi/2026-07-02-template-red-batch3/thought-systems.json
.research/tmp/kimi/2026-07-02-template-red-batch4/thought-systems.json
.research/tmp/kimi/2026-07-02-template-red-batch5/thought-systems.json
```

正式库写入仍走 admit 管线：

```text
validate:kimi -> quality-audit --batch --require-standard -> admit dry-run -> admit --write
```

## 实跑结果

```text
VALIDATE_B3:0
REQUIRE_STANDARD_B3:0
VALIDATE_B4:0
REQUIRE_STANDARD_B4:0
VALIDATE_B5:0
REQUIRE_STANDARD_B5:0
```

```text
ADMIT_DRY_B3:0
ADMIT_DRY_B4:0
ADMIT_DRY_B5:0
```

```text
ADMIT_WRITE_B3:0
ADMIT_WRITE_B4:0
ADMIT_WRITE_B5:0
```

正式库复核：

```text
VALIDATE_DATA:0
FULL_REQUIRE_STANDARD:0
BUILD:0
```

全量审计摘要：

```text
内容质量审计：108 位有 thoughtSystem
🟢 全绿 108 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
RED 0 ｜ 🟡 仅YELLOW 0
YELLOW 0
```

11 位局部复核：

```text
thin_lt40=0 uniform=0 evidence=132
```

## 纪律纠偏

本次确认并记录：

- 标准档放行标准是 `--require-standard`，不是“无 RED”。
- 被安全层拦截时，应停车记 `blocked` / `needs_human`，不得改用 targeted edit 绕过门禁。
- 本次完成后禁止 `git commit` / `git push`，等待外部复核。
