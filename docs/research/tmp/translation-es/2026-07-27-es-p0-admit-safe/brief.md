# Spanish P0 safe admission patch

Scope: derived from the two PASS Spanish P0 patches after current Chinese keyword drift.

Rules:
- Preserve every reviewed oneLineEs.
- Admit keywordsEs only when its length still matches current keywordsZh.
- Do not author replacement Spanish keywords for drifted rows.

- p0-index-current-safe: 361 ids, keywordsEs kept 332, skipped 29
- p0-pending-024-026: 89 ids, keywordsEs kept 89, skipped 0
