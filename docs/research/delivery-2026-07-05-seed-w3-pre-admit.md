# Seed W3 预产交付（PRE-ADMIT，未写 public/data）

时间：2026-07-05
状态：按 `docs/research/seed-w3-production-spec.md` 执行完成 seed-tier 预产包，停车等待新上下文盲审。

## 范围

上游名单：`docs/research/seed-w3-candidates.md`
生产口径：`docs/research/seed-w3-production-spec.md`

- B1：`.research/tmp/kimi/2026-07-05-seed-w3-b1/`，8 位，16 works，16 relationships。
- B2：`.research/tmp/kimi/2026-07-05-seed-w3-b2/`，12 位，24 works，29 relationships。
- B3：`.research/tmp/kimi/2026-07-05-seed-w3-b3/`，6 位，12 works，13 relationships。

合计：26 位 seed philosophers，52 works，58 relationships。

## 门禁实跑

```bash
for b in 1 2 3; do
  node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-05-seed-w3-b$b
  node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w3-b$b --tier seed
done
```

结果：

- B1 validate-kimi：ok，0 claims，8 sources，0 thought systems。
- B1 seed dry-run：ok，8 philosophers，16 works，16 relationships。
- B2 validate-kimi：ok，0 claims，12 sources，0 thought systems。
- B2 seed dry-run：ok，12 philosophers，24 works，29 relationships。
- B3 validate-kimi：ok，0 claims，6 sources，0 thought systems。
- B3 seed dry-run：ok，6 philosophers，12 works，13 relationships。

## 机械校验

- 每批 `thought-systems.json` 均为空。
- 每位 seed 均有 sourceNotes，且 sourceNotes 含 URL。
- 每位 seed 均有 1–2 个 works。
- 每位 seed 在本批 proposed relationships 中关系数为 2–3。
- `node tools/validate-data.mjs` 当前正式库仍为：355 philosophers（standard 195 | seed 160），200 arguments，664 relationships，10 themes。
- `node tools/quality-audit.mjs --data-dir public/data`：标准档 195 全绿，RED 0，YELLOW 0。

## 写入边界

本轮未执行：

```bash
node tools/admit-kimi-batch.mjs <batch> --tier seed --write
```

原因：`docs/research/review-checklist.md` §2.5 明确要求 seed-tier 批次必须先走新上下文盲审；盲审 `PASS` 前不得写 `public/data/**`。

## 下一步

对 B1 → B2 → B3 逐批启动新上下文盲审。每批 PASS 后再执行：

```bash
node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w3-bN --tier seed --write
node tools/validate-data.mjs
node tools/quality-audit.mjs --data-dir public/data
```

禁止 commit / push，等待 gao 后续裁决。
