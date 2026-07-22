# Delivery: Template RED Batch 2

日期：2026-07-02

## 范围

按用户放行条件完成第二批模板 RED 重写：

- `aquinas`
- `ockham`
- `erasmus`
- `machiavelli`
- `montaigne`

并补做第一批 3 位的占位 workId 真实化：

- `augustine`
- `boethius`
- `anselm`

## 用户条件落实

### 条件一：占位 workId 随批替换，含第一批 3 位

已完成：

- `works.json` 中 8 位的 `*-primary-work` 占位条目已替换/拆分为真实作品条目。
- 8 位 philosopher 文件的 `works` 数组已改为真实 workId。
- 第一批 3 位已入库的 evidence source workId 已从 `*-primary-work` 改为真实作品 workId。
- `arguments.index.json` 中这 8 位共 16 条旧 workId 引用已改为真实作品 workId。

已确认：

```text
rg -n 'augustine-primary-work|boethius-primary-work|anselm-primary-work|aquinas-primary-work|ockham-primary-work|erasmus-primary-work|machiavelli-primary-work|montaigne-primary-work' public/data
(no output)
```

### 条件二：全库 audit 复核

本轮再次执行全库 `quality-audit`，未被安全层拦截；当前模板 RED 剩余 12 位。

命令：

```text
node ./tools/quality-audit.mjs --data-dir ./public/data
```

截取结果：

```text
内容质量审计：108 位有 thoughtSystem
  🟢 全绿 96 ｜ 🔴 有RED 12 ｜ 🟡 仅YELLOW 0
  RED 216 条 {"template_claim":72,"template_evidence_summary":144}
```

## 本批暂存目录

```text
.research/tmp/kimi/2026-07-02-template-red-batch2/
```

## 门禁与写入

```text
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-02-template-red-batch2
✅ kimi research ok: 5 claims, 5 sources, 5 thought systems, 0 timeline items
```

```text
node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/2026-07-02-template-red-batch2 --overwrite
✅ dry-run: 5 planned / 0 written
```

```text
node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/2026-07-02-template-red-batch2 --overwrite --write
✅ written: 5 planned / 5 written
```

```text
npm run validate:data
✅ data ok: 122 philosophers, 200 arguments, 82 relationships, 10 themes
```

```text
npm run build
✅ build ok
```

## 回归修复

- `laozi` 从 `git HEAD` 恢复 `publicDomainExcerptZh` 8 条。
- `zhuangzi` 从 `git HEAD` 恢复 `publicDomainExcerptZh` 8 条。
- 只合入摘录与 `excerptStatus: "public_domain"`，保留 Batch6 当前 summary 内容。

## 注意

- 本批第二批 `thoughtSystem` 已真实重写，并已由本轮 full audit 确认模板 RED 剩余 12 位。
- 剩余模板 RED 队列为 `bacon` 起后续 12 位。
