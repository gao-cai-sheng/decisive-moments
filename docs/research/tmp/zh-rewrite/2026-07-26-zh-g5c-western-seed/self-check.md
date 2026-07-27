# self-check — G5c / g5c-western-seed（25）

## 门 1

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g5c-western-seed/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g5c-western-seed/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g5c-western-seed/patch.philosophers.zh.json
  条目 25 ｜ 含 oneLineZh 25 ｜ 含 oneLineEn 25
  对照名单 25 个 id

✅ 文本补丁门通过
```

## 门 2

1. seed 为主：重组库内信息，去奠定/著名/集大成。
2. 同步 oneLineEn ≤120。
3. 反模板门已过。
