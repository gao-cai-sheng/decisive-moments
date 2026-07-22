# P0-001 translation notes

## Preflight verification

Branch: `translation/p0-batch-001` (worktree at `.claude/worktrees/beautiful-mcnulty-0dcf60`).

Compared `brief.md` source strings against `public/data/philosophers.index.json` for all six ids. **Exact match** on `oneLineZh` and `keywordsZh` (length and order). `names.en` also matches the brief table. No translation blocked.

| id | keywordsZh length | keywordsEn length | oneLineEn chars |
|---|---|---|---|
| confucius | 3 | 3 | 111 |
| buddha | 6 | 6 | 119 |
| plato | 3 | 3 | 92 |
| aristotle | 3 | 3 | 92 |
| kant | 3 | 3 | 87 |
| rawls | 3 | 3 | 87 |

## Seed terms retained (no override)

All seed choices used as given, including the Buddha set under examination:

- 四圣谛 → the Four Noble Truths  
- 缘起 → dependent origination  
- 无我 → non-self (anatta)  
- 中道 → the Middle Way  
- 八正道 → the Noble Eightfold Path  
- 涅槃 → nirvana  
- 苦 → dukkha (suffering) — full form in glossary; oneLine uses bare **dukkha** for length  
- 解脱 → liberation  

Also retained without change: 仁/礼/君子/儒家, 理念论/理想国, 实体/目的因/德性伦理, 批判哲学/道德法则, 公平正义, and the shared keyword set 正义/伦理/政治/知识/形而上学/自由.

## New glossary terms (batch-only)

| Zh | En choice | Rationale |
|---|---|---|
| 君子修养 | junzi cultivation | Keeps seed **junzi**; “cultivation” is standard for 修养 in Confucian ethics (vs. “self-cultivation of the junzi”, longer). |
| 伦理政治 | ethical-political | Hyphenated compound for 伦理政治传统 as one modifier. |
| 执著 | attachment | Common English for Buddhist *upādāna* / clinging; alternative **clinging** equally good—chose the more general-reader form. |
| 问题框架 | problem-frame | Calques 问题框架 without over-technical “problematic”; alternative “problematics” rejected as jargony. |
| 系统哲学框架 | systematic philosophical framework | Natural prose expansion of 系统哲学框架. |
| 重设边界 | reset the bounds | Verb phrase for 重设…的边界; “redraw the limits” was a near alternative. |

## oneLine decisions

### confucius
Source front-loads 以仁、礼和君子修养. English leads with the achievement (“Founded…tradition”) then instruments, avoiding 以-serial Chinese syntax. Kept **ren (humaneness)** and **junzi** per seed/spec on Romanization + gloss.

### buddha
Priority: seed Buddhist terms exact in `keywordsEn`. In `oneLineEn`, 无我 shortened to **non-self** (anatta reserved for keywords); 苦 as **dukkha** only. **解脱道路** compressed to **liberation**—the “path” sense is carried by “through … and liberation” rather than the longer “path to liberation” (would exceed ~120). **执著** → attachment (see glossary).

### plato
**理念论** → theory of Forms (seed); **《理想国》** → the Republic (seed, italic not used in plain JSON strings). “One of the core sources” mirrors 核心源头之一 without claiming sole origin.

### aristotle
**实体 / 目的因 / 德性伦理** all seed-aligned. “Built … around” for 建立…框架.

### kant
**批判哲学 / 道德法则** seed-aligned. “Reset the bounds of X, Y, and Z” for 重设…的边界—academic-prose, not calque “re-set the boundary of”.

### rawls
**公平正义** → justice as fairness (seed, Rawls’s own English). “Problem-frame” for 问题框架 (see new terms).

## Deliberate non-choices / open for reviewer

1. **仁**: seed locks **ren (humaneness)** rather than benevolence/humanity—followed.  
2. **自由** (Kant keyword and Buddha oneLine): seed **freedom**, not “liberty” or “autonomy”; for Kant moral philosophy some prefer autonomy, but keyword must stay one-to-one with 自由 → freedom.  
3. **Forms** capital F: conventional for Plato’s technical term; left capitalized in oneLine.  
4. **nirvana**: seed lowercase; kept lowercase (common in philosophical English; Sanskrit *nirvāṇa* not required here).  
5. Buddha oneLine is 119 chars—tight; if reviewer wants “path to liberation” or full “dukkha (suffering)”, trim elsewhere (e.g. “Recast Indian thought on life…” → “Recast Indian views of life…”).

## Scope compliance

- Wrote only under `docs/research/tmp/translation/2026-07-22-p0-batch-001/`: `glossary.json`, `patch.philosophers.json`, `notes.md`.  
- Did **not** modify `public/data/**` or any Zh fields.  
- No admit / merge performed.
