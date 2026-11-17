# Seed W4 预产交付（PRE-ADMIT，未写 public/data）

时间：2026-07-05
状态：按 `docs/research/seed-w4-production-spec.md` 执行完成 seed-tier 预产包，停车等待新上下文盲审。

## 范围

上游名单：`docs/research/seed-w4-candidates.md`
生产口径：`docs/research/seed-w4-production-spec.md`

- B1：`.research/tmp/kimi/2026-07-05-seed-w4-b1/`，8 位，16 works，15 relationships。
- B2：`.research/tmp/kimi/2026-07-05-seed-w4-b2/`，8 位，16 works，16 relationships。

合计：16 位 seed philosophers，32 works，31 relationships。

## 门禁实跑

```bash
for b in 1 2; do
  node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-05-seed-w4-b$b
  node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w4-b$b --tier seed
done
```

结果：

- B1 validate-kimi：ok，0 claims，8 sources，0 thought systems。
- B1 seed dry-run：ok，8 philosophers，16 works，15 relationships。
- B2 validate-kimi：ok，0 claims，8 sources，0 thought systems。
- B2 seed dry-run：ok，8 philosophers，16 works，16 relationships。

## 机械校验

- 每批 `thought-systems.json` 均为空。
- 每位 seed 均有 sourceNotes，且 sourceNotes 含 URL。
- 每位 seed 均有 1–2 个 works。
- 每位 seed 在本批 proposed relationships 中关系数为 2–3。
- 由于 `poincare` 作为既有 seed 已有 3 条关系，本轮未再挂 `boutroux→poincare`，改用 `boutroux→comte` 与 `boutroux→bergson`，避免触发 whole-graph seed 关系上限。
- `node tools/validate-data.mjs` 当前正式库仍为：381 philosophers（standard 195 | seed 186），200 arguments，722 relationships，10 themes。
- `node tools/quality-audit.mjs --data-dir public/data`：标准档 195 全绿，RED 0，YELLOW 0。

## 写入边界

本轮未执行：

```bash
node tools/admit-kimi-batch.mjs <batch> --tier seed --write
```

原因：`docs/research/review-checklist.md` §2.5 明确要求 seed-tier 批次必须先走新上下文盲审；盲审 `PASS` 前不得写 `public/data/**`。

## 下一步

对 B1 → B2 逐批启动新上下文盲审。每批 PASS 后再执行：

```bash
node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w4-bN --tier seed --write
node tools/validate-data.mjs
node tools/quality-audit.mjs --data-dir public/data
```

禁止 commit / push，等待 gao 后续裁决。
