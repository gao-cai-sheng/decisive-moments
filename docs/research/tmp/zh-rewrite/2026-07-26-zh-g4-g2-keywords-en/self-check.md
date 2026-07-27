# self-check — G4 / G2-en-sync（29 keywordsEn）

- **字段**：仅 `keywordsEn`
- **源**：正式库 `keywordsZh`（G2 合入后）
- **动机**：库内旧 `keywordsEn` 为 3 个主题英词，与现 `keywordsZh` 长度/语义均不匹配

## 门 1 命令

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/patch.philosophers.en.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/patch.philosophers.en.json
  条目 29 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 29 个 id

✅ 文本补丁门通过
```

## 门 2

1. **通读**：每条 keywordsEn 与 keywordsZh 逐位对齐（见 brief 对照表生成时的映射）。
2. **书名**：Republic / De Rerum Natura / Enchiridion / Meditations / Hymn to Zeus / Encomium of Helen / Characters — 通行英名，无自拟中译痕迹。
3. **非主题名**：不再使用 ethics/knowledge/politics 等整词主题英译作为关键词。
4. **未动**：oneLineEn / oneLineZh / keywordsZh。
5. **存疑**：见 open-questions.md。
