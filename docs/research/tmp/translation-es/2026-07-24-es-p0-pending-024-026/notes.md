# Notes — Spanish P0 pending EN 024–026 (2026-07-24)

**Producer:** Grok (xAI) — Spanish translation patch only.

## Why this batch

Main ES index patch covered all **361** index rows that already have admitted EN. This batch covers the **next 89** clean-Chinese rows whose EN lives only in retranslation patches 024–026 (not yet blind-reviewed / admitted).

## Sources

- Chinese: index (post-`23deb9b` cleanup; internal tags 0)
- English: offline EN patches 024–026 as terminology reference only
- Prior ES glossary: `docs/research/tmp/translation-es/2026-07-24-es-p0-index/glossary.es.json` (reuse where zh overlaps)

## Self-check

- [x] 89 ids; set equals EN patches 024–026 union
- [x] No index EN present for these ids at produce time
- [x] Every `oneLineEs` non-empty
- [x] Every `keywordsEs.length === keywordsZh.length`
- [x] No empty keywords; no TODO/TBD; no unintended CJK
- [x] Producer line present

## Contingency

Do **not** admit this Spanish patch into `public/data` until:

1. EN batches 024–026 pass blind review and are admitted to index, **or** EN wording is frozen by maintainer;
2. Schema/i18n/UI/admit tooling support Spanish fields.

If EN rework changes terminology after this patch, re-sync affected Spanish keywords/oneLiners before admit.

## Highlights (term choices)

| Area | Spanish |
|------|---------|
| logical positivism / verification | positivismo lógico / principio de verificación |
| habitus / field / cultural capital | habitus / campo / capital cultural |
| simulacra / hyperreality | simulacro / hiperrealidad |
| speech acts | actos de habla |
| mimetic desire | deseo mimético |
| epistemological obstacle | obstáculo epistemológico |
| the normal and the pathological | lo normal y lo patológico |
| descriptive metaphysics | metafísica descriptiva |
| Ortega (native Spanish author) | keep his Spanish titles/terms (razón vital, *La rebelión de las masas*) |
| Unamuno | *Del sentimiento trágico de la vida* |

## Explicit non-actions

- Did not modify `public/data`
- Did not modify Zh/En fields
- Did not admit EN 024–026
- Did not translate the 92 Chinese template-debt rows
- No commit/push
