# 交付说明：世亲 vasubandhu thoughtSystem 入库

## 范围

- 哲人：世亲 / Vasubandhu (`vasubandhu`)
- 起点：队列指向 `vasubandhu / sources-notes`
- Kimi 状态：`run-next` 返回 `blocked_rate_limit`，未产出完整阶段文件
- 接手方式：按 RUNBOOK §9 / §13，由 ChatGPT 完成暂存研究、claims、thought-system，并执行标准校验与入库

## 厚度对照

| 对象 | 改前 | 改后 |
|---|---:|---:|
| thoughtSystem problems | 0 | 3 |
| claims | 0 | 6 |
| evidence | 0 | 12 |
| sources | 0 | 8 |
| publicDomainExcerptZh | 0 | 0 |
| summary_only evidence | 0 | 12 |

## 产物

- `.research/tmp/kimi/people/vasubandhu/brief.md`
- `.research/tmp/kimi/people/vasubandhu/sources.md`
- `.research/tmp/kimi/people/vasubandhu/notes.md`
- `.research/tmp/kimi/people/vasubandhu/open-questions.md`
- `.research/tmp/kimi/people/vasubandhu/works-candidates.json`
- `.research/tmp/kimi/people/vasubandhu/claims.json`
- `.research/tmp/kimi/people/vasubandhu/thought-systems.json`

## 真实校验输出摘要

写前门：

```text
kimi research ok: 11 claims, 8 sources, 1 thought systems, 0 timeline items
kimi thought-system admission dry run: 1 planned, 0 written
- add vasubandhu -> public/data/philosophers/vasubandhu.json
✅ 写前门全绿
```

单独入库：

```text
kimi thought-system admission written: 1 planned, 1 written
- add vasubandhu -> public/data/philosophers/vasubandhu.json
```

写后门与质量审计：

```text
data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes
vasubandhu ✅ 正式库 == admit 应生成（逐字节一致）
✅ 写后门全绿
内容质量审计：17 位有 thoughtSystem
RED 0 条 {}
YELLOW 0 条 {}
✅ 无 RED
```

## 项目测试

```text
Test Files  15 passed (15)
Tests  81 passed (81)
```

## 边界确认

- 未修改 `src/`、`tools/`、schema、UI。
- 未修改 `public/data/works.json`。
- 未写正式 `relationships.json`。
- 正式库只新增 `public/data/philosophers/vasubandhu.json` 的 thoughtSystem。
- 未填任何未核实的 `publicDomainExcerptZh`。

## 下一步

队列已推进至 `adi-shankara / sources-notes`。如果 Kimi 仍限额，可继续由 ChatGPT 按同一等价方案接手。