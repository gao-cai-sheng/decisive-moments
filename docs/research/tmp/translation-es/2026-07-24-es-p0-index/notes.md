# Notes — Spanish P0 index translation (2026-07-24)

**Producer:** Grok (xAI) — Spanish translation patch only.

## Process

1. Computed eligible set from live `public/data/philosophers.index.json`: **361** entries with non-empty `oneLineEn` / `keywordsEn` and matching keyword lengths.
2. Confirmed **0** eligible rows still carry internal Chinese pipeline tags (`身份层`, `二线哲人`, `思想史补线`, `可补`, `身份层锚点`, `★升档候选`).
3. Translated `oneLineZh` → `oneLineEs` and `keywordsZh` → `keywordsEs`, calibrating technical terms against locked English fields and `names.en`.
4. Did **not** modify `public/data`, Zh/En fields, or run admit/`--write`/commit/push.
5. Git branch `translation/es-p0-index` was **not** created because the working tree already contained unrelated data upgrades; patch remains isolated under `docs/research/tmp/translation-es/`.

## Self-check

- [x] Patch id set equals eligible index id set (361)
- [x] Every `oneLineEs` non-empty
- [x] Every `keywordsEs.length === keywordsZh.length`
- [x] No empty keyword elements
- [x] No unintended CJK residue
- [x] No TODO/TBD placeholders
- [x] Producer line present

## Terminology choices (highlights)

| Domain | Choice |
|--------|--------|
| ren / 仁 | `ren (humanidad)` — keep scholarly ren + Spanish gloss |
| li / 礼 | `ritual (li)` / propiedad ritual according to context |
| wuwei / 无为 | `wuwei (no-acción)` |
| shūnyatā / 空 | `vacuidad` (Buddhist technical) |
| pramāṇa / 量 | `pramāṇa` kept; theory as `teoría del pramāṇa` |
| justice as fairness | `justicia como equidad` |
| Kyoto School | `Escuela de Kioto` |
| Pure Land | `Tierra Pura` |
| Cappadocian Fathers | `Padres Capadocios` |
| sobornost | kept as `sobornost` (+ conciliaridad when helpful) |
| Forms / Ideas (Plato) | `Ideas` / `Formas` — used `Ideas` (Spanish academic norm for Plato) |

## Open / uncertain items

1. **Chinese book titles** without a settled Spanish scholarly title were kept in pinyin or conventional English/Latin catalog form (e.g. *Baopuzi*, *Huainanzi*, *Platform Sutra* as *Sūtra de la plataforma* where used). Prefer curator override if a house style exists.
2. **Korean / Japanese / Tibetan school names** largely retain scholarly romanization (Jōdo Shinshū, Gelug, Nyingma, Sakya, etc.) rather than ad-hoc Spanish calques.
3. **Legalism / School of Names / Huang-Lao** rendered as `legalismo`, `Escuela de los Nombres`, `Huang-Lao` to stay aligned with comparative-philosophy Spanish usage.
4. A few long one-liners exceed ~160 characters; Spanish academic prose is slightly longer than the English ≤120 guideline. No EN length rule was specified for Spanish; can compress on rework if desired.
5. Keyword order strictly follows Chinese/English source order even when Spanish collocation might prefer reordering.

## Explicit non-actions

- No schema / i18n / UI engineering for `es` locale
- No merge into `public/data`
- No translation of the 181 non-eligible entries
- No fact correction of Chinese or English sources
