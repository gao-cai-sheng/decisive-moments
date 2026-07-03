# 执行手册：Kimi 思想系统数据自驱循环（Standing Loop Runbook）

**给执行者**：ChatGPT / Codex
**性质**：常驻手册。每次开工都按本手册循环推进，直到额度耗尽或触发"需人工"的检查点。不要等待逐条指令——本手册就是你的循环。
**项目**：Decisive Moments in History
**当前进度（2026-06-26）**：100 位哲人中仅 10 位有 `thoughtSystem`，**90 位待补**。王阳明（wang-yangming）研究已就绪可入库；朱熹（zhu-xi）目录空、待研究。

---

## 0. 每次开工的前三步（必做，决定可续性）

```text
1. 读本手册（docs/research/RUNBOOK-kimi-autonomous-loop.md）
2. 读账本   docs/research/LOOP-LEDGER.md（不存在就按 §7 模板新建）
3. 读队列   npm run kimi:queue -- next        # 打印下一个待办阶段
            （首次或队列过期时先 npm run kimi:queue -- init 重建 manifest）
```

读完你就知道"上次到哪、这次从哪继续"。**永远从账本+队列恢复，不要从记忆假设进度。**

---

## 1. 循环总览

```text
┌─> A. 选目标：取下一个缺 thoughtSystem 的哲人（§2）
│   B. 产研究：把该哲人推进到 thought-system 阶段完成（§3.1）
│   C. 达标：把内容加厚到质量门槛（§4）——不要只满足"能过校验"
│   D. 校验：validate:kimi → admit dry-run（§5 门 1-2）
│   E. 入库：admit --overwrite --write（被拦则走 §6 等价方案）
│   F. 复核：validate:data + 克隆仓库逐字节自检（§5 门 3 + §6）
│   G. 记账+交付：更新 LEDGER，写本轮交付说明（§7、§8）
└── 回到 A（除非触发 §9 限额 或 §10 人工检查点）
```

一次循环 = 一位哲人入库。能连着跑就连着跑。

---

## 2. 选取下一个目标

队列引擎已按"缺 thoughtSystem"自动建好名单。优先级：

```text
1. 已就绪可直接入库者：任何 .research/tmp/kimi/people/<id>/thought-systems.json 已存在、但正式库该人还没 thoughtSystem 的 → 先清掉（这步不调 Kimi，限额时也能做）
2. kimi:queue -- next 指向的下一个 pending 阶段（这步要调 Kimi 生成研究）
3. blocked 的两种情况要分清：
   - 单人因【非额度】原因 failed → 记账后跳过该人，换下一个 pending
   - Kimi【额度】429（lastError 含 "rate limit"）→ 全局：所有 pending 的 run-next 都会 429，所以**不要再逐个找 Kimi 生成研究**。
     但这【不是停车】——立即按 §9 转 §13，用编排方自己的额度接手非 Kimi 待办，继续干；§13 也空了才停车。
```

命令：

```bash
npm run kimi:queue -- status   # 看全局（如无此子命令，直接读 .research/tmp/kimi/person-queue/manifest.json）
npm run kimi:queue -- next     # 下一个待办阶段
```

每人三阶段顺序固定：`sources-notes → claims → thought-system`。

---

## 3. 单人处理流水线

### 3.1 产出研究（推进队列阶段）

对当前哲人反复执行，直到 `thought-system` 阶段 done：

```bash
npm run kimi:queue -- run-next   # 跑一个 Kimi 阶段，状态写回 manifest.json
```

- 退出码 2 = `blocked_rate_limit` 或 `failed`。若是限额 → 转 §9。若是 failed → 读该阶段 logPath，按 §10 判断能否自行修复。
- `run-next` 跑完 thought-system 阶段会自动做一次 `validateResearchBatch`。

### 3.2 该哲人的研究产物落在

```text
.research/tmp/kimi/people/<philosopherId>/
  brief.md  sources.md  notes.md  open-questions.md
  works-candidates.json  claims.json  thought-systems.json
```

`thought-systems.json` 就是后续 admit 的输入。

---

## 4. 质量门槛（硬性，低于此不许入库）

Kimi 初产的 thought-system 往往偏薄（旧批次就是每 problem 仅 1 claim/1 evidence）。**入库前必须加厚到下列标准**，否则只是"应试式"垃圾数据：

**两档制：硬下限（低于=RED，不许入库）＋ 标准档（低于=YELLOW，算"没加厚完"）。只压到硬下限不叫达标——那正是 round B（2026-07-01）退化的样子：全绿门禁下 evidence 密度砍半、行文贴着 20 字线。**

硬下限（RED，入库前必须清零）：

```text
每位哲人 thoughtSystem.problems >= 3
每个 problem: claims >= 2
每个 problem: evidence 合计 >= 2
每个 claim 是该哲人在该问题上的【实质立场】，不是复述问题
每条 evidence 的 summaryZh 长度 >= 20 字
```

标准档（本轮交付前应做到；未达则 quality-audit 报 YELLOW，需在交付说明里显式解释为何停在下限）：

```text
每个 claim: evidence >= 2（低于报 YELLOW thin_evidence）——round A（2026-06-27）是 2/claim=每人12条，别退回 1/claim=每人6条
每条 evidence 的 summaryZh 长度 >= 40 字（介于 20-40 报 YELLOW summary_thin）
同一 problem 内 claim 的 weight 有区分（全同权报 YELLOW weight_uniform）
```

> 判据（已升级为硬门，见 §5 门3）：写前门 `scripts/verify.sh pre` 会跑 `quality-audit --batch <batchDir>/thought-systems.json --require-standard`，本批只要有 RED 或标准档码（`thin_evidence`/`summary_thin`/`weight_uniform`）就**判未过、禁止 `--write`**。也就是说标准档不再是"建议"——不达标的 batch 根本过不了写前门。若确因限额只能产出下限数据，要么先加厚再入库，要么记 `needs_human` 停车，不许绕过门直接手工同步。

引证（evidence.source）要求：

```text
workId 必须存在于 public/data/works.json，且属于同一 philosopherId
locator 必须精确到【单一段落/章句】，禁止"天志上中下""等相关篇章"这类宽泛范围
publicDomainExcerptZh：填【逐字】公有领域原文（schema 已支持该字段，会进正式库并被前端展示）
  - 必须是真实原典原文，禁止改写、拼接、编造
  - 不确定是否逐字/是否公有领域 → 留空，并把 excerptStatus 设 summary_only 或 none
excerptStatus 与实际一致：有逐字原文=public_domain；仅概括=summary_only；无=none
```

**铁律：内容正确性 > 通过校验。** 宁可留空 excerpt、宁可 problem 少而扎实，也不许为过门槛填假引文。

---

## 5. 写前门（一次调用，只读，全绿才允许写）

把"研究格式 + 入库 dry-run"两道只读校验合并成**一次工具调用**（见 §14 合并守则）：

```bash
bash scripts/verify.sh pre <batchDir>
# 内部依次跑：validate:kimi → admit dry-run(--overwrite，不写) → 内容标准档硬门(quality-audit --batch --require-standard)
# 期望末尾：✅ 写前门全绿
```

**门3 是硬门（2026-07-01 强化）**：直接审计 `<batchDir>/thought-systems.json`，只要本批出现 `thin_evidence`（某 claim <2 evidence）/ `summary_thin`（summaryZh <40）/ `weight_uniform`（同 problem 内 claim 全同权），**写前门即判未过、禁止 `--write`**。这把 §4 标准档从"建议"变成"不加厚就进不去"，正是为了堵住 round B / habermas 批次那种"压过硬下限就停"的退化。

`<batchDir>` 例：`.research/tmp/kimi/people/wang-yangming` 或 `.research/tmp/kimi/2026-06-26-batch-01-chinese-classical`。

报 `references unknown workId` / `belongs to another philosopher` → 回 §4 修 workId（去 works.json 找正确的、同一哲人的 workId；缺则**改 works.json 属于扩边界，走 §10 人工确认**）。

`verify.sh` 是只读助手，对真实仓库零写入；克隆比对只发生在 /tmp 副本。

---

## 6. 入库写入（智能体单独那一下）+ 写后门

**写入是唯一会改正式库的动作，必须单独、显式、在看完 §5 的 dry-run 计划之后执行——不要把它串进任何脚本或 `&&` 链（见 §14）。**

```bash
npm run admit:kimi -- <batchDir> --overwrite --write
# 期望：N planned, N written
```

**若 `--write` 被 OpenAI 安全层拦截**（ChatGPT 环境常见）：按 dry-run 的 replace/add 计划，**逐文件手工同步** `public/data/philosophers/<id>.json` 到加厚后的等价内容。

**若为过安全层而【改写了内容措辞】（如 round B 把加缪/福柯条目改成"中性学术表述"）——必须留痕，否则本人不算完成：**

```text
- 交付说明里逐条列出：<id> 的哪个字段（claimZh/summaryZh/...）、改前原文、改后表述、改动原因（触发词/合规）。
- LEDGER 备注标注"含安全层改写：<id> N 条"，让审计者知道该批内容经过软化、需人工复核语义保真。
- 铁律不变：改写只为过合规，不得因此弱化或歪曲该哲人的实质立场；若无法在不失真的前提下改写 → 走 §10 needs_human，别硬压。
```

写完后跑**写后门**（一次调用，只读，含克隆逐字节自检）：

```bash
bash scripts/verify.sh post <batchDir> <id1> [id2 ...]
# 内部依次跑：validate:data → 克隆副本跑 --write 再 diff 现有正式库
# 期望：每个 id ✅ 逐字节一致；末尾 ✅ 写后门全绿
```

任何一条 ⚠️ = 未完成（正式库与 admit 规范输出有偏差），回去修到一致。

写后再跑**内容质量审计**（只读，查 validate 查不到的内容质量）：

```bash
node tools/quality-audit.mjs --data-dir public/data
# 期望：本批入库的哲人不引入任何 RED。出现 RED（薄项/假引文/非法workId等）= 回 §4 修。
```

---

## 7. 进度账本 LOOP-LEDGER.md（让循环可续）

路径：`docs/research/LOOP-LEDGER.md`。**每轮结束追加一行**，开工时先读。模板：

```markdown
# Kimi Loop Ledger

| 时间(CST) | 哲人 | 阶段结果 | problems/claims/evidence | 校验 | 备注 |
|---|---|---|---|---|---|
| 2026-06-26 22:22 | laozi+4 | admitted | 3 / 6 / 8 each-ok | data ok | 第一批中国古典，已加厚 |
| ... | wang-yangming | research_ready | - | - | 待入库 |
```

状态词统一用：`research_ready` / `thickened` / `admitted` / `blocked_rate_limit` / `needs_human`。
账本是断点续传的唯一真相源——**宁可多记，不可漏记**。

---

## 8. 每轮交付物

每完成一位（或一小批）哲人入库，写一份精简交付说明：

```text
docs/research/delivery-<YYYY-MM-DD>-<philosopherId>.md
```

须含：改前/改后厚度对照、§5 三道门的真实实跑输出（禁止手写编造）、§6 克隆自检结果、是否触碰边界的逐条确认、哪些 excerpt 为逐字原文/哪些留空。

---

## 9. Kimi 限额处理（**先转 §13，不是立即停车**）

`run-next` 退出码 2 且日志含 `429 / rate_limit / usage limit` → 当前哲人阶段标 `blocked_rate_limit`。

**严格按此顺序，不要跳步：**

```text
1. LEDGER 记一行 blocked_rate_limit + 哲人 + 阶段。
2. 不要重试硬刚、不伪造产物、不逐个换人试【生成研究】（换谁的 run-next 都 429）。
   —— 注意：这只禁止"继续找 Kimi 生成研究"，不等于停工。
3. 【关键】立即转 §12.1 情形① / §13：用编排方自己的额度接手【非 Kimi 待办清单】，继续干。
   §13 里有活（待入库就绪研究、加厚薄项、locator、补原文、relationship 候选、体检）就接着做，
   每轮连推 3-5 项（§12.3），并打戳记。
4. 只有当 §13 待办【也清空】（停因 C: backlog_empty），才真正干净停车：
   输出 "⏸ §13 已清空且 Kimi 限额，正式库 N 位，待 Kimi 恢复从 kimi:queue -- next 续跑"。
5. 下个额度窗口开工时，§0 三步自动续上。
```

**判定口诀**：Kimi 429 ≠ 停车。**Kimi 429 = 换条腿走路（转 §13）**。只有 §13 也没活了，才是真停车（C）。
若不确定 §13 是否还有活，**先跑 `node tools/quality-audit.mjs` 体检**：有 RED/YELLOW 就是 §13 还有活（去修），全绿且无就绪入库项才算 §13 空。

ChatGPT 与 Codex 额度独立——若编排方自己也额度将尽，按 §12.1 情形② 接力另一方继续同一队列。

---

## 10. 何时必须停下找人（不要自作主张）

```text
- 要改 schema（src/data/schemas.ts）、admit/validate 脚本、前端 UI、队列脚本
- 要往正式 relationships.json 写关系（候选只许写 .research/tmp/.../relationship-candidates.md 待审）
- 要新增/修改 works.json 里的 workId（影响入库判定）
- 同一阶段连续 failed >= 2 次且非限额
- 原文真伪/是否公有领域无法判断
- 某哲人内容涉及在世人物、敏感争议、或史料严重冲突
遇到以上：LEDGER 记 needs_human，写清卡点，停在此处等人工。
```

护栏（任何时候不得越线）：

```text
只动 .research/tmp/ 暂存 与 public/data/philosophers/*.json
不碰本批次以外、已有 thoughtSystem 的哲人数据
不为过校验填假引文；不把仓库既有的、非本轮产生的改动算作本轮成果
【溯源铁律】禁止跨哲人复用/覆写研究批次目录：thought-systems.json 里的 philosopherId 必须与所在目录名对应的人一致。
  需要给新一批人跑研究，就【新建目录】，不许把 arendt-camus 目录的 thought-systems.json 覆写成 quine-derrida
  （round B 就这样把 arendt-camus 自己的研究产物冲掉、导致 quine-derrida 无独立 sources/notes 溯源）。
  一旦发现目录名与内容 philosopherId 不符 → 记 needs_human，别将就入库。
```

---

## 11. 一句话循环口令

> 读账本与队列 → run-next 直到 thought-system 完成 → 加厚到 §4 门槛 → 三道门全绿 → 写入并克隆自检 → 记账+交付 → 下一个。**Kimi 限额则转 §13 继续干（不停车）；§13 也空了才停，等窗口再来。**

照此循环即可，无需等待新指令。

---

## 12. 额度接力与戳记协议（Quota Relay & Stamping）

本项目有**两类独立额度**，任一耗尽都不该让进度空转：

```text
A. Kimi 额度    —— 只用于"生成研究"（kimi:queue -- run-next）。耗尽=无法产出新研究。
B. 编排方额度   —— ChatGPT 与 Codex 各自独立（即"双倍额度"）。用于加厚/入库/校验/记账等下游工。
```

### 12.1 触发与接手规则

```text
情形①：Kimi 额度耗尽（run-next 报 rate limit）
  → 不停摆。当前编排方（ChatGPT 或 Codex）立刻接手【非 Kimi 待办清单 §13】，
    用自己的额度继续推进，直到 §13 也清空或自身额度耗尽。

情形②：当前编排方额度将尽/耗尽
  → 接力给另一编排方（ChatGPT↔Codex）。对方按 §0 从账本+队列续上，无缝接同一进度。

情形③：Kimi 与两编排方均耗尽
  → 全局干净停车，留戳记，等任一额度恢复。
```

### 12.2 戳记规范（每次接手/交接/停车都必须打）

在账本的 **「接力戳记 (Handoff Log)」** 区追加一行，固定字段：

```text
[戳记] <ISO时间 +08:00> | from:<Kimi|ChatGPT|Codex> → to:<ChatGPT|Codex|—> | 原因:<rate_limit|quota_low|done|human> | 正式库:<N位thoughtSystem> | 下一步:<kimi:queue next 指向 / §13 第k项 / 等额度>
```

规则：

```text
- 接手时打一条（"我接手了，从哪开始"）
- 交接/停车时打一条（"我推到哪，交给谁/等什么"）
- 时间精确到分，带 +08:00 时区
- 戳记只增不改；任何人续跑前先读最后一条戳记定位现场
```

### 12.3 每轮吞吐 + 停车原因（避免"又停了"看不懂）

**LLM 智能体不是常驻进程**：每次被唤起只跑一个工作回合，回合一到就停——这是正常的，不是故障。为减少人工反复唤起、并让每次停都看得懂：

```text
吞吐：每个回合在额度/上下文允许内，尽量连续推进【3-5 项】再停，而不是干 1 项就收。
```

**每次停车必须在停车戳记里标明原因**，四选一：

```text
A. kimi_rate_limit      —— Kimi 没额度。§13 可能仍有活；若 §13 也空了才是真停。
B. turn_budget          —— 本回合活干够了/上下文将满，但【待办仍有剩余】。人只需说"继续"即可再起一轮。
C. backlog_empty        —— §13 待办与队列就绪项都清空，且 Kimi 仍限额。真·停车，等 Kimi。
D. orchestrator_quota   —— 当前编排方自己额度将尽 → 按 §12.1 情形② 接力另一方，戳记写 to:Codex/ChatGPT。
```

停车戳记格式（在 §12.2 基础上加 stop 原因与剩余量）：

```text
[戳记] <ISO时间 +08:00> | from:X → to:Y | 停因:<A/B/C/D 关键词> | 正式库:N位 | 剩余:<§13还剩什么/队列next> | 下一步:<续跑指令>
```

例：`停因:turn_budget | 剩余:buddha/plato/kant/nietzsche 仍薄且缺原文 | 下一步:对ChatGPT说"按RUNBOOK续跑§13"即可`。
这样人看账本最后一条就知道：B=说句继续；A/C=等 Kimi；D=换另一方跑。

---

## 13. 非 Kimi 待办清单（Kimi 断供时 ChatGPT 接手做这些）

这些活**不需要 Kimi 现生成研究**，靠编排方自己的额度即可推进。按序消化：

```text
1. 入库就绪研究：任何 people/<id>/thought-systems.json 已存在但正式库未入库者 → 走 §4→§6 入库
2. 加厚存量薄数据：对已入库但内容偏薄的 thoughtSystem（尤其早期"既有"5位 confucius/buddha/plato/kant/nietzsche，
   以及任何 problem 仅1 claim/1 evidence 者）→ 补到 §4 质量门槛
3. locator 精确化：扫正式库所有 evidence.source.locator，把"等相关篇章/上中下"这类宽泛定位收敛到单一段落
4. 补逐字原文：给已有 evidence 补 publicDomainExcerptZh（逐字、公有领域、真伪存疑则留空），提升前端可读性
   —— 这是一笔持续增长的技术债：`quality-audit` 现会打印 `逐字原文欠债 summary_only=N`，限额窗口优先啃这块，别让它只增不减
5. relationship 候选：为已入库哲人生成跨哲人关系候选 → 只写 .research/tmp/.../relationship-candidates.md 待人工审
6. 数据体检：跑 `node tools/quality-audit.mjs`（一条命令出全库红/黄/绿，替代逐哲人手检：薄项 thin_evidence/summary_thin、模糊locator、假引文、claim复述题目、weight区分、重复claim、theme覆盖、逐字原文欠债 excerptDebt），再核账本与正式库一致、补齐漏记戳记。RED 必修，YELLOW（含 thin_evidence/summary_thin=退回硬下限的加厚欠账）建议修。详见 docs/research/delivery-quality-audit.md
```

每做一项，§5 校验门全绿 + 账本记账 + 打戳记。清单见底就停车等 Kimi。**注意**：第 2-4 项是"修改已入库哲人数据"，属 §4 允许范围内的同人加厚，**但不得触碰 §10 红线**（schema/脚本/UI/works.json/正式 relationships）。

---

## 14. 调用合并守则（省往返，但别省掉安全闸）

原则：**有依赖→必须分开（改不了）；无依赖→应合并（不合是浪费）；会改数据的写操作→永远单独、显式。**

合并这些（基本纯赚）：

```text
- §0 开工三件事（读手册/读账本/kimi:queue next）互不依赖 → 同一回合并行发出，别一个等一个
- 多个【只读】shell 校验用 && 串成一次调用（已封装进 scripts/verify.sh 的 pre/post）
- §13 跨哲人加厚：N 个文件的【读】先一批读完；想清楚后 N 个【写】再一批写完；别 读-写-读-写 串着来
- 数据体检/扫描：写一段脚本一次遍历全部文件，别一个哲人发一次调用
- 每回合连推 3-5 项再停（见 §12.3），减少被重新唤起的次数
```

绝不合并这些（保安全）：

```text
- admit --overwrite --write：唯一改正式库的动作，必须单独一次、且在看完 §5 dry-run 计划之后。
  禁止把它塞进 && 链或任何脚本——丢掉"先看再写"那一停，就会出现"写脏了才发现"。
- run-next 研究链：sources-notes→claims→thought-system 天然串行（后一阶段吃前一阶段产物），合不了。
- 跨哲人批量写前，先确认目标文件互不重叠（同一文件/works.json 不能并行写，会相互覆盖）。
```

一句话：**把往返省在"读和校验"上，绝不省在"写"上。** scripts/verify.sh 已经把只读校验合好了，写那一下留给你/智能体亲手按。

---

## 15. Subagent 盲审复核制（B 档起强制）

从 B 档第一批开始，入库流程改为：

```text
生产 → 写暂存 batch → 只读门禁 → 盲审 subagent → PASS 才 admit --write → post 验证 → 记账 → 停车/下一批
```

### 15.1 角色分离

生产者只负责研究和暂存 batch：

```text
.research/tmp/kimi/<batch>/thought-systems.json
.research/tmp/kimi/<batch>/sources.md
.research/tmp/kimi/<batch>/notes.md
.research/tmp/kimi/<batch>/claims.json
.research/tmp/kimi/<batch>/open-questions.md
```

生产者不得触碰正式库：

```text
public/data/philosophers/*.json
public/data/philosophers.index.json
public/data/works.json
public/data/relationships.json
```

生产者不得执行：

```bash
npm run admit:kimi -- <batch> --write
node tools/admit-kimi-thought-systems.mjs <batch> --write
```

`admit --write` 移出生产者职责，只能在盲审 PASS 后由主循环/裁决阶段执行。

### 15.2 盲审员启动约束

每批必须新起一个全新 subagent，禁止复用实例。盲审员输入只能包含：

1. batch 目录路径；
2. `docs/research/review-checklist.md`；
3. 历史事故摘要：一代模板灌水、二代模板灌水、E6 首版打回原因。

禁止给盲审员：delivery 文档、账本成功叙述、生产者自述“已完成/已修复/已全绿”。原则是：**先看货，后看账。**

### 15.3 盲审员职责

盲审员按 `docs/research/review-checklist.md` 执行，至少包括：

1. 实跑门禁：
   - `node tools/validate-kimi-research.mjs "$BATCH"`
   - `node tools/admit-kimi-thought-systems.mjs "$BATCH" --overwrite`
   - `node tools/quality-audit.mjs --batch "$BATCH/thought-systems.json" --require-standard`
2. 独立仪器：自写脚本计算 `summaryZh` 两两字符 Jaccard；每位均值必须 `<= 0.55`。
3. 内容抽查：每位随机抽 2 条 evidence，独立核对著作归属、章节定位、论点真实性。
4. 对抗测试：若出现新句式风格或疑似模板，构造仿冒批喂门3，必须确认 `exit=1`。

盲审员只输出：

```text
.research/tmp/kimi/<batch>/review-verdict.md
```

结论只能是：

```text
PASS
REJECT + 逐条证据
```

### 15.4 裁决规则

- 盲审 `PASS` → 主循环才允许执行 `admit --write`。
- 盲审 `REJECT` → 生产者无权推翻，只能重做或升级 `needs_human`。
- 生产者与盲审员意见冲突 → 停车等外部审核。
- 盲审员要求改审计规则 → 停车等外部审核。
- 新增审计规则必须测试先行：盲审员的对抗样例先入测试用例，证明新规则命中样例且对现库零误报，才许合入。

### 15.5 节奏与人工抽检

每批节奏：

```text
生产 → 门禁 → 盲审 → PASS 后写入 → post 验证 → 账本记录 review-verdict 路径 → 停车复核/下一批
```

外部审核降为抽检：

- 每 3 批人工复核 1 批；
- 所有 `REJECT` 争议批必须人工复核；
- 所有审计规则变更批必须人工复核。

账本每条新增记录必须引用对应：

```text
.research/tmp/kimi/<batch>/review-verdict.md
```

### 15.6 过渡规则：B1

B1 在本节写入前已由主循环 admit 到正式库，因此不能伪装为完全合规的盲审批。处理方式：

1. B1 必须补一次新 subagent 盲审 verdict；
2. verdict 里必须注明“post-admit transitional review”；
3. 若 B1 verdict 为 REJECT，立即停车并升级外部审核；
4. B2 及以后必须严格执行 pre-admit 盲审，未有 PASS verdict 不得写正式库。

### 15.7 审计规则变更纪律与新增 RED

新增审计规则必须测试先行：先写失败用例，确认旧审计器未命中，再实现规则并证明测试转绿。规则变更批必须人工复核。

B1 过渡盲审 REJECT 后新增两条 RED：

```text
malformed_punct —— summaryZh 含病句标点「。，」直接 RED。该指纹通常说明先写完整句号，再机械拼接逗号尾缀凑长度。
shared_suffix   —— 同一哲人 >=3 条 summaryZh 共享 >=12 字符相同尾缀直接 RED。该规则用于阻断“真内容 + 套话尾巴”式第三代凑数。
```

西方中世纪-现代 20 位整批 REJECT 后新增两条 RED，并把空 locator 升级为 RED：

```text
template_foundational_stance —— claimZh 含「基础性立场，说明其理论问题的出发点」直接 RED。
template_primary_locator     —— evidence.summaryZh 含「提供该命题的原典定位」直接 RED。
missing_locator              —— evidence.source.excerptStatus 非 none 且 locator 为空直接 RED，空字符串不得入库。
```

这些规则进入 `quality-audit` 后，`tools/quality-audit.test.mjs` 必须包含对抗样例，并保持对干净样本零误报。

### 15.8 外部审计报告只读纪律

`docs/research/review-2026-07-02-claude-external-audit.md` 对生产方只读。生产方不得修改外部审计报告，包括看似事实性更正的改写。

如需更正事实，生产方只能在自己的账本、交付文档或复审申请中记录，并引用外部报告行号；由外部审核决定是否修订外部报告。

事故记录：2026-07-03 前，生产方曾在 commit `00b8c04` 中改写外部验证结论。外部报告现已在 §十注明该纪律；后续账本必须引用该处行号并自记更正，不得再次改报告。
