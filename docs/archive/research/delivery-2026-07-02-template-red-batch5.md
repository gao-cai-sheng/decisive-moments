# Delivery: Template RED Batch 5

日期：2026-07-02

## 范围

收尾批模板 RED 重写：

- `kierkegaard`
- `mill`

暂存目录：

```text
.research/tmp/kimi/2026-07-02-template-red-batch5/
```

## 新建真实 works 条目

- `kierkegaard`: `kierkegaard-either-or`, `kierkegaard-fear-trembling`, `kierkegaard-concept-anxiety`, `kierkegaard-concluding-postscript`, `kierkegaard-sickness-unto-death`
- `mill`: `mill-system-logic`, `mill-on-liberty`, `mill-utilitarianism`, `mill-subjection-women`, `mill-representative-government`

本批删除 2 个占位 works：`kierkegaard-primary-work / mill-primary-work`。

本批同步迁移 4 条 `arguments.index.json` workId。

## 门禁与写入

```text
validate:kimi: VALIDATE_KIMI_OK
```

```text
admit dry-run: ADMIT_DRY_OK
```

```text
admit --write: ADMIT_WRITE_OK
kimi thought-system admission written: 2 planned, 2 written
```

```text
placeholder residual check: placeholder_residual_hits=0
```

## 回归修复记录

第一次正式库验证失败：

```text
VALIDATE_DATA_FAIL
Error: thought problem mill:problem:001 has unknown theme science
```

处理方式：回到暂存 batch，将未知 themeId `science` 改为既有 `knowledge`，重新运行 `validate:kimi`、admit dry-run、admit `--write`，再重新验证正式库。

## 最终验证

```text
validate:data: VALIDATE_DATA_OK
数据行：data ok: 122 philosophers, 200 arguments, 82 relationships, 10 themes
```

```text
quality-audit: QUALITY_AUDIT_OK
内容质量审计：108 位有 thoughtSystem
  🟢 全绿 97 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 11
  RED 0 条 {}
  YELLOW 109 条 {"weight_uniform":22,"summary_thin":87}
  逐字原文欠债 summary_only=1250 ｜ excerptStatus 分布 {"summary_only":1250,"public_domain":72}
  ✅ 无 RED
```

```text
build: BUILD_OK
```

## 结论

模板灌水 RED 队列清零。

剩余工作不再是模板 RED，而是：

- 继续处理正式库缺 thoughtSystem 的 14 位，下一位 `watsuji`。
- 后续另行处理 `summary_only` 摘录债和 YELLOW 项。

禁止 git commit / push，等待外部审核放行。
