# Spanish P0 Admission Note

Date: 2026-07-27

Engineering blocker from `2026-07-24-es-p0-index/review-verdict.md` was removed:

- schema accepts `oneLineEs` / `keywordsEs`
- `pickText` and `pickName` support `es`
- settings exposes `Español`
- text patch lint/apply accept Spanish index fields

Admission used derived safe patches:

- `oneLineEs`: 450 / 542 admitted
- `keywordsEs`: 421 / 542 admitted
- skipped `keywordsEs`: 29 reviewed rows whose `keywordsEs.length` no longer matched current `keywordsZh.length`

No replacement Spanish keywords were authored in this admission step.
