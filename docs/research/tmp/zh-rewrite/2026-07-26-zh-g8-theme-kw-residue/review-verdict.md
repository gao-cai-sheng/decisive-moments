# Blind Review Verdict — G8 + G9

Verdict: PASS
Reviewer: codex
Reviewer context: current session; independent rerun after reading REVIEW-PROTOCOL-cross-audit.md
Batch paths:
- `docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/`
- `docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/`
Date: 2026-07-26 22:39 +08:00

## 1. 门 1 机器门

```text
node tools/text-patch-lint.mjs docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/patch.philosophers.zh.json --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/ids.expect.txt
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/patch.philosophers.zh.json
  条目 9 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 9 个 id
✅ 文本补丁门通过
```

```text
node tools/text-patch-lint.mjs docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/patch.philosophers.en.json --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/ids.expect.txt
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/patch.philosophers.en.json
  条目 27 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 27 个 id
✅ 文本补丁门通过
```

跨批冲突：

```text
唯一(id,字段) 45 ｜ 取值冲突 0
```

## 2. 门 2 独立仪器

本批只改关键词字段，§B.2 的 oneLineZh 相似度/字数仪器不适用；改用关键词专用独立仪器。

```text
node tools/text-patch-apply.mjs <G8 patch> <G9 patch> --dry-run
补丁合计: 36 位 | index 字段变更 45 | detail 字段变更 45（涉及 36 个 detail 文件）
（--dry-run：未写盘）
```

```text
keyword rows 36 ｜ exact theme hits 0 ｜ structural bad 0
```

```text
virtual exact-theme keywordsZh=0 ｜ oneLineEn without keywordsEn=0 ｜ no oneLineEn=62
```

仪器结论：PASS。

## 3. 门 3 全量通读

通读条数: 36/36。

| id | 类型(§B.4 #) | 问题 | 处置 |
|---|---|---|---|
| abhinavagupta | #3/#4 | `宗教形而上学` 含主题词但不是整词主题；当前 oneLine 明确为“连接宗教形而上学和味论传统”。 | 通过 |
| gadamer | #3 | `linguisticality` 较专门，但与库内 oneLineEn “linguisticality”一致。 | 通过 |

其余 34 条未发现语义、术语、书名或同序问题。

## 4. 门 4 对抗测试

- Required: yes
- Reason: 合库前确认 lint 对重复、空话词、过短仍会失败。
- Result: PASS, fake exit=1

```text
fake stats 条目 3 ｜ RED 4 ｜ WARN 0
[empty_word] confucius: 含空话词「重要」，套谁都行
[empty_word] laozi: 含空话词「重要」，套谁都行
[zh_length] plato: oneLineZh 2 字，应在 25-40
[zh_duplicate] (批): oneLineZh 有 1 组重复
❌ fake rejected as expected
```

## 5. §B.4 十二类逐类回答

1. 压字出语病：0 条。
2. 凭空造因果：0 条。
3. 术语译错：0 条；G8/G9 术语与库内 oneLine/summary/thoughtSystem 对齐。
4. 后世标签当正面切口：0 条。
5. 句式别扭：0 条；本批无 oneLine。
6. 书名口径：0 条；`The Life of Reason`、`Truth and Method`、`The Concept of Mind`、`The Methods of Ethics` 等英文书名口径可接受。
7. 史实错：0 条。
8. 丢核心身份：0 条。
9. 语义悬空：0 条。
10. 英译语法错位：0 条；本批无 oneLineEn，keywordsEn 均为短语。
11. 凑字/评价词撑场面：0 条；本批无 oneLine。
12. 同义叠词：0 条。

## 6. 最终结论

Verdict: PASS

G8/G9 可合库。合库后仍需跑 `validate-data`、同步 dist，并在账本记录当前工作树已有其他文本层 public/data 改动。
