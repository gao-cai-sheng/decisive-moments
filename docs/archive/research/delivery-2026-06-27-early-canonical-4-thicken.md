# 交付说明：佛陀、柏拉图、康德、尼采存量薄数据加厚

**项目**：Decisive Moments in History  
**交付时间**：2026-06-27 00:01 CST  
**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md` §13 非 Kimi 待办  
**对象**：`buddha` / `plato` / `kant` / `nietzsche`  
**状态**：本轮 4 位已加厚，正式数据校验通过  

---

## 1. 背景

Kimi 队列仍停在：

```text
zhu-xi / sources-notes
```

当前无新的 Kimi 研究产物可入库。按 RUNBOOK §13，本轮继续处理不依赖 Kimi 的存量薄数据。本轮选择早期既有的 4 位非中文哲人：佛陀、柏拉图、康德、尼采。

---

## 2. 本轮边界

本轮只修改：

```text
public/data/philosophers/buddha.json
public/data/philosophers/plato.json
public/data/philosophers/kant.json
public/data/philosophers/nietzsche.json
docs/research/LOOP-LEDGER.md
docs/research/delivery-2026-06-27-early-canonical-4-thicken.md
```

未修改：

```text
src/data/schemas.ts
tools/admit-kimi-thought-systems.mjs
tools/validate-data.mjs
tools/validate-kimi-research.mjs
前端 UI
测试脚本
队列脚本
works.json
relationships.json
本轮对象以外哲人数据
```

---

## 3. 逐字原文策略

RUNBOOK 要求：不确定是否逐字 / 是否公有领域时，宁可留空 `publicDomainExcerptZh`，并设 `excerptStatus: summary_only`。

本轮对象涉及巴利、希腊、德文原典，现有正式字段是中文 `publicDomainExcerptZh`。在未引入可核验公有领域中文译本的情况下，本轮 **不填任何 publicDomainExcerptZh**，避免把现代译文、助手自译或不确定文本伪装成逐字公有领域原文。

因此本轮所有 evidence 均保持：

```text
excerptStatus: summary_only
publicDomainExcerptZh: 0
```

本轮工作重点是：

```text
1. 将每个 problem 补到 claims >= 2
2. 将每个 problem 补到 evidence >= 2
3. 让同一 problem 内 weight 有区分
4. 把 locator 从“相关段落”收敛到更具体的作品、卷章或主题段落
```

---

## 4. 改后厚度核查

真实核查输出：

```text
# buddha
buddha-suffering claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
buddha-dependent-origination claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
buddha-nonself claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
buddha-path claims=2 evidence=2 weights=2/1 distinct=2 summary_only=2 publicDomainExcerptZh=0
buddha-nirvana claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0

# plato
plato-forms claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
plato-justice claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
plato-soul claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
plato-dialogue claims=2 evidence=2 weights=2/1 distinct=2 summary_only=2 publicDomainExcerptZh=0

# kant
kant-knowledge claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
kant-limits claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
kant-morality claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
kant-freedom-judgment claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0

# nietzsche
nietzsche-values claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
nietzsche-nihilism claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
nietzsche-power claims=2 evidence=2 weights=3/2 distinct=2 summary_only=2 publicDomainExcerptZh=0
nietzsche-perspectivism claims=2 evidence=2 weights=2/1 distinct=2 summary_only=2 publicDomainExcerptZh=0
```

---

## 5. 分哲人改动摘要

### 5.1 佛陀

补薄项：

```text
buddha-dependent-origination
buddha-path
```

新增：

```text
buddha-middle-view
buddha-middle-view-source

buddha-eightfold-path
buddha-eightfold-path-source
```

改后：

```text
5 problems / 10 claims / 10 evidence
```

### 5.2 柏拉图

补薄项：

```text
plato-soul
plato-dialogue
```

修正同权：

```text
plato-forms weights 3/3 → 3/2
```

新增：

```text
plato-soul-harmony
plato-soul-tripartite

plato-aporia-method
plato-aporia-dialogue
```

改后：

```text
4 problems / 8 claims / 8 evidence
```

### 5.3 康德

补薄项：

```text
kant-limits
kant-freedom-judgment
```

修正同权：

```text
kant-knowledge weights 3/3 → 3/2
kant-morality weights 3/3 → 3/2
```

新增：

```text
kant-transcendental-illusion
kant-dialectic-source

kant-reflective-judgment
kant-judgment-source
```

改后：

```text
4 problems / 8 claims / 8 evidence
```

### 5.4 尼采

补薄项：

```text
nietzsche-power
nietzsche-perspectivism
```

修正同权：

```text
nietzsche-nihilism weights 3/3 → 3/2
```

新增：

```text
nietzsche-will-to-power-interpretation
nietzsche-will-to-power-source

nietzsche-artistic-affirmation
nietzsche-art-source
```

改后：

```text
4 problems / 8 claims / 8 evidence
```

---

## 6. 验证

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

本轮不涉及 `admit:kimi`，因为 4 位哲人 already admitted，且本轮是 RUNBOOK §13 的存量正式数据加厚。

---

## 7. 结论

本轮按 RUNBOOK §13 连续完成 4 位早期既有哲人的存量薄数据加厚。佛陀、柏拉图、康德、尼采的所有 thoughtSystem problem 均达到：

```text
claims >= 2
evidence >= 2
weight 有区分
locator 较原先更具体
```

因中文逐字公有领域译文未核，本轮未填 `publicDomainExcerptZh`，全部保留 `summary_only`，符合 RUNBOOK 的“内容正确性 > 通过校验”铁律。

正式数据校验通过。已更新 `LOOP-LEDGER.md` 并按新版格式打停车戳记。
