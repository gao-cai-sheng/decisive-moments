# Delivery: Template RED Batch 3

日期：2026-07-02

## 范围

第三批模板 RED 重写：

- `bacon`
- `hobbes`
- `descartes`
- `spinoza`
- `locke`

暂存目录：

```text
.research/tmp/kimi/2026-07-02-template-red-batch3/
```

## 新建真实 works 条目

- `bacon`: `bacon-novum-organum`, `bacon-advancement-learning`, `bacon-new-atlantis`
- `hobbes`: `hobbes-leviathan`, `hobbes-de-cive`, `hobbes-elements-law`
- `descartes`: `descartes-discourse-method`, `descartes-meditations`, `descartes-principles-philosophy`, `descartes-passions-soul`
- `spinoza`: `spinoza-ethics`, `spinoza-ttp`, `spinoza-political-treatise`, `spinoza-emendation-intellect`
- `locke`: `locke-essay-human-understanding`, `locke-two-treatises`, `locke-letter-toleration`, `locke-thoughts-education`

本批删除 5 个占位 works：`bacon-primary-work / hobbes-primary-work / descartes-primary-work / spinoza-primary-work / locke-primary-work`。

本批同步迁移 10 条 `arguments.index.json` workId。

## 门禁与写入

```text
validate:kimi: VALIDATE_KIMI_OK
```

```text
admit dry-run: ADMIT_DRY_OK
```

```text
admit --write: ADMIT_WRITE_OK
kimi thought-system admission written: 5 planned, 5 written
```

```text
placeholder residual check: placeholder_residual_hits=0
```

```text
validate:data: VALIDATE_DATA_OK
数据行：data ok: 122 philosophers, 200 arguments, 82 relationships, 10 themes
```

```text
quality-audit: QUALITY_AUDIT_FAIL:1
内容质量审计：108 位有 thoughtSystem
  🟢 全绿 97 ｜ 🔴 有RED 7 ｜ 🟡 仅YELLOW 4
  RED 126 条 {"template_claim":42,"template_evidence_summary":84}
  YELLOW 33 条 {"weight_uniform":7,"summary_thin":26}
```

说明：`quality-audit` 退出 1 是因为剩余库内仍有 RED，不是本批写入失败。本批将模板 RED 人数从 12 降至 7。

```text
build: BUILD_OK
```

## 后续

剩余模板 RED 队列 7 位，下一批可从 `leibniz / hume / rousseau / hegel / schopenhauer` 开始。

禁止 git commit / push，等待外部审核放行。
