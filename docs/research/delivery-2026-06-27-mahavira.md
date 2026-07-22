# 交付说明：mahavira thoughtSystem 入库

时间：2026-06-27 10:56 CST  
对象：摩诃毗罗 / Mahavira (`mahavira`)  
执行路径：RUNBOOK §9/§13，Kimi 429 后由 ChatGPT 接手 claims + thought-system，并按 §5/§6 入库。

---

## 1. 改前 / 改后厚度

| 项目 | 改前 | 改后 |
|---|---:|---:|
| 正式库 thoughtSystem | 0 | 1 |
| problems | 0 | 3 |
| claims | 0 | 6 |
| evidence | 0 | 12 |
| publicDomainExcerptZh | 0 | 0 |
| summary_only evidence | 0 | 12 |

说明：摩诃毗罗只有 `mahavira-primary-work` 这个占位 workId。为避免伪造现代中文逐字公有领域译文，本轮所有 evidence 均使用 `excerptStatus: "summary_only"`，未填 `publicDomainExcerptZh`。

---

## 2. 本轮写入文件

- `.research/tmp/kimi/people/mahavira/claims.json`
- `.research/tmp/kimi/people/mahavira/thought-systems.json`
- `public/data/philosophers/mahavira.json`
- `.research/tmp/kimi/person-queue/manifest.json`：将 `mahavira` 三阶段标记为 done，队列推进到 `nagarjuna/sources-notes`
- `docs/research/LOOP-LEDGER.md`
- `docs/research/delivery-2026-06-27-mahavira.md`

---

## 3. 写前门实跑输出

命令：

```bash
bash scripts/verify.sh pre .research/tmp/kimi/people/mahavira
```

输出：

```text
=== 门1 validate:kimi（只读） ===
kimi research ok: 11 claims, 8 sources, 1 thought systems, 0 timeline items

=== 门2 admit dry-run --overwrite（只读，不写正式库） ===
kimi thought-system admission dry run: 1 planned, 0 written
- add mahavira -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/mahavira.json
Re-run with --write after human review to update public/data.

=== 结论 ===
✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）
```

---

## 4. 入库写入实跑输出

命令：

```bash
npm run admit:kimi -- .research/tmp/kimi/people/mahavira --overwrite --write
```

输出：

```text
kimi thought-system admission written: 1 planned, 1 written
- add mahavira -> /Users/gao/Desktop/Decisive Moments in History/public/data/philosophers/mahavira.json
```

---

## 5. 写后门实跑输出

命令：

```bash
bash scripts/verify.sh post .research/tmp/kimi/people/mahavira mahavira
```

输出：

```text
=== 门3 validate:data（只读） ===
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

=== 门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库） ===
  mahavira ✅ 正式库 == admit 应生成（逐字节一致）

=== 结论 ===
✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过
```

---

## 6. 内容质量审计

命令：

```bash
node tools/quality-audit.mjs --data-dir public/data
```

输出：

```text
内容质量审计：15 位有 thoughtSystem
  🟢 全绿 15 ｜ 🔴 有RED 0 ｜ 🟡 仅YELLOW 0
  RED 0 条 {}
  YELLOW 0 条 {}
  ✅ 无 RED
```

---

## 7. 测试

第一次误用了 Vitest 不支持的 Jest 参数 `--runInBand`，失败原因是命令参数错误，不是项目测试失败。随后用项目原生命令复跑。

命令：

```bash
npm test
```

输出：

```text
Test Files  15 passed (15)
Tests  81 passed (81)
```

---

## 8. 边界确认

- 未修改 `src/`。
- 未修改 `tools/`。
- 未修改 schema。
- 未修改 `public/data/works.json`。
- 未写正式 `relationships.json`。
- 正式数据仅新增/更新 `public/data/philosophers/mahavira.json`。
- 暂存目录仅写入 `mahavira` 对应研究产物。
- 所有 evidence 使用既有 workId：`mahavira-primary-work`。
- 未填任何未经核实的中文逐字公有领域摘录。

---

## 9. 下一步

队列已推进：

```text
next Kimi stage: nagarjuna / sources-notes
```

若 Kimi 继续限额，可按 RUNBOOK §9/§13 由 ChatGPT 继续接手 `nagarjuna/sources-notes`。
