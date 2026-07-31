# Seed W3 生产口径（给 codex）

状态：**名单已由 gao 审核通过（2026-07-05）**。codex 可据此生产 seed batch。
上游名单：`docs/research/seed-w3-candidates.md`。生产纪律：`docs/research/review-checklist.md` §2.5。

## 通则

- 生产者只写 `.research/tmp/kimi/<batch>/`，禁碰 public/data、禁 admit --write、禁 commit/push。
- 批目录命名：`.research/tmp/kimi/2026-07-05-seed-w3-b1`（b2/b3 同）。
- 每位：`tier:"seed"`、禁 thoughtSystem、1–2 部**真实**作品（禁 placeholder/candidate/primary-work 占位 id）、**2–3 条关系**、sourceNotes≥1（SEP/IEP/Routledge 条目 + URL）。
- 关系 `themeIds` 与 philosopher `themes` **只能用 10 主题**：justice, ethics, knowledge, politics, metaphysics, language, freedom, life_death, religion, aesthetics。（admit 已含白名单前置校验，越界即 REJECT。）
- 每位**至少一条关系挂靠现库既有哲人**（下表给了锚点；批内互挂可补第 2–3 条）。
- review-verdict.md 初始写 `PENDING_BLIND_REVIEW`，由新上下文盲审员改判。

## 挂靠锚点（现库既有 id，供每位起 2–3 条关系）

### b1 — 簇 A 科学认识论线（8）
| id | 建议锚点（现库） | 关系性质提示 |
|---|---|---|
| cournot | comte, mill | 实证论语境 / 概率与经济 |
| poincare | russell, bergson | 数学基础之争 / 同代法国、时间直觉 |
| duhem | quine, poincare(批内) | Duhem–Quine 命题 reception |
| brunschvicg | kant, cavailles(批内) | 判断哲学 reception / 师承 |
| koyre | kuhn, husserl | 科学革命史 influence / 现象学师承 |
| bachelard | foucault, bergson | 认识论断裂 influence / 对绵延的批评 |
| cavailles | husserl, canguilhem(批内) | 对现象学的批评 / 概念哲学传承 |
| canguilhem | foucault, bachelard(批内) | foucault 导师 / 认识论承续 |

### b2 — 簇 B 结构/后结构（12）
| id | 建议锚点（现库） | 关系性质提示 |
|---|---|---|
| levi-strauss | rousseau, sartre | 人类学始祖认领 / 辩证理性之争 |
| lacan | alexandre-kojeve, hegel | 科耶夫讲座 / 黑格尔式主体 |
| bourdieu | weber, marx | 场域/资本 shared_problem |
| lyotard | wittgenstein, kant | 语言游戏 / 崇高与判断 |
| baudrillard | marx, foucault | 政治经济学批判 / “忘掉福柯” critique |
| michel-serres | leibniz, bergson | 莱布尼茨研究 / 生成 |
| rene-girard | nietzsche, hobbes | 怨恨与模仿 / 暴力 |
| bruno-latour | whitehead, michel-serres(批内) | 过程哲学 influence / 对话者 |
| claude-lefort | cornelius-castoriadis, machiavelli | 社会主义或野蛮共创 / 马基雅维利研究 |
| badiou | louis-althusser, plato | 阿尔都塞学生 / 柏拉图重写 |
| ranciere | louis-althusser, plato | 《阿尔都塞的教训》critique / 感性分配 |
| jean-luc-nancy | derrida, heidegger | 解构 / 共在（Mitsein） |

### b3 — 簇 C 存在/伦理（6）
| id | 建议锚点（现库） | 关系性质提示 |
|---|---|---|
| raymond-aron | weber, sartre | 韦伯引入法国 / 友敌 |
| georges-bataille | nietzsche, hegel | 逾越 / 科耶夫式黑格尔 |
| maurice-blanchot | levinas, bataille(批内) | 挚友 / 逾越与中性 |
| jankelevitch | bergson, schelling | 柏格森专著 / 自由 |
| etienne-gilson | aquinas, jacques-maritain | 托马斯主义复兴 |
| emmanuel-mounier | jacques-maritain, gabriel-marcel | 人格主义 |

## 升档标记
bachelard / canguilhem / levi-strauss / lacan / bourdieu 先以 seed 入，字段照 seed；标准档升级另开工单，不阻塞本波。

## 门禁顺序（每批）
1. `node tools/validate-kimi-research.mjs <batch>`
2. `node tools/admit-kimi-batch.mjs <batch> --tier seed`（dry-run，rc=0）
3. 新上下文盲审 → review-verdict.md 判 PASS/REJECT
4. PASS 后才 `--tier seed --write`；随后 validate-data + quality-audit --require-standard + vitest 全绿。
