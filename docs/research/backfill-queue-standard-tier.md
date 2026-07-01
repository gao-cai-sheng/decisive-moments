# 存量回补队列：把门3 之前入库的薄数据补到标准档

**背景**：写前门门3（2026-07-01 强化）只挡【新入库】的薄批次，不回补历史数据。以下 36 位是门3 上线前入库、当前仍低于标准档（`thin_evidence` 或 `summary_thin` 或 `weight_uniform`）的哲人。按 ROI + 影响力排序，供 Kimi 限额窗口按 §13 逐个加厚。

**判据**：某位加厚后，`node tools/quality-audit.mjs` 对其不再报 thin_evidence/summary_thin/weight_uniform，即从本队列移除。加厚走 §4→§5（门3 会校验）→§6，同人改动属 §4 允许范围。

**目标标准档**：每 claim ≥2 evidence（每人 ≥12）；每条 summaryZh ≥40 字；同 problem 内 claim 的 weight 有区分。

生成时间：2026-07-01；全库 108 位有 thoughtSystem，其中 36 位待回补。

最近回补：
- 2026-07-01 21:36：已清 `aristotle`、`socrates`、`thales` 三位 T2 欠账；全库质量审计从 🟢45 / 🟡63 更新为 🟢48 / 🟡60，YELLOW 总数从 632 降到 622。
- 2026-07-01 21:45：已清 `carneades`、`chrysippus`、`cicero` 三位 T2 欠账；全库质量审计从 🟢48 / 🟡60 更新为 🟢51 / 🟡57，YELLOW 总数从 622 降到 586。
- 2026-07-01 21:58：已清 `democritus`、`diogenes-sinope`、`epictetus` 三位 T2 欠账；全库质量审计从 🟢51 / 🟡57 更新为 🟢54 / 🟡54，YELLOW 总数从 586 降到 550。
- 2026-07-01 22:28：完成 6 批方案第 1 批：T1 `buddha`、`plato`、`confucius`、`nietzsche`、`kant` 证据翻倍并清薄摘要，T2 `gorgias`、`lucretius`、`marcus-aurelius`、`protagoras` 清薄摘要；全库质量审计从 🟢54 / 🟡54 更新为 🟢63 / 🟡45，YELLOW 总数从 550 降到 424。
- 2026-07-01 23:49：完成 6 批方案第 2 批：T1 `marx`、`rawls`、`bergson`、`foucault`、`merleau-ponty` 证据翻倍并清薄摘要，T2 `pyrrho`、`seneca`、`theophrastus`、`zeno-elea` 清薄摘要；全库质量审计从 🟢63 / 🟡45 更新为 🟢72 / 🟡36，YELLOW 总数从 424 降到 322。

---

## 一档 T1：需【证据翻倍】6→12（工作量大、收益最高，先做）

这 20 位每 claim 仅 1 条 evidence，多数摘要也偏薄。优先按 influenceWeight（iw）从高到低。

| # | iw | id | 缺证据(claim) | 摘要偏薄(条) | 中文名 | 备注 |
|---|---:|---|---:|---:|---|---|
| 1 | 2 | whitehead | 6 | 6 | 怀特海 | round B |
| 2 | 2 | xunzi | 5 | 1 | 荀子 | 中国古典 |
| 3 | 1 | arendt | 6 | 6 | 阿伦特 | round B |
| 4 | 1 | beauvoir | 6 | 6 | 波伏娃 | round B |
| 5 | 1 | camus | 6 | 6 | 加缪 | round B（曾被安全层改写，复核语义） |
| 6 | 1 | carnap | 6 | 6 | 卡尔纳普 | round B |
| 7 | 1 | derrida | 6 | 6 | 德里达 | round B |
| 8 | 1 | heidegger | 6 | 6 | 海德格尔 | round B |
| 9 | 1 | nozick | 6 | 6 | 诺齐克 | round B |
| 10 | 1 | quine | 6 | 6 | 蒯因 | round B（溯源存疑：曾复用他人研究目录） |
| 11 | 1 | russell | 6 | 6 | 罗素 | round B |
| 12 | 1 | sartre | 6 | 6 | 萨特 | round B |
| 13 | 1 | wittgenstein | 6 | 6 | 维特根斯坦 | round B |
| 14 | 1 | dewey | 6 | 5 | 杜威 | round B |
| 15 | 1 | frege | 6 | 5 | 弗雷格 | round B |
| 16 | 1 | husserl | 6 | 4 | 胡塞尔 | round B |
| 17 | 1 | mencius | 5 | 2 | 孟子 | 中国古典 |
| 18 | 1 | mozi | 6 | 0 | 墨子 | 中国古典 |
| 19 | 1 | zhuangzi | 4 | 1 | 庄子 | 中国古典 |
| 20 | 1 | laozi | 4 | 0 | 老子 | 中国古典 |

## 二档 T2：仅【摘要加厚】到 ≥40 字（证据已 12，工作量小）

这 16 位每人已有 12 条 evidence，只是 summaryZh 偏短，把偏薄的几条补到 40 字即可。含 2 位 weight 无区分（标 ⚑，顺手把同题 claim 的 weight 拉开）。

| # | iw | id | 摘要偏薄(条) | weight无区分 | 中文名 |
|---|---:|---|---:|:--:|---|
| 1 | 1 | anaximenes | 11 | | 阿那克西美尼 |
| 2 | 1 | empedocles | 11 | | 恩培多克勒 |
| 3 | 1 | xenophanes | 11 | | 色诺芬尼 |
| 4 | 1 | anaxagoras | 10 | | 阿那克萨戈拉 |
| 5 | 1 | antisthenes | 10 | | 安提斯泰尼 |
| 6 | 1 | cleanthes | 10 | | 克里安忒斯 |
| 7 | 1 | hypatia | 10 | | 希帕提娅 |
| 8 | 1 | plotinus | 10 | | 普罗提诺 |
| 9 | 1 | zeno-citium | 9 | | 芝诺（基提翁） |
| 10 | 1 | anaximander | 8 | | 阿那克西曼德 |
| 11 | 1 | pythagoras | 7 | | 毕达哥拉斯 |
| 12 | 1 | heraclitus | 4 | | 赫拉克利特 |
| 13 | 1 | epicurus | 2 | | 伊壁鸠鲁 |
| 14 | 1 | parmenides | 2 | | 巴门尼德 |
| 15 | 1 | krishnamurti | 1 | ⚑ | 克里希那穆提 |
| 16 | 1 | ambedkar | 0 | ⚑ | 安贝德卡尔 |

---

## 处理建议

1. **先 T1 后 T2**：T1 要补证据（每 claim 找第 2 条精确原典 + locator），是真研究活；T2 只是把摘要写厚，可快速批量清。
2. **下一批按 6 批方案继续 Batch 3**：T1 `whitehead`、`xunzi`、`arendt`、`beauvoir`、`camus`；T2 `anaximenes`、`empedocles`、`xenophanes`、`anaxagoras`。
3. **round B 的 20 位注意两个坑**：foucault/camus 曾为过安全层被改写措辞，回补时顺手复核语义保真；quine–derrida 那 5 位原研究目录被复用覆写，补的时候best-effort 重建独立 sources（见 §10 溯源铁律）。
4. 每清一位：`bash scripts/verify.sh pre <batch>` 门3 全绿 → admit → `quality-audit` 确认该人从本队列消失 → 记账 + 打戳记。
5. 另一笔不在本队列、但同样在涨的债：**逐字原文 publicDomainExcerptZh**（当前 summary_only=1072）。回补摘要时若手头正好有公有领域原典，可一并补上，excerptStatus 改 public_domain。
