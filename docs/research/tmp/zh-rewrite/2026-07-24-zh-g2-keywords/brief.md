# brief — G2：29 位关键词补实词

**执行者**：grok  
**日期**：2026-07-24  
**手册**：`docs/research/RUNBOOK-text-layer-loop.md` §2 G2  
**交付**：`docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/`

## 任务

全库 118 位 `keywordsZh` 全是十主题名；其中 89 位与首批 92 占位简介重叠（待 G1 合入后一并解决），**本批只处理 92 之外的 29 位**。

- **只写** `keywordsZh`（3–6 实词）  
- **禁止** 改 `oneLineZh`（这 29 人的简介已是成文，有的甚至短于 25 字——那是既有状态，本批不扩写）  
- 素材：各人 `thoughtSystem.problems/claims` + 通行代表作名

## 名单（29，与 `ids.expect.txt` 一致）

| 簇 | 人数 | ids |
|---|---:|---|
| 中华古典 | 3 | confucius, laozi, zhuangzi |
| 西方核心 | 4 | plato, aristotle, kant, rawls |
| 早期斯多葛 / 犬儒 | 4 | cleanthes, chrysippus, diogenes-sinope, antisthenes |
| 前苏格拉底 / 智者 | 10 | pythagoras, anaximander, anaximenes, xenophanes, empedocles, anaxagoras, zeno-elea, democritus, protagoras, gorgias |
| 希腊化—罗马 | 8 | pyrrho, theophrastus, carneades, cicero, lucretius, seneca, epictetus, marcus-aurelius |

合计 3+4+4+10+8 = **29**。完整名单见 `ids.expect.txt`。

## 切分原则（同学派不撞车）

- **克里安忒斯 / 克律西波斯**：虔敬赞歌·顺从命运 vs 命题逻辑·同意·命运责任机制  
- **第欧根尼 / 安提斯泰尼**：生活表演·反习俗 vs 德性自足·名称定义·艰苦训练  
- **米利都三家**：apeiron / 气·凝聚稀薄 / （泰勒斯不在本批）  
- **智者两家**：人是尺度·德性可教 vs 论非存在·言辞如药  
- **皮浪 / 卡尔涅阿德斯**：悬置·ataraxia vs 可信表象·概率性判断  
- **三罗马斯多葛**：激情治疗·有限生命 / 控制二分·同意 / 《沉思录》·职责·宇宙整体  
- **德谟克利特 / 卢克莱修**：同有原子与虚空，后者加《物性论》与死亡恐惧治疗以区分组合

## 交付件

```
patch.philosophers.zh.json   # schemaVersion 1；每 id 仅 keywordsZh
ids.expect.txt
brief.md / notes.md / open-questions.md / self-check.md
```

## 红线遵守

未写 `public/data/`，未 admit/commit/push，未扩 29 人以外，未写 review-verdict。  
