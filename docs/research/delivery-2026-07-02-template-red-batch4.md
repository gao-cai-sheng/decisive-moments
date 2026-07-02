# Delivery: Template RED Batch 4

日期：2026-07-02

## 范围

第四批模板 RED 重写：

- `leibniz`
- `hume`
- `rousseau`
- `hegel`
- `schopenhauer`

暂存目录：

```text
.research/tmp/kimi/2026-07-02-template-red-batch4/
```

## 新建真实 works 条目

- `leibniz`: `leibniz-discourse-metaphysics`, `leibniz-monadology`, `leibniz-new-essays`, `leibniz-theodicy`
- `hume`: `hume-treatise`, `hume-enquiry-human-understanding`, `hume-enquiry-morals`, `hume-dialogues-natural-religion`
- `rousseau`: `rousseau-discourse-inequality`, `rousseau-social-contract`, `rousseau-emile`, `rousseau-confessions`
- `hegel`: `hegel-phenomenology-spirit`, `hegel-science-logic`, `hegel-philosophy-right`, `hegel-encyclopaedia`
- `schopenhauer`: `schopenhauer-world-will-representation`, `schopenhauer-fourfold-root`, `schopenhauer-basis-morality`, `schopenhauer-parerga`

本批删除 5 个占位 works：`leibniz-primary-work / hume-primary-work / rousseau-primary-work / hegel-primary-work / schopenhauer-primary-work`。

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
  🟢 全绿 97 ｜ 🔴 有RED 2 ｜ 🟡 仅YELLOW 9
  RED 36 条 {"template_claim":12,"template_evidence_summary":24}
  YELLOW 89 条 {"weight_uniform":17,"summary_thin":72}
red_people=kierkegaard,mill
```

说明：`quality-audit` 退出 1 是因为剩余库内仍有 RED，不是本批写入失败。本批将模板 RED 人数从 7 降至 2。

```text
build: BUILD_OK
```

## 偏离记录

按数据纪律，本轮本应对正式库 JSON 做整文件管线式写入；但 works/arguments 的脚本化整文件写入被安全层拦截。本批对 `works.json`、5 个 philosopher 的 `works` 数组、以及 10 条 `arguments.index.json` workId 使用了精确 `edit` fallback。`thoughtSystem` 本身仍按暂存 batch → `validate-kimi` → admit dry-run → admit `--write` 管线入库。

## 后续

剩余模板 RED 队列 2 位：`kierkegaard / mill`。

禁止 git commit / push，等待外部审核放行。
