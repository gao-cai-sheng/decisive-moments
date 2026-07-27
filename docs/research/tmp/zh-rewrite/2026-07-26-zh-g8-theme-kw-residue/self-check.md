# self-check — G8 主题整词关键词残留（9）

## 门 1

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/patch.philosophers.*.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g8-theme-kw-residue/patch.philosophers.zh.json
  条目 9 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 9 个 id

✅ 文本补丁门通过
```

## 门 2

1. G8：整词主题已替换为 thoughtSystem/oneLine 实词；英侧同步。
2. G9：仅 keywordsEn，与库内 keywordsZh 等长同序。
3. 未碰 62 离线英目录。
