# Seed W4 生产口径（给 codex）

状态：**名单已由 gao 审核通过（2026-07-05）**。codex 可据此生产 seed batch。
上游名单：`docs/research/seed-w4-candidates.md`。生产纪律：`docs/research/review-checklist.md` §2.5。

## 通则
- 生产者只写 `.research/tmp/kimi/<batch>/`，禁碰 public/data、禁 admit --write、禁 commit/push。
- 批目录：`.research/tmp/kimi/2026-07-05-seed-w4-b1`、`...-b2`。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 部**真实**作品（禁 placeholder/candidate/primary-work 占位 id）、**2–3 条关系**、sourceNotes≥1（SEP/IEP/Routledge 条目 + URL）。
- philosopher `themes` 与关系 `themeIds` **只能用 10 主题**：justice, ethics, knowledge, politics, metaphysics, language, freedom, life_death, religion, aesthetics。（admit 已含白名单前置校验。）
- **每位至少一条关系挂靠现库既有哲人**；批内互挂可补第 2–3 条。
- **优先挂标准档锚点**（见下表）。避免把既有 seed 哲人顶爆——admit 现含 whole-graph seed 关系上限(≤3)前置校验，越界 dry-run 即 REJECT。挂靠既有 seed（如 comte 是标准/需确认；bergson/poincare 等）前先想清其现有边数。
- review-verdict.md 初始 `PENDING_BLIND_REVIEW`，由新上下文盲审员改判。

## 挂靠锚点（现库既有 id）

### b1 — 簇 A 启蒙（8）
| id | 建议锚点 | 关系性质提示 |
|---|---|---|
| voltaire | locke, rousseau | 经验论推崇 / 同代论争 |
| diderot | rousseau, locke | 友谊与决裂 / 经验论 |
| montesquieu | hobbes, tocqueville | 政体论 / 影响托克维尔 |
| condillac | locke, diderot(批内) | 感觉论承续 |
| condorcet | comte, rousseau | 进步史观 influence / 政治哲学 |
| holbach | spinoza, diderot(批内) | 唯物论/决定论 |
| helvetius | locke, bentham | 感觉论伦理 / 功利主义 influence |
| la-mettrie | descartes, spinoza | 机械论 / 唯物论 |

### b2 — 簇 B 17c（3）+ 组 C 19c（5）
| id | 建议锚点 | 关系性质提示 |
|---|---|---|
| malebranche | descartes, leibniz | 偶因论 / 通信论争 |
| gassendi | descartes, epicurus | 《诘难》critique / 伊壁鸠鲁复兴 |
| pierre-bayle | leibniz, spinoza | 《神义论》回应 / 辞典条目 |
| maine-de-biran | descartes, bergson | 内在努力 / 影响柏格森 |
| victor-cousin | hegel, kant | 折衷主义 reception |
| renouvier | kant, james | 新批判主义 / 影响詹姆斯 |
| ravaisson | bergson, aristotle | 《论习惯》influence / 亚里士多德研究 |
| boutroux | comte, poincare | 决定论批判 / 偶然性（接 W3 poincaré） |

## 门禁顺序（每批）
1. `node tools/validate-kimi-research.mjs <batch>`
2. `node tools/admit-kimi-batch.mjs <batch> --tier seed`（dry-run，rc=0；含 theme 白名单 + seed 关系上限双校验）
3. 新上下文盲审 → review-verdict.md 判 PASS/REJECT
4. PASS 后 `--tier seed --write`；随后 validate-data + quality-audit --require-standard + vitest 全绿。
