# 十轮连跑作业单：先清欠，后新产（Standing 10-Round Worksheet）

**执行者**：codex ｜ **性质**：**一次下达、十轮连跑**的作业单
**立于**：2026-08-18（v2，全面重排）｜ **上位规程**：`RUNBOOK-std-upgrade-loop.md`（红线、四道门、停车协议全部继续有效）

---

## 0. 为什么这版把顺序倒过来

v1 排了十轮新产，**排错了**。核对主仓库后的真实状况：

```
产出侧：U8 / U9a / U9b / C1–C7 全部已产（约 40 人份，堆在 .research/tmp/kimi/）
盲审侧：C1 C2 PASS ｜ C3 C4 C5 C6a C6b REJECT ｜ U8 U9a U9b C7 根本没审
入库侧：标准档仍是 218，一个都没进去
```

**瓶颈不是产能，是返工与审核。** 再产十批只会让积压更厚。

更要紧的是 C6 的打回理由：**84 条 locator 全部是编造的流水号，而四道门全绿。**
这正是"连跑多轮"最怕的失败模式——错误口径被复制了整整两批。
所以本版前四轮全部用于清欠，**清干净之前不许开新批**。

### 你不必碰、也不许碰的

正式库现有 4 位 RED（`huineng` 12 条、`zhang-zai` 7 条 `locator_no_chinese_title`，`laozi` 1 条 `duplicate_excerpt` 等）
属于 `public/data/`，**归本机处理，不归你**。红线一条不松。

---

## 1. 开工前：核对现场，不要从本文件假设进度

本单写于 2026-08-18。中间可能又有产出。

```bash
tail -5 docs/research/LOOP-LEDGER.md
ls -d .research/tmp/kimi/*/ | sort | tail -20
node tools/quality-audit.mjs --data-dir public/data | head -6
```

**已完成的轮次直接跳过，从第一个没做的开始。** 尤其：**不要重产任何已存在的批次目录。**

---

## 2. 十轮排期（返工优先）

| 轮 | 内容 | 量 | 位置 |
|---|---|---:|---|
| **R1** | **C6a 返工**：`daoxuan`、`shandao`、`zongmi`、`yanshou` 的编造 locator 逐条重定位 | 4 人 / 56 条 | `2026-07-27-std-c6a-chinese-buddhism-b` |
| **R2** | **C6b 返工**：`han-yu`、`liu-zongyuan` 同上 | 2 人 / 28 条 | `2026-07-27-std-c6b-tang-confucianism` |
| **R3** | **C3/C4/C5 五条解除项**（见 §4 表） | 5 条 | 各原批目录内改 |
| **R4** | **自查 C7 与 U8/U9a/U9b**：用 R1 学到的 locator 判据回头筛一遍这四批，凡编造流水号的就地修 | 4 批 | 各批目录 |
| **R5** | C8 南宋湖湘/事功＋元：`hu-hong`、`zhang-shi`、`chen-liang`、`ye-shi`、`xu-heng` | 5 人 | 新建 `...-std-c8-southern-song-yuan` |
| **R6** | C9 明代心学：`chen-xianzhang`、`luo-qinshun`、`wang-tingxiang`、`zhan-ruoshui`、`wang-gen` | 5 人 | 新建 `...-std-c9-ming-xinxue` |
| **R7** | C10 晚明—明清之际 a：`li-zhi`、`liu-zongzhou`、`huang-zongxi` | 3 人 | 新建 `...-std-c10a-late-ming` |
| **R8** | C10 b：`gu-yanwu`、`fang-yizhi`、`tang-zhen` | 3 人 | 新建 `...-std-c10b-late-ming` |
| **R9** | C11 清代朴学 a：`yan-yuan-qing`、`zhang-xuecheng`、`ruan-yuan` | 3 人 | 新建 `...-std-c11a-qing-evidential` |
| **R10** | C11 b：`jiao-xun`、`gong-zizhen`、`wei-yuan` | 3 人 | 新建 `...-std-c11b-qing-evidential` |

**R1–R4 是硬前置。** 没清完不许进 R5。C 系跑完，近端只剩 P3 方案待 gao 决策。

---

## 3. R1/R2 返工的判据：什么叫"编造的流水号"

C6 那 84 条的病象：locator 写成看起来规整、实则查无此处的编号串。**门查不出来，因为形态合法。**

重定位时对每一条自问三句，答不上就删掉这条改引别的材料：

1. **我是从哪个本子的目录查到这个篇名的？** 写不出版本就是没查过。
2. **这个编号是我数出来的，还是我推出来的？** 推出来的一律不算。
3. **同一部书我引的这几条，编号是跳跃的还是连号？** 连号（ch.1/2/3/4/5）几乎一定是编的——真实取证是跳跃的，**整齐反而反常**。

修完在 `sources.md` 的 **「locator 版本声明」** 一节补上版本依据；凡以章题定位者须给页码或页码区间。
**取不到实物目录就别写章题**——改用该书实际分部，或删掉这条。

宁可一个人只剩 8 条扎实 evidence，也不要 14 条里混 6 条编的。**删掉比编造好。**

---

## 4. R3 的五条解除项

| 批 | 待修 | 解除方向 |
|---|---|---|
| C3 | `liu-xiang:evidence:002` | 「伯禽受封」疑在《说苑·敬慎》而非所标《君道》，核对后改 locator 或改引师旷对答 |
| C4 | `tao-hongjing:evidence:007` | 《真诰》卷六「谢君慎事」篇目无法确认，给出版本依据或改挂可确证篇目 |
| C4 | `ge-hong:evidence:003` | 「明师」疑属《勤求》而非《论仙》，拆成两条或补说明 |
| C5 | `jizang:evidence:005` | 《三论玄义》二谛专节存疑，改挂《二谛义》或《大乘玄论》卷一 |
| C5 | `dao-an:evidence:012` | 安录主体在《出三藏记集》卷二（新集撰出经律论录），非卷四 |

这五条**不是内容错误**，是篇属无法确认，多数只需改一个 locator 或补一句出处说明，**不要重做整批**。

---

## 5. 每轮固定动作

```
选轮（§2 表）→ 做 → 四道门自跑 → 写/更新 self-review.md → 打戳记 → 直接进下一轮
                        ↑ 未过就地修；修不动就降级记 needs_human 并跳过该条，不卡整轮
```

```bash
bash scripts/verify.sh pre .research/tmp/kimi/<batch>      # 门 1–3
node tools/locator-lint.mjs .research/tmp/kimi/<batch>     # 门 4
```

**门全绿不构成任何质量证据**——C6 就是四道门全绿被整批打回的。门只是及格线，判据在 §3 那三句自问。

门 5（self-review.md）沿用 RUNBOOK §4 五问，**外加**：

- 自足问题三问（见 `std-c6-instruction.md` §5）：每人至少一条 questionZh 去掉人名后仍主谓完整、单拿出来是真问题。
- **本轮 locator 我实际翻了哪些本子的目录？** 逐批列出，这是 R1 教训的直接产物。

---

## 6. 盲审是异步的

产完/修完打戳记就进下一轮，**不等盲审**。盲审回来的 REJECT 记进待清欠清单，**当前轮跑完再处理**。

**但有一个例外**：若某轮盲审打回的理由与 §3 的编造 locator 同类，**立即停车**——
说明口径又跑偏了，继续跑只会复制错误。这是本单唯一允许中断轮次推进的信号。

---

## 7. 停车条件

| 码 | 含义 | 处理 |
|---|---|---|
| `turn_budget` | 上下文/额度将满，轮次还有剩 | 戳记写"停在 R\<k\>，下一轮 R\<k+1\>"，人说声继续即可续 |
| `needs_human` | 撞红线、史料判不了、或 §6 那个例外 | 停车等人 |
| `quota` | 额度将尽 | 按 RUNBOOK §12.1 情形② 交接 |
| `backlog_empty` | 十轮跑完 | 报告并要下一单 |

**不构成停车**：一批产完（打戳记进下一轮）／盲审 REJECT 回来（下轮再清）／某人 evidence 找不齐（记 `open-questions.md`，删该条或换人，本轮继续）。

**每轮结束必须打戳记**（格式照 RUNBOOK §12.2，追加到 `docs/research/LOOP-LEDGER.md`），写明 `R<k>/10 完成`。
中断后靠戳记续跑，**永远从账本恢复，不要从记忆假设进度**。

---

## 8. 红线（十轮全程有效）

1. **只写** `.research/tmp/kimi/<batch>/`。**禁碰** `public/data/` 任何文件——包括那 4 位 RED。
2. **禁执行** `admit --write`、`oneoff-promote-upgrade.mjs --write`、`git commit`、`git push`。
3. **禁改** `src/data/schemas.ts`、`tools/*`、`scripts/*`、`relationships.json`。新作品走 `proposed-works.json`。
4. **不写 `review-verdict.md`**。你是生产方，通过与否不由你判。
5. **文本层不归你**：`keywordsEn`/`oneLineEn`/`theme_kw` 缺口属另一条产线，未经 gao 授权一个都不许动。
6. 禁止跨哲人复用/覆写批次目录，`thought-systems.json` 的 `philosopherId` 必须与目录名对应。
7. **不许重产已存在的批次目录**。开新批前先 `ls .research/tmp/kimi/` 确认。

---

## 9. 工作区

正确的工作区是 **`/Users/gao/Desktop/Decisive Moments in History`**（git 仓库，分支 `kimi-research-bridge`）。

`/Users/gao/Desktop/群星闪耀时` 是个空壳目录，只有 `.codex-staging` 镜像，**不是仓库**，在那里跑什么都白跑。
若你的 workspace 指向那里，先让 gao 切过来再开工。

---

## 10. 一句话口令

> 核现场 → R1/R2 返工 C6 的 84 条编造 locator → R3 清五条解除项 → R4 回筛 C7/U8/U9 →
> 清干净才进 R5–R10 产 C8–C11 → 每轮四道门＋self-review＋戳记 → 不等盲审直接下一轮。
> **门全绿不算数，判据是"这个编号我从哪本目录查到的"。删掉比编造好。**
