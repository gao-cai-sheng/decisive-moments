# Expansion E2 Delivery — peirce / james / du-bois / moore

时间：2026-07-02T20:37+08:00

## 范围

按 `docs/research/roster-expansion-proposal-2026-07-02.md` 已批准排期执行 E2：

- `peirce`
- `james`
- `du-bois`
- `moore`

本批完成后停车，等待外部审核复核放行；未执行 push。

## 新增 philosopher

| id | 中文名 | 定位 | works | thoughtSystem |
|---|---|---|---:|---:|
| `peirce` | 皮尔士 | 美国实用主义、符号学、科学探究逻辑 | 6 | 3 / 6 / 12 |
| `james` | 威廉·詹姆斯 | 实用主义、彻底经验主义、宗教经验与心理学 | 7 | 3 / 6 / 12 |
| `du-bois` | 杜波依斯 | 非裔现代政治思想、双重意识、废奴民主 | 8 | 3 / 6 / 12 |
| `moore` | G. E. 摩尔 | 伦理非自然主义、反观念论、常识实在论 | 7 | 3 / 6 / 12 |

合计新增：4 位 philosopher，28 个真实 works。

## 新增 relationships

本批新增 13 条 relationships：

- `kant-peirce-influence`：`kant` → `peirce`
- `peirce-james-pragmatism`：`peirce` → `james`
- `peirce-dewey-influence`：`peirce` → `dewey`
- `james-dewey-influence`：`james` → `dewey`
- `james-bergson-shared_problem`：`james` → `bergson`
- `james-du-bois-teacher`：`james` → `du-bois`
- `hegel-du-bois-reception`：`hegel` → `du-bois`
- `marx-du-bois-influence`：`marx` → `du-bois`
- `du-bois-dewey-shared_problem`：`du-bois` → `dewey`
- `moore-russell-influence`：`moore` → `russell`
- `moore-wittgenstein-reception`：`moore` → `wittgenstein`
- `frege-moore-shared_problem`：`frege` → `moore`
- `mill-moore-critique`：`moore` → `mill`

关系验收：

```text
peirce relationships=3 withExisting=2 kant-peirce-influence,peirce-james-pragmatism,peirce-dewey-influence
james relationships=4 withExisting=2 peirce-james-pragmatism,james-dewey-influence,james-bergson-shared_problem,james-du-bois-teacher
du-bois relationships=4 withExisting=3 james-du-bois-teacher,hegel-du-bois-reception,marx-du-bois-influence,du-bois-dewey-shared_problem
moore relationships=4 withExisting=4 moore-russell-influence,moore-wittgenstein-reception,frege-moore-shared_problem,mill-moore-critique
philosophers 130 works 267 relationships 105
```

## 验收命令与结果

### 写前门

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-02-expansion-e2 && \
node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/2026-07-02-expansion-e2 --overwrite && \
node tools/quality-audit.mjs --batch .research/tmp/kimi/2026-07-02-expansion-e2/thought-systems.json --require-standard
```

结果：

```text
kimi research ok: 14 claims, 16 sources, 4 thought systems, 0 timeline items
kimi thought-system admission dry run: 4 planned, 0 written
Batch 内容审计：4 位（thought-systems.json）
  🟢 全绿 4 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

注：首次 batch audit 发现 `james:evidence:012` summary_thin 1 条；已在暂存 batch 修正后重跑通过。

### Admit + validate + build

```bash
node tools/admit-kimi-thought-systems.mjs .research/tmp/kimi/2026-07-02-expansion-e2 --overwrite --write && \
npm run validate:data && \
npm run build
```

结果：

```text
kimi thought-system admission written: 4 planned, 4 written

data ok: 130 philosophers, 200 arguments, 105 relationships, 10 themes

✓ 168 modules transformed.
✓ built in 287ms
```

Vite 保留既有 chunk-size warning，构建退出成功。

### 全库标准档质量审计

```bash
node tools/quality-audit.mjs --require-standard
```

结果：

```text
内容质量审计：130 位有 thoughtSystem
  🟢 全绿 130 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  逐字原文欠债 summary_only=1514 ｜ excerptStatus 分布 {"summary_only":1514,"public_domain":72}
  ✅ 无 RED
```

## 正式库计数变化

- philosophers：126 → 130
- thoughtSystem 覆盖：126 → 130
- works：239 → 267
- relationships：92 → 105

## 停车点

E2 已交付并停车，等待外部审核复核放行。下一批 E3 暂不执行。

持续约束：

- 禁止 push。
- E2 交付后不再继续 E3，除非外部审核放行。
- B 档 Zera Yacob 后续入库 id 必须用 `zera-yacob`，与现有 `zelea` 区分。
