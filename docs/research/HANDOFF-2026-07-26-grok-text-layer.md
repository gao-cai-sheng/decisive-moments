# Handoff — Grok 专线（索引文本层）｜2026-07-26 续

**写给谁**：下一任 **grok** / gao / 盲审方。  
**常驻手册**：`docs/research/RUNBOOK-text-layer-loop.md`  
**账本**：`docs/research/LOOP-LEDGER.md`

> 本文接替 `HANDOFF-2026-07-25-grok-text-layer.md` 的**状态板**；口径与红线仍以 RUNBOOK + 旧 handoff §4–§8 为准。

---

## 0. 角色（不变）

只动四字段：`oneLineZh` · `keywordsZh` · `oneLineEn` · `keywordsEn`。  
只写 `docs/research/tmp/**`。禁碰 `public/data`、禁 admit/commit/push、禁写 `review-verdict.md`。  
禁碰 `docs/research/tmp/translation/`（89 离线英）与 `.research/tmp/kimi/**`（codex）。

---

## 1. TL;DR（2026-07-26）

```
正式库：
  placeholder oneLineZh = 0     ← G1 已合入
  theme_kw = 0                  ← G1+G2 已合入
  no_en = 181                   ← 92(G3补丁未合) + 89(离线英已有)

Grok 本线：
  G0/G1  92 中文     已合库
  G2     29 中文kw   已合库（但旧 keywordsEn 仍是主题英词、长度错）
  G3     92 英文     已产四子批，待盲审合库
  G4     29 keywordsEn 等长同序补齐（G2 英侧）已产，待盲审
```

---

## 2. 磁盘交付物

### 2.1 G3 — 92 补 oneLineEn+keywordsEn

**根**：`docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/`

| 子批 | 人 |
|---|---:|
| `a-europe-modern/` | 33 |
| `b-asia/` | 21 |
| `c-classical-abrahamic/` | 23 |
| `d-global-modern/` | 15 |

每子批：`patch.philosophers.en.json` + `ids.expect.txt` + `brief.md` + `self-check.md`（门1真输出）。  
总：`README.md` · `notes.md` · `open-questions.md` · `glossary.json`。

**源**：正式库 zh。**门1**：四批 `text-patch-lint --expect` 全绿。

### 2.2 G4 — G2 的 29 人 keywordsEn 同步

**目录**：`docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/`

- `patch.philosophers.en.json` — **仅** `keywordsEn`
- `ids.expect.txt` — 与 G2 29 名单一致
- brief / notes / open-questions / glossary / self-check

**为何急**：G2 合入后 `keywordsZh` 已是 5–6 实词，index 里 `keywordsEn` 仍是 3 个 ethics/knowledge… → 长度与语义双坏。书名项（Republic、De Rerum Natura 等）一并按通行英名写入。

### 2.3 历史已合

- G0+G1：`docs/research/tmp/zh-rewrite/2026-07-24-zh-p0-onelines/`（已 admit）
- G2：`docs/research/tmp/zh-rewrite/2026-07-24-zh-g2-keywords/`（已 admit）

---

## 3. 队列

| 批 | 内容 | 状态 |
|---|---|---|
| G3 | 92 oneLineEn+keywordsEn | **待盲审合库** |
| G4 | 29 keywordsEn 对齐 G2 zh | **待盲审合库** |
| 89 离线英 | batch-011…026 等 | **非 grok 活**；别重译 |
| 西语 | 工程阻塞 | 挂起 |

建议合库顺序：盲审 G3 → admit G3；盲审 G4 → admit G4（可并行审；G4 不依赖 G3 合入）。

合后预期：`no_en` 181→89；G2 的 keywordsEn 长度/语义与 zh 对齐。

---

## 4. 门禁命令

```bash
# G3 子批示例
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/a-europe-modern/patch.philosophers.en.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-25-zh-g3-en/a-europe-modern/ids.expect.txt

# G4
node tools/text-patch-lint.mjs \
  docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/patch.philosophers.en.json \
  --expect docs/research/tmp/zh-rewrite/2026-07-26-zh-g4-g2-keywords-en/ids.expect.txt
```

合库工具（维护者侧，非 grok 默认权限）：`tools/text-patch-apply.mjs`（见 2026-07-26 合 G1/G2 戳记）。

---

## 5. 停因与下一步

**停因**：`needs_human` — G3 + G4 交盲审。  
**下一任第一句问 gao**：审/合 G3？审/合 G4？还是只维护？

旧文件保留：`docs/research/HANDOFF-2026-07-25-grok-text-layer.md`（历史细节与口径教材仍可用）。


---

## 续：G5 短简介加厚（2026-07-26 同日续跑）

| 批 | 目录 | 人 | 状态 |
|---|---|---:|---|
| **G5a** | `docs/research/tmp/zh-rewrite/2026-07-26-zh-g5a-short-onelines-standard/` | 9 | 已产待盲审（standard+thoughtSystem） |
| **G5b** | `docs/research/tmp/zh-rewrite/2026-07-26-zh-g5b-short-onelines-chinese-seed/` | 24 | 已产待盲审（中华 seed 第一波） |
| G5c | remain-chinese-seed-short + 其他文明 short | ~77 | 未开工 |

G5a 字段：`oneLineZh`+`oneLineEn`。G5b 同。  
库内仍约 111−9−24 条 short 待后续波次（seed 为主）。

---

## 续续：G5c 完成（short 全覆盖）

库内 `oneLineZh < 25` 共 111，现 G5a+G5b+G5c 补丁集合覆盖 **111/111**。

| 批 | 人 | 状态 |
|---|---:|---|
| G5a | 9 | 待盲审 |
| G5b | 24 | 待盲审 |
| G5c-chinese-seed-remain | 38 | 待盲审 |
| G5c-western-seed | 25 | 待盲审 |
| G5c-other-seed | 15 | 待盲审 |

说明见 `docs/research/tmp/zh-rewrite/2026-07-26-zh-g5-README.md`。

**生产侧 short 债已写完**；与 G3/G4 一并停 needs_human 等盲审合库。


---

## 续：G6/G7（2026-07-26）

| 批 | 内容 | 人 | 目录 |
|---|---|---:|---|
| G6 | 空话词清理（非 G5 覆盖） | 23 | `2026-07-26-zh-g6-empty-words/` |
| G7 | oneLineZh&gt;40 压至 25–40 | 23 | `2026-07-26-zh-g7-long-onelines/` |

合 G5+G6+G7 后：short/long/empty-word 简介债预期清零（虚拟合并验证）。
