# 交付说明：庄子、墨子、孟子、荀子存量薄数据加厚

**项目**：Decisive Moments in History  
**交付时间**：2026-06-26 23:35 CST  
**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md` §13 非 Kimi 待办  
**对象**：`zhuangzi` / `mozi` / `mencius` / `xunzi`  
**状态**：本轮 4 位已加厚，正式数据校验通过  

---

## 1. 背景

Kimi 当前仍因额度限制停在：

```text
zhu-xi / sources-notes
```

按 RUNBOOK §13，在 Kimi 断供时继续处理不依赖 Kimi 的存量薄数据。本轮按用户要求一次推进 3–5 位，实际完成 4 位中国古典哲人。

---

## 2. 本轮边界

本轮只修改正式哲人数据和文档：

```text
public/data/philosophers/zhuangzi.json
public/data/philosophers/mozi.json
public/data/philosophers/mencius.json
public/data/philosophers/xunzi.json
docs/research/LOOP-LEDGER.md
docs/research/delivery-2026-06-26-classical-4-thicken.md
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

## 3. 改后厚度核查

实跑核查输出：

```text
# zhuangzi
zhuangzi:problem:001 claims=2 evidence=3 weights=2/1 publicDomainExcerptZh=3 summary_only=0
zhuangzi:problem:002 claims=2 evidence=3 weights=2/1 publicDomainExcerptZh=3 summary_only=0
zhuangzi:problem:003 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0

# mozi
mozi:problem:001 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
mozi:problem:002 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
mozi:problem:003 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0

# mencius
mencius:problem:001 claims=2 evidence=3 weights=2/1 publicDomainExcerptZh=3 summary_only=0
mencius:problem:002 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
mencius:problem:003 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0

# xunzi
xunzi:problem:001 claims=2 evidence=3 weights=2/1 publicDomainExcerptZh=3 summary_only=0
xunzi:problem:002 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
xunzi:problem:003 claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
```

---

## 4. 分哲人改动摘要

### 4.1 庄子

加厚目标：

```text
zhuangzi:problem:001 逍遥与无待自由
zhuangzi:problem:002 齐物与语言怀疑
```

新增 claim/evidence：

```text
zhuangzi:claim:005 心斋以虚静解除成见
zhuangzi:evidence:007 《庄子·人间世》：虚者心斋也段

zhuangzi:claim:006 语言不能固定最终意义
zhuangzi:evidence:008 《庄子·齐物论》：言者有言其所言未定段
```

同时为既有 evidence 补 `publicDomainExcerptZh`：

```text
zhuangzi:evidence:001 至人无己，神人无功，圣人无名。
zhuangzi:evidence:002 若一志，无听之以耳而听之以心，无听之以心而听之以气。唯道集虚。虚者，心斋也。
zhuangzi:evidence:003 彼亦一是非，此亦一是非。果且有彼是乎哉？果且无彼是乎哉？
zhuangzi:evidence:004 言非吹也，言者有言，其所言者特未定也。果有言邪？其未尝有言邪？
```

### 4.2 墨子

加厚目标：

```text
mozi:problem:002 尚贤尚同与政治正义
```

新增 claim/evidence：

```text
mozi:claim:006 尚同以形成共同判断标准
mozi:evidence:006 《墨子·尚同上》：上之所是必皆是之段
```

同时修正 weight 区分：

```text
mozi:problem:001 weights 1/1 → 2/1
mozi:problem:002 weights 1 → 2/1
```

并为既有 evidence 补 `publicDomainExcerptZh`：

```text
mozi:evidence:001 天下兼相爱则治，交相恶则乱。
mozi:evidence:002 仁人之所以为事者，必兴天下之利，除去天下之害，以此为事者也。
mozi:evidence:003 官无常贵，而民无终贱。有能则举之，无能则下之。
```

### 4.3 孟子

加厚目标：

```text
mencius:problem:001 性善与四端
```

新增 claim/evidence：

```text
mencius:claim:006 善端必须扩充才成为德性
mencius:evidence:007 《孟子·公孙丑上》：凡有四端于我者章
```

同时修正 weight 区分：

```text
mencius:problem:002 weights 1/1 → 2/1
```

并为既有 evidence 补 `publicDomainExcerptZh`：

```text
mencius:evidence:001 恻隐之心，仁之端也；羞恶之心，义之端也；辞让之心，礼之端也；是非之心，智之端也。
mencius:evidence:002 仁义礼智，非由外铄我也，我固有之也，弗思耳矣。
mencius:evidence:003 无伤也，是乃仁术也，见牛未见羊也。君子之于禽兽也，见其生，不忍见其死。
mencius:evidence:004 民为贵，社稷次之，君为轻。
```

### 4.4 荀子

加厚目标：

```text
xunzi:problem:001 性恶与化性起伪
```

新增 claim/evidence：

```text
xunzi:claim:006 礼义法度来自化性起伪
xunzi:evidence:007 《荀子·性恶》：化性起伪段
```

同时修正 weight 区分：

```text
xunzi:problem:002 weights 1/1 → 2/1
```

并为既有 evidence 补 `publicDomainExcerptZh`：

```text
xunzi:evidence:001 人之性恶，其善者伪也。今人之性，生而有好利焉，顺是，故争夺生而辞让亡焉。
xunzi:evidence:002 积土成山，风雨兴焉；积水成渊，蛟龙生焉；积善成德，而神明自得，圣心备焉。
xunzi:evidence:003 礼者，养也。
xunzi:evidence:004 名无固宜，约之以命，约定俗成谓之宜，异于约则谓之不宜。
```

---

## 5. 验证

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

## 6. 结论

本轮按 RUNBOOK §13 连续完成 4 位存量薄数据加厚。庄子、墨子、孟子、荀子的所有 thoughtSystem problem 均达到：

```text
claims >= 2
evidence >= 2
weight 有区分
publicDomainExcerptZh 完整补齐
summary_only = 0
```

正式数据校验通过。已更新 `LOOP-LEDGER.md` 并打停车戳记。Kimi 仍因额度限制停在 `zhu-xi / sources-notes`，恢复后从队列继续；若继续非 Kimi 待办，下一优先对象为 `buddha / plato / kant / nietzsche`。
