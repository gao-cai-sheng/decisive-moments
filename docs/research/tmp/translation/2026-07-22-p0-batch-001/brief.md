# Translation batch P0-001 — brief

**Priority tier:** P0（`philosophers.index.json` 的 `oneLineZh → oneLineEn`、`keywordsZh → keywordsEn`）
**规模:** 6 位（首批小样，验证代理能力 + 术语纪律）
**范围出自:** Claude 侧（本文件即范围契约）。执行代理只填充，不自选范围。
**规范母文档:** `docs/i18n-content-translation-spec.md`（硬性规则以它为准）

## 为何只有 6 位

standard+iw3 共 51 位，但其中约半数 `oneLineZh` 仍是占位模板（"…问题谱系中的第一版候选哲人"），
keywordsZh 也是通用词——这些是**中文内容债**，须先补中文再翻译，不在本批。
本批只取 `oneLineZh` 为真实内容的 6 位。

## 待翻译清单（source = 现库 `public/data/philosophers.index.json`）

| id | names.en | oneLineZh（源） | keywordsZh（源） |
|---|---|---|---|
| confucius | Confucius | 以仁、礼和君子修养奠定儒家伦理政治传统。 | 伦理 / 政治 / 正义 |
| buddha | Gautama Buddha | 以苦、缘起、无我和解脱道路重塑印度思想中关于生命、执著与自由的根本问题。 | 四圣谛 / 缘起 / 无我 / 中道 / 八正道 / 涅槃 |
| plato | Plato | 以理念论和《理想国》构成西方哲学核心源头之一。 | 正义 / 知识 / 形而上学 |
| aristotle | Aristotle | 以实体、目的因和德性伦理建立系统哲学框架。 | 伦理 / 形而上学 / 政治 |
| kant | Immanuel Kant | 以批判哲学重设知识、自由和道德法则的边界。 | 知识 / 伦理 / 自由 |
| rawls | John Rawls | 以公平正义理论重塑当代政治哲学的问题框架。 | 正义 / 政治 / 伦理 |

## 要写的字段

对每个 id，产出 `oneLineEn`（1 句，≤120 字符）与 `keywordsEn`（与 keywordsZh 一一对应、等长的英文数组）。
不改任何 Zh 字段、id、其它结构。

## 术语

以 `glossary.seed.json` 为起点，**必须沿用**其中已定选择；新增术语追加进你产出的 `glossary.json` 并在 `notes.md` 说明取舍。
buddha 的佛学术语一致性是本批重点考察项。
