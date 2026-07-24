# 盲审 Verdict — 西语 P0（两批合审）

日期：2026-07-24 ｜ 生产方：Grok (xAI)
覆盖批次：
- `docs/research/tmp/translation-es/2026-07-24-es-p0-index/`（361 条，索引 EN 已锁定者）
- `docs/research/tmp/translation-es/2026-07-24-es-p0-pending-024-026/`（89 条，EN 仍在离线 patch）

## 结论：**翻译内容 PASS ｜ 入库 BLOCKED（阻断在工程侧，不在翻译侧）**

翻译质量过关，可以留用；但**当前代码库没有任何路径让西语字段生效**。这不是 grok 的问题——grok 在 `notes.md` 已明确声明「No schema / i18n / UI engineering for `es` locale」，边界守得干净。阻断项须由本项目侧的代码工作解决。

## 机器门（全绿）

| 项 | 批一（361） | 批二（89） |
|---|---|---|
| id 全部存在于 `philosophers.index.json` | ✓ 0 例外 | ✓ 0 例外 |
| `keywordsEs.length === keywordsZh.length` | ✓ 0 不匹配 | ✓ 0 不匹配 |
| 空串／空数组元素 | ✓ 0 | ✓ 0 |
| TODO/TBD 占位残留 | ✓ 0 | ✓ 0 |
| 中文字符残留 | ✓ 0 | ✓ 0 |
| 两批 id 重叠 | ✓ 0（361 + 89 互斥） | |

账目对得上：361（EN 已锁）+ 89（EN 待 admit）+ 92（中文内容债，超出范围）= 542。范围划分正确，未越界。

## 内容门（抽样 18 条，覆盖希腊／德国／英美／先秦／魏晋／宋明／清代／印度／朝鲜／伊斯兰／犹太／拉美／俄国／越南）

### 质量判断：高于预期

- **无 id 错位**——抽样中每条西语内容都与该 id 的中文语义对应，未发现最危险的「译文挂错人」。✓
- **专名用西语学界正字法而非英语转写**：`halajá`（非 halakhah）、`maturidismo`、`Escuela de Marburgo`、`Orden Jogye`、`Siete Sabios del Bosque de Bambú`。✓
- **梵文术语保留天城转写**：`Sāṃkhya Kārikā`、`tres guṇas`。✓
- **西语原著还原正确**：`gustavo-gutierrez` 的《解放神学》回落为原书名 *Teología de la liberación*（该书本就是西语著作），而非从中文回译。这是本批最见功力的一处。✓
- **中文哲学术语一致处理**：`ren (humanidad)` / `ritual (li)` / `wuwei (no-acción)` / `xuanxue` / `monismo del qi` —— 罗马化 + 括注，全批统一，与 `glossary.es.json` 对得上。✓
- **德文术语保留并括注**：`Geisteswissenschaften`、`Erlebnis (vivencia)`、`Verstehen (comprensión)`。✓

### 记录项（不阻断）

1. **书名类 keywords 为自拟意译**。中文 keywords 中夹带书名（《宗镜录》《慎言》《孟子正义》《达庄论》《芸台类语》等），译为 `Registros del Espejo de la fuente` / `Palabras cautas` / `Sentido correcto de Mencio` / `Dichos clasificados de la Terraza de las Nubes`。这些多数**无既定西语学界译名**，属合理自拟，grok 在 `notes.md` open item 1 已主动声明。风险：keywords 若用于检索，自拟译名检索不到。
   → 建议：西语 keywords 中的书名保留罗马化原名 + 意译括注（如 `Zongjinglu (Espejo de la fuente)`），与哲学术语的处理方式对齐。可作为后续统一调整，不必现在返工。
   *例外*：`往事与随想` → `Pasado y pensamientos` 是通行西语译名，正确。✓

2. **个别文体生硬**：`wang-tingxiang` 的「空疏心学」→ `el vacío aprendizaje de la mente`，西语搭配不自然（`vacío` 作前置定语少见）。属文体细节，不影响正确性。

3. **oneLineEs 长度**：批一 236/361 超 120 字符，批二 39/89 超。规范 §3 的 ≤120 字符只写给 `oneLineEn`，西语未定规则，且西语学术散文天然长于英语——grok 在 `notes.md` open item 4 已提出并询问是否压缩。
   → **这需要决策**：120 字符是 UI 布局约束还是文风约束？若前端一行位宽固定，超长会破版，则须压缩；若可换行，则放宽。见下方「待决」。

## ❌ 阻断项：西语目前无入库路径

翻译落不了地，因为三处代码只认 zh/en 二值：

1. **schema 无 Es 字段** —— `src/data/schemas.ts:85-88`、`118-119` 只声明 `keywordsEn` / `oneLineEn`（均 optional）。写入 `oneLineEs` / `keywordsEs` 后 `npm run validate:data` 不会承认它们。
2. **取文函数硬编码 en** —— `src/i18n/index.ts:32-40` 的 `pickText` 内是 `if (locale === "en")` 再回退 Zh；`pickName`（同文件 27-29 行）同样是 `locale === "en" ? names.en : names.zh`。即使数据写进去，前端也读不到。
3. **Locale 类型来自 messages** —— `src/i18n/messages.ts:435` 是 `export type Locale = keyof typeof messages`，UI 文案里没有 `es` 条目，语言切换器也就没有西语选项。
4. **合并工具** —— 现有 admit 链路按 En patch 设计，未处理 Es patch。

**结论**：西语要上线，需要的是一次「多语言泛化」改造——把 Zh/En 二值结构改成按 locale 后缀取值的通用结构，而不是再加一个 `es` 分支。这是本项目侧的代码任务，与 grok 的翻译产出无关。在此之前，两份 patch **原样保存在 `docs/research/tmp/translation-es/` 即可，不要尝试 admit**。

## 待决（需 gao 拍板）

1. **西语是否现在就要上线？** 若是，先排「i18n 多语言泛化」这项代码工作（schema + pickText/pickName + Locale + 合并工具，四处）；若否，patch 存档待用，翻译不会过期（中文源已在 `23deb9b` 冻结）。
2. **oneLineEs 长度是否压到 120 字符？** 取决于上一条——UI 改造时才能确定行宽约束。在此之前不必让 grok 返工压缩。
3. **书名类 keywords 是否统一改为「罗马化 + 括注」**？建议改，但可与 En 侧同批处理，避免两种语言口径分裂。

## 给 grok 的回执（可直接转发）

> 两批西语 P0 patch 盲审通过：361 + 89 条，机器门全绿，抽样 18 条无 id 错位、无术语漂移，专名与西语学界惯例一致，`Teología de la liberación` 的原著还原处理正确。
> 暂不 admit，原因不在翻译：本项目 schema、`pickText` / `pickName`、`Locale` 类型目前只支持 zh/en 二值，西语字段没有生效路径，需先做一次多语言泛化改造。patch 原样存档，不会作废。
> 三个待定项已记录：oneLineEs 长度上限待 UI 行宽确定后再定；书名类 keywords 建议改为「罗马化 + 意译括注」；其余按你 `notes.md` 的口径保持。**现在不需要返工。**
