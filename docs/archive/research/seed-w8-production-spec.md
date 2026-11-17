# Seed W8 生产口径（给 codex · 犹太文明）

状态：**名单已由 gao 审核通过（2026-07-05，含加入 philo-of-alexandria）**。上游名单：`docs/research/seed-w8-candidates.md`（含 scope 说明与逐位锚点表）。纪律：review-checklist §2.5。

## 范围硬约束
- 只收**可考哲学家**。**禁**收圣经/神话人物（亚伯拉罕/摩西/先知/族长等）——它们只作为主题(religion)与关系挂靠内容，不建条目。
- 谱系起于斐洛（古代）与中世纪系统家；不早于此、不触神话层。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w8-b1..b3`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/Encyclopaedia Judaica/Stanford + URL）。
- `themes`/`themeIds` 只用 10 主题白名单。著作用通行汉/英译名（《生命之源》《库萨里》《光辉之书》《坦尼亚》等）；生卒争议（bahya、卡巴拉人物）sourceNotes 注明。

## 关系上限
全部锚点（saadia-gaon/maimonides/buber/levinas/rosenzweig/cohen + philo 挂的 plato/aristotle/plotinus/spinoza/benjamin/kant/ibn-rushd/ibn-sina/al-ghazali）**均标准档、无上限**，无顶爆风险。每位新 seed 自身 2–3 条、至少一条挂现库既有哲人；批内互挂（hasdai-crescas←joseph-albo、nachmanides↔moses-de-leon、baal-shem-tov←schneur-zalman 等）计入计数。

## 批次 & 门禁（共 21 位）
- b1 philo + 中世纪(9,试点)：philo-of-alexandria/isaac-israeli/ibn-gabirol/bahya-ibn-paquda/judah-halevi/abraham-ibn-daud/gersonides/hasdai-crescas/joseph-albo
- b2 卡巴拉与哈西德(6)：nachmanides/moses-de-leon/abraham-abulafia/isaac-luria/baal-shem-tov/schneur-zalman
- b3 哈斯卡拉与现代(6)：moses-mendelssohn/gershom-scholem/abraham-joshua-heschel/joseph-soloveitchik/mordecai-kaplan/yeshayahu-leibowitz
- 每批：validate-kimi → admit dry-run --tier seed(含双校验) → 新上下文盲审 PASS → --write → validate-data+audit+vitest 全绿。
