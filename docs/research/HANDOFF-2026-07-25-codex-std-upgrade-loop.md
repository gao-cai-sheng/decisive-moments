# Handoff — Codex 专线（标准档升格层）｜2026-07-25

**写给谁**：下一任（或同一会话重启后的）**codex**，以及需要调度本线的 gao / 盲审方。  
**读完即可续跑，不必回溯聊天记录。**  
**常驻手册**（规程真源，本 handoff 只记状态）：`docs/research/RUNBOOK-std-upgrade-loop.md`  
**账本戳记**：`docs/research/LOOP-LEDGER.md`（重点看 2026-07-24T22:38、23:05、23:34、23:51 四条）

---

## 0. 你是谁、你管什么

| | |
|---|---|
| **角色** | 种子档 → 标准档升格执行者 |
| **只生产** | `.research/tmp/kimi/<batch>/` 研究批次：`claims.json`、`proposed-philosophers.json`、`thought-systems.json`、`sources.md`、`self-review.md` 等 |
| **默认不写** | `public/data/`、`works.json`、`relationships.json`、`src/**`、`tools/**`、`scripts/**` |
| **默认不做** | `admit --write`、commit、push、写自己的 `review-verdict.md` |
| **可做** | 产批、修批、跑只读门、写 ledger 戳记、把存疑点摊开给盲审 |
| **不管** | `oneLineZh` / `keywordsZh` / `oneLineEn` / `keywordsEn` 文本层补丁 → grok 线 |

姊妹 handoff：

- 文本层：`docs/research/HANDOFF-2026-07-25-grok-text-layer.md`
- 旧总 handoff：`docs/research/HANDOFF-2026-07-23.md`

> **⚠ tmp 根不要记混**：本线（codex 标准档）产物在 `.research/tmp/kimi/**`；grok 文本层线产物在 `docs/research/tmp/zh-rewrite/**`。两个是不同的根，勿写错目录，也勿互相覆盖。

---

## 1. TL;DR（当前实测）

```
正式库：542 人
  standard：218
  seed：324
  relationships：1035
  arguments：200
  themes：10

Codex 本线当前状态：
  U5b Herzen      PASS，已由盲审/外部流程 admit 入库
  U7b Fedorov     PASS，已 admit；sources 循环举证小债已修
  U7b Bulgakov    HOLD，未入库；卡在《神的羔羊》五条页码举证
  U8 Russian      已产，待外部盲审
  U9a Theravada   已产，待外部盲审

默认下一步：
  先盲审 U8 + U9a；若继续生产而不合库，下一批是 U9b。
```

一句话：**U8/U9a 已经是可送盲审状态；Bulgakov 是未清旧债；不要把生产方自己写的批次直接 admit。**

> 上表 admit 状态与计数为写此 handoff 时的快照；冷启动请按 §4.1 重跑 `node tools/validate-data.mjs` 核对当前口径，勿直接沿用旧数字。

---

## 2. 磁盘上的交付物

### 2.1 已通过并入库的返工批

| 批 | 目录 | 状态 | 备注 |
|---|---|---|---|
| U5b Herzen | `.research/tmp/kimi/2026-07-24-std-u5b-herzen/` | PASS，已 admit | 新增两部真实 works 后修正作品归属错误 |
| U7b Fedorov | `.research/tmp/kimi/2026-07-24-std-u7b-fedorov/` | PASS，已 admit | 六个疑似自造篇名已清；三条新篇名登记待抽检 |

Fedorov 批次有一个已处理的小债：`sources.md` 两处「盲审已核实为真篇名」已改为 `Koutaissoff & Minto 英译目录实有篇名`。后续不用再修这两句；若盲审看的是旧 verdict，会看到那里仍写“下批前须改”，以当前 `sources.md` 为准。

### 2.2 未通过入库的返工批

**目录**：`.research/tmp/kimi/2026-07-24-std-u7b-bulgakov/`

状态：`HOLD`，不 admit。

核心问题不在思想内容，而在 `bulgakov-lamb-of-god` 五条 locator：

```
ch. 1  The Divine Sophia
ch. 2  Creaturely Sophia
ch. 3  Emmanuel the God-Man
ch. 4  The Incarnation
ch. 5  The Work of Christ
```

放行条件：

- 每条补页码或页码区间，并写明所据印次；
- 若拿不到实物目录，就删掉/改引可定位材料；
- 不要把主题描述补成章号。

### 2.3 待盲审的新产批 U8

**目录**：`.research/tmp/kimi/2026-07-24-std-u8-russian-silver/`

名单：

- `lev-shestov`
- `nikolai-berdyaev`
- `pavel-florensky`
- `semyon-frank`

主线：

- Shestov：反必然性与信仰不可能性
- Berdyaev：人格自由与创造伦理
- Florensky：三一友爱、Sophia 与象征知识
- Frank：不可测度者与社会精神基础

新鲜门禁：

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-24-std-u8-russian-silver
# kimi research ok: 4 claims, 16 sources, 4 thought systems, 0 timeline items

node tools/locator-lint.mjs .research/tmp/kimi/2026-07-24-std-u8-russian-silver
# locator 门通过：4 位，48 条 evidence，RED 0，待声明 0，提示 0

bash scripts/verify.sh pre .research/tmp/kimi/2026-07-24-std-u8-russian-silver
# 写前门全绿：dry-run 4 planned, 0 written；batch quality 4 绿，RED 0 / YELLOW 0
```

盲审重点：

- Shestov `Athens and Jerusalem` 无页码目录定位是否可接受；
- Berdyaev `The Philosophy of Freedom` 只用章号、无页码；
- Frank `The Unknowable` 只用 part/chapter 层级；
- Florensky / Frank 章题页码是否与所据目录一致。

### 2.4 待盲审的新产批 U9a

**目录**：`.research/tmp/kimi/2026-07-24-std-u9a-theravada-a/`

名单：

- `buddhaghosa`
- `dhammapala`
- `ledi-sayadaw`
- `mahasi-sayadaw`

主线：

- Buddhaghosa：`Visuddhimagga` 的戒、定、慧总纲
- Dhammapala：小部诗偈注疏与解脱叙事
- Ledi：阿毗达磨/内观手册化与在家传播
- Mahasi：noting、训练程序与观智地图

新鲜门禁：

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/2026-07-24-std-u9a-theravada-a
# kimi research ok: 4 claims, 14 sources, 4 thought systems, 0 timeline items

node tools/locator-lint.mjs .research/tmp/kimi/2026-07-24-std-u9a-theravada-a
# locator 门通过：4 位，48 条 evidence，RED 0，待声明 0，提示 0

bash scripts/verify.sh pre .research/tmp/kimi/2026-07-24-std-u9a-theravada-a
# 写前门全绿：dry-run 4 planned, 0 written；batch quality 4 绿，RED 0 / YELLOW 0

node tools/validate-data.mjs
# data ok: 542 philosophers (standard 218 | seed 324), 200 arguments, 1035 relationships, 10 themes
```

盲审重点：

- `dhammapala-paramatthadipani` 是集合性 workId，本批取 Therīgāthā commentary 扫描；后续是否拆分需人工判；
- Ledi 的 `ledi-paramattha-dipani` 在 works 中，但本批 evidence 未引用；当前落在 `Manuals of Dhamma` 与 `Vipassanā Dīpanī`；
- Mahasi 正式 titleEn 叫 `Manual of Vipassana Meditation`，Google Books 2016 口径叫 `Manual of Insight`，需确认是否统一展示口径。

---

## 3. 队列状态板（Codex U 线）

| 批 | 内容 | 数 | 状态 | 下一步 |
|---|---|---:|---|---|
| U5b | Herzen 返工 | 1 | PASS，已入库 | 无 |
| U7b-Fedorov | Fedorov 返工 | 1 | PASS，已入库 | 待抽检三篇名，不阻塞 |
| U7b-Bulgakov | Bulgakov 返工 | 1 | **HOLD** | 补《神的羔羊》页码或换证据 |
| U8 | 俄罗斯白银时代 | 4 | **已产，待盲审** | 外部盲审，不要自写 verdict |
| U9a | 上座部 A | 4 | **已产，待盲审** | 外部盲审，不要自写 verdict |
| U9b | 上座部 + 越南 | 4 | 未产 | `buddhadasa`、`tran-thai-tong`、`tran-nhan-tong`、`le-quy-don` |
| C1-C11 | 中华 w3 存量 | 48 | 未产 | U9 收尾后再进 |

---

## 4. 接到新会话时怎么开

### 4.1 冷启动

```bash
git branch --show-current
tail -n 20 docs/research/LOOP-LEDGER.md
git status --short
node tools/validate-data.mjs
```

确认：

- 分支应在 `kimi-research-bridge`，不要在 `master` 上开升格；
- `public/data` 不应被生产方新批次直接改；
- `.research/tmp/kimi/2026-07-24-std-u8-russian-silver/` 和 `.research/tmp/kimi/2026-07-24-std-u9a-theravada-a/` 不应有生产方自己写的 `review-verdict.md`。

### 4.2 若授权盲审 U8/U9a

这时你是审核方，不是生产方。可以写 `review-verdict.md`，但必须独立重跑：

```bash
node tools/validate-kimi-research.mjs .research/tmp/kimi/<batch>
node tools/locator-lint.mjs .research/tmp/kimi/<batch>
bash scripts/verify.sh pre .research/tmp/kimi/<batch>
node tools/validate-data.mjs
```

盲审不采信批次自述；逐条查 `sources.md` 的 `locator 版本声明`，重点打机器门看不到的地方：章节是否真实、页码是否来自所称版本、同一书连号是否像补编号。

### 4.3 若授权继续生产

默认下一批是 U9b：

```
buddhadasa
tran-thai-tong
tran-nhan-tong
le-quy-don
```

建议目录：

```
.research/tmp/kimi/2026-07-25-std-u9b-theravada-vietnam/
```

最小交付：

- 每人 3 个 problems；
- 每人 12 条 evidence；
- 全部 evidence 必须落到真实 workId；
- `sources.md` 必须有 `## locator 版本声明`；
- `self-review.md` 必须回答 RUNBOOK §4 门 5 五问；
- 产完跑 `verify.sh pre` + `locator-lint` + `validate-data`，然后停车等盲审。

### 4.4 若授权修 Bulgakov

只修 `.research/tmp/kimi/2026-07-24-std-u7b-bulgakov/`，不要顺手重写整个人。

优先顺序：

1. 找到 Boris Jakim / Eerdmans 2008 `The Lamb of God` 的目录页码；
2. 能证实五章与页码，就补 `sources.md` 和相关 locator；
3. 证实不了，就把五条换成可定位材料；
4. 改完重跑四门，更新 `self-review.md` / `open-questions.md`。

---

## 5. 红线

1. 生产批只写 `.research/tmp/kimi/<batch>/`。
2. 不要在生产方会话写 `review-verdict.md`。
3. 不要自己执行 `admit --write`，除非用户明确授权且盲审 PASS 已在磁盘上。
4. 不要改 `public/data/works.json` 来绕 `unknown_workid`；新增作品走 `proposed-works.json`，由审核/合库方手工并入。
5. 不要 commit/push；每批停车写 `LOOP-LEDGER.md` 戳记即可。
6. 不要碰 grok 文本层目录：`docs/research/tmp/zh-rewrite/**`、`docs/research/tmp/translation-es/**`。

---

## 6. 工具速查

```bash
# 单批结构门
node tools/validate-kimi-research.mjs .research/tmp/kimi/<batch>

# locator 版本声明门
node tools/locator-lint.mjs .research/tmp/kimi/<batch>

# 写前总门，只读 dry-run
bash scripts/verify.sh pre .research/tmp/kimi/<batch>

# 正式库完整性，只读
node tools/validate-data.mjs

# 确认未自写 verdict
find .research/tmp/kimi/<batch> -maxdepth 1 -name review-verdict.md -print
```

不要把 `scripts/verify.sh pre` 末尾那句「可由智能体单独执行 admit」理解成自动许可；本仓库当前纪律是**外部盲审 PASS 后再写**。
