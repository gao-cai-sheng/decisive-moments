# 盲审启动包：C8 / C9 返修版（2026-08-19）

**给谁**：两个**全新、互相隔离**的盲审实例（C8 一个，C9 一个，不得复用同一实例）
**为什么需要它**：两批的旧 verdict 审的是返修前的版本，结论已失效；返修版尚无盲审结论。

---

## 0. 起实例前，先做隔离（gao 执行一条命令）

两批目录里都还留着**返修前**的旧 verdict 与生产者自述，会污染独立性。先归档：

```bash
cd "/Users/gao/Desktop/Decisive Moments in History" && for B in 2026-08-18-std-c8-southern-song-yuan 2026-08-18-std-c9-ming-xinxue; do D=".research/tmp/kimi/$B"; mkdir -p "$D/_archive-v1"; for f in review-verdict.md self-review.md postmortem-rejected.md; do [ -f "$D/$f" ] && mv "$D/$f" "$D/_archive-v1/$f"; done; done; echo done
```

> 说明：`_archive-v1` 空目录已由上一会话创建（沙箱阻止了移动这一步），这条命令补完移动即可。

---

## 1. 喂给盲审员的输入（只有这些）

```
1. 批次目录路径（C8 或 C9，二选一）
2. docs/research/review-checklist.md
3. 本文件 §3 的事故摘要
4. 本文件 §4 的本轮重点
```

## 2. 禁止喂给盲审员

```
✗ 任何 _archive-v1/ 下的内容（旧 verdict、旧 self-review、postmortem-rejected）
✗ docs/research/LOOP-LEDGER.md（含生产方成功叙述与两批的返修记账）
✗ POSTMORTEM / REPAIR / std-*-instruction 等本线规划文档
✗ 生产者自述「已完成 / 已修复 / 已全绿」
```

原则不变：**先看货，后看账。**

---

## 3. 事故摘要（唯一允许的历史输入）

> **一代模板**：claim/evidence/summary 只换哲人名或主题词，句式高度重复。
> **二代模板**：规避浅层正则，同一 problem 内 claimZh 重复或同构，summaryZh 粘 workId，locator 伪定位为泛泛篇章。
> **三代（文本层）**：机器门 12/12 全绿的批次里仍有 9 条红项——史实错、语义悬空、评价词凑字。
> **四代（本线，2026-07~08）**：locator 用「英译书名 + sec. N」递增序号伪造定位（C6，84 条），
> 被打回后改为「中文《篇目》+ 概括词 + 段」——**不写编号就没有编号可被质疑**，四道门仍全绿。
> 中华块 12 批原文锚率从 92% 单调退化至 3%。
>
> **结论：机器门全绿不构成任何质量证据。** 判据是：**锚里的字能不能在原典里直接搜到？**

---

## 4. 本轮重点核查项

### 共同项

1. **删除项是否复活**：上一版两批合计删除 20 条 unsupported。逐条比对 `_archive-v1/postmortem-rejected.md`
   （**由裁决者代查，不交盲审员**，避免其读到旧账）——或由盲审员独立判断是否存在语义重复的可疑条目。
2. **引文锚真实性**：每条 locator 的引文锚必须能在可达源检索到。CTP 有登录墙，
   优先 wikisource / kanripo；核不到就记「未核完」，**不许凭记忆补写结论**。
3. **两个率只是字段完备率**，不等于真实性。verdict 必须同时报这两个数与人工抽查比例。

### C8 专项

```
当前为 2 人批（ye-shi 叶适、xu-heng 许衡），24 条 evidence。
hu-hong / zhang-shi / chen-liang 已因材料不足退回种子档，不在本批 —— 勿按 5 人口径审。
```

- **23 条 summaryZh 系本轮加厚**（从 24–38 字扩写至 ≥40 字）。
  重点查：加厚内容是否**只据本条已有逐字 excerpt 扩写**，有无添加原文中不存在的判断或评价。

### C9 专项

```
当前为 5 人批，61 条 evidence（上一版为 55 条）。
```

- **新增 6 条是为消两条结构 RED（`luo-qinshun:problem:002` 仅 1 claim、`wang-gen` 仅 2 problems）而补。**
  这是本轮最需要独立核实的地方：新增条虽已过 metrics 门（有原文锚与逐字摘录），
  但必须确认其属「回原典真找到的真材料」，**而非为消 RED 而变相补条**。
  逐条核其引文锚是否真实存在于所标 workId 的原典对应位置。
- 另查 `zhan-ruoshui:evidence:337/338` 的 workId 是否已正确指向 `zhan-ruoshui-xinxing-tushuo`。

---

## 5. 盲审员输出

只输出一个文件：

```
<batch>/review-verdict.md
```

结论只有 `PASS` / `REJECT` 两种。**没有「PASS with minor fixes」**——有要改的就是 REJECT。
无法确认的关键事实：`REJECT` 或 `needs_human`，**不得 PASS**。
不修生产者的批；不要求改审计规则（需要改则停车报 gao）。

---

## 6. 裁决

- 两批**都 PASS** → gao 可决定 admit；codex 方可按 `std-next-batch-instruction.md` 开 C10a。
- 任一 REJECT → 该批按 verdict 返修，**C10a 继续禁止开工**。
