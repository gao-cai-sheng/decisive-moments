# 交付说明：王阳明 thoughtSystem 加厚与正式入库

**项目**：Decisive Moments in History  
**交付时间**：2026-06-26 22:38 CST  
**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md`  
**账本**：`docs/research/LOOP-LEDGER.md`  
**对象**：`wang-yangming`  
**状态**：已正式入库  

---

## 1. 恢复点与目标选择

开工后按 RUNBOOK §0 执行：

```text
1. 读取 RUNBOOK-kimi-autonomous-loop.md
2. 读取 LOOP-LEDGER.md
3. 执行 npm run kimi:queue -- next
```

队列输出显示：

```text
next Kimi stage: zhu-xi / sources-notes
prompt: .research/tmp/kimi/person-queue/prompts/zhu-xi/sources-notes.prompt.txt
output: .research/tmp/kimi/people/zhu-xi
log: .research/tmp/kimi/person-queue/logs/zhu-xi/sources-notes.log
```

但 RUNBOOK §2 规定优先处理已就绪可直接入库者：

```text
wang-yangming（.research/tmp/kimi/people/wang-yangming 已含 thought-systems.json）→ 先清掉它
```

因此本轮目标为王阳明。

---

## 2. 改前状态

研究暂存目录：

```text
.research/tmp/kimi/people/wang-yangming
```

正式文件：

```text
public/data/philosophers/wang-yangming.json
```

改前正式文件无 `thoughtSystem`。

暂存 thoughtSystem 改前已有：

```text
problems: 3
claims: 7
evidence: 14
```

但仍有两个问题：

```text
1. problem:002 的 claim weight 为 3/3，problem:003 的 claim weight 为 2/2，缺少区分度
2. 多条 evidence 虽已有 locator，但 excerptStatus 多为 summary_only，部分可确认逐字原文未 surfacing 到 publicDomainExcerptZh
```

---

## 3. 本轮加厚与修复

### 3.1 weight 区分

| problem | 改前 weights | 改后 weights |
|---|---:|---:|
| `wang-yangming:problem:001` 道德知识与行动的关系 | 3 / 3 / 2 | 3 / 3 / 2 |
| `wang-yangming:problem:002` 政治权威的伦理基础 | 3 / 3 | 3 / 2 |
| `wang-yangming:problem:003` 正义、秩序与暴力的张力 | 2 / 2 | 2 / 1 |

### 3.2 publicDomainExcerptZh surfacing

能较稳确认逐字原文的 evidence，已补 `source.publicDomainExcerptZh` 并设：

```text
excerptStatus: public_domain
```

数量：8 条。

```text
wang-yangming:evidence:001
wang-yangming:evidence:003
wang-yangming:evidence:004
wang-yangming:evidence:005
wang-yangming:evidence:006
wang-yangming:evidence:007
wang-yangming:evidence:009
wang-yangming:evidence:013
```

仍保留 `summary_only` 的 evidence 数量：6 条。

原因：对应段落涉及英译注、全集卷册、奏疏/告谕或问答段落，当前无法在不引入误引风险的情况下确认逐字公有领域文本。遵守 RUNBOOK 铁律：

```text
内容正确性 > 通过校验
不确定是否逐字/是否公有领域 → 留空，并把 excerptStatus 设 summary_only 或 none
```

---

## 4. 改后厚度

实跑核查输出：

```text
wang-yangming:problem:001 claims=3 evidence=6 weights=3/3/2
  excerpts public_domain=5 summary_only=1
wang-yangming:problem:002 claims=2 evidence=4 weights=3/2
  excerpts public_domain=2 summary_only=2
wang-yangming:problem:003 claims=2 evidence=4 weights=2/1
  excerpts public_domain=1 summary_only=3
```

合计：

```text
problems: 3
claims: 7
evidence: 14
publicDomainExcerptZh: 8
summary_only: 6
```

---

## 5. 验证门

### 5.1 门 1：validate:kimi

执行：

```bash
npm run validate:kimi -- .research/tmp/kimi/people/wang-yangming
```

真实输出：

```text
> qunxing-shanyaoshi@0.1.0 validate:kimi
> node tools/validate-kimi-research.mjs .research/tmp/kimi/people/wang-yangming

kimi research ok: 11 claims, 9 sources, 1 thought systems, 0 timeline items
```

### 5.2 门 2：admit dry-run

执行：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/wang-yangming
```

真实输出：

```text
> qunxing-shanyaoshi@0.1.0 admit:kimi
> node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/people/wang-yangming

kimi thought-system admission dry run: 1 planned, 0 written
- add wang-yangming -> <repo>/public/data/philosophers/wang-yangming.json
Re-run with --write after human review to update public/data.
```

### 5.3 正式写入

执行：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/wang-yangming --write
```

真实输出：

```text
> qunxing-shanyaoshi@0.1.0 admit:kimi
> node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/people/wang-yangming --write

kimi thought-system admission written: 1 planned, 1 written
- add wang-yangming -> <repo>/public/data/philosophers/wang-yangming.json
```

### 5.4 门 3：validate:data

执行：

```bash
npm run validate:data
```

真实输出：

```text
> qunxing-shanyaoshi@0.1.0 validate:data
> node tools/validate-data.mjs

data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes
```

附加核查：

```text
thoughtSystems 11 confucius, laozi, zhuangzi, mozi, mencius, xunzi, wang-yangming, buddha, plato, kant, nietzsche
wang-yangming:problem:001 claims=3 evidence=6 weights=3/3/2 publicDomainExcerptZh=5
wang-yangming:problem:002 claims=2 evidence=4 weights=3/2 publicDomainExcerptZh=2
wang-yangming:problem:003 claims=2 evidence=4 weights=2/1 publicDomainExcerptZh=1
```

---

## 6. 克隆自检

执行：

```bash
SRC="$(pwd)"; T=/tmp/dmih_verify_wang_yangming; rm -rf "$T"; mkdir -p "$T"; rsync -a --exclude node_modules --exclude .git "$SRC/" "$T/"; ln -s "$SRC/node_modules" "$T/node_modules"; ( cd "$T" && node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/people/wang-yangming --overwrite --write >/dev/null ); diff -q "$T/public/data/philosophers/wang-yangming.json" "$SRC/public/data/philosophers/wang-yangming.json" && echo "wang-yangming ✅ 一致" || echo "wang-yangming ⚠️ 有偏差"
```

真实输出：

```text
wang-yangming ✅ 一致
```

---

## 7. 边界确认

本轮未修改：

```text
src/data/schemas.ts
tools/admit-kimi-thought-systems.mjs
tools/validate-data.mjs
tools/validate-kimi-research.mjs
前端 UI
测试脚本
队列脚本
relationships.json
works.json
本轮对象以外的哲人数据
```

本轮实际修改：

```text
.research/tmp/kimi/people/wang-yangming/thought-systems.json
public/data/philosophers/wang-yangming.json
docs/research/LOOP-LEDGER.md
docs/research/delivery-2026-06-26-wang-yangming.md
```

---

## 8. 当前全局状态

正式库：

```text
100 philosophers
200 arguments
82 relationships
10 themes
11 philosophers with thoughtSystem
```

已有 thoughtSystem：

```text
confucius
laozi
zhuangzi
mozi
mencius
xunzi
wang-yangming
buddha
plato
kant
nietzsche
```

下一队列目标：

```text
zhu-xi / sources-notes
```

当前状态：

```text
blocked_rate_limit
```

按 RUNBOOK §9，额度限制属于正常停车点，不硬重试，不伪造产物；额度恢复后从 `npm run kimi:queue -- next` 继续。

---

## 9. 结论

王阳明 thoughtSystem 已加厚、验证、正式入库并通过克隆自检。本轮循环完成，账本已更新。当前正式库 thoughtSystem 覆盖从 10 位提升到 11 位，剩余 89 位待补。
