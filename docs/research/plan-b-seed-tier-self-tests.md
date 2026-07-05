# Plan B Seed Tier 对抗自测留档

Date: 2026-07-05 +08:00

Scope: Plan B seed-tier 工具改造。以下 fixture 仅用于对抗自测，位于 `.research/tmp/plan-b-seed-tier-self-tests/`，未写入正式库。

## A. seed 携带 thoughtSystem 应被 validate-data 硬错

Fixture: `.research/tmp/plan-b-seed-tier-self-tests/a-seed-with-thoughtsystem/`

Command:

```bash
cd .research/tmp/plan-b-seed-tier-self-tests/a-seed-with-thoughtsystem
node /Users/gao/Desktop/Decisive\ Moments\ in\ History/tools/validate-data.mjs
```

Observed result: exit 1，PASS（预期失败）。

```text
Error: seed philosopher cannot carry thoughtSystem: seed-rogue
```

## B. 缺来源引用的 seed 批应被 checklist / admit identity gate 拦截

Fixture: `.research/tmp/plan-b-seed-tier-self-tests/b-seed-missing-source-notes/`

门1先通过，证明 batch 基础 sources/claims 结构可读：

```bash
node tools/validate-kimi-research.mjs .research/tmp/plan-b-seed-tier-self-tests/b-seed-missing-source-notes
```

```text
kimi research ok: 1 claims, 1 sources, 0 thought systems, 0 timeline items
```

随后执行 seed 身份层 dry-run：

```bash
node tools/admit-kimi-batch.mjs .research/tmp/plan-b-seed-tier-self-tests/b-seed-missing-source-notes --tier seed
```

Observed result: exit 1，PASS（预期失败）。

```text
seed-missing-source seed tier needs sourceNotes
```

## 结论

- seed 身份层若混入 thoughtSystem，`validate-data` 硬错误生效。
- seed 批若缺 sourceNotes / 来源引用，`review-checklist.md` 的 seed 分支与 `admit-kimi-batch --tier seed` 身份层门禁会阻断。
- 此规则变更批仍须外部审核复核后，方可作为正式门禁使用。
