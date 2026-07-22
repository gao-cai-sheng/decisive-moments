# Seed W6 生产口径（给 codex · 藏传佛教）

状态：**名单已由 gao 审核通过（2026-07-05）**。上游名单：`docs/research/seed-w6-candidates.md`（含逐位锚点表）。纪律：review-checklist §2.5。
范围决定：candrakirti（月称，印度中观）**不并入 W6**，留待印度中观补白波。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w6-b1..b2`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/Treasury of Lives/学界断代 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单。锚点见名单表。
- 半传说/密续人物以传统归属根本著作为代表作，sourceNotes 注明学界断代；藏文著作用通行汉译/英译名。

## 关系上限
W6 全部锚点（nagarjuna/vasubandhu/dignaga/dharmakirti/buddha/huineng）均**标准档、无上限**，无顶爆风险。仅需保证每位新 seed 自身 2–3 条；批内互挂（gampopa↔milarepa、atisa→tsongkhapa、gorampa→tsongkhapa、buton→sakya-pandita、jamgon-kongtrul/mipham→longchenpa、dalai-lama-14→tsongkhapa）计入各自计数，且每位至少一条挂现库既有哲人。

## 批次 & 门禁
- b1 入藏祖师+早期教派(7,试点)：santaraksita/kamalasila/atisa/milarepa/gampopa/sakya-pandita/longchenpa
- b2 系统家+利美/近现代(7)：tsongkhapa/dolpopa/gorampa/buton/jamgon-kongtrul/mipham/dalai-lama-14
- 每批：validate-kimi → admit dry-run --tier seed(含双校验) → 新上下文盲审 PASS → --write → validate-data+audit+vitest 全绿。
