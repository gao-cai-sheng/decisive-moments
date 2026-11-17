# 交付说明：孔子 thoughtSystem 存量薄数据加厚

**项目**：Decisive Moments in History  
**交付时间**：2026-06-26 23:15 CST  
**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md` §13 非 Kimi 待办  
**对象**：`confucius`  
**状态**：已加厚，正式数据校验通过  

---

## 1. 背景

Kimi 当前对朱熹 `sources-notes` 阶段仍返回 `blocked_rate_limit`，日志包含 429 / usage limit。按 RUNBOOK §9 与 §13，不硬重试 Kimi，转入非 Kimi 待办：加厚已入库但偏薄的 thoughtSystem。

本轮选择孔子，原因：

```text
1. 孔子为早期既有 thoughtSystem
2. confucius-junzi 与 confucius-governance 改前均只有 1 claim / 1 evidence
3. 《论语》为公有领域文本，可较稳补 publicDomainExcerptZh
```

---

## 2. 本轮边界

本轮只修改：

```text
public/data/philosophers/confucius.json
docs/research/LOOP-LEDGER.md
docs/research/delivery-2026-06-26-confucius-thicken.md
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
其他哲人数据
```

---

## 3. 改前 / 改后厚度

| problem | 改前 | 改后 |
|---|---:|---:|
| `confucius-ren` 仁与人伦 | 2 claims / 2 evidence | 2 claims / 2 evidence |
| `confucius-li` 礼与秩序 | 2 claims / 2 evidence | 2 claims / 2 evidence |
| `confucius-junzi` 君子与修身 | 1 claim / 1 evidence | 2 claims / 2 evidence |
| `confucius-governance` 德治与政治 | 1 claim / 1 evidence | 2 claims / 2 evidence |

改后核查输出：

```text
confucius-ren claims=2 evidence=2 weights=3/2 publicDomainExcerptZh=2 summary_only=0
confucius-li claims=2 evidence=2 weights=3/2 publicDomainExcerptZh=2 summary_only=0
confucius-junzi claims=2 evidence=2 weights=2/1 publicDomainExcerptZh=2 summary_only=0
confucius-governance claims=2 evidence=2 weights=3/2 publicDomainExcerptZh=2 summary_only=0
```

---

## 4. 新增与精确化内容

### 4.1 locator 精确化 + 逐字原文

已将 6 条既有 evidence 从宽泛定位改为单一章句，并补 `publicDomainExcerptZh`：

| evidence id | 改后 locator | excerpt |
|---|---|---|
| `confucius-ren-analects` | 《论语·颜渊》：樊迟问仁章 | 樊迟问仁。子曰：爱人。 |
| `confucius-shu-analects` | 《论语·里仁》：曾子曰夫子之道章 | 夫子之道，忠恕而已矣。 |
| `confucius-li-analects` | 《论语·颜渊》：颜渊问仁章 | 克己复礼为仁。一日克己复礼，天下归仁焉。 |
| `confucius-rectification-names` | 《论语·子路》：子路问正名章 | 名不正，则言不顺；言不顺，则事不成。 |
| `confucius-learning-analects` | 《论语·为政》：学而不思则罔章 | 学而不思则罔，思而不学则殆。 |
| `confucius-governance-analects` | 《论语·为政》：道之以政章 | 道之以政，齐之以刑，民免而无耻；道之以德，齐之以礼，有耻且格。 |

### 4.2 新增 claim/evidence

新增 `confucius-junzi` 下第二条 claim：

```text
confucius-self-examination
君子以反省改过成德
```

新增 evidence：

```text
confucius-self-examination-analects
《论语·学而》：曾子三省吾身章
吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？
```

新增 `confucius-governance` 下第二条 claim：

```text
confucius-polaris-rule
君德具有凝聚秩序的中心作用
```

新增 evidence：

```text
confucius-polaris-analects
《论语·为政》：为政以德章
为政以德，譬如北辰，居其所而众星共之。
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

本轮不涉及 `admit:kimi`，因为孔子 already admitted，且本轮是 RUNBOOK §13 的存量正式数据加厚。

---

## 6. 结论

孔子 thoughtSystem 已从早期薄数据提升到 §4 质量门槛：4 个 problem 全部达到 claims>=2、evidence>=2、weight 有区分；8 条 evidence 均精确到《论语》单一章句，并补入公有领域逐字原文。正式数据校验通过。
