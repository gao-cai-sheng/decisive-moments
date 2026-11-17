# Seed W5 生产口径（给 codex）

状态：**名单已由 gao 审核通过（2026-07-05）**。上游名单：`docs/research/seed-w5-candidates.md`（含逐位锚点表）。纪律：review-checklist §2.5。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w5-b1..b4`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/Routledge/学界断代说明 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单。锚点见名单表。
- **半传说奠基者**（kapila-ishvarakrishna/patanjali/jaimini/aksapada-gautama/kanada/badarayana）：以传统归属的根本经为代表作，sourceNotes 注明学界断代争议，不编造精确生卒。

## ⚠ 关系上限硬约束（已排雷，务必遵守）
下列既有 **seed** 锚点现有 2 条、全库上限 3，**本波每个只能被唯一一位新 seed 各挂一条**：
- `xuanzang` → 只给 **wonhyo**
- `shandao` → 只给 **honen**
- `zongmi` → 只给 **jinul**
- `jizang` → 只给 **wonhyo**
kukai 已改挂标准档 `nagarjuna`（真言宗祖师），不得再挂 xuanzang。其余锚点（adi-shankara/dignaga/dharmakirti/nagarjuna/vasubandhu/buddha/huineng/zhu-xi/confucius/xunzi/toegye/zhang-zai/nishida/dogen/shinran/mill/heidegger 等）均标准档，无上限。

## 批次 & 门禁
- b1 印度六派奠基(7,试点) → b2 印度后期/近现代(6) → b3 日本(10) → b4 朝鲜(5)。
- 每批：validate-kimi → admit dry-run --tier seed(含双校验) → 新上下文盲审 PASS → --write → validate-data+audit+vitest 全绿。
