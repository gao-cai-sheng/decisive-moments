# 自检自运行循环手册 — C 系收尾（5 轮制）

**执行者**：codex ｜ **性质**：常驻循环，跑满 5 轮**强制停车**等人验收
**承接**：`std-c-series-CLOSEOUT.md`（本轮队列来源）、`std-c-series-REWORK-ORDER.md`（红线来源）

**这份手册就是你的循环。** 不要等逐条指令，读完直接开始。
但**跑满 5 轮必须停**，哪怕你觉得还能继续——停车不是失败，是设计。

---

## 0. 开工前三步（决定可续性，必做）

```
1. 读本手册
2. 读轮次账本 .research/tmp/kimi/C-LOOP-STATE.md（不存在就按 §2 建）
3. 跑一次全量自检（§4 的三条命令），看当前基线
```

**永远从账本恢复进度，不要凭记忆假设「上次做到哪」。**

---

## 1. 一轮 = 五步

```
┌─> A. 取目标：从 §3 队列取下一个 pending 项（一轮只做一项）
│   B. 做：改数据 / 出补丁 / 写举证
│   C. 自检：§4 机器门 + §5 必答三问（缺一不可）
│   D. 记账：往 C-LOOP-STATE.md 追加本轮记录
└── E. 判断：轮次 <5 且队列非空 且 无 needs_human → 回 A；否则停车（§6）
```

**一轮只做一项。** 不要因为「顺手」把两三项一起做完——上一次就是一次性改了六个批次，
结果好坏混在一起，验收方分不清哪个改动带来了哪个后果。

---

## 2. 轮次账本

路径：`.research/tmp/kimi/C-LOOP-STATE.md`

不存在时先建，模板：

```markdown
# C 系收尾循环状态

| 轮 | 时间 | 队列项 | 结果 | 机器门 | 停车原因 |
|---|---|---|---|---|---|
```

每轮结束**追加一行**，例如：

```markdown
| 1 | 2026-08-18 21:10 | Q1 形态残留 | 58→0 条 | 七批 RED=0，退出码 0 | — |
```

**最后一行必须写清停车原因**（见 §6 四选一）。没有停车行 = 循环没收尾，验收方会当作跑飞。

---

## 3. 本次队列（5 项，正好 5 轮）

| # | 项 | 来源 | 完成判据（客观、可验） |
|---|---|---|---|
| Q1 | 形态残留 58 条 | CLOSEOUT §1 | §4 门 2 报 0 条截断 / 0 条繁体 / 0 条书名号不配对 |
| Q2 | 正式库 6 位补丁 | CLOSEOUT §2 | `2026-08-18-fix-inducted/locator-patch.json` 存在且含 6 人、格式合法；**未改动 `public/data/`** |
| Q3 | 定位抽样自证 | CLOSEOUT §4 | 23 人 × 3 条 = 69 条，写进各批 `self-review.md`，含依据来源 |
| Q4 | 逐字原文回补 | CLOSEOUT §3 | **无数量要求**；补几条就在 `notes.md` 举证表写几行；补 0 条也算完成 |
| Q5 | 终检与交付整理 | 本手册 §7 | 七批 + 补丁全部过 §4 三道门，交付说明写完 |

队列做完但轮次没满 5 → **仍然停车**，停车原因写 `backlog_empty`。不要自己找活加进队列。

---

## 4. 自检三道门（每轮必跑，全部贴进账本）

### 门 1：机器审计（客观，不可绕过）

```bash
for d in .research/tmp/kimi/*std-c[1-6]*/; do
  echo "== $d"
  node tools/quality-audit.mjs --batch "$d/thought-systems.json" --require-standard
done
```

任一批退出码非 0 → 本轮不算完成。

### 门 2：形态自检（查机器门查不到的）

```bash
node - <<'JS'
import fs from "fs";
const K=".research/tmp/kimi";
const TRAD=/[學國體萬與無為將們這來時間問題經濟聲個歲點區龍傳說淨務衆眾靜軍農業實現關開發長書寫語讀圓圖畫術見親愛禮義]/;
let t=0,f=0,b=0;
for(const d of fs.readdirSync(K).filter(x=>/std-c[1-6]/.test(x))){
  const p=`${K}/${d}/thought-systems.json`; if(!fs.existsSync(p))continue;
  const j=JSON.parse(fs.readFileSync(p,"utf8"));
  for(const it of j.items)for(const pr of it.problems)for(const c of pr.claims)for(const e of c.evidence){
    const L=e.source.locator||"";
    if(/(所|在|之|其|而|以|於|于|与|與|和)段$/.test(L))t++;
    if(TRAD.test(L))f++;
    if((L.match(/《/g)||[]).length!==(L.match(/》/g)||[]).length)b++;
  }
}
console.log(`截断 ${t} ｜ 繁体 ${f} ｜ 书名号不配对 ${b}`);
JS
```

### 门 3：红线自检（证明你没越界）

**注意**：本仓库有其他产线的未提交改动（西语翻译、i18n 等），
所以 `git status` 本来就不为空——**不能拿「是否为空」当判据**，那会让你一开工就误判越界。
正确做法是**对比开工前的快照**：

开工时（第 1 轮之前）只做一次，建立基线：

```bash
git status --short public/data/ | sort > .research/tmp/kimi/C-LOOP-baseline.txt
wc -l < .research/tmp/kimi/C-LOOP-baseline.txt   # 记进账本，作为基线条数
```

每轮结束时比对：

```bash
git status --short public/data/ | sort > /tmp/c-now.txt
diff .research/tmp/kimi/C-LOOP-baseline.txt /tmp/c-now.txt
```

**diff 必须无输出。** 有任何一行差异 = 你在本轮动了正式库 = 本轮作废，
立即停车报 `needs_human`，并把 diff 原文贴进账本。

（基线文件本身不要删、不要重建——重建就等于把越界洗白了。
若基线确需重建，在账本写明原因，由验收方确认。）

---

## 5. 每轮必答三问（写进账本，不许省略）

不是三个可以答「都好」的问题。逐条作答：

1. **这一轮我最可能哪里做错了？** 指出**具体的一条**（evidenceId 或文件行），不要写「可能有疏漏」。
2. **有没有哪一项，我是靠猜的？** 有就列出来，并说明为什么没有降级处理。
3. **如果验收方只抽查一条，抽到哪条我最心虚？** 写出那一条，并说明为什么。

> 这三问的用处是**暴露风险，不是展示成绩**。
> 上一次的 `self-review.md` 通篇写「覆盖 78.6%、删名后主谓完整」，全部属实，
> 却一句没碰到定位真伪——那批 84 条定位全是编的。
> **自检要查最可能坏的地方，不是查最容易答的地方。**

三问答案全是「没有」「都对」「不心虚」→ 视为没自检，本轮不算完成。

---

## 6. 停车（四选一，必须写明）

| 原因 | 何时用 |
|---|---|
| `round_limit` | 跑满 5 轮。**默认结局，最常见。** |
| `backlog_empty` | 队列 5 项提前做完。 |
| `needs_human` | 撞红线、史料判不了、或门 3 非空。**立即停，不要试图自救。** |
| `blocked` | 缺工具、缺文件、命令跑不通。写清缺什么。 |

停车后**不要继续做任何事**，包括「顺手整理一下」。等验收。

---

## 7. 交付说明（停车时写一份）

路径：`.research/tmp/kimi/C-LOOP-STATE.md` 末尾追加一节。

只回答五个问题，简短：

```markdown
## 交付说明（第 N 轮停车）

1. 这 N 轮做了什么：（每轮一行）
2. 机器门现状：（门 1 退出码 / 门 2 三个数 / 门 3 是否为空）
3. 哪些项没做完、为什么：
4. 我最没把握的三条：（evidenceId + 一句话）
5. 建议验收方优先看哪里：
```

**第 4、5 条是这份交付说明的重点。** 前三条是记录，后两条才是给验收方省时间的东西。

---

## 8. 红线（任何一轮都不许破）

- 禁碰 `public/data/`，禁 admit / `--write`，禁 commit / push。
- **禁止自判通过。** 机器门全绿只说明没踩已知的坑，不说明货是对的。
- 禁开 C7 及以后任何新批。
- 文本层（`oneLineZh/En`、`keywordsZh/En`）不归你。
- **任何指标都不是硬指标。** 做不到就降级、就停车、就写清楚。
  **补三条真的，好过补十条编的**——这条是用一次全线返工换来的，别再试第二次。
