# Handoff — Grok 专线（索引文本层）｜2026-07-25

**写给谁**：下一任（或同一会话重启后的）**grok**，以及需要调度本线的 gao / 盲审方。  
**读完即可续跑，不必回溯聊天记录。**  
**常驻手册**（规程真源，本 handoff 只记状态）：`docs/research/RUNBOOK-text-layer-loop.md`  
**账本戳记**：`docs/research/LOOP-LEDGER.md`（文末 G1/G2 两条）

---

## 0. 你是谁、你管什么

| | |
|---|---|
| **角色** | 索引文本层执行者 |
| **只动四个字段** | `oneLineZh` · `keywordsZh` · `oneLineEn` · `keywordsEn` |
| **输入（只读）** | `public/data/philosophers/<id>.json` 的 `thoughtSystem`、`works`、`names` 等 |
| **输出位置** | 只写 `docs/research/tmp/**` 补丁；**禁碰** `public/data/` |
| **不管** | thoughtSystem / evidence / works 增删 / relationships / tier 升格 → **codex** 线 |
| **不管** | 自行 admit、commit、push、写 `review-verdict.md` |

姊妹手册：

- 思想体系：`RUNBOOK-std-upgrade-loop.md`（codex）
- 英译规范：`docs/i18n-content-translation-spec.md`
- 首批生产指令（历史）：`docs/research/zh-p0-oneline-rewrite-instruction.md`

> **⚠ tmp 根不要记混**：本线（grok 文本层）产物在 `docs/research/tmp/**`；codex 标准档线产物在 `.research/tmp/kimi/**`。两个是不同的根，同时接手两线时别写错目录。

---

## 1. TL;DR（2026-07-25 实测）

```
正式库 index：542 人
  oneLineZh 占位模板仍在库：92      ← 补丁已修好，未合入
  keywordsZh 全是主题名：118        ← 其中 89⊂92 批 + 29=G2，均未合入
  缺 oneLineEn：181                 ← 92(P0中文债) + 89(离线英译已有)

Grok 本线已产、停在 needs_human：
  G0/G1  92 人中文简介+关键词重写（含 6+2 字句修正）
  G2     29 人只补 keywordsZh

下一刀生产：G3（92 补英文）—— 硬阻塞于「G1 合入正式库」
不要做：重译 89 离线英；产新西语批；改 public/data
```

**一句话**：生产侧能写的中文文本债已经写完；卡在**盲审 + 合库**。合库前开 G3 会把占位符翻成英文垃圾。

---

## 2. 磁盘上的交付物（接着改这些，别另起炉灶）

### 2.1 G0 + G1 — 92 位占位简介重写

**目录**：`docs/research/tmp/zh-rewrite/2026-07-24-zh-p0-onelines/`

| 文件 | 作用 |
|---|---|
| `patch.philosophers.zh.json` | **主交付**。schemaVersion 1；每 id 含 `oneLineZh` + `keywordsZh`。**已含 G1 修正**。 |
| `brief.md` / `notes.md` / `open-questions.md` / `self-check.md` | 做法、口径、存疑、门 1+2 |
| `_source.extract.json` | 工作底稿（thoughtSystem 抽取），非主交付，可留 |

**名单来源**（勿改）：指令文末 7 文明组，见 `zh-p0-oneline-rewrite-instruction.md` 附录。

**盲审史**：

1. 首产 92 → 机器门全绿  
2. codex 先行盲审 REWORK（小修）  
3. Claude 复核：6 阻断 + 2 建议（见 RUNBOOK §6）  
4. **G1 已按表改完**（见下），lint 再绿 → **等复审 PASS → 合库**

**G1 已改的 8 个 id**（其余 86 字节不应再动，除非复审新点名）：

| id | 改动摘要 |
|---|---|
| `whitehead` | 摄取**代** → 摄取**替代**（31 字） |
| `amo` | **在欧** → **在欧洲的**（33 字） |
| `ockham` | 整句三分句；去掉「全能限制教权」伪因果（35 字） |
| `zelea` | **普遍性问题定义** → **界定普遍性问题**（31 字） |
| `ibn-rushd` | kw `双重真理争议` → `证明性理性` |
| `zeno-citium` | kw `冷淡之物` → `无差别之物` |
| `heidegger` | **经**此在 → **以**此在 |
| `anselm` | kw `《论证》` → `Proslogion（论证）` |

**ockham 终稿**（与 thoughtSystem 三 problem 对齐，勿再串因果）：

> 以唯名论拒绝共相实体，用神的绝对能力松动形上必然，并论证教权可错有界。

### 2.2 G2 — 29 位只补关键词

**目录**：`docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/`

| 文件 | 作用 |
|---|---|
| `patch.philosophers.zh.json` | 每 id **仅** `keywordsZh`（3–6 实词） |
| `ids.expect.txt` | 29 id 对照名单 |
| `brief.md` / `notes.md` / `open-questions.md` / `self-check.md` | 说明与自查 |

**名单**（与 expect 文件一致）：  
`confucius, laozi, zhuangzi, plato, aristotle, kant, rawls, cleanthes, chrysippus, diogenes-sinope, antisthenes, pythagoras, anaximander, anaximenes, xenophanes, empedocles, anaxagoras, zeno-elea, democritus, protagoras, gorgias, pyrrho, theophrastus, carneades, cicero, lucretius, seneca, epictetus, marcus-aurelius`

**硬规则**：这 29 人 `oneLineZh` **是好的，别改**（有的库内已短于 25 字，那是既有状态；加厚另开批，勿与 G2 混）。

**门 1 命令**（两批通用形态）：

```bash
# G1 批（无 --expect 亦可；有则更严）
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-24-zh-p0-onelines/patch.philosophers.zh.json

# G2 必须带 expect
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/ids.expect.txt
```

最近一次：**两批均 ✅ 文本补丁门通过**。合库前若再动补丁，必须重跑并贴真实输出进 `self-check.md`。

---

## 3. 队列状态板（文本层 G 系列）

| 批 | 内容 | 数 | 状态 | 阻塞 |
|---|---|---:|---|---|
| **G0** | 92 占位 oneLineZh+keywordsZh 首产 | 92 | 已产 | — |
| **G1** | 上批 6+2 字句修正 | 8 | **已写入 patch，待复审合库** | 盲审 / 本机合入 |
| **G2** | 92 外主题名关键词 → 实词 | 29 | **已产，待盲审合库** | 盲审 / 本机合入 |
| **G3** | 92 补 `oneLineEn`+`keywordsEn` | 92 | **未开工** | **G1 合入正式库** |
| **G4** | 既有 En/Es 关键词书名口径回填 | 待估 | 未估 | G3 后 |
| 西语上线 | schema + pickText/pickName | — | **挂起** | 工程，非翻译 |
| 89 离线英 | batch-011…026 已有 patch | 89 | 待盲审入库 | **非 grok 活：别重译别碰** |

### 合库后预期（给调度方）

- 占位 oneLineZh：92 → 0  
- 主题名关键词：118 → 0（89 随 92 批 + 29 随 G2）  
- 然后才谈 G3：缺 En 181 中的 92 截  

---

## 4. 质量口径（再犯会直接 REWORK）

### 4.1 oneLineZh

- **25–40 字**（中文字符数 = `len`）  
- 落在**具体概念**，禁止空话：重要 / 深远 / 奠定 / 贡献 / 集大成 / 杰出 / 著名  
- 禁止占位句：`是.*问题谱系中的第一版候选哲人`  
- **禁止凭印象补细节**——只能压缩该人 `thoughtSystem` 已有说法  

### 4.2 keywordsZh

- **3–6** 实词：学说名、核心概念、代表作、方法  
- **禁用十主题名整词**：正义 / 伦理 / 知识 / 政治 / 形而上学 / 语言 / 自由 / 生死 / 宗教 / 美学  
  （`themes` 已存；复合词如「内在自由」「公平正义」可，整词抄主题不可）  
- 组内、跨条 **关键词组合不可重复**

### 4.3 书名

- 中文原著：书名号通行名（《传习录》）  
- 有通行中译：中译 + 书名号（《第一哲学沉思集》）  
- **无通行译名**：罗马化 + 括注意译 → `Proslogion（论证）`  
- **禁止自拟**「看起来像通行译名」的书名  

### 4.4 门 2 教材（机器绿也会挂）——首批已中招

| 类型 | 反例 | 教训 |
|---|---|---|
| 压字语病 | 摄取**代**实体；在**欧**权利 | 宁可少一个概念，不许缩成不成词 |
| 凭空造因果 | 全能**限制**教权（ockham） | 「以…并…」必须回源确认是同一关系 |
| 术语译错 | 冷淡之物 ≠ ἀδιάφορα | 要用学派本义：无差别之物 |
| 后世标签当切口 | 双重真理争议（ibn-rushd） | 标签不是本人主张 |
| 书名口径 | 《论证》 | 改 Proslogion（论证） |

### 4.5 英文（G3 才用）

- 只含 `oneLineEn` / `keywordsEn`  
- `keywordsEn` 与 `keywordsZh` **等长同序**  
- `oneLineEn` ≤120 字符；无 CJK 残留  
- 规范：`docs/i18n-content-translation-spec.md`

---

## 5. 接到新会话时怎么开

### 5.1 冷启动检查清单

1. 读本 handoff + `RUNBOOK-text-layer-loop.md`  
2. `tail -n 15 docs/research/LOOP-LEDGER.md` 看最新戳记  
3. 确认 G1/G2 目录还在、patch 是否仍 lint 绿  
4. **问清本回合授权**：复审修改 / 开 G3 / 另开短简介批 / 只答疑——**不要擅自合库或开阻塞批**

### 5.2 若授权「开 G3」

前置：**正式库**里 92 人 `oneLineZh` 已不是占位（G1 已 admit）。用库内（或已合入后的）中文做源，不要用过期 tmp。

建议节奏：

1. 从 `patch.philosophers.zh.json`（合库后的字段）导出 92 的 zh 对  
2. 按文明拆 3–4 子批写 `oneLineEn`/`keywordsEn`  
3. 每子批 `text-patch-lint` + 门 2  
4. 停车交盲审；**禁止**与 89 离线批混目录

### 5.3 若复审又点名修改

- **只改点名 id**，其余 86/21 一个字节不动  
- 改完字数仍 25–40；重跑 lint；更新该批 `self-check.md`  
- 追加 `LOOP-LEDGER` 戳记  

### 5.4 合库（不是你默认权限）

合库通常由 gao / 本机脚本 / 审核授权会话做。字段只覆盖 index（及若有的 detail 镜像策略——**以仓库现有 admit 脚本为准**，本线历史未自行写 admit）。合后：

```bash
npm run validate:data
# 及项目惯用的 sync:dist / quality 门——按当时主线 handoff
```

---

## 6. 明确不是你的活（越界清单）

| 事项 | 谁 | 路径提示 |
|---|---|---|
| 89 位离线英文补丁盲审入库 | 审核 + 本机 | `docs/research/tmp/translation/2026-07-22-p0-batch-011` … `026` |
| 西语 450 上线 | 工程 | schema `Es`、`Locale`、`pickText`/`pickName` 硬编码 en |
| U8 白银时代 / bulgakov 页码 / 标准档 | codex | `.research/tmp/kimi/2026-07-24-std-u8-*` 等 |
| 前端 `keywordsEn` 不显示 | 工程 | 旧 handoff：`PhilosopherPanel` 硬编码 keywordsZh |
| commit / push / 写 verdict | 人 | 红线 |

---

## 7. 工具与命令速查

```bash
# 文本补丁机器门
node tools/text-patch-lint.mjs <patch.json> [--expect ids.txt] [--index public/data/philosophers.index.json]

# 查库内占位 / 主题名关键词 / 缺英（诊断用，只读）
python3 - <<'PY'
import json
from pathlib import Path
THEME={"正义","伦理","知识","政治","形而上学","语言","自由","生死","宗教","美学"}
idx=json.loads(Path("public/data/philosophers.index.json").read_text())
print("placeholder", sum(1 for p in idx if "第一版候选哲人" in (p.get("oneLineZh") or "")))
print("theme_kw", sum(1 for p in idx if p.get("keywordsZh") and all(k in THEME for k in p["keywordsZh"])))
print("no_en", sum(1 for p in idx if not (p.get("oneLineEn") or "").strip()))
PY
```

停车戳记格式：追加 `docs/research/LOOP-LEDGER.md`，仿：

```
[戳记] ISO时间 | from:grok → to:gao/ExternalReview | 停因:needs_human|turn_budget|... | 正式库:… | 剩余:… | 下一步:…
```

---

## 8. 已知坑（本线踩过 / 邻线相关）

1. **合库前 G3 = 灾难**：index 里仍是占位 oneLineZh；必须等 G1 入正式库。  
2. **压字是第一语病源**：机器只查长度，不查「在欧」「摄取代」是否成词。  
3. **同学派连写会句式收敛**：欧陆 33 人拆 6 子簇是对的；G3 同样要拆。  
4. **关键词组合去重**：可以两人共用单个词（如「原子与虚空」），整组 tuple 不能相同。  
5. **十主题名是整词禁用**：子串匹配若将来收紧，「羞耻与正义」可能要改（已记 G2 open-questions）。  
6. **别写 review-verdict.md**：那是盲审方文件。  
7. 邻线：vitest 可能扫到 `.claude/worktrees`——验证用主线 handoff 的 exclude；与文本补丁无关。

---

## 9. 给 gao 的调度选项（复制即可）

| 指令 | 效果 |
|---|---|
| 「复审 G1 PASS，合库」 | 本机合并 92 中文文本；解锁 G3 |
| 「盲审 / 合 G2」 | 29 关键词入 index |
| 「G1+G2 一起合」 | 主题名关键词清零 + 占位简介清零 |
| 「开 G3」 | 仅当上项 92 已在正式库 |
| 「短简介加厚批」 | 另开目录；名单另批（孔老庄等 oneLine&lt;25） |
| 「只维护 / 答疑」 | 不生产 |

---

## 10. 会话履历（本 handoff 覆盖的工作）

| 时点 | 做什么 |
|---|---|
| 执行 `zh-p0-oneline-rewrite-instruction.md` | 产 92 中文简介+关键词；门全绿 |
| 执行 RUNBOOK §6 G1 | 8 id 字句修正；lint 绿；self-check + 戳记 |
| 用户「G2 开始」 | 产 29 keywords-only；lint --expect 绿；self-check + 戳记 |
| 用户问可推进项 | 结论：生产停在 needs_human；下一步审合库 / 条件满足后 G3 |
| 用户「写专属 handoff」 | **本文件** |

---

## 11. 文件索引（下列均为相对仓库根的路径；仓库根 = Decisive Moments in History）

```
docs/research/RUNBOOK-text-layer-loop.md          # 常驻规程
docs/research/zh-p0-oneline-rewrite-instruction.md # 首批指令（历史）
docs/research/HANDOFF-2026-07-25-grok-text-layer.md # 本文件
docs/research/LOOP-LEDGER.md                      # 戳记
docs/i18n-content-translation-spec.md             # 英译
tools/text-patch-lint.mjs                         # 机器门

docs/research/tmp/zh-rewrite/2026-07-24-zh-p0-onelines/   # G0+G1
docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/   # G2

# 不要动
docs/research/tmp/translation/                    # 89 离线英
docs/research/tmp/translation-es/                  # 西语存档
public/data/                                      # 禁写（本角色）
```

---

**停因（写 handoff 时）**：`needs_human` — G1 待复审合库、G2 待盲审合库；G3 阻塞。  
**下一任 grok 第一句话建议问 gao**：本回合是「只读维护 / 按复审改点名 id / 合库后开 G3 / 其他授权」？
