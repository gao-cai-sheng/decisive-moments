# Seed W5 预产交付（PRE-ADMIT，未写 public/data）

时间：2026-07-05
状态：按 `docs/research/seed-w5-production-spec.md` 执行完成 seed-tier 预产包，停车等待新上下文盲审。

## 范围

上游名单：`docs/research/seed-w5-candidates.md`
生产口径：`docs/research/seed-w5-production-spec.md`

- B1：`.research/tmp/kimi/2026-07-05-seed-w5-b1/`，7 位，7 works，14 relationships。
- B2：`.research/tmp/kimi/2026-07-05-seed-w5-b2/`，6 位，11 works，12 relationships。
- B3：`.research/tmp/kimi/2026-07-05-seed-w5-b3/`，10 位，19 works，20 relationships。
- B4：`.research/tmp/kimi/2026-07-05-seed-w5-b4/`，5 位，8 works，11 relationships。

合计：28 位 seed philosophers，45 works，57 relationships。

## 门禁实跑

```bash
for b in 1 2 3 4; do
  node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-05-seed-w5-b$b
  node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w5-b$b --tier seed
done
```

结果：

- B1 validate-kimi：ok，0 claims，7 sources，0 thought systems。
- B1 seed dry-run：ok，7 philosophers，7 works，14 relationships。
- B2 validate-kimi：ok，0 claims，6 sources，0 thought systems。
- B2 seed dry-run：ok，6 philosophers，11 works，12 relationships。
- B3 validate-kimi：ok，0 claims，9 sources，0 thought systems。
- B3 seed dry-run：ok，10 philosophers，19 works，20 relationships。
- B4 validate-kimi：ok，0 claims，4 sources，0 thought systems。
- B4 seed dry-run：ok，5 philosophers，8 works，11 relationships。

## 机械校验

- 每批 `thought-systems.json` 均为空。
- 每位 seed 均有 sourceNotes，且至少一个 sourceNotes 含 URL。
- 每位 seed 均有 1–2 个 works。
- 每位 seed 在本批 proposed relationships 中关系数为 2–3。
- B2 没有依赖 W5 B1 未写入人物作为关系端点，保证单批 dry-run 可独立通过。
- 已满/近满 seed 锚点按规格排雷：
  - `shandao` 只新增 `honen → shandao`。
  - `xuanzang` 只新增 `wonhyo → xuanzang`。
  - `jizang` 只新增 `wonhyo → jizang`。
  - `zongmi` 只新增 `jinul → zongmi`。
  - `kukai` 挂标准档 `nagarjuna`，未挂 `xuanzang`。
- `node tools/validate-data.mjs` 当前正式库仍为：397 philosophers（standard 195 | seed 202），200 arguments，753 relationships，10 themes。
- `node tools/quality-audit.mjs --data-dir public/data`：标准档 195 全绿，RED 0，YELLOW 0。

## 写入边界

本轮未执行：

```bash
node tools/admit-kimi-batch.mjs <batch> --tier seed --write
```

原因：`docs/research/review-checklist.md` §2.5 明确要求 seed-tier 批次必须先走新上下文盲审；盲审 `PASS` 前不得写 `public/data/**`。

## 下一步

对 B1 → B2 → B3 → B4 逐批启动新上下文盲审。每批 PASS 后再执行：

```bash
node tools/admit-kimi-batch.mjs .research/tmp/kimi/2026-07-05-seed-w5-bN --tier seed --write
node tools/validate-data.mjs
node tools/quality-audit.mjs --data-dir public/data
```

禁止 commit / push，等待 gao 后续裁决。
