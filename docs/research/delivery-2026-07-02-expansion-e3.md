# Expansion E3 Delivery — popper / kuhn / dilthey / gadamer / jaspers

时间：2026-07-02T20:50+08:00

## 范围

按 `docs/research/roster-expansion-proposal-2026-07-02.md` 已批准排期执行 E3：

- `popper`
- `kuhn`
- `dilthey`
- `gadamer`
- `jaspers`

本批完成后停车，等待外部审核复核放行；未执行 push，未提交 commit。

## 新增 philosopher

| id | 中文名 | 定位 | works | thoughtSystem |
|---|---|---|---:|---:|
| `popper` | 波普尔 | 科学哲学、批判理性主义、开放社会 | 6 | 3 / 6 / 12 |
| `kuhn` | 库恩 | 科学史哲学、范式、科学革命 | 5 | 3 / 6 / 12 |
| `dilthey` | 狄尔泰 | 精神科学、生命哲学、解释学前史 | 6 | 3 / 6 / 12 |
| `gadamer` | 伽达默尔 | 哲学解释学、效果历史、视域融合 | 6 | 3 / 6 / 12 |
| `jaspers` | 雅斯贝尔斯 | 生存哲学、界限处境、轴心时代 | 7 | 3 / 6 / 12 |

合计新增：5 位 philosopher，30 个真实 works。

## 新增 relationships

本批新增 16 条 relationships：

- `carnap-popper-critique`：`popper` → `carnap`
- `russell-popper-reception`：`russell` → `popper`
- `popper-wittgenstein-critique`：`popper` → `wittgenstein`
- `popper-kuhn-critique`：`popper` → `kuhn`
- `kuhn-quine-shared_problem`：`kuhn` → `quine`
- `carnap-kuhn-shared_problem`：`carnap` → `kuhn`
- `hegel-dilthey-reception`：`hegel` → `dilthey`
- `dilthey-heidegger-influence`：`dilthey` → `heidegger`
- `dilthey-gadamer-influence`：`dilthey` → `gadamer`
- `heidegger-gadamer-influence`：`heidegger` → `gadamer`
- `gadamer-habermas-critique`：`gadamer` → `habermas`
- `gadamer-derrida-dialogue`：`gadamer` → `derrida`
- `kierkegaard-jaspers-reception`：`kierkegaard` → `jaspers`
- `nietzsche-jaspers-reception`：`nietzsche` → `jaspers`
- `heidegger-jaspers-shared_problem`：`heidegger` → `jaspers`
- `jaspers-arendt-direct_student`：`jaspers` → `arendt`

关系验收：

```text
popper relationships=4 withExisting=3 carnap-popper-critique,russell-popper-reception,popper-wittgenstein-critique,popper-kuhn-critique
kuhn relationships=3 withExisting=2 popper-kuhn-critique,kuhn-quine-shared_problem,carnap-kuhn-shared_problem
dilthey relationships=3 withExisting=2 hegel-dilthey-reception,dilthey-heidegger-influence,dilthey-gadamer-influence
gadamer relationships=4 withExisting=3 dilthey-gadamer-influence,heidegger-gadamer-influence,gadamer-habermas-critique,gadamer-derrida-dialogue
jaspers relationships=4 withExisting=4 kierkegaard-jaspers-reception,nietzsche-jaspers-reception,heidegger-jaspers-shared_problem,jaspers-arendt-direct_student
philosophers 135 works 297 relationships 121
```

## 验收命令与结果

### 写前门

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-02-expansion-e3 && \
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-expansion-e3 --overwrite && \
node tools/quality-audit.mjs --batch .research/tmp/kimi/2026-07-02-expansion-e3/thought-systems.json --require-standard
```

结果：

```text
kimi research ok: 14 claims, 20 sources, 5 thought systems, 0 timeline items
kimi thought-system admission dry run: 5 planned, 0 written
Batch 内容审计：5 位（thought-systems.json）
  🟢 全绿 5 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 通过（含标准档硬门）
```

注：首次 batch audit 发现 4 条 `summary_thin`；已只在暂存 batch 加厚 evidence summary 后重跑通过。

### Admit + validate + build

```bash
npm run admit:kimi -- .research/tmp/kimi/2026-07-02-expansion-e3 --overwrite --write && \
npm run validate:data && \
npm run build
```

结果：

```text
kimi thought-system admission written: 5 planned, 5 written

data ok: 135 philosophers, 200 arguments, 121 relationships, 10 themes

✓ 168 modules transformed.
✓ built in 302ms
```

Vite 保留既有 chunk-size warning，构建退出成功。

### 全库标准档质量审计

```bash
node tools/quality-audit.mjs --require-standard
```

结果：

```text
内容质量审计：135 位有 thoughtSystem
  🟢 全绿 135 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  逐字原文欠债 summary_only=1574 ｜ excerptStatus 分布 {"summary_only":1574,"public_domain":72}
  ✅ 无 RED
```

## 正式库计数变化

- philosophers：130 → 135
- thoughtSystem 覆盖：130 → 135
- works：267 → 297
- relationships：105 → 121

## 停车点

E3 已交付并停车，等待外部审核复核放行。下一批 E4 暂不执行。

持续约束：

- 禁止 push。
- E3 交付后不再继续 E4，除非外部审核放行。
- B 档 Zera Yacob 后续入库 id 必须用 `zera-yacob`，与现有 `zelea` 区分。
