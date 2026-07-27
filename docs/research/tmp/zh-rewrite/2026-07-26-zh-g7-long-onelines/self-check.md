# self-check — g7-long-onelines

## 门 1

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g7-long-onelines/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g7-long-onelines/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g7-long-onelines/patch.philosophers.zh.json
  条目 23 ｜ 含 oneLineZh 23 ｜ 含 oneLineEn 23
  对照名单 23 个 id

✅ 文本补丁门通过
```

## 门 2

1. 只压缩库内既有说法，去掉禁词。
2. 同步 oneLineEn。
3. G5 已覆盖 short 中空话词不重复列入 G6。
