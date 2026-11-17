# 执行指令：旧批次 5 位中国古典哲人——内容加厚（第二阶段）

**下达人**：项目负责人（经 Claude/Cowork 评估后下达）
**执行人**：ChatGPT / Codex
**前置交付**：`docs/research/delivery-2026-06-26-kimi-thought-systems.md`（第一阶段，结构合规与入库已完成）
**本阶段目标**：把第一阶段为通过校验而压低的内容补到“可展示”的厚度，并提高引证精度。**不是**重新研究，是在既有结构上加厚。

---

## 0. 硬性边界（违反即视为不合格）

```text
禁止修改：src/data/schemas.ts（schema 定义）
禁止修改：tools/admit-kimi-thought-systems.mjs、tools/validate-*.mjs（入库与校验脚本）
禁止修改：任何前端 UI、测试脚本、队列脚本
禁止改动：confucius/buddha/plato/kant/nietzsche 等本批次以外哲人的数据
本阶段只动：旧批次 5 人的 thoughtSystem 内容（见下）
```

涉及文件，仅限：

```text
.research/tmp/kimi/2026-06-26-batch-01-chinese-classical/thought-systems.json
public/data/philosophers/laozi.json
public/data/philosophers/zhuangzi.json
public/data/philosophers/mozi.json
public/data/philosophers/mencius.json
public/data/philosophers/xunzi.json
```

工作流：**先改 `.research/tmp` 暂存批次 → 跑 `validate:kimi` 和 `admit:kimi` dry-run 通过 → 再用 `--overwrite` 正式入库 → 最后 `validate:data`。** 不允许绕过暂存直接手改 `public/data`。

---

## 1. 任务 A：精确化引证 locator（必做）

第一阶段新增的 5 条 evidence 中，有 4 条 locator 过于宽泛，可核查性不足。逐条改为**单一、精确**的章节 + 具体段落定位，不要用“等相关篇章/章句”这类模糊范围。

| 哲人 | evidence id | 现状 locator（过宽） | 要求 |
|---|---|---|---|
| 庄子 | `zhuangzi:evidence:005` | 大宗师、至乐等相关篇章 | 收敛到**一个**主篇（如《大宗师》某段），给出可定位的句首 |
| 墨子 | `mozi:evidence:004` | 天志上、中、下 | 指定**其中一篇**并标段，而非三篇并列 |
| 孟子 | `mencius:evidence:005` | 梁惠王上、公孙丑上等相关章句 | 收敛到**一处**具体章句 |
| 老子 | `laozi:evidence:005` | 第一章 | 已较精确，**核对原文**确认即可 |
| 荀子 | `xunzi:evidence:005` | 天论 | 在《天论》内**标出具体段落**，而非整篇 |

每条 evidence 须补全真实的 `source.excerptZh`（公有领域原文摘录，逐字），并将 `excerptStatus` 与实际情况对齐（确有摘录则用对应状态，不要保留占位）。

---

## 2. 任务 B：加厚第 3 个 problem（必做）

第一阶段为各哲人补的第 3 个 problem 均为最省力配置（1 claim + 1 evidence），明显薄于原有 problem。把这 5 个新 problem 补到与原有 problem 同等厚度。

涉及 problem：

```text
laozi:problem:003    语言、名与道的限度
zhuangzi:problem:003 生死、转化与自然化生
mozi:problem:003     天志、明鬼与公共规范
mencius:problem:003  义利之辨
xunzi:problem:003    天人之分
```

每个 problem 须达到：

```text
claims >= 2
每个 claim 的 evidence >= 1，且该 problem 下 evidence 合计 >= 2
claim 之间 weight 有区分度（不要全部同权重；主张强度不同要体现在 weight 上）
每条 evidence 都有精确 locator + 真实 excerptZh（同任务 A 标准）
```

内容要求：claim 必须是该哲人在该问题上的**实质立场**，不是复述题目；evidence 必须能支撑对应 claim，引文与 claim 有可见的逻辑关系。

---

## 3. 任务 C：跨哲人 relationship 候选（选做，但推荐）

为本批次 5 人生成思想关系候选（如：庄子承老子、孟荀对立于性、墨家与儒家对立于“爱有差等”）。**只产出候选清单到研究暂存区或单独 md，不直接写正式 `relationships`**，等负责人审核。输出至：

```text
.research/tmp/kimi/2026-06-26-batch-01-chinese-classical/relationship-candidates.md
```

每条候选给出：源哲人、目标哲人、关系类型、一句话依据、建议 weight。

---

## 4. 验收门槛（全部必须通过，并在交付中贴出实跑输出）

```bash
# 1) 暂存批次研究校验
npm run validate:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical
# 期望：thought systems 仍为 5；claims、evidence 总数应较第一阶段(22 claims / 10 sources)上升

# 2) 入库 dry-run（覆盖模式）
npm run admit:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical --overwrite
# 期望：5 planned, 0 written（dry-run）

# 3) 正式覆盖入库
npm run admit:kimi -- .research/tmp/kimi/2026-06-26-batch-01-chinese-classical --overwrite --write
# 期望：5 written

# 4) 正式数据校验
npm run validate:data
# 期望：data ok: 100 philosophers, ... themes（哲人/主题计数不得因本次改动而下降）
```

逐项验收清单：

```text
[ ] 5 条新 evidence 的 locator 已精确到单一段落，无“等相关篇章/章句”
[ ] 5 条新 evidence 均含逐字 excerptZh，excerptStatus 与实际一致
[ ] 5 个 problem:003 均达到 claims>=2、evidence>=2、weight 有区分度
[ ] 未修改 schema / 入库脚本 / 校验脚本 / UI / 队列脚本
[ ] 未触碰本批次以外哲人数据
[ ] 全库 thoughtSystem 仍为 10 人，未因覆盖入库丢失任何已有哲人
[ ] 上述 4 条命令实跑输出已粘贴进交付文档
```

---

## 5. 交付要求

完成后写一份 `docs/research/delivery-2026-06-26-kimi-thicken-classical.md`，结构对齐第一阶段交付文档，并**额外**满足：

```text
- 用「改前 / 改后」对照表展示每位哲人 problem:003 的 claims/evidence/locator 变化
- 贴出第 4 节四条命令的真实输出（不得手写编造）
- 明确声明未越界（对照第 0 节边界逐条确认）
- 诚实标注：哪些 excerpt 为逐字原文、哪些仍为概括（如有）
```

**重要**：和第一阶段一样，不得把仓库里既有的、非本次产生的改动算作本次成果；不得为通过校验而填入与原文不符的引文。内容正确性优先于通过校验。
