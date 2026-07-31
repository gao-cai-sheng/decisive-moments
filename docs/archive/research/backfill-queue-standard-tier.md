# 存量回补队列：把门3 之前入库的薄数据补到标准档

**背景**：写前门门3（2026-07-01 强化）只挡【新入库】的薄批次，不回补历史数据。结构性标准档回补队列已清空：门3 上线前入库的 `thin_evidence`、`summary_thin`、`weight_uniform` 欠账均已在 2026-07-02 收尾批处理完成。

⚠️ 2026-07-02 复核发现旧门3未能识别“模板灌水”：`augustine` 至 `mill` 这批 20 位命中新增反模板 RED 规则。详见 `docs/research/backfill-template-red-queue.md`。因此不得再按旧口径宣称“108 全绿”；新口径为 88 绿 / 20 RED。

**判据**：某位加厚后，`node ./tools/quality-audit.mjs --data-dir ./public/data` 对其不再报 summary_thin/weight_uniform，即从本队列移除。加厚走 §4→§5（门3 会校验）→§6，同人改动属 §4 允许范围。

**目标标准档**：每 claim ≥2 evidence（每人 ≥12）；每条 summaryZh ≥40 字；同 problem 内 claim 的 weight 有区分。

生成时间：2026-07-01；最近更新：2026-07-02；全库 108 位有 thoughtSystem，其中结构性薄项 0 位待回补；模板灌水 RED 队列 20 位待重做。

最近回补：
- 2026-07-01 21:36：已清 `aristotle`、`socrates`、`thales` 三位 T2 欠账；全库质量审计从 🟢45 / 🟡63 更新为 🟢48 / 🟡60，YELLOW 总数从 632 降到 622。
- 2026-07-01 21:45：已清 `carneades`、`chrysippus`、`cicero` 三位 T2 欠账；全库质量审计从 🟢48 / 🟡60 更新为 🟢51 / 🟡57，YELLOW 总数从 622 降到 586。
- 2026-07-01 21:58：已清 `democritus`、`diogenes-sinope`、`epictetus` 三位 T2 欠账；全库质量审计从 🟢51 / 🟡57 更新为 🟢54 / 🟡54，YELLOW 总数从 586 降到 550。
- 2026-07-01 22:28：完成 6 批方案第 1 批：T1 `buddha`、`plato`、`confucius`、`nietzsche`、`kant` 证据翻倍并清薄摘要，T2 `gorgias`、`lucretius`、`marcus-aurelius`、`protagoras` 清薄摘要；全库质量审计从 🟢54 / 🟡54 更新为 🟢63 / 🟡45，YELLOW 总数从 550 降到 424。
- 2026-07-01 23:49：完成 6 批方案第 2 批：T1 `marx`、`rawls`、`bergson`、`foucault`、`merleau-ponty` 证据翻倍并清薄摘要，T2 `pyrrho`、`seneca`、`theophrastus`、`zeno-elea` 清薄摘要；全库质量审计从 🟢63 / 🟡45 更新为 🟢72 / 🟡36，YELLOW 总数从 424 降到 322。
- 2026-07-02：完成 6 批方案第 3 批 T1：`whitehead`、`xunzi`、`arendt`、`beauvoir`、`camus` 证据翻倍并清薄摘要；全库质量审计从 🟢72 / 🟡36 更新为 🟢77 / 🟡31，YELLOW 总数从 322 降到 268。
- 2026-07-02 01:35：完成 6 批方案第 4 批 T1：`carnap`、`derrida`、`heidegger`、`nozick`、`quine` 证据翻倍并清薄摘要；全库质量审计从 🟢77 / 🟡31 更新为 🟢82 / 🟡26，YELLOW 总数从 268 降到 208。
- 2026-07-02 01:51：完成 Batch 5 T1：`russell`、`sartre`、`wittgenstein`、`dewey`、`frege` 证据翻倍并清薄摘要；全库质量审计从 🟢82 / 🟡26 更新为 🟢87 / 🟡21，YELLOW 总数从 208 降到 150。
- 2026-07-02 02:05：完成 Batch 6 最后一组 T1：`husserl`、`mencius`、`mozi`、`zhuangzi`、`laozi` 证据翻倍并清薄摘要；全库质量审计从 🟢87 / 🟡21 更新为 🟢92 / 🟡16，YELLOW 总数从 150 降到 118，`thin_evidence` 清零。
- 2026-07-02 02:16：完成 T2 摘要加厚 A 批：`anaximenes`、`empedocles`、`xenophanes`、`anaxagoras`、`antisthenes`；全库质量审计从 🟢92 / 🟡16 更新为 🟢97 / 🟡11，YELLOW 总数从 118 降到 65。
- 2026-07-02 09:19：完成 T2 摘要加厚 B 批：`cleanthes`、`hypatia`、`plotinus`、`zeno-citium`、`anaximander`；全库质量审计从 🟢97 / 🟡11 更新为 🟢102 / 🟡6，YELLOW 总数从 65 降到 18。
- 2026-07-02 09:52：完成 T2 收尾批：`pythagoras`、`heraclitus`、`epicurus`、`parmenides`、`krishnamurti`、`ambedkar`；在旧结构性审计口径下，全库质量审计从 🟢102 / 🟡6 更新为 🟢108 / 🟡0，YELLOW 总数从 18 降到 0，结构性标准档回补队列清空。
- 2026-07-02 10:03：新增反模板 RED 审计规则，确认 `augustine`→`mill` 20 位为模板灌水；新口径全库为 🟢88 / 🔴20 / 🟡0，RED 360 条。

---

## 一档 T1：需【证据翻倍】6→12

✅ 已清空。当前全库 `thin_evidence=0`。

## 二档 T2：仅【摘要加厚】到 ≥40 字（证据已 12，工作量小）

✅ 已清空。当前全库 `summary_thin=0`、`weight_uniform=0`。

---

## 处理建议

1. 结构性标准档回补队列已清空，但模板灌水 RED 队列未清空。
2. 下一步应优先重做 `docs/research/backfill-template-red-queue.md` 中 20 位，而不是继续新增 `watsuji`。
3. 若暂不重做，应至少在汇报中使用新口径：88 绿 / 20 RED / 0 YELLOW。
4. 另一笔不在本队列、但仍存在的债：逐字原文债务（当前 summary_only=1266）。后续若核定公有领域原典，可逐条补 `publicDomainExcerptZh`。
