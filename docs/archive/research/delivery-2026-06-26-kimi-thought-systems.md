# 交付说明：Kimi 思想系统旧批次修复与正式入库

**项目**：Decisive Moments in History  
**交付时间**：2026-06-26 22:02:44 CST  
**执行人**：ChatGPT / Codex 接手处理  
**交付类型**：研究暂存数据修复、正式数据入库、校验确认  

---

## 1. 背景

Kimi 在额度周期内产出了中国古典哲人旧批次研究数据，路径为：

```text
.research/tmp/kimi/2026-06-26-batch-01-chinese-classical
```

该批次覆盖 5 位哲人：

```text
laozi
zhuangzi
mozi
mencius
xunzi
```

接手前，该批次可以通过 `validate:kimi` 的临时研究格式校验，但不能通过 `admit:kimi` 的正式入库干跑，主要原因是 `thought-systems.json` 中引用了不存在的候选作品 ID，例如 `*-candidate` workId。

此外，该批次每位哲人原本只有 2 个 `problems`，而正式数据校验 `tools/validate-data.mjs` 要求每个已入库 `thoughtSystem` 至少包含 3 个 `problems`。

---

## 2. 本次处理范围

本次处理只针对以下研究暂存批次与正式哲人详情数据：

```text
.research/tmp/kimi/2026-06-26-batch-01-chinese-classical/thought-systems.json
public/data/philosophers/laozi.json
public/data/philosophers/zhuangzi.json
public/data/philosophers/mozi.json
public/data/philosophers/mencius.json
public/data/philosophers/xunzi.json
```

未处理范围：

```text
王阳明 person queue 批次
朱熹 blocked_rate_limit 批次
前端 UI
测试脚本
schema 定义
队列脚本
```

说明：仓库在接手前已经存在其他未提交修改，例如 `docs/research/kimi-research-bridge.md`、`package.json`、若干测试与工具文件。本次交付不声称这些既有改动属于本次完成内容。

---

## 3. 已完成事项

### 3.1 修复非法 workId

将旧批次 `thought-systems.json` 中不能入库的候选作品 ID 替换为正式 `public/data/works.json` 中已存在的 workId。

| 哲人 | 原候选 workId | 修复后正式 workId |
|---|---|---|
| 老子 | `laozi-daodejing-candidate` | `laozi-primary-work` |
| 庄子 | `zhuangzi-zhuangzi-candidate` | `zhuangzi-primary-work` |
| 墨子 | `mozi-mozi-candidate` | `mozi-primary-work` |
| 孟子 | `mencius-mengzi-candidate` | `mencius-primary-work` |
| 荀子 | `xunzi-xunzi-candidate` | `xunzi-primary-work` |

修复目标是满足 `tools/admit-kimi-thought-systems.mjs` 对 `evidence.source.workId` 的要求：

```text
workId 必须存在于 public/data/works.json
workId 必须属于同一 philosopherId
```

### 3.2 补足每位哲人的第 3 个 problem

为每位哲人各补充 1 个 `problem`，并配套 1 个 `claim` 和 1 个 `evidence`，使其满足正式数据校验中 `thoughtSystem.problems.length >= 3` 的要求。

| 哲人 | 新增 problem | 主题 |
|---|---|---|
| 老子 | 语言、名与道的限度 | `language`, `metaphysics` |
| 庄子 | 生死、转化与自然化生 | `life_death`, `metaphysics` |
| 墨子 | 天志、明鬼与公共规范 | `ethics`, `politics` |
| 孟子 | 义利之辨 | `ethics`, `justice` |
| 荀子 | 天人之分 | `metaphysics`, `politics` |

新增内容均遵循 `src/data/schemas.ts` 中的 `philosopherThoughtSystemSchema`：

```text
problems[]
  claims[]
    evidence[]
```

每条新增 evidence 均包含：

```text
id
titleZh
summaryZh
source.workId
source.locator
source.excerptStatus
sourceIds
```

### 3.3 正式入库

在修复并完成 dry-run 后，已执行正式写入：

```bash
npm run admit:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical --write
```

写入结果：

```text
kimi thought-system admission written: 5 planned, 5 written
- add laozi -> public/data/philosophers/laozi.json
- add zhuangzi -> public/data/philosophers/zhuangzi.json
- add mozi -> public/data/philosophers/mozi.json
- add mencius -> public/data/philosophers/mencius.json
- add xunzi -> public/data/philosophers/xunzi.json
```

---

## 4. 验证记录

### 4.1 研究批次校验

执行：

```bash
npm run validate:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical
```

结果：

```text
kimi research ok: 22 claims, 10 sources, 5 thought systems, 0 timeline items
```

### 4.2 正式入库 dry-run

执行：

```bash
npm run admit:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical
```

结果：

```text
kimi thought-system admission dry run: 5 planned, 0 written
- add laozi
- add zhuangzi
- add mozi
- add mencius
- add xunzi
```

### 4.3 正式数据校验

正式写入后执行：

```bash
npm run validate:data
```

结果：

```text
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes
```

---

## 5. 交付产物

### 5.1 已更新正式数据文件

```text
public/data/philosophers/laozi.json
public/data/philosophers/zhuangzi.json
public/data/philosophers/mozi.json
public/data/philosophers/mencius.json
public/data/philosophers/xunzi.json
```

每个文件新增 `thoughtSystem` 字段，正式成为前端和后续数据流程可读取的思想系统数据。

### 5.2 已修复研究暂存文件

```text
.research/tmp/kimi/2026-06-26-batch-01-chinese-classical/thought-systems.json
```

该文件现已满足：

```text
validate:kimi 通过
admit:kimi dry-run 通过
无非法候选 workId
每位哲人至少 3 个 problems
```

### 5.3 当前正式库 thoughtSystem 覆盖情况

本次交付后，正式库中已有 10 位哲人具备 `thoughtSystem`：

```text
confucius
laozi
zhuangzi
mozi
mencius
xunzi
buddha
plato
kant
nietzsche
```

---

## 6. 交付状态

本次交付状态：**完成**。

已达到以下条件：

```text
旧批次 5 人完成结构修复
旧批次 5 人完成正式入库
正式数据 validate:data 通过
未修改 schema
未修改入库脚本
未修改前端 UI
```

---

## 7. 遗留事项与建议

### 7.1 王阳明批次

王阳明 person queue 批次此前已经表现为高质量候选：

```text
validate:kimi 通过
admit:kimi dry-run 通过
3 problems
7 thought-system claims
14 evidence
workId 合规
```

建议下一步单独审核并入库：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/wang-yangming --write
npm run validate:data
```

### 7.2 朱熹批次

朱熹处于 `blocked_rate_limit` 状态，Kimi 已产生较长日志，但未落成正式研究文件。

当前状态：

```text
.research/tmp/kimi/people/zhu-xi/ 为空
sources-notes.log 存在，但没有 brief.md / sources.md / notes.md 等结构化产物
```

建议后续从日志中抢救 sources-notes，或等待 Kimi 额度恢复后继续 person queue。

### 7.3 旧批次内容质量

本次修复优先目标是结构合规与可入库。旧批次 5 人的内容已经可用于第一版展示，但仍建议后续做一次内容加厚：

```text
提高部分 problem / claim 的 weight 区分度
补充更精确的 locator
增加每个 problem 下的 claim 数量
为跨哲人关系生成 relationship 候选
```

---

## 8. 结论

Kimi 旧批次的 5 位中国古典哲人研究数据已完成接手、修复、验证并正式入库。正式数据校验通过，当前项目的思想系统覆盖从原有 5 位扩展到 10 位。
