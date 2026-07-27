# 互审总规程（codex ⇄ grok Cross-Audit Protocol）

**立于**：2026-07-26 ｜ **裁决者**：gao ｜ **状态**：生效，取代此前「生产方自证 + gao 直接放行」的临时做法

本文规定两条生产线互为盲审员时的角色、输入边界、门禁与 verdict 格式。
它**不替代**已有文件，而是把它们编成一张互审矩阵：

| 层 | 批次目录 | 生产者 | **盲审员** | 操作单 |
|---|---|---|---|---|
| 思想体系层（thoughtSystem / evidence / works） | `.research/tmp/kimi/<batch>/` | codex | **grok** | [`review-checklist.md`](review-checklist.md) 全文（已有，不改） |
| 索引文本层（oneLineZh/En、keywordsZh/En） | `docs/research/tmp/zh-rewrite/<batch>/` | grok | **codex** | **本文 §B**（新） |
| 英译层（P1–P4 内容英译） | `docs/research/tmp/translation/<batch>/` | codex | **grok** | 本文 §C + [`../i18n-content-translation-spec.md`](../i18n-content-translation-spec.md) §3 |

生产手册（**生产者读，盲审员不读**）：`RUNBOOK-std-upgrade-loop.md`（codex）、`RUNBOOK-text-layer-loop.md`（grok）。

---

# §A 互审通则（三层通用）

## A.1 独立性铁律

1. **盲审员必须新起会话/subagent**，禁止复用生产该批的实例，禁止在同一会话里既审对方的批又产自己的批。
2. **输入白名单**，盲审员启动时只能拿到三样：
   - 批次目录路径；
   - 本文（或对应操作单）；
   - §A.4 事故摘要。
3. **输入黑名单**，以下一律不得喂给盲审员：
   生产者的 `brief.md` 之外的自述、`self-check.md`、`notes.md`、delivery 文档、handoff 文档、
   `LOOP-LEDGER.md` 中对该批的描述、生产者说的「已全绿/已修复/已自检」。
   **顺序是先看货、后看账。** `self-check.md` 只在盲审员写完 verdict 后才可打开做交叉比对。
4. **`brief.md` 可读**，因为盲审需要知道本批范围；但 brief 里的任何质量断言不作数。

## A.2 互审特有风险与对策

两条线互为审核方，比外部盲审多两种失效模式，必须显式防：

| 风险 | 表现 | 对策 |
|---|---|---|
| **互惠放水** | 「你放我一马，我放你一马」，双方都倾向 PASS | REJECT 不可协商（A.3）；每 3 批 gao 外部抽检 1 批；连续 5 批全 PASS 触发一次强制外部抽检 |
| **跨层无知** | codex 不熟文本层口径、grok 不熟 evidence 口径，看不出问题只好 PASS | 盲审员**不得**以「不熟该层」为由 PASS；不确定一律 `REJECT` 或 `needs_human`（A.3） |
| **同源盲区** | 两条线都是 LLM，会犯同一类错（压字出语病、凑字、术语想当然） | 门 2 独立仪器必须**盲审员自写**，不得调用生产者用过的工具；§B.4 教材表逐条自答，不许整体回答 |

## A.3 角色边界

**生产者**
- 只写自己批次目录；不碰 `public/data/**`；不执行 admit/commit/push。
- 不得写 `review-verdict.md`；不得回审盲审员的结论。
- 盲审 REJECT 后只能重做或升级 `needs_human`。

**盲审员**
- 只做复核，**不修生产者的批**（发现问题写进 verdict，由生产者改）。
- 只输出一个文件：`<batch>/review-verdict.md`。
- 结论只有 `PASS` / `REJECT` 两种。**没有「PASS with minor fixes」**——有要改的就是 REJECT。
- 无法确认的关键事实：`REJECT` 或 `needs_human`，**不得 PASS**。
- 要求新增/修改审计规则时：停车等 gao，不得自行合入规则。

**裁决者（gao）**
- 只有 verdict 为 PASS，才可执行合库（§D）。
- 生产者与盲审员冲突、或盲审员要求改规则：一律停车。

## A.4 事故摘要（喂给盲审员的唯一历史输入）

> 一代模板：claim/evidence/summary 只换哲人名或主题词，句式高度重复，内容很薄。
> 二代模板：规避浅层正则，但同一 problem 内 `claimZh` 精确重复或高度同构，`summaryZh` 粘贴 `workId`，`locator` 伪定位为泛泛篇章。
> 三代（文本层，2026-07-26 实测）：**机器门 12/12 全绿的批次里仍有 9 条红项**——史实错、压字出语病、
> 丢核心身份、语义悬空、英译把人写成学科、评价性形容词、为凑字数加无意义后缀。
> 结论：**机器门全绿不构成任何质量证据，门 2 才是真正的门。**

---

# §B 索引文本层盲审操作单（grok 产 → codex 审）

适用：`docs/research/tmp/zh-rewrite/<batch>/`，字段只涉及 `oneLineZh` / `keywordsZh` / `oneLineEn` / `keywordsEn` 四个。

## B.1 门 1：机器门

```bash
BATCH="docs/research/tmp/zh-rewrite/<batch>"
node tools/text-patch-lint.mjs "$BATCH/patch.philosophers.zh.json" --expect "$BATCH/ids.expect.txt"
```

通过标准：退出码 0，输出 `✅ 文本补丁门通过`，`RED 0`。

若本批含多个子批（如 G3 的四个子目录、G5 的五个子批），**逐份跑，逐份贴输出**。

**跨批冲突预检**（多份补丁同时待合时必跑，防同一 `(id, 字段)` 在两份补丁取值不同）：

```bash
node - <patch1> <patch2> ... <<'NODE'
const fs = require('fs');
const seen = new Map();
for (const f of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [id, fields] of Object.entries(j.items || {})) {
    for (const [k, v] of Object.entries(fields)) {
      const key = `${id}::${k}`;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push([f.split('/').slice(-2)[0], JSON.stringify(v)]);
    }
  }
}
let conflict = 0;
for (const [key, list] of seen) {
  if (list.length < 2) continue;
  if (new Set(list.map(x => x[1])).size > 1) { conflict++; console.log('冲突', key, list.map(x => x[0]).join(' vs ')); }
}
console.log(`唯一(id,字段) ${seen.size} ｜ 取值冲突 ${conflict}`);
if (conflict) process.exit(1);
NODE
```

通过标准：`取值冲突 0`。

## B.2 门 2：独立仪器（盲审员自写，不得调用 text-patch-lint）

**双仪器防单点失效。** 三个指标都要跑，输出贴进 verdict。

> ⚠️ **时序要求：门 2 必须在合库前跑。** 仪器 2 拿补丁值与 `public/data` 现值比对，
> 一旦该批已合库，库内值就等于补丁值，相似度恒为 `1.000`，仪器失效。
> （2026-07-26 实测：对已合库的 G5c-western-seed 跑仪器 2，25 条全部 1.000。）
> 盲审在合库前，这是本规程的正常顺序；若因故要复验已合库的批，仪器 2 须改用
> `git show <合库前 commit>:public/data/philosophers.index.json` 作为对照基线。

```bash
node - "$BATCH/patch.philosophers.zh.json" public/data/philosophers.index.json <<'NODE'
const fs = require('fs');
const patch = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const raw = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const list = Array.isArray(raw) ? raw : (raw.philosophers || raw.items || []);
const cur = {}; for (const p of list) cur[p.id] = p;
const chars = s => new Set(String(s || '').replace(/[\s，。、；：（）《》「」]/g, '').split(''));
const jac = (a, b) => { const A = chars(a), B = chars(b);
  const i = [...A].filter(x => B.has(x)).length; return i / (new Set([...A, ...B]).size || 1); };

const rows = Object.entries(patch.items).filter(([, f]) => f.oneLineZh);
// 仪器 1：批内两两相似度（抓同构模板）
let max = 0, pair = [], vals = [];
for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
  const v = jac(rows[i][1].oneLineZh, rows[j][1].oneLineZh);
  vals.push(v); if (v > max) { max = v; pair = [rows[i][0], rows[j][0]]; }
}
const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
console.log(`[仪器1 批内同构] mean=${mean.toFixed(3)} max=${max.toFixed(3)} maxPair=${pair.join(' | ')}`);

// 仪器 2：与库内旧值的相似度（抓「假修改」——号称重写实际只换了个词）
const drift = rows.map(([id, f]) => [id, jac(f.oneLineZh, cur[id]?.oneLineZh)]).sort((a, b) => b[1] - a[1]);
console.log(`[仪器2 改动幅度] 与旧值最像的 5 条：`);
for (const [id, v] of drift.slice(0, 5)) console.log(`   ${v.toFixed(3)}  ${id}`);

// 仪器 3：字数分布（抓为过门槛而凑字/压字）
const lens = rows.map(([, f]) => f.oneLineZh.length);
const hist = {}; for (const n of lens) hist[n] = (hist[n] || 0) + 1;
const edge = lens.filter(n => n <= 26 || n >= 39).length;
console.log(`[仪器3 字数分布] n=${lens.length} 贴边(≤26或≥39)=${edge} (${(edge / lens.length * 100).toFixed(0)}%)`);
console.log('   ' + Object.entries(hist).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join(' '));
NODE
```

判定：

| 仪器 | 阈值 | 超阈时 |
|---|---|---|
| 1 批内同构 | `mean ≤ 0.45`，`max ≤ 0.70` | 超 → 逐对人工看，是模板即 REJECT |
| 2 改动幅度 | 与旧值 `jaccard ≥ 0.90` 的条目须**逐条**在 verdict 说明为何这是充分修改 | 说不出理由即 REJECT |
| 3 字数分布 | 贴边率 `≤ 40%` | 超 → 按 §B.4 第 11 类逐条查凑字/压字 |

> 仪器 2 是文本层特有。像 G6（只去空话词）这类批次天然高相似，**不是自动 REJECT**，
> 但盲审员必须确认「改动确实解决了本批要解决的问题」，而不是换个同义词糊弄机器门。
>
> **实测基线（2026-07-26，G5c-western-seed 25 条）**：
> 仪器 1 `mean=0.075 max=0.243`（不同哲学家天然低相似，抓模板主要看 `max`，`mean` 低不构成任何质量证据）；
> 仪器 3 贴边率 **96%**（25 字 12 条 + 26 字 12 条 + 29 字 1 条），逐条看确认是为够 25 字下限
> 加「之问题路径」「之传统路径」这类无意义后缀 —— 这是仪器 3 唯一一次实战，直接命中真问题。

## B.3 门 3：全量通读（不是抽样）

文本层每条只有一句话，**必须 100% 通读，不许抽样**。
（这与思想体系层不同：那边每人几十条 evidence 才抽 2 条；这边一人一句，没有抽样的理由。）

导出对照清单（新值 + 库内旧值 + tier + 姓名）后逐条过：

```bash
node - "$BATCH/patch.philosophers.zh.json" public/data/philosophers.index.json <<'NODE'
const fs = require('fs');
const patch = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const raw = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const list = Array.isArray(raw) ? raw : (raw.philosophers || raw.items || []);
const cur = {}; for (const p of list) cur[p.id] = p;
for (const [id, f] of Object.entries(patch.items)) {
  const c = cur[id] || {};
  console.log(`--- ${id}  ${c.names?.zh || ''}  [${c.tier || '?'}]`);
  if (f.oneLineZh) { console.log(`  旧zh(${(c.oneLineZh||'').length}): ${c.oneLineZh || '(空)'}`);
                     console.log(`  新zh(${f.oneLineZh.length}): ${f.oneLineZh}`); }
  if (f.oneLineEn) { console.log(`  旧en: ${c.oneLineEn || '(空)'}`);
                     console.log(`  新en(${f.oneLineEn.length}): ${f.oneLineEn}`); }
  if (f.keywordsZh) console.log(`  kwZh: ${JSON.stringify(c.keywordsZh)} → ${JSON.stringify(f.keywordsZh)}`);
  if (f.keywordsEn) console.log(`  kwZh(库): ${JSON.stringify(c.keywordsZh)}\n  kwEn: ${JSON.stringify(c.keywordsEn)} → ${JSON.stringify(f.keywordsEn)}`);
}
NODE
```

必要时回源查证：该人的 `public/data/philosophers/<id>.json` 的 `thoughtSystem` 与 `works` 是唯一权威素材。

## B.4 教材表：机器门抓不到的 12 类

**逐类回答，不许整体回答「已通读无问题」。** 每类写：本批有几条命中、id 是哪些、如何处置。

前 6 类来自首批（2026-07-24）的 6 条阻断项；后 6 类来自 G5/G6/G7 合库复核（2026-07-26）新增。

| # | 类型 | 实例 | 机器为何看不见 |
|---|---|---|---|
| 1 | **压字数压出语病** | `以实际机缘与摄取代实体`（whitehead）「摄取代实体」不成词；`把非洲人在欧权利问题哲学化`（amo）；`限有效认知为现量与比量`（dignaga）应为「把…限定为」 | 字数、字符集全合规 |
| 2 | **凭空造因果** | `并用全能限制教会绝对权力`（ockham）——源数据里「神的全能」讲形上必然，「教权边界」是另一个 problem，两者无此因果 | 词都对，关系错了 |
| 3 | **术语译错** | `冷淡之物`（zeno-citium）——ἀδιάφορα 是「无差别之物」，「冷淡」说的是态度 | 是实词，不是主题名 |
| 4 | **把后世标签当正面切口** | `双重真理争议`（ibn-rushd）——是拉丁阿威罗伊派被扣的帽子，他本人主张的是宗教与哲学相协调 | 是真实术语，只是不属于他 |
| 5 | **句式别扭** | `经此在分析重提存在问题`（heidegger）应为「以」；`…建立关键连接的学者。`（nasir-al-din-tusi）把人压成同位语尾巴 | 语法无误 |
| 6 | **书名口径** | `《论证》`（anselm）——Proslogion 无此通行中译，应作 `Proslogion（论证）` | 是个书名号 |
| 7 | **史实错**⚠️最严重 | `主张君臣并耕`（xu-xing）——《孟子·滕文公上》作「贤者与民并耕而食」，是君**民**并耕 | 字词全合规，只有懂这段才看得出 |
| 8 | **丢核心身份** | `早期穆尔太齐赖派人物`（wasil-ibn-ata）——他是该派**奠基者**，压字时把最关键的身份删了 | 剩下的话本身没错 |
| 9 | **语义悬空** | `构成前伊斯兰源头`（zoroaster）——前伊斯兰的**什么**源头？删「波斯思想」后中心词没了 | 句子结构完整 |
| 10 | **英译语法错位** | `Key post-independence African political philosophy via…`（nkrumah）——描述一个人，主语却成了学科 | 长度合规、无中文残留 |
| 11 | **凑字 / 评价词撑场面** | `解释暴力与神圣起源之问题路径`（rene-girard）；`在抵抗运动中英勇被处决`（cavailles）——「英勇」是评价不是事实 | 25 字下限逼出来的，长度反而「合规」 |
| 12 | **同义叠词** | `成为对照参照`（yang-zhu）——「对照」「参照」同义叠床架屋 | 每个词都是实词 |

逐条自答的五个问题（沿用 `RUNBOOK-text-layer-loop.md` §3 门 2）：

1. **每条出声念一遍**，卡壳的就是有问题的。压字与凑字是本层最大的语病来源。
2. **每个「以…并…」「用…来…」的连接**，回源数据确认这个因果／手段关系真的存在。
3. **每个专名术语**，确认是该人自己主张的，不是后人扣的帽子，也不是别的学派的词。
4. **每个书名**，按 §B.6 口径核一遍。
5. **每条涉及具体史实的断言**（谁主张什么、谁是谁的创始人、哪本书讲了什么），凭自身知识核对；**核不动的写进 verdict 存疑，不许默认放行**。

## B.5 门 4：对抗测试（换写作范式时必跑）

若本批出现新句式风格、或盲审员直觉「像模板但门 1 没抓」，构造仿冒补丁喂 lint，**必须 exit=1**：

```bash
TMP="$(mktemp -d)"
cat > "$TMP/fake.json" <<'JSON'
{ "schemaVersion": 1, "items": {
  "confucius": { "oneLineZh": "以核心概念回应时代困境，构成传统中的重要节点与深远影响之路径。" },
  "laozi":     { "oneLineZh": "以核心概念回应时代困境，构成传统中的重要节点与深远影响之路径。" },
  "plato":     { "oneLineZh": "短。" }
} }
JSON
node tools/text-patch-lint.mjs "$TMP/fake.json"; echo "exit=$?"
```

通过标准：`exit=1`，且触发 `zh_duplicate`（跨条重复）、空话词（重要/深远）、`zh_length`（短于 25）。
若 `exit=0`，说明门 1 有漏检，verdict 必须 `REJECT` 或升级 gao。

实测（2026-07-26）本仿冒批的真实输出，可作对照基准：

```
🔴 RED 4 条（禁止 admit）
   [empty_word] confucius: 含空话词「重要」，套谁都行
   [empty_word] laozi: 含空话词「重要」，套谁都行
   [zh_length] plato: oneLineZh 2 字，应在 25-40
   [zh_duplicate] (批): oneLineZh 有 1 组重复
❌ 文本补丁门未过    exit=1
```

## B.6 长期口径（跨批一致，盲审员据此判，不重定）

**书名**
- 中文原著：中文书名 + 书名号 —— 《传习录》《四书章句集注》
- 非中文原著：中文通行译名 + 书名号
- 无通行译名：罗马化原名 + 括注意译 —— `Proslogion（论证）`、`Nomoi（法律篇）`
- 不许自拟一个看起来像通行译名的东西
- ⚠️ 同名歧义要标出：如普勒东的 Νόμοι 与柏拉图《法律篇》同名，须区分

**关键词**
- 3–6 个实词：学说名、核心概念、代表作、方法
- 十个主题名（正义／伦理／知识／政治／形而上学／语言／自由／生死／宗教／美学）一个都不许用
- 优先取该人 `thoughtSystem` 里反复出现的术语

**简介**
- `oneLineZh` 25–40 字，点出这人区别于旁人的切口
- 落在具体概念上，不靠形容词撑场面；禁空话词（重要/深远/奠定/贡献/集大成/杰出/著名）
- **宁可少写一个概念，不许挤成不成词的缩写；也不许为够字数加无意义后缀**

**英文**
- `oneLineEn` ≤120 字符，须是描述**这个人**的完整句，不是名词短语堆砌
- `keywordsEn` 与 `keywordsZh` 等长同序
- 专名以库内 `names.en` 为准绳；术语按 `glossary.json` 全批统一

## B.7 PASS / REJECT 规则

**PASS 必须同时满足**
- 门 1 全部子批 exit 0，跨批冲突 0
- 门 2 三个仪器均在阈内，或超阈项已逐条说明并成立
- 门 3 全量通读完成（不是抽样）
- 门 4（如需要）仿冒批 exit=1
- §B.4 十二类逐类回答，命中项均已判定为无问题
- 未要求新增审计规则

**REJECT 任一触发即可**
- 任一门失败
- 仪器 2 中 `jaccard ≥ 0.90` 的条目说不出充分修改理由
- 教材表任一类命中且确为问题（**一条即 REJECT，不存在「小修后 PASS」**）
- 出现史实错误（第 7 类）——无条件 REJECT
- 盲审员无法确认关键事实且该事实影响内容真实性
- 盲审员认为需要新增审计规则

---

# §C 英译层盲审要点（codex 产 → grok 审）

门禁与格式沿用 `../i18n-content-translation-spec.md` §5，此处只补互审要点：

1. **抽样比例**：P0 索引层**全量通读**（一人一句，无抽样理由）；P1 thoughtSystem 批次 ≥30%；P2/P3 ≥20%。
2. **最危险错误是 En 内容对应错 id** —— 逐条核 id 与人名是否对得上，不要只读英文本身。
3. **`keywordsEn` 与 `keywordsZh` 必须等长同序**，逐位对照，不是集合相等。
4. 公版引文：`excerptStatus: public_domain` 的 `publicDomainExcerptEn` 只能用公版英译并注明译本；**禁止自译逐字引文**，找不到就不填。
5. 术语一致性对 `glossary.json` 全批核，跨批沿用既有 glossary。
6. §B.4 第 10 类（英译语法错位）同样适用。

---

# §D verdict 格式与合库

## D.1 verdict 文件

盲审员只写这一个文件：`<batch>/review-verdict.md`

```md
# Blind Review Verdict — <batch>

Verdict: PASS | REJECT
Reviewer: codex | grok（须与生产者不同）
Reviewer context: fresh session; inputs limited to batch path, REVIEW-PROTOCOL-cross-audit.md, incident summary (§A.4)
Batch path: <path>
Date: <YYYY-MM-DD HH:mm +08:00>

## 1. 门 1 机器门
<逐份贴真实输出，含 RED 统计与条目数；跨批冲突预检输出>

## 2. 门 2 独立仪器
<贴三个仪器的完整输出>
仪器1: PASS | REJECT   仪器2: PASS | REJECT   仪器3: PASS | REJECT

## 3. 门 3 全量通读
通读条数: <n>/<总数>（须相等）
| id | 类型(§B.4 #) | 问题 | 建议改法 |
|---|---|---|---|

## 4. 门 4 对抗测试
- Required: yes | no ／ Reason: ...
- Result: PASS, fake exit=1 | REJECT, fake exit=0

## 5. §B.4 十二类逐类回答
1. 压字出语病：命中 <n> 条 <ids> — <处置>
2. 凭空造因果：...
（12 类全列，无命中写「0 条」）

## 6. 最终结论
Verdict: PASS | REJECT
If REJECT, 逐条证据:
1. ...
```

## D.2 PASS 后由 gao 合库

```bash
node tools/text-patch-apply.mjs <patch...> --dry-run   # 先看条数
node tools/text-patch-apply.mjs <patch...>             # 写入 public/data
node tools/validate-data.mjs
npx vitest run --exclude '**/node_modules/**' --exclude '**/.claude/**' --exclude '**/tests/smoke.spec.ts'
npm run sync:dist
```

> ⚠️ **不要直接跑 `npm test` 判断结果**。本仓有多个 git worktree，vitest 会扫到同级 worktree 的
> `node_modules` 并把第三方包自带测试（zod / meshoptimizer / @testing-library 等）算进来，
> 还会误捡 playwright 的 `tests/smoke.spec.ts`，造成 18 个「失败文件」的假象。
> 上面的 `--exclude` 组合才是本仓真实测试范围（2026-07-26 实测：19 文件 / 131 测试全通过）。

合库后核对变更范围（确认只动了该动的字段）：

```bash
git diff --stat public/data/philosophers.index.json
# 并逐字段比对 HEAD 与工作区，确认未被本批声明的字段为 0 变更
```

## D.3 账本

合库后追加 `LOOP-LEDGER.md` 戳记，必须包含：`review-verdict.md` 路径、盲审员身份、
门 1–4 结论、变更字段计数、验证命令结果、留债。

---

# §E 红线（两条线共同）

1. 生产者**只写**自己的批次目录，**禁碰** `public/data/`。
2. **禁改**本层声明字段以外的任何字段（文本层四字段之外的 `thoughtSystem`/`themes`/`names`/`life`/`works`/`tier` 一律不许出现在补丁里）。
3. **禁**自行 admit、commit、push。产完即停，交盲审。
4. **禁**顺手扩范围。本批名单之外的一个不碰，看到问题记进 `notes.md`。
5. **生产者禁写 `review-verdict.md`**；**盲审员禁改生产者的批**。
6. 红线豁免只能由 gao 当面给出，且必须在账本戳记与复核记录中写明豁免了哪一条、范围多大。

---

## 附：本规程的来源

- §A 独立性与角色边界：`review-checklist.md` §0–§1，强化了互审特有的三种风险
- §B.1/B.6 判据：`tools/text-patch-lint.mjs`、`RUNBOOK-text-layer-loop.md` §3–§4
- §B.2 双仪器思路：`review-checklist.md` §3（那边是 summaryZh Jaccard，这边换成文本层的三仪器）
- §B.4 第 1–6 类：`RUNBOOK-text-layer-loop.md` §3 门 2 教材表（首批 6 条阻断项）
- §B.4 第 7–12 类：`review-2026-07-26-g3-g7-inline-recheck.md` §4（G3–G7 合库复核实测新增）
- §B.5 对抗测试：`review-checklist.md` §5 的文本层版本
- §C：`../i18n-content-translation-spec.md` §3、§5
- §D.2 的 vitest 陷阱：2026-07-26 实测
