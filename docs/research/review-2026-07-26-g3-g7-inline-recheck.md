# G3–G7 合库复核记录（2026-07-26）

**性质**：**产线自复核，不是独立盲审。** 执行者与 G5/G6/G7 补丁的生产方是同一条上下文线（grok 文本层产线），
不满足 `docs/research/review-checklist.md` §2.5「新上下文盲审」的独立性要求。
`RUNBOOK-text-layer-loop.md` §5 红线 3（禁自行 admit）与红线 5（禁写 review-verdict）由项目所有者 gao 当面授权豁免，
授权范围仅限「复核 + 合入 public/data」，**不含 commit / push**。

因此本文件**不是** `review-verdict.md`，各批目录下的 verdict 仍应由独立盲审方填写。
若后续做独立盲审，本记录可作为已知问题清单的输入，不可当作已通过的凭据。

---

## 1. 合库范围

| 批 | 内容 | 条数 | 补丁 |
|---|---|---:|---|
| G3 | 92 位 `oneLineEn` + `keywordsEn` | 92 | `2026-07-25-zh-g3-en/{a-europe-modern,b-asia,c-classical-abrahamic,d-global-modern}/` |
| G4 | G2 那 29 位的 `keywordsEn` 等长同序补齐 | 29 | `2026-07-26-zh-g4-g2-keywords-en/` |
| G5 | 短简介（<25 字）加厚，含同步 `oneLineEn` | 111 | `2026-07-26-zh-g5a/g5b/g5c-*`（五个子批 9+24+38+15+25） |
| G6 | 去空话词（重要/深远/奠定/贡献/集大成/杰出/著名） | 23 | `2026-07-26-zh-g6-empty-words/` |
| G7 | `oneLineZh` >40 字压到 25–40 | 23 | `2026-07-26-zh-g7-long-onelines/` |

合计 12 份补丁、270 位、527 个字段写入。

## 2. 门 1：机器门

12 份补丁逐份 `node tools/text-patch-lint.mjs <patch> --expect <ids.expect.txt>` —— **12/12 全绿**，
修正后（见 §4）重跑受影响的 5 份 —— **5/5 仍全绿**。

跨批冲突预检（同一 `(id, 字段)` 在多份补丁取值是否冲突）：
```
补丁份数 12 ｜ 唯一(id,字段) 527 ｜ 重复 0 ｜ 取值冲突 0 ｜ 涉及 id 270
```
G5/G6/G7 三批人群互斥，无一处重叠。

## 3. 门 2：人工门

270 位、527 个字段逐条通读，未抽样。

**G3（92 英文）通过。** 术语口径经查准确：「性恶」→ Bad nature、「无差别之物」→ Indifferents（G1 修正生效）、
「证明性理性」→ Demonstrative reason（G1 修正生效）、「摄取」→ Prehension、「新佛教」→ Navayana Buddhism、
「真理无路」→ Truth is a pathless land（克氏原话）、「间柄」→ Betweenness、`Proslogion` 书名口径（§4 罗马化原名）落实。

**G4（29 keywordsEn）通过。** 29 组全部等长同序，主题英词已换实词：
「暗昧知识」→ Bastard knowledge、「言辞如药」→ Speech as pharmakon、
「反可把握表象」→ Against cataleptic impression、「始基」→ Archē 等，无一处沿用十个主题名。

**G5/G6/G7 抓到 9 条红项 + 4 条凑字**，机器门全绿时一条都没抓到，合库前已就地修正（见 §4）。

## 4. 复核抓到并修正的 13 条

红项（不修不能合库）：

| id | 批 | 类型 | 原 | 改 |
|---|---|---|---|---|
| `xu-xing` | G5b | **史实错** | 主张**君臣**并耕 | 主张**君民**并耕（《孟子·滕文公上》作「贤者与民并耕而食」；en 同步改为 rulers to till alongside the people） |
| `dignaga` | G6 | 压字出语病 | **限**有效认知**为**现量与比量 | **把**有效认知**限定为**现量与比量（37 字，仍在 25–40） |
| `nkrumah` | G6 | 英文语法 | Key post-independence African political **philosophy** via… | **A key node in** post-independence African political philosophy: …（原句把人写成了学科） |
| `yang-zhu` | G6 | 同义叠词 | 成为**对照参照** | 成为**长期对照** |
| `wasil-ibn-ata` | G7 | 丢核心身份 | 早期穆尔太齐赖派**人物** | 早期穆尔太齐赖派**奠基者**（他是该派创始人；en 恢复 founder） |
| `nasir-al-din-tusi` | G7 | 句式别扭+丢身份 | …建立关键连接**的学者**。 | **哲学家与天文学家，**在…间建立连接。 |
| `zoroaster` | G7 | 语义悬空 | 构成**前伊斯兰源头** | 构成**前伊斯兰波斯思想源头**（前伊斯兰的什么源头？；改用「祆教先知」腾出字数） |
| `michael-psellos` | G7 | 不成词 | **百科学问** | **百科式学问** |
| `xuanzang` | G5c-cn | 不成词 | 借**西行译场**夯实 | 以**西行求法与主持译场**夯实（西行取经与主持译场是两件事） |
| `cavailles` | G5c-west | 评价性形容词 | 在抵抗运动中**英勇**被处决 | **因参加法国抵抗运动而**被处决（§4「不靠形容词撑场面」） |

凑字尾巴（不阻断，一并改）——25 字下限逼出的无意义后缀：

| id | 原 | 改 |
|---|---|---|
| `rene-girard` | 解释暴力与神圣起源**之问题路径** | 解释暴力和神圣经验**的共同起源** |
| `michel-serres` | 打通科学史与人文思想**之传统路径** | 打通科学史和人文思想**两种传统** |
| `gilbert-simondon` | 重构技术哲学**之基础路径** | 重构技术哲学**的基本问题** |

## 5. 合库结果

```
node tools/text-patch-apply.mjs <12 份补丁>
→ 270 位 | index 字段变更 517 | detail 字段变更 527
→ ✅ 已写入 public/data/philosophers.index.json 与 270 个 detail 文件
```

变更范围核对（与合库前 HEAD 逐字段比对）：

```
oneLineZh   157 变更（= G5 111 + G6 23 + G7 23）
oneLineEn   239 变更
keywordsEn  121 变更（= G3 92 + G4 29）
keywordsZh    0 变更  ← 本批不碰，符合红线 2
```

验证：

```
node tools/validate-data.mjs   → data ok: 542 philosophers (standard 218 | seed 324), 200 arguments, 1035 relationships, 10 themes
vitest（排除 node_modules）     → 19 文件 / 131 测试全通过
npm run sync:dist              → dist/data 已同步 542/542
```

> `npm test` 直接跑会报 18 个失败文件，全部来自同级 worktree 的 `node_modules`（zod / meshoptimizer 等第三方包自带测试）
> 和被 vitest 误捡的 playwright `tests/smoke.spec.ts`，与本仓源码无关。项目自身测试须排除这些路径才能看到真实结果。

全库形态：

| 指标 | 合库前 | 合库后 |
|---|---:|---:|
| `oneLineZh` <25 字 | 111 | **0** |
| `oneLineZh` >40 字 | 23 | **0** |
| 含空话词 | 23 | **0** |
| `keywordsEn`/`keywordsZh` 不等长 | 0 | **0** |
| 无 `oneLineEn` | 181 | 62 |
| 无 `keywordsEn` | 210 | 89 |

## 6. 留债与新发现

1. **9 位 `keywordsZh` 仍是主题名**，账本此前记 `theme_kw=0` 与实际不符。经对照合库前 HEAD，
   这 9 位在本次合库前后 `keywordsZh` 完全一致，**是 G2 那 29 人之外的漏网，不是本次引入**：
   `fichte`、`schelling`、`alexander-herzen`、`mikhail-bakunin`、`fyodor-dostoevsky`（「自由」），
   `gadamer`（「语言」），`george-santayana`、`diderot`、`abhinavagupta`（「美学」）。
   建议开 G8 批按 G2 口径补齐。
2. **62 位无 `oneLineEn` / 89 位无 `keywordsEn`**。其中 89 位对应 `docs/research/tmp/translation/` batch-011~026 的离线英文补丁，
   按 runbook §2「不是你的活」，待审核方处理，不重译。
3. **`gemistos-plethon` 的《法律篇》**（G7 沿用旧值，非本批引入）：普勒东著作 Νόμοι 与柏拉图《法律篇》同名，
   中文用《法律篇》会与柏拉图混淆。按 §4 口径应作 `Nomoi（法律书）`。本批未动（红线 4 禁扩范围），记此待办。
4. **G5 的 25 字下限副作用**：111 条里相当一部分是给原句加尾巴凑到 25 字，
   §4 已改掉三条最空的，其余（「基本」「之处」「脉络」类）读得通，未逐条重写。
   若日后调整 lint 下限口径，这批值得回看。

## 7. 红线状态

- ✅ 只改了四个文本字段，`thoughtSystem`/`themes`/`names`/`life`/`works`/`tier` 零改动
- ✅ 补丁修正只写在 `docs/research/tmp/<批次目录>/` 内
- ⚠️ 写入 `public/data/`：**经 gao 当面授权**（红线 1、3 豁免），非产线自行 admit
- ✅ **未 commit、未 push** —— 授权不含此项
- ✅ 未写任何 `review-verdict.md`
