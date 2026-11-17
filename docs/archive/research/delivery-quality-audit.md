# 交付说明：内容质量审计层（quality-audit）

**分支**：`quality-audit`（git worktree，独立于 ChatGPT/Kimi 的 `kimi-research-bridge`，零文件冲突）
**执行人**：Claude（Cowork）
**交付时间**：2026-06-27

## 1. 解决什么

`validate-data.mjs` 只查结构/schema，过了不代表内容好。本会话里每轮的深度核查（薄项、模糊 locator、假引文、claim 是否复述题目、weight 区分、重复 claim、theme 覆盖）此前全靠人手。Kimi 接下来要灌 89 位，手检不可扩展——本工具把这套核查自动化。

## 2. 交付物

```text
tools/quality-audit.mjs        # 只读审计器（CLI + 可导出函数）
tools/quality-audit.test.mjs   # vitest 单测：13 类问题各一例 + 干净样例零误报
docs/research/quality-baseline-2026-06-27.md / .json   # 当前全库基线报告
```

## 3. 用法

```bash
node tools/quality-audit.mjs                       # 审计 public/data，控制台摘要
node tools/quality-audit.mjs --md report.md --json report.json   # 另存报告
node tools/quality-audit.mjs --strict              # 有 YELLOW 也非0退出
node tools/quality-audit.mjs --data-dir <dir>      # 审计指定数据目录
# 退出码 0=无RED（--strict 下需也无YELLOW）；1=有问题。可直接当 CI/循环门。
```

## 4. 检查项

RED（硬性，对应 §4 铁律，必须修）：
`problems_lt_3`、`claims_lt_2`、`evidence_lt_2`、`summary_too_short`、`fake_public_domain`（标 public_domain 却无逐字原文）、`unknown_workid`、`workid_other_philosopher`。

YELLOW（质量异味，建议修）：
`weight_uniform`、`claim_restates_question`（claimZh 与 questionZh 字符 Jaccard≥0.72）、`duplicate_claim`、`excerpt_status_mismatch`、`vague_locator`（"等相关/上中下/整篇"等）、`missing_locator`。

外加 theme 覆盖：报告列出无人使用的 theme。

## 5. 验证

- **单测**：13 类问题各构造一例，断言被抓到；另有"干净样例零误报"。在 macOS 上 `npm test`（vitest）运行。
- **沙箱内**（vitest 因 rolldown 原生二进制平台不符跑不了）已用 node 原生 assert 跑等价断言：**14/14 通过**（含干净样例）。
- **对真实数据交叉验证**：跑当前全库 → 11 位全绿、0 RED、0 YELLOW，与本会话人工核查结论一致。
- 写测试时还**抓到自身一个 bug**（早期"干净"样例跨 problem 复用 claim 标题被判重复），已修——证明它不是只会说 OK 的摆设。

## 6. 接入 RUNBOOK（合并时加，未替你改主线文件）

合并本分支后，在 `RUNBOOK-kimi-autonomous-loop.md` 加：

- §5 写前门追加一行（可选强门）：
  `node tools/quality-audit.mjs --data-dir public/data` —— 入库后若出现 RED 即视为不合格。
- §13 第6项"数据体检"替换为：直接跑 `quality-audit`，红/黄一目了然，替代逐个哲人手检。

## 7. 顺带发现的数据债（未处理，建议另立项）

主线 09:36 戳记提到 `arguments.index` 有 **198 条缺 locator**。那是 arguments（非 thoughtSystem）数据，本工具暂不覆盖。若要，可加一个并行的 `quality-audit:arguments` 检查项——属独立任务。

## 8. 不冲突保证

全部新增文件，对数据只读；在独立 `quality-audit` 分支/worktree 完成，主工作树（ChatGPT 在写）一字未动。合并时只新增 tools/ 两个文件 + 文档，与主线的数据改动无文本重叠。
