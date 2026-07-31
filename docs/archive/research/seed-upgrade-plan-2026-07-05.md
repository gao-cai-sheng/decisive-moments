# Seed→Standard 升格计划（丰富单条数据 / 补齐卫星）— 2026-07-05

哲人扩充暂停。本计划把已入库的 seed 档逐批升格为标准档，让每颗恒星长出卫星。承接 `HANDOFF-2026-07-05-v3.md`。

## 0. 问题定义

- 星图中每颗星的「卫星」= `thoughtSystem.problems`（`src/scene/NearbyOrbits.tsx` 按 problems 渲染轨道行星；`!detail.thoughtSystem` 直接不画）。
- seed 档按 §2.5 门禁止 thoughtSystem → **全库 347 位 seed 星都无卫星**。标准档 195 位正常。
- 补齐 = 逐位升格 seed→standard：补 thoughtSystem（含 evidence 溯源）、加厚 summaryZh、按需扩 works。总量 542 不变，每批计数变化为 standard +N / seed −N。

## 1. 现状盘点（2026-07-05，全库 542 = 标准 195 / seed 347）

seed 按名气（influenceWeight）：**w3 = 81｜w2 = 263｜w1 = 3**。

| 优先级 | 块 | 人数 | 说明 |
|---|---|---:|---|
| P1 | W10–W13 新采集 | 36 | 波斯 2、俄罗斯 16、东正教 10、上座部 5、越南 3；33 位 w3 |
| P2 | 存量 w3（全部为中华） | 48 | 商鞅→魏源，先秦至晚清 |
| P3 | 其余 w2/w1 | 263+3 | western 102、chinese 52、islamic 24、latin_american 22、jewish 20 等；**是否全升待决**（见 §5） |

## 2. 升格判据（= 标准档写前硬门，照 RUNBOOK §4）

- problems ≥3；每 problem claims ≥2；每 claim evidence ≥2（每人 ≥12 条）。
- 每条 evidence summaryZh ≥40 字；同 problem 内 claim weight 有区分。
- evidence.source：workId 必须在 works.json 且属同一人；locator 精确到单一段落/章句；有逐字公有领域原文才标 public_domain，否则 summary_only/none。**铁律：内容正确性 > 通过校验**——俄文/希腊文/巴利文原典的中译多无公有领域版本，预期大量 summary_only，不许编造引文。
- 反模板规则全部生效（template_claim / shared_suffix / 复述问题等直接 RED）。
- 人级字段同步加厚：summaryZh ≥40 字、works 如只有登记名可经 proposed-works.json 扩充（新增 works 属扩边界，盲审时重点核）。

## 3. 每批标准流程（沿用现有纪律，不新造流程）

1. codex 产 `.research/tmp/kimi/<batch>/`：proposed-philosophers.json（tier=standard，保留原 seed 身份层字段）+ thought-systems.json + 按需 proposed-works.json。禁碰 public/data。
2. **新上下文盲审** → PASS/REJECT 写 `<batch>/review-verdict.md`。升格批盲审要点：evidence 溯源真实性、locator 精确度、反模板、新增 works 是否可考。（seed 关系 ≤3 度数模拟不再需要——升格不动 relationships，标准档也无上限。）
3. `bash scripts/verify.sh pre <batch>`（含 quality-audit --batch --require-standard 硬门）。
4. `admit --tier standard --overwrite --write` → `validate-data` + `quality-audit --require-standard` + `vitest` 全绿 → `npm run sync:dist`。
5. 本机 commit（勿 push）；每步记 `LOOP-LEDGER.md`。
6. 批命名：`2026-07-XX-std-u<N>-<block>`；每批 3–6 人（标准档工作量大，勿贪）。

## 4. 批次表

### P1：新采集 36 位（W10–W13），约 9 批

| 批 | 块 | 人 | 名单 |
|---|---|---:|---|
| U1（试点） | 波斯 | 2 | zoroaster, mani。**小批打样升格全流程**：tier 翻转、works 扩充、summary_only 口径，跑通后再放量。伽萨/沙卜拉干 locator 可到颂/章 |
| U2 | 东正教 a | 3 | basil-the-great, gregory-of-nazianzus, gregory-of-nyssa（卡帕多西亚三杰） |
| U3 | 东正教 b | 4 | pseudo-dionysius, maximus-the-confessor, john-of-damascus, michael-psellos |
| U4 | 东正教 c | 3 | symeon-the-new-theologian, gregory-palamas, gemistos-plethon |
| U5 | 俄罗斯 a | 4 | pyotr-chaadaev, ivan-kireevsky, aleksei-khomyakov, alexander-herzen |
| U6 | 俄罗斯 b | 3 | mikhail-bakunin, nikolai-chernyshevsky, peter-kropotkin |
| U7 | 俄罗斯 c | 5 | fyodor-dostoevsky, leo-tolstoy, vladimir-solovyov, nikolai-fedorov, sergei-bulgakov（solovyov 升格后其 ≤3 锁定自然解除） |
| U8 | 俄罗斯 d（白银） | 4 | lev-shestov, nikolai-berdyaev, pavel-florensky, semyon-frank |
| U9 | 上座部+越南 | 8→拆2 | buddhaghosa, dhammapala, ledi-sayadaw, mahasi-sayadaw ｜ buddhadasa, tran-thai-tong, tran-nhan-tong, le-quy-don |

### P2：存量 w3 中华 48 位，约 10 批（按学脉分组，批内 4–6 人）

| 批 | 学脉 | 名单 |
|---|---|---|
| C1 | 先秦政术/法兵 | shang-yang, guan-zhong, sunzi, li-si |
| C2 | 两汉经史 a | dong-zhongshu, wang-chong, sima-qian |
| C3 | 两汉经史 b + 目录学 | zheng-xuan, liu-xiang, liu-xin |
| C4 | 魏晋玄学/道教 | ji-kang, ge-hong, tao-hongjing |
| C5 | 汉传佛教 a | dao-an, huiyuan, jizang, xuanzang |
| C6 | 汉传佛教 b | daoxuan, shandao, zongmi, yanshou |
| C7 | 唐宋转型 | han-yu, liu-zongyuan, shao-yong, sima-guang, su-shi |
| C8 | 南宋湖湘/事功 + 元明 | hu-hong, zhang-shi, chen-liang, ye-shi, xu-heng |
| C9 | 明代心学一线 | chen-xianzhang, luo-qinshun, wang-tingxiang, zhan-ruoshui, wang-gen |
| C10 | 晚明—明清之际 | li-zhi, liu-zongzhou, huang-zongxi, gu-yanwu, fang-yizhi, tang-zhen |
| C11 | 清代朴学/经世 | yan-yuan-qing, zhang-xuecheng, ruan-yuan, jiao-xun, gong-zizhen, wei-yuan |

（C 系 11 批；中文原典公有领域文本充足，publicDomainExcerptZh 应尽量逐字补，是全库 excerpt 债务下降最快的一段。）

### P3：w2/w1 共 266 位 —— 先决策后动工

不建议无差别全升（263 位 × 每人 ≥12 evidence 是 P1+P2 的三倍量）。两个选项，P2 收尾时定：

- **方案甲（推荐）**：名气优先抽升。每文明按 w2 中最有名者挑短名单（估 60–90 位，如 western 的二线经院/启蒙、islamic 苏非一线、latin_american 解放哲学一线），其余长期保留 seed 档——「亮星有卫星、暗星只是星」本身是可接受的产品形态。
- **方案乙**：全量升格,按 civ 逐块推进，预估 50+ 批，数月量级。

## 5. 节奏与验收

- 参考历史节奏（2026-07-01/02 加厚批）：一个会话日 1–2 批。P1 约 9 批 ≈ 1 周量级；P2 约 11 批。
- 每批验收：三绿（validate 542 / audit RED0·YELLOW0 / vitest）+ sync:dist + 星图肉眼抽查该批卫星已浮现（Cmd+Shift+R 硬刷新，镜头拉近 <7.5 距离）。
- 阶段验收：P1 完成后 standard 应为 195+36=231 / seed 311；P2 完成后 279 / 263。
- 前置（不动不开工）：HANDOFF v3 §7 本机收尾 commit 仍未做——先 commit W10–W13 的 36 位，再开 U1，避免升格改动和入库改动混在同一工作树。

## 6. 升格特有风险

- **works 扩充**：seed 只登记 1–2 部作品,evidence 需要的 workId 可能不够 → 经 proposed-works.json 随批新增，盲审核真伪；禁占位 id。
- **史料薄的人**：zoroaster/mani/tran-thai-tong 这类可归属文本少的,允许 problems=3 的下限结构 + 诚实标注争议，不许灌水凑厚——反模板 RED 会抓。
- **跨批模板化**：同一学脉连续产出易共享句式,盲审加查 shared_suffix / template_similarity。
- **勿动 relationships**：升格批不改关系文件，把变量隔离在 philosophers/*.json + works.json + index。关系增补(如给升格后的枢纽补边)另起单独批。
