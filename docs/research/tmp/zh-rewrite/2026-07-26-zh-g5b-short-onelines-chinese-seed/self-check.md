# self-check — G5b 中华 seed 短简介加厚（24）

## 门 1 命令

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g5b-short-onelines-chinese-seed/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g5b-short-onelines-chinese-seed/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g5b-short-onelines-chinese-seed/patch.philosophers.zh.json
  条目 24 ｜ 含 oneLineZh 24 ｜ 含 oneLineEn 24
  对照名单 24 个 id

✅ 文本补丁门通过
```

## 门 2

1. seed 无 thoughtSystem：只重组原 oneLine+keywords+书名，不发明新论题。
2. 去掉「著称」堆砌。
3. zhan-ruoshui/shen-dao 主动标疑。
4. 剩余 38 人中华 seed 短简介未入本批。
