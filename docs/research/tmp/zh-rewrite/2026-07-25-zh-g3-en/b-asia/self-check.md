# self-check — G3 / b-asia

- **批**：中华+印度+日本+朝鲜，21 人
- **字段**：仅 `oneLineEn` + `keywordsEn`
- **源**：正式库 index（G1/G2 已合入后的 zh）
- **机器门命令**：

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/b-asia/patch.philosophers.en.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/b-asia/ids.expect.txt
```

## 门 1 真实输出

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/b-asia/patch.philosophers.en.json
  条目 21 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 21
  对照名单 21 个 id

✅ 文本补丁门通过
```


## 门 2（人工）

1. **通读**：英文句按正式库 oneLineZh 压缩，未另加 thoughtSystem 细节。
2. **因果连接**：欧陆高危组（笛卡尔/斯宾诺莎/莱布尼茨；胡塞尔/海德格尔/梅洛-庞蒂；福柯/德里达；朱熹/王阳明 在 B 批）切口拆开，未共享 12 字符首尾段。
3. **专名/术语**：与学界通行英名对齐（Dasein、Différance、Négritude、virtù 等保留习惯写法）；书名用通行英名（The Praise of Folly、Summa Theologiae、Muqaddimah、Proslogion）。
4. **书名**：Proslogion 不自拟中文通行译；《传习录》→ Instructions for Practical Living；《正法眼藏》→ Treasury of the True Dharma Eye。
5. **没底项**：见批次 `open-questions.md` / 总目录 notes。

