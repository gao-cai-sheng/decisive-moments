# self-check — G2 29 位 keywordsZh

**阶段**：G2 产出完成 → 停车交盲审  
**范围**：仅 `keywordsZh`；29 ids 见 `ids.expect.txt`；**无** oneLineZh/En

## 门 1：机器门（真实输出）

```bash
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/patch.philosophers.zh.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/ids.expect.txt
```

真实输出：

```
文本补丁门：docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/patch.philosophers.zh.json
  条目 29 ｜ 含 oneLineZh 0 ｜ 含 oneLineEn 0
  对照名单 29 个 id

✅ 文本补丁门通过
```

手算核对：

| 项 | 结果 |
|---|---|
| id 恰好 29 且均在 index | PASS |
| 每条仅 keywordsZh 字段 | PASS |
| keywords 3–6 | PASS |
| 无十主题名整词 | PASS |
| 关键词组合无重复 | PASS |
| 未夹带 oneLine / 其他字段 | PASS |

## 门 2：人工门

### 1. 通读

本批无简介可念；关键词均为可读实词/书名/术语。无压字缩写。

### 2. 连接/因果

本批无 oneLine 因果句。关键词各自对应 problems/claims 中的概念簇，未把无关 problem 硬绑。

### 3. 专名是否本人主张

- 毕达哥拉斯：按传统内容标，见 open-questions。  
- 智者/高尔吉亚：论非存在、海伦颂均有文本传统支撑。  
- 未使用「双重真理」类后世扣帽标签。

### 4. 书名口径

- 中文原著/通行译名：仁礼体系无单书强塞；《理想国》《物性论》《沉思录》《手册》《宙斯赞歌》《海伦颂》《性格》用通行名。  
- 无自拟「看起来像通行译名」的书名。

### 5. 自己没底

见 `open-questions.md`（短简介另批、毕达哥拉斯传统归因、Characters 是否罗马化等）。

## 成对切开抽样

| 对 | keywordsZh |
|---|---|
| cleanthes / chrysippus | 《宙斯赞歌》·虔敬·顺从命运 / 命题逻辑·同意·命运与责任 |
| diogenes / antisthenes | 自足·反习俗·生活表演 / 德性自足·艰苦训练·名称与定义 |
| protagoras / gorgias | 人是尺度·德性可教 / 论非存在·言辞如药 |
| pyrrho / carneades | 悬置·ataraxia / 可信表象·概率性判断 |
| seneca / epictetus / marcus | 激情治疗·有限生命 / 控制二分·同意 / 《沉思录》·职责·宇宙整体 |
| democritus / lucretius | 原子·约定·euthymia / 《物性论》·解除宗教恐惧·死亡与我们无关 |

## 停车

- **停因**：`needs_human`（G2 交盲审）  
- **未做**：未写 public/data、未 admit/commit/push、未写 review-verdict、未开 G3  
- **下一步**：盲审 PASS → 合入索引 keywordsZh；G3 仍阻塞于 G1 合入正式库  
