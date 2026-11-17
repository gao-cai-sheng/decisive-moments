# Seed W7 生产口径（给 codex · 伊斯兰文明）

状态：**名单已由 gao 审核通过（2026-07-05）**。上游名单：`docs/research/seed-w7-candidates.md`（含逐位锚点表）。纪律：review-checklist §2.5。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w7-b1..b4`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/Encyclopaedia of Islam/学界断代 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单。锚点见名单表。
- 著作用通行汉译/英译名（如《哈义·本·叶格赞》《玛斯纳维》《性理之净化》）；生卒有争议者 sourceNotes 注明。

## 关系上限
W7 全部锚点（al-kindi/al-farabi/ibn-sina/al-ghazali/ibn-rushd/ibn-arabi/suhrawardi/ibn-khaldun/mulla-sadra/iqbal + aristotle/plato/plotinus/maimonides）**均标准档、无上限**，无顶爆风险。仅需每位新 seed 自身 2–3 条，且至少一条挂现库既有哲人；批内互挂（al-ashari↔al-maturidi、al-juwayni↔al-baqillani、al-junayd↔al-hallaj、al-afghani↔muhammad-abduh、nasir-al-din-tusi→fakhr-al-din-al-razi）计入各自计数。

## 注意
- 两位「拉齐」是不同人：`abu-bakr-al-razi`（医师-自由思想家，854—925）与 `fakhr-al-din-al-razi`（教义学家，1150—1210）。勿混淆生卒/著作。

## 批次 & 门禁
- b1 kalam(6,试点)：wasil-ibn-ata/al-ashari/al-maturidi/al-baqillani/al-juwayni/fakhr-al-din-al-razi
- b2 falsafa(6)：abu-bakr-al-razi/miskawayh/ibn-bajja/ibn-tufayl/ibn-hazm/nasir-al-din-tusi
- b3 sufism(5)：rabia-al-adawiyya/al-junayd/al-hallaj/rumi/nasir-khusraw
- b4 晚期与近现代(7)：ibn-taymiyya/mir-damad/tabatabai/al-afghani/muhammad-abduh/fazlur-rahman/seyyed-hossein-nasr
- 每批：validate-kimi → admit dry-run --tier seed(含双校验) → 新上下文盲审 PASS → --write → validate-data+audit+vitest 全绿。
