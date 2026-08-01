# P0-008 notes

**Producer:** Grok (xAI) — translation content.

## Preflight
All 20 ids from brief present in index; `oneLineZh`/`keywordsZh` from `public/data/philosophers.index.json` (SoT). None skipped.

## Uncertain / contested choices
- 本质/能质之分 is one keyword (index length=4; brief-table slash split is not SoT).
- 明夷待访录 → Waiting for the Dawn.
- 声无哀乐论 → Music Has Neither Grief nor Joy.
- 焚书 → A Book to Burn.

## Skipped ids
None.

## Compliance
- En-only incremental patch; no Zh/id/structure changes; `public/data` untouched; no commit/push.
- Glossary append-only from previous batch; `oneLineEn` ≤120; keywords equal length/order to source.
