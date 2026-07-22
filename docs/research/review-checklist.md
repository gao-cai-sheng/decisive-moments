# 盲审员复核操作单（Subagent Review Checklist）

适用范围：所有新批次 thoughtSystem / works / relationships / sources / notes 入库前复核。每批必须新起一个盲审 subagent，禁止复用实例。

## 0. 启动约束

盲审员启动时只能获得三类输入：

1. batch 目录路径，例如 `.research/tmp/kimi/2026-07-02-expansion-b1`。
2. 本文件：`docs/research/review-checklist.md`。
3. 历史事故摘要：
   - 一代模板：claim / evidence / summary 只换哲人名或主题词，句式高度重复，真实内容很薄。
   - 二代模板：规避浅层正则，但同一 problem 内 `claimZh` 精确重复或高度同构，`summaryZh` 粘贴 `workId`，`locator` 伪定位为泛泛篇章，E6 首版即因此打回。

禁止输入给盲审员：生产者交付说明、生产者自述“已完成/已修复/已全绿”、delivery 文档、账本中对该批的成功描述。盲审顺序必须是：先看货、后看账。

## 1. 角色边界

### 生产者

- 只负责研究与暂存 batch。
- 只能写 `.research/tmp/kimi/<batch>/...` 以及必要的候选说明。
- 不许触碰正式库：`public/data/**`、正式 `works.json`、正式 `relationships.json`、正式 `philosophers.index.json`。
- 不许执行 `admit --write`。

### 盲审员

- 只做复核，不修生产者 batch。
- 只能输出 `.research/tmp/kimi/<batch>/review-verdict.md`。
- 结论只有两种：`PASS` 或 `REJECT`。
- 若要求新增或修改审计规则，必须停车等外部审核；不得自行合入规则。

### 裁决者 / 主循环

- 只有盲审 `PASS` 后，主循环才可执行 `admit --write`。
- 盲审 `REJECT` 后，生产者只能重做 batch 或升级 `needs_human`，不得推翻盲审结论。
- 生产者与盲审员意见冲突，或盲审员要求改审计规则：一律停车等外部审核。

## 2. 门禁实跑（必须按序）

设 batch 路径：

```bash
BATCH=".research/tmp/kimi/<batch>"
```

### a. validate-kimi

```bash
node tools/validate-kimi-research.mjs "$BATCH"
```

通过标准：退出码 0；不得有 schema / source / thought-system 结构错误。

### b. admit dry-run（只读）

```bash
node tools/admit-kimi-thought-systems.mjs "$BATCH" --overwrite
```

通过标准：退出码 0；输出只允许 planned / dry run，不得写正式库；盲审员必须记录 planned 的 philosopher 列表。

### c. 门3标准档硬门

```bash
node tools/quality-audit.mjs --batch "$BATCH/thought-systems.json" --require-standard
```

通过标准：退出码 0，且输出满足：

```text
RED 0
YELLOW 0
```

硬阻断项包括但不限于：

- `thin_evidence`
- `summary_thin`
- `weight_uniform`
- `template_similarity`
- `duplicate_claim_text`
- `workid_in_summary`
- `malformed_punct`
- `shared_suffix`
- `template_foundational_stance`
- `template_primary_locator`
- `missing_locator`
- 模糊 locator / 假引文 / claim 复述题目 / theme 覆盖不足等 RED。

## 2.5 种子档 seed-tier 分支

仅适用于已由主循环明确标注为 `--tier seed` 的候选批。名单批准前不得生产 seed batch；seed 批只允许身份层，禁止携带 thoughtSystem。

门禁顺序：

```bash
node tools/validate-kimi-research.mjs "$BATCH"
node tools/admit-kimi-batch.mjs "$BATCH" --tier seed
```

通过标准：

- `validate-kimi-research` 退出码 0；sources.md 至少定义一个 S###，claims.json 每条 claim 都有已定义 sourceIds。
- `admit-kimi-batch --tier seed` 退出码 0，且输出只允许 dry run，不得写正式库。
- proposed philosopher 必须是 `tier: "seed"` 或不显式写 tier；若显式写其他 tier，直接 REJECT。
- seed philosopher 必须有 sourceNotes；sourceNotes 为空、缺 URL/条目说明、或来源条目名无法支撑身份层，直接 REJECT。
- seed philosopher 禁止携带 thoughtSystem；batch 中 thought-systems.json 若含任何 item，直接 REJECT。
- 每位 seed 必须有 1-2 个真实作品、2-3 条关系、不得使用 `primary-work` / `placeholder` / `candidate` 等占位 workId。
- 种子档不运行标准档门3内容审计；盲审员改查身份层完整性、来源可追溯性、人物真实性与去重边界。

若 seed 批缺来源引用，必须按 checklist 结论 REJECT；不得以“后续补源”放行。

## 3. 独立仪器：summaryZh 两两相似度

盲审员必须自写或使用下列脚本独立计算，不依赖 `quality-audit.mjs` 的实现。目的：双仪器防单点失效。

```bash
node - "$BATCH/thought-systems.json" <<'NODE'
const fs = require('fs');
const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
function chars(s) {
  return new Set(String(s || '').replace(/\s+/g, '').split(''));
}
function jaccard(a, b) {
  const A = chars(a), B = chars(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union;
}
let failed = false;
for (const item of data.items || []) {
  const rows = [];
  for (const p of item.problems || []) {
    for (const c of p.claims || []) {
      for (const e of c.evidence || []) rows.push([e.id, e.summaryZh || '']);
    }
  }
  const vals = [];
  let max = 0, maxPair = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const v = jaccard(rows[i][1], rows[j][1]);
      vals.push(v);
      if (v > max) { max = v; maxPair = [rows[i][0], rows[j][0]]; }
    }
  }
  const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  console.log(`${item.philosopherId}\tmean=${mean.toFixed(3)}\tmax=${max.toFixed(3)}\tmaxPair=${maxPair.join(' | ')}`);
  if (mean > 0.55) failed = true;
}
if (failed) {
  console.error('REJECT: mean summaryZh char-Jaccard > 0.55');
  process.exit(1);
}
NODE
```

通过标准：每位 philosopher 的 `summaryZh` 两两字符 Jaccard 均值 `<= 0.55`。若超过，直接 `REJECT`。

注意：即使脚本通过，如果内容抽查发现同构模板、空泛改写或伪定位，仍必须 `REJECT`。

## 4. 内容抽查（必须执行，不能用门禁替代）

每位 philosopher 随机抽 2 条 evidence。若每位 evidence 少于 2 条，直接 `REJECT`。

抽样命令：

```bash
node - "$BATCH/thought-systems.json" <<'NODE'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const item of data.items || []) {
  const evs = [];
  for (const p of item.problems || []) for (const c of p.claims || []) for (const e of c.evidence || []) evs.push(e);
  const seed = [...item.philosopherId].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const first = seed % evs.length;
  const second = (seed * 7 + 3) % evs.length;
  const picks = [...new Set([first, second])];
  while (picks.length < 2 && picks.length < evs.length) picks.push((picks[picks.length - 1] + 1) % evs.length);
  console.log(`\n## ${item.philosopherId}`);
  for (const idx of picks) {
    const e = evs[idx];
    console.log(`- ${e.id} | workId=${e.source?.workId || ''} | locator=${e.source?.locator || ''}`);
    console.log(`  ${e.summaryZh || ''}`);
  }
}
NODE
```

盲审员必须凭自身知识核对三件事：

1. 著作归属：`workId` 是否真属于该 philosopher，年份/文本定位是否不离谱。
2. 章节定位：`locator` 是否像真实章节、篇章、论题位置，而不是“相关章节”“全书多处”等伪定位。
3. 论点真实性：`summaryZh` 是否真实支撑所属 claim / problem，是否把他人观点错归、把二手概括伪装成原文、或把现代术语硬塞进古典文本。

判定：

- 任一 evidence 出现著作归属错误、伪定位、明显错义：`REJECT`。
- 抽查中出现可疑但盲审员无法确认：`REJECT` 或 `needs_human`，不得 `PASS`。
- 抽查结果必须逐条写入 `review-verdict.md`。

## 5. 对抗测试（仿冒批喂门3）

若本批出现新的句式风格、生产者换了写作范式、或 blind reviewer 直觉上觉得“像模板但门3未抓”，必须构造仿冒批测试门3。

最低要求：构造一个临时 `thought-systems.json`，模拟该批可疑句式：

- 同一 problem 内重复或近重复 `claimZh`；或
- 多条 `summaryZh` 高度同构；或
- `summaryZh` 含 `workId` 子串；或
- 使用泛化 locator。

示例命令（写入 `/tmp`，不碰正式库）：

```bash
TMP="$(mktemp -d)"
node - "$TMP/thought-systems.json" <<'NODE'
const fs = require('fs');
const out = process.argv[2];
const ev = n => ({
  id: `fake:evidence:${String(n).padStart(3, '0')}`,
  titleZh: `模板证据${n}`,
  summaryZh: `fake-work-id 这条摘要沿用同一种句式，把著作编号粘贴进摘要，并用重复结构制造看似具体的说明 ${n}`,
  sourceIds: ['S1'],
  source: { workId: 'fake-work-id', locator: '相关章节', excerptStatus: 'summary_only' }
});
const claim = n => ({
  id: `fake:claim:${String(n).padStart(3, '0')}`,
  titleZh: `模板主张${n}`,
  claimZh: '这个问题说明该哲人通过核心概念回应现代困境。',
  explanationZh: '重复解释，模拟二代模板灌水。',
  themeIds: ['knowledge'],
  weight: 3,
  sourceIds: ['S1'],
  evidence: [ev(n * 2 - 1), ev(n * 2)]
});
const data = { schemaVersion: 1, items: [{
  philosopherId: 'fake-template-person',
  sourceIds: ['S1'],
  problems: [{
    id: 'fake:problem:001',
    titleZh: '模板问题',
    questionZh: '模板如何伪装成内容？',
    summaryZh: '此问题用于测试门3是否能抓住重复 claim、workId 粘贴和模板摘要。',
    themeIds: ['knowledge'],
    weight: 3,
    sourceIds: ['S1'],
    claims: [claim(1), claim(2)]
  }]
}] };
fs.writeFileSync(out, JSON.stringify(data, null, 2));
NODE
node tools/quality-audit.mjs --batch "$TMP/thought-systems.json" --require-standard
```

通过标准：该仿冒批必须 `exit=1`。如果仿冒批 `exit=0`，说明门3有漏检风险，盲审结论必须是 `REJECT` 或升级外部审核。

## 6. verdict 输出格式

盲审员最终只写一个文件：

```text
.research/tmp/kimi/<batch>/review-verdict.md
```

模板：

```md
# Blind Review Verdict — <batch>

Verdict: PASS | REJECT
Reviewer context: fresh subagent; input limited to batch path, review-checklist, and historical incident summary.
Batch path: .research/tmp/kimi/<batch>
Date: <YYYY-MM-DD HH:mm +08:00>

## 1. Gate runs

- validate-kimi: PASS | REJECT
- admit dry-run: PASS | REJECT
- quality-audit batch --require-standard: PASS | REJECT

<粘贴关键输出，至少包含 RED/YELLOW 统计与 planned philosopher 列表。>

## 2. Independent similarity instrument

<粘贴每位 philosopher mean/max/maxPair。>

Decision: PASS | REJECT

## 3. Content spot checks

| philosopherId | evidenceId | workId | locator | authorship | locator quality | claim support | verdict | notes |
|---|---|---|---|---|---|---|---|---|

## 4. Adversarial test

- Required: yes | no
- Reason: <为什么需要或不需要>
- Result: PASS, fake batch exit=1 | REJECT, fake batch exit=0
- Triggered codes: <如 duplicate_claim_text / workid_in_summary / template_similarity>

## 5. Final decision

Verdict: PASS | REJECT

If REJECT, evidence:

1. ...
2. ...
```

## 7. PASS / REJECT 规则

### PASS 必须同时满足

- 三道门禁全部退出码 0。
- 独立相似度仪器通过，每位 mean `<= 0.55`。
- 每位 2 条 evidence 内容抽查均通过。
- 需要对抗测试时，仿冒批触发门3且 `exit=1`。
- 未要求新增审计规则。

### REJECT 任一触发即可

- 任一门禁失败。
- 独立相似度均值 `> 0.55`。
- 任一抽查 evidence 著作归属错误、伪定位、论点错义或高度可疑。
- 仿冒批未被门3拦截。
- 盲审员认为需要新增审计规则。
- 盲审员无法确认关键事实且该事实影响内容真实性。

## 8. 主循环后续动作

盲审 `PASS` 后，主循环执行：

```bash
npm run admit:kimi -- "$BATCH" --overwrite --write
bash scripts/verify.sh post "$BATCH" <philosopherId...>
node tools/quality-audit.mjs --data-dir public/data
npm run validate:data
npm test -- tools/quality-audit.test.mjs
npm run build
```

盲审 `REJECT` 后：

- 生产者重做 batch；或
- 升级 `needs_human`；
- 不得执行 `admit --write`；
- 不得改写 `review-verdict.md` 结论。

账本必须记录 `review-verdict.md` 路径。每 3 批外部人工抽检 1 批；所有 REJECT 争议批和所有审计规则变更批必须人工复核。
