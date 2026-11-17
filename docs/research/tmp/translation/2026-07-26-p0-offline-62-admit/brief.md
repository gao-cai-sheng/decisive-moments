# P0 Offline 62 Admission Patch

Scope: current philosophers missing `oneLineEn` after G8/G9 merge.

Sources: `2026-07-23-p0-batch-024`, `2026-07-23-p0-batch-025`, `2026-07-23-p0-batch-026`.
Source subset counts: 2026-07-23-p0-batch-024: 23; 2026-07-23-p0-batch-025: 18; 2026-07-23-p0-batch-026: 21.

This derived patch keeps only the 62 current gaps to avoid overwriting already-admitted English fields.
Corrections applied in this admission patch:
- `george-santayana`: align `keywordsEn` with current `keywordsZh` after G8 (`理性的生命` -> `Life of Reason`).
- `alexius-meinong`, `ernst-cassirer`, `emmanuel-mounier`: break shared `Founder of t` opening flagged by text-patch-lint.
- `miguel-de-unamuno`, `max-scheler`, `maurice-blondel`, `jjc-smart`, `cornelius-castoriadis`, `jaimini`, `patanjali`, `kanada`: minimal P0 English grammar/clarity repair without changing Zh or scope.

Total ids: 62.

## IDs

- franz-brentano (2026-07-23-p0-batch-024)
- alexius-meinong (2026-07-23-p0-batch-024)
- ernst-cassirer (2026-07-23-p0-batch-024)
- josiah-royce (2026-07-23-p0-batch-025)
- george-santayana (2026-07-23-p0-batch-025)
- fh-bradley (2026-07-23-p0-batch-024)
- th-green (2026-07-23-p0-batch-026)
- georg-simmel (2026-07-23-p0-batch-024)
- max-scheler (2026-07-23-p0-batch-026)
- gabriel-marcel (2026-07-23-p0-batch-024)
- jose-ortega-y-gasset (2026-07-23-p0-batch-025)
- miguel-de-unamuno (2026-07-23-p0-batch-026)
- giovanni-gentile (2026-07-23-p0-batch-025)
- rg-collingwood (2026-07-23-p0-batch-026)
- michael-oakeshott (2026-07-23-p0-batch-026)
- jl-austin (2026-07-23-p0-batch-025)
- pf-strawson (2026-07-23-p0-batch-026)
- michael-dummett (2026-07-23-p0-batch-026)
- thomas-nagel (2026-07-23-p0-batch-026)
- georges-sorel (2026-07-23-p0-batch-025)
- nicolai-hartmann (2026-07-23-p0-batch-026)
- paul-natorp (2026-07-23-p0-batch-026)
- heinrich-rickert (2026-07-23-p0-batch-025)
- ernst-troeltsch (2026-07-23-p0-batch-024)
- maurice-blondel (2026-07-23-p0-batch-026)
- ci-lewis (2026-07-23-p0-batch-024)
- frank-ramsey (2026-07-23-p0-batch-024)
- susan-stebbing (2026-07-23-p0-batch-026)
- cd-broad (2026-07-23-p0-batch-024)
- nelson-goodman (2026-07-23-p0-batch-026)
- david-armstrong (2026-07-23-p0-batch-024)
- jjc-smart (2026-07-23-p0-batch-025)
- ruth-barcan-marcus (2026-07-23-p0-batch-026)
- john-mcdowell (2026-07-23-p0-batch-025)
- robert-brandom (2026-07-23-p0-batch-026)
- alvin-plantinga (2026-07-23-p0-batch-024)
- richard-swinburne (2026-07-23-p0-batch-026)
- rm-hare (2026-07-23-p0-batch-026)
- judith-jarvis-thomson (2026-07-23-p0-batch-025)
- alain-locke (2026-07-23-p0-batch-024)
- leo-strauss (2026-07-23-p0-batch-025)
- judith-shklar (2026-07-23-p0-batch-025)
- hans-jonas (2026-07-23-p0-batch-025)
- eric-voegelin (2026-07-23-p0-batch-024)
- alexandre-kojeve (2026-07-23-p0-batch-024)
- louis-althusser (2026-07-23-p0-batch-026)
- jan-patocka (2026-07-23-p0-batch-025)
- leszek-kolakowski (2026-07-23-p0-batch-025)
- cornelius-castoriadis (2026-07-23-p0-batch-024)
- cournot (2026-07-23-p0-batch-024)
- poincare (2026-07-23-p0-batch-026)
- duhem (2026-07-23-p0-batch-024)
- koyre (2026-07-23-p0-batch-025)
- bachelard (2026-07-23-p0-batch-024)
- canguilhem (2026-07-23-p0-batch-024)
- badiou (2026-07-23-p0-batch-024)
- raymond-aron (2026-07-23-p0-batch-026)
- etienne-gilson (2026-07-23-p0-batch-024)
- emmanuel-mounier (2026-07-23-p0-batch-024)
- jaimini (2026-07-23-p0-batch-025)
- patanjali (2026-07-23-p0-batch-026)
- kanada (2026-07-23-p0-batch-025)
