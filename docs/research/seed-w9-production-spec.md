# Seed W9 生产口径（给 codex · 拉丁美洲文明）

状态：**名单已由 gao 审核通过（2026-07-05）**。上游名单：`docs/research/seed-w9-candidates.md`（含逐位锚点表）。纪律：review-checklist §2.5。

## 通则
- 只写 `.research/tmp/kimi/2026-07-05-seed-w9-b1..b3`；禁碰 public/data、禁 admit --write、禁 commit/push。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 真实作品（禁占位 id）、2–3 关系、sourceNotes≥1（SEP/IEP/学界条目 + URL）。
- `themes`/`themeIds` 只用 10 主题白名单。著作用通行汉/英译名（《法昆多》《爱丽尔》《宇宙种族》《墨西哥人的轮廓》《孤独的迷宫》等）。

## ⚠ 关系上限硬约束（已排雷，务必遵守）
下列既有 **seed** 锚点现有 2 条、上限 3，**本波每个只能被唯一一位新 seed 各挂一条**：
- `jose-ortega-y-gasset` → 只给 **francisco-romero**
- `miguel-de-unamuno` → 只给 **jose-enrique-rodo**
- `max-scheler` → 只给 **risieri-frondizi**
其余拉美这代人（samuel-ramos 等）虽受奥尔特加影响，一律改挂标准档（`zelea`/`bergson` 等）避让，**不得**再挂上述三个。其余锚点（dussel/zelea/mariategui/freire/sor-juana/comte/tocqueville/bergson/marx/heidegger/fanon/sartre/rousseau/bentham/aristotle/kant）均标准档、无上限。

## 收录判据提醒
- `las-casas` 西班牙出生但属美洲殖民思想核心，按拉美思想史归入。
- `octavio-paz` 以思想家身份收录（《孤独的迷宫》《另一个声音》），非纯诗人条目。

## 批次 & 门禁（共 22 位）
- b1 殖民+独立/19c(7,试点)：las-casas/andres-bello/simon-rodriguez/alberdi/sarmiento/hostos/gabino-barreda
- b2 反实证与身份(8)：jose-marti/jose-enrique-rodo/antonio-caso/jose-vasconcelos/alejandro-korn/samuel-ramos/francisco-romero/risieri-frondizi
- b3 解放与去殖民/当代(7)：salazar-bondy/ignacio-ellacuria/gustavo-gutierrez/rodolfo-kusch/anibal-quijano/maria-lugones/octavio-paz
- 每批：validate-kimi → admit dry-run --tier seed(含双校验) → 新上下文盲审 PASS → --write → validate-data+audit+vitest 全绿。
