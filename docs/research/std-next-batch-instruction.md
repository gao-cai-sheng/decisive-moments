# 下一批指令：一批一停，用已验证的三角色流水线

**执行者**：codex ｜ **立于**：2026-08-19
**上位**：`RUNBOOK-std-upgrade-loop.md`（红线不变）、`POSTMORTEM-2026-08-18-quality-decay.md`（诊断）、`REPAIR-2026-08-19-c8-c9.md`（返修原则）

---

## 0. 开工第一件事：确认 C8/C9 盲审结论

**不要直接开新批。** 先看：

```bash
tail -3 docs/research/LOOP-LEDGER.md
ls .research/tmp/kimi/2026-08-18-std-c{8,9}*/review-verdict.md
```

| 情况 | 你做什么 |
|---|---|
| C8/C9 尚未盲审 | **停车**。报告等待盲审，不产新批 |
| 任一 REJECT | 先按其 verdict 清完，再回本文件 §2 |
| 两批均 PASS | 进 §2，做 C10a |

**C8 当前是 2 人批**（ye-shi、xu-heng），hu-hong/zhang-shi/chen-liang 已退回种子档，
材料存于 `2026-08-18-std-c8-southern-song-yuan/deferred-to-seed.json`。**别按 5 人口径处理。**

---

## 1. 上一轮验证有效的做法，继续用

2026-08-18 的「采集—整理—独立审核」三角色分工**确实解决了根本问题**：
两名独立盲审员各自确认第四代退化形态零残留。**这套照搬，不要退回单人产批。**

| 角色 | 职责 | 铁律 |
|---|---|---|
| **采集员**（多名，分人分工） | 逐条回原典核，产出「已核实 / unsupported」两类 | 核不到就标 unsupported，**不许用记忆补写** |
| **整理员** | 只保留已核实条目，组装 batch | **只删不补**；被删条目写进 `postmortem-rejected.md` 存档 |
| **盲审员**（新实例，不看采集包） | 独立复核，出 verdict | 只输出 `review-verdict.md`，不修批 |

上一轮实绩：120 条核出 20 条 unsupported，**删掉而非保留**——这是最有价值的动作，继续保持。

---

## 2. 本批任务：C10a，三人，就这一批

```
li-zhi 李贽 ｜ liu-zongzhou 刘宗周 ｜ huang-zongxi 黄宗羲
目录：.research/tmp/kimi/<日期>-std-c10a-late-ming/
```

**旧的 `2026-08-18-std-c10a-late-ming` 原文锚率仅 8%，属退化产物。**
另起新目录重做，旧目录保留作对照，**不许在旧目录上打补丁**。

规模目标：每人 3 problems、每 problem ≥2 claims、每 claim ≥2 evidence、每人 ≥12 条。
**但规模服从真实性**——见 §4。

---

## 3. locator 的唯一判据

```
锚里的字，能不能在原典里直接搜到？
搜得到 → 合格。搜不到（是你概括的）→ 换成搜得到的字，或删掉这条改引别处。
```

已验证合格的形态（C8/C9 实例）：

```
《知言》vol. 1；引文锚：「性外無物，物外無性」
《習學記言序目》卷七〈周禮·儀禮〉；引文锚：「官有職業則道可行」
```

**编号锚 ＋ 原文字句锚，两者都要。** 每条的引文锚必须与本条 `publicDomainExcerptZh` 连续重叠。

可达源优先级（CTP 有登录墙，别依赖）：

```
1. wikisource（zh.wikisource.org）  2. kanripo.org  3. 中国哲学书电子化计划（仅无登录墙页面）
```

取不到可达源的条目 → 标 unsupported 删掉，**不许留「未核完」蒙混过关**。

---

## 4. 撑不住标准档就退种子档（不许补条）

若某人删完 unsupported 后不足 3 problems / claims 不足 / evidence 不足：

```
1. 回原典真找 —— 材料确实还有就补，补进来的同样要过引文锚＋逐字摘录
2. 找不到 → 本批剔除该人，退回种子档，材料存 deferred-to-seed.json
3. 一批里 >=2 人撑不住 → 停车报 needs_human，不要自行放宽口径
```

**C8 的先例**：5 人删到 2 人送审，3 人退种子档。**这是正确处理，不是失败。**
少升一个人不是失败；编一条撑住一个人才是。

`summaryZh` 不足 40 字时**只许据本条已有逐字 excerpt 扩写**，
把原文自身的论证说充分即可，**不许添加原文没有的判断**。

---

## 5. 门禁（四道，全绿才算产完）

```bash
B=.research/tmp/kimi/<批次目录>
node tools/research-batch-metrics.mjs "$B"      # 原文锚率>=80%、逐字摘录率>=60%
node tools/locator-lint.mjs "$B"                # RED 0
bash scripts/verify.sh pre "$B"                 # validate + dry-run + 标准档硬门
```

**门全绿不构成质量证据**——C6 就是四门全绿被整批打回的。门只是及格线。

戳记必须带两个率：`原文锚率 X% ｜ 逐字摘录率 Y%`。低于阈值自己判未过，不许送审。

---

## 6. 节奏：一批一停

```
产 C10a → 四道门 → self-review → 打戳记 → 【停车交盲审】
```

**不连跑。** 十轮连跑的教训已写进 POSTMORTEM §2.2：无反馈迭代会让偏差按轮次复利，
C5 的 56% 三轮内退化成 C10b 的 3%。收益远小于代价。

C10a 盲审 PASS 后才做 C10b，依此类推。

---

## 7. self-review 必答

1. 本批采集了多少条？核实多少？unsupported 多少？逐条列删除原因。
2. 每条引文锚在哪个可达源检索到？给 URL。
3. 有没有人因材料不足退回种子档？若都没退，凭什么认为够了？
4. 每人的自足问题是哪一条（去掉人名后仍主谓完整）？列 problemId 与原文。
5. 同一部书的引用编号是跳跃的还是连号？连号请逐条说明从哪个目录查到。

---

## 8. 红线（不变）

1. 只写 `.research/tmp/kimi/<batch>/`，**禁碰** `public/data/`。
2. 禁 `admit --write`、`git commit`、`git push`。
3. 禁改 `src/**`、`tools/**`、`scripts/**`、`relationships.json`。
4. **不写 `review-verdict.md`**——通过与否不由你判。
5. 文本层（`oneLineZh`/`keywordsZh`/`oneLineEn`/`keywordsEn`）不归你。
6. 不许重产已存在的批次目录；开批前先 `ls .research/tmp/kimi/`。
