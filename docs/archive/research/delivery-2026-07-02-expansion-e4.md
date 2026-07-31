# Expansion E4 Delivery — sextus-empiricus / duns-scotus / al-kindi / suhrawardi / ibn-arabi

时间：2026-07-02T21:18+08:00

## 范围

按 `docs/research/roster-expansion-proposal-2026-07-02.md` 已批准排期执行 E4：

- `sextus-empiricus`
- `duns-scotus`
- `al-kindi`
- `suhrawardi`
- `ibn-arabi`

本批完成后停车，等待外部审核复核放行；未执行 push，未提交 commit。

## 新增 philosopher

| id | 中文名 | 定位 | works | thoughtSystem |
|---|---|---|---:|---:|
| `sextus-empiricus` | 塞克斯都·恩披里柯 | 皮浪主义怀疑论、悬搁判断、反独断论 | 5 | 3 / 6 / 12 |
| `duns-scotus` | 邓斯·司各脱 | 经院哲学、存在单义性、此性与形式区别 | 6 | 3 / 6 / 12 |
| `al-kindi` | 肯迪 | 阿拉伯哲学源头、第一哲学、翻译运动 | 6 | 3 / 6 / 12 |
| `suhrawardi` | 苏赫拉瓦迪 | 照明哲学、临现知识、光形而上学 | 6 | 3 / 6 / 12 |
| `ibn-arabi` | 伊本·阿拉比 | 苏非形而上学、存在显现、完人和想象 | 6 | 3 / 6 / 12 |

合计新增：5 位 philosopher，29 个真实 works。

## 新增 relationships

本批新增 17 条 relationships：

- `pyrrho-sextus-reception`：`pyrrho` → `sextus-empiricus`
- `sextus-carneades-critique`：`sextus-empiricus` → `carneades`
- `sextus-montaigne-influence`：`sextus-empiricus` → `montaigne`
- `sextus-hume-reception`：`sextus-empiricus` → `hume`
- `aquinas-duns-scotus-critique`：`duns-scotus` → `aquinas`
- `duns-scotus-ockham-influence`：`duns-scotus` → `ockham`
- `duns-scotus-peirce-reception`：`duns-scotus` → `peirce`
- `aristotle-al-kindi-reception`：`aristotle` → `al-kindi`
- `plotinus-al-kindi-reception`：`plotinus` → `al-kindi`
- `al-kindi-al-farabi-influence`：`al-kindi` → `al-farabi`
- `al-kindi-ibn-sina-influence`：`al-kindi` → `ibn-sina`
- `ibn-sina-suhrawardi-critique`：`suhrawardi` → `ibn-sina`
- `al-ghazali-suhrawardi-shared_problem`：`al-ghazali` → `suhrawardi`
- `suhrawardi-mulla-sadra-influence`：`suhrawardi` → `mulla-sadra`
- `al-ghazali-ibn-arabi-reception`：`al-ghazali` → `ibn-arabi`
- `plotinus-ibn-arabi-shared_problem`：`plotinus` → `ibn-arabi`
- `ibn-arabi-mulla-sadra-influence`：`ibn-arabi` → `mulla-sadra`

关系验收：

```text
sextus-empiricus relationships=4 withExisting=4 pyrrho-sextus-reception,sextus-carneades-critique,sextus-montaigne-influence,sextus-hume-reception
duns-scotus relationships=3 withExisting=3 aquinas-duns-scotus-critique,duns-scotus-ockham-influence,duns-scotus-peirce-reception
al-kindi relationships=4 withExisting=4 aristotle-al-kindi-reception,plotinus-al-kindi-reception,al-kindi-al-farabi-influence,al-kindi-ibn-sina-influence
suhrawardi relationships=3 withExisting=3 ibn-sina-suhrawardi-critique,al-ghazali-suhrawardi-shared_problem,suhrawardi-mulla-sadra-influence
ibn-arabi relationships=3 withExisting=3 al-ghazali-ibn-arabi-reception,plotinus-ibn-arabi-shared_problem,ibn-arabi-mulla-sadra-influence
philosophers 140 works 326 relationships 138
```

## 验收命令与结果

### 写前门

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-02-expansion-e4 && \
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-expansion-e4 --overwrite && \
node tools/quality-audit.mjs --batch .research/tmp/kimi/2026-07-02-expansion-e4/thought-systems.json --require-standard
```

结果：

```text
kimi research ok: 12 claims, 20 sources, 5 thought systems, 0 timeline items
kimi thought-system admission dry run: 5 planned, 0 written
Batch 内容审计：5 位（thought-systems.json）
  🟢 全绿 5 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

注：首次 batch audit 发现 15 条 `summary_thin`；已只在暂存 batch 加厚 evidence summary 后重跑通过。加厚中曾触发一次暂存 JSON 逗号错误，已修复后重新通过 `validate-kimi`。

### Admit + validate + build

```bash
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-expansion-e4 --overwrite --write && \
npm run validate:data && \
npm run build
```

结果：

```text
kimi thought-system admission written: 5 planned, 5 written

data ok: 140 philosophers, 200 arguments, 138 relationships, 10 themes

✓ 168 modules transformed.
✓ built in 299ms
```

Vite 保留既有 chunk-size warning，构建退出成功。

### 全库标准档质量审计

```bash
node tools/quality-audit.mjs --require-standard
```

结果：

```text
内容质量审计：140 位有 thoughtSystem
  🟢 全绿 140 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  逐字原文欠债 summary_only=1634 ｜ excerptStatus 分布 {"summary_only":1634,"public_domain":72}
  ✅ 无 RED
```

## 正式库计数变化

- philosophers：135 → 140
- thoughtSystem 覆盖：135 → 140
- works：297 → 326
- relationships：121 → 138

## 停车点

E4 已交付并停车，等待外部审核复核放行。下一批 E5 暂不执行。

持续约束：

- 禁止 push。
- E4 交付后不再继续 E5，除非外部审核放行。
- B 档 Zera Yacob 后续入库 id 必须用 `zera-yacob`，与现有 `zelea` 区分。
