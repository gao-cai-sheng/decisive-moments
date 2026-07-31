# 交付说明：全库 locator 精确度与 thoughtSystem 薄项体检

**执行依据**：`docs/research/RUNBOOK-kimi-autonomous-loop.md` §13 非 Kimi 待办第 2、3、6 项  
**本轮类型**：正式库只读扫描 + 可高置信 locator 精确化 + 数据校验  
**范围**：`public/data/philosophers/*.json`、`public/data/arguments.index.json`  

---

## 1. 扫描结论

### 1.1 thoughtSystem 覆盖与薄项

正式库共有 100 位哲人，其中 11 位已有 `thoughtSystem`：

- buddha
- confucius
- kant
- laozi
- mencius
- mozi
- nietzsche
- plato
- wang-yangming
- xunzi
- zhuangzi

结构体检结果：

| 指标 | 结果 |
|---|---:|
| 正式库哲人总数 | 100 |
| 已有 thoughtSystem | 11 |
| 缺 thoughtSystem | 89 |
| 已有 thoughtSystem 中结构薄项 | 0 |
| thoughtSystem evidence 缺 locator | 0 |

判定：现有 11 位 `thoughtSystem` 已全部达到 RUNBOOK §4 的结构门槛，即每个 problem 至少 2 条 claim / 2 条 evidence 聚合支撑；本轮没有发现需要继续“补厚”的既有 problem。

### 1.2 thoughtSystem locator 精确度

初扫发现 8 条 thoughtSystem evidence locator 仍偏宽泛或多锚：

| 哲人 | evidence | 问题 |
|---|---|---|
| buddha | `buddha-mahaparinibbana-source` | `DN 16；入灭与遗教传统` 过宽 |
| nietzsche | `nietzsche-revaluation-source` | 多作品 + “等晚期文本/相关段落” |
| nietzsche | `nietzsche-overcoming-source` | “相关段落” |
| nietzsche | `nietzsche-will-to-power-source` | “相关段落” |
| nietzsche | `nietzsche-perspective-source` | 多作品 + “相关段落” |
| nietzsche | `nietzsche-art-source` | “相关段落” |
| plato | `plato-aporia-dialogue` | “早期苏格拉底式对话”过宽 |
| wang-yangming | `wang-yangming:evidence:014` | “两广军政告谕”未落到具体篇名 |

本轮已高置信收敛 7 条；王阳明一条暂不硬改，原因是缺确切篇名，强改会制造伪精确 locator。

修后复扫结果：

| 指标 | 修前 | 修后 |
|---|---:|---:|
| thoughtSystem 缺 locator | 0 | 0 |
| 宽泛 locator | 8 | 1 |
| 多作品/多锚 locator | 2 | 0 |
| summary_only evidence | 40 | 40 |

`summary_only` 未在本轮批量改为 `public_domain`，因为非中文/现代译文版权与逐字原文真伪需要独立核查；本轮只做 locator 精确化，不冒进写摘录。

---

## 2. 本轮改动

### 2.1 佛陀

| evidence | 改前 | 改后 |
|---|---|---|
| `buddha-mahaparinibbana-source` | `DN 16；入灭与遗教传统` | `DN 16，第六诵品：最后遗教「诸行无常，应不放逸」段` |

### 2.2 柏拉图

| evidence | 改前 | 改后 |
|---|---|---|
| `plato-aporia-dialogue` | `早期苏格拉底式对话：定义、反例与困惑结尾段落` | `《尤西弗罗》14c–15e：虔敬定义反复失败并以困惑收束段` |

### 2.3 尼采

| evidence | 改前 | 改后 |
|---|---|---|
| `nietzsche-revaluation-source` | `《偶像的黄昏》《敌基督者》等晚期文本：重估价值相关段落` | `《道德谱系》序言第6节：要求批判道德价值本身的段落` |
| `nietzsche-overcoming-source` | `《查拉图斯特拉如是说》：自我超克相关段落` | `《查拉图斯特拉如是说》第二部〈论自我超克〉：生命告白权力意志段` |
| `nietzsche-will-to-power-source` | `《善恶的彼岸》：生命与权力意志相关段落` | `《善恶的彼岸》第13节：生命即权力意志段` |
| `nietzsche-perspective-source` | `《善恶的彼岸》及《道德谱系》：视角性认识相关段落` | `《道德谱系》第三论文第12节：视角性认识段` |
| `nietzsche-art-source` | `《悲剧的诞生》：悲剧艺术与生命肯定相关段落` | `《悲剧的诞生》第5节：作为审美现象的存在得以辩护段` |

---

## 3. argument index 体检

`public/data/arguments.index.json` 另有一层旧摘要卡数据债：

| 指标 | 结果 |
|---|---:|
| arguments 总数 | 200 |
| 缺 locator | 198 |
| summary_only | 200 |
| public_domain | 0 |
| 宽泛 locator | 0 |

判定：这批 `arguments.index.json` 基本是第一版摘要索引，和 thoughtSystem 精修不是同一批次。若继续 §13，第 3 项可以单独开一轮 “arguments locator 补齐”，但它会涉及 100 位 × 2 条 arguments 的系统补源，不建议混在本轮 11 位 thoughtSystem 精修里。

---

## 4. 剩余待办

1. `wang-yangming:evidence:014` 仍需定位到《王阳明全集》中具体告谕篇名或卷次；未核前保留现状。
2. 40 条 thoughtSystem evidence 仍为 `summary_only`，主要集中在 buddha / plato / kant / nietzsche / wang-yangming；可后续按作品逐条补公有领域原文。
3. 89 位哲人仍缺 thoughtSystem；Kimi 恢复后优先从 `zhu-xi / sources-notes` 续跑。
4. `arguments.index.json` 的 198 条缺 locator 是独立数据债，可另开批次按 3–5 位一组补。

---

## 5. 校验

```text
npm run validate:data
→ data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes

npm test
→ Test Files 14 passed (14)
→ Tests 64 passed (64)
```

备注：曾尝试 `npm test -- --runInBand`，Vitest 不支持 Jest 的 `--runInBand` 参数，失败原因是命令参数错误；已用项目原脚本 `npm test` 重跑通过。

---

## 6. 本轮结论

本轮完成了 §13 剩余项中的一次正式库 locator / thoughtSystem 体检，并将可高置信收敛的 7 条 thoughtSystem locator 精确化。现有 11 位 thoughtSystem 无结构薄项、无缺 locator、多锚 locator 清零，仅余王阳明 1 条需要源文级核查后再改。
