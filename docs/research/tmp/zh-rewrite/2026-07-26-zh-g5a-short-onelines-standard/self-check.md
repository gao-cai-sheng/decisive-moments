# self-check — G5a 标准档短简介加厚（9）

## 门 1 命令

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g5a-short-onelines-standard/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g5a-short-onelines-standard/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-26-zh-g5a-short-onelines-standard/patch.philosophers.zh.json
  条目 9 ｜ 含 oneLineZh 9 ｜ 含 oneLineEn 9
  对照名单 9 个 id

✅ 文本补丁门通过
```

## 门 2

1. 通读：9 条均从 thoughtSystem 压缩，去掉「奠定」。
2. 因果：未硬接无关 problem。
3. 术语：ren/wuwei/Forms 等与关键词对齐。
4. 书名：无新增可疑书名。
5. 存疑：见 open-questions.md。
