# Expansion E6 delivery — redone after external template rejection

日期：2026-07-02

## 范围

- philosophers: `wollstonecraft`, `anscombe`, `rosenzweig`, `fanon`, `freire`
- works / relationships：保留上一版真实作品与关系数据
- thoughtSystem：五位全部重写，每位 `3 problems / 6 claims / 12 evidence`

## 打回原因

外部审核判定旧 E6 五位为二代模板灌水：

- `claimZh` 整批同句式，并且同一 `problem` 内精确重复；
- `summaryZh` 粘贴该 evidence 的 `workId` 子串；
- `locator` 使用伪定位而非作品内章节/段落范围。

处理顺序已按复核要求执行：先提交 E2–E5 干净成果；再给 `quality-audit` 增加结构性 RED；最后重写 E6。

## 新增审计规则

`tools/quality-audit.mjs` 新增三条 RED，并配套单测：

- `template_similarity`：同一哲人 evidence `summaryZh` 两两字符 Jaccard 均值 `> 0.55`；
- `duplicate_claim_text`：同一 `problem` 内 `claimZh` 精确重复；
- `workid_in_summary`：`summaryZh` 含该 evidence 的 `workId` 子串。

旧 E6 在新规则下的实测结果：

```text
内容质量审计：149 位有 thoughtSystem
  🟢 全绿 144 ｜ 🔴 有RED 5 ｜ 🟡 仅YELLOW 0
  RED 80 条 {"workid_in_summary":60,"duplicate_claim_text":15,"template_similarity":5}
  YELLOW 0 条 {}
```

这同时确认 E1–E5 及存量 144 位零误报。

## 写前门

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 10 claims, 4 sources, 5 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 5 planned, 0 written
- replace wollstonecraft -> public/data/philosophers/wollstonecraft.json
- replace anscombe -> public/data/philosophers/anscombe.json
- replace rosenzweig -> public/data/philosophers/rosenzweig.json
- replace fanon -> public/data/philosophers/fanon.json
- replace freire -> public/data/philosophers/freire.json

=== 门3 内容标准档硬门 ===
Batch 内容审计：5 位（thought-systems.json）
  🟢 全绿 5 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

## 写入与写后门

```text
kimi thought-system admission written: 5 planned, 5 written

=== 门3 validate:data（只读） ===
data ok: 149 philosophers, 200 arguments, 172 relationships, 10 themes

=== 门4 克隆逐字节自检 ===
  wollstonecraft ✅ 正式库 == admit 应生成（逐字节一致）
  anscombe ✅ 正式库 == admit 应生成（逐字节一致）
  rosenzweig ✅ 正式库 == admit 应生成（逐字节一致）
  fanon ✅ 正式库 == admit 应生成（逐字节一致）
  freire ✅ 正式库 == admit 应生成（逐字节一致）

✅ 写后门全绿
```

## 最终验证

```text
内容质量审计：149 位有 thoughtSystem
  🟢 全绿 149 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 无 RED

data ok: 149 philosophers, 200 arguments, 172 relationships, 10 themes

quality-audit.test.mjs: 31 passed

vite build: ✓ built in 268ms
```

备注：`vite build` 仍有既有 chunk-size warning，非本次数据质量阻断项。

## 提交状态

已提交：

- `e99fec9` — `Expansion E2-E5 clean admission`
- `994e94f` — `Add structural audit guards for E6 templates`

E6 重写结果已写入工作树并停车等外部复核；未 push，未另行提交 E6。
