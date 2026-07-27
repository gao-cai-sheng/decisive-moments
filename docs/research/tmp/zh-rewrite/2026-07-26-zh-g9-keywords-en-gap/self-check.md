# self-check — G9 keywordsEn 缺口（27）

## 门 1

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/patch.philosophers.*.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g9-keywords-en-gap/patch.philosophers.en.json
  条目 27 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 27 个 id

✅ 文本补丁门通过
```

## 门 2

1. G8：整词主题已替换为 thoughtSystem/oneLine 实词；英侧同步。
2. G9：仅 keywordsEn，与库内 keywordsZh 等长同序。
3. 未碰 62 离线英目录。
