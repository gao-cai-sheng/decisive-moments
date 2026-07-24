# P0 西班牙语翻译分支指令 — 2026-07-24

## 目的

开一条隔离的西班牙语翻译线，把已经完成中文内容确认、且已有英文 P0 字段的哲人索引条目，翻成离线 Spanish patch。Grok 只做翻译，不做哲人信息采集、事实判断、内容修正或正式入库。

## 分支

建议分支名：

```bash
git switch -c translation/es-p0-index
```

执行前提：
- 只在干净工作树或独立 worktree 开分支。
- 当前若有升格/admit 脏改，先不要切分支，避免把数据入库改动和西语 patch 混在一起。
- 本分支不直接改 `public/data`，只产离线 patch。

## 当前范围

Source of truth：`public/data/philosophers.index.json`。

只处理同时满足以下条件的条目：
- 已有 `oneLineEn`。
- 已有 `keywordsEn`。
- `keywordsEn.length === keywordsZh.length`。

2026-07-24 当前实算：全库 542 位，其中 361 位满足上述条件；其余 181 位暂不进入西语翻译线。

暂不处理：
- P0 024–026 的 89 位：已有 Grok 重译 patch，但尚未盲审并 admit。
- 剩余 92 位：中文 `oneLineZh` 仍是“第一版候选哲人”模板，属于中文内容债，须先由 Codex/维护者补中文信息。

## 输出目录

```text
docs/research/tmp/translation-es/2026-07-24-es-p0-index/
```

交付物：

```text
brief.md
patch.philosophers.es.json
glossary.es.json
notes.md
```

`patch.philosophers.es.json` 格式：

```json
{
  "schemaVersion": 1,
  "items": {
    "<id>": {
      "oneLineEs": "...",
      "keywordsEs": ["...", "..."]
    }
  }
}
```

`notes.md` 顶部必须有：

```markdown
**Producer:** Grok (xAI) — Spanish translation patch only.
```

## 给 Grok 的任务边界

Grok 必须读取：
- `docs/i18n-content-translation-spec.md`
- 本文件
- `public/data/philosophers.index.json`

Grok 只负责：
- 把已锁定的 `oneLineZh` 翻成 `oneLineEs`。
- 把已锁定的 `keywordsZh` 翻成 `keywordsEs`。
- 使用 `oneLineEn` / `keywordsEn` 作为术语参考，而不是替代中文源。
- 产出离线 patch 与 glossary。

Grok 禁止：
- 修改 `public/data`。
- 修改任何 `Zh` / `En` 字段。
- 新增或删除 id。
- 翻译缺 `oneLineEn` / `keywordsEn` 的条目。
- 补充源文没有的信息。
- 修正哲学判断。
- admit、`--write`、commit、push。

若发现源文仍含内部标签或占位内容，例如：
- `身份层`
- `二线哲人`
- `思想史补线`
- `可补`
- `身份层锚点`
- `★升档候选`

则停止该条，在 `notes.md` 记录，不要硬译。

## 翻译规则

- `oneLineEs` 必须非空，保持一句话。
- `keywordsEs` 必须与 `keywordsZh` 等长、同序、逐项对应。
- 西语应使用自然学术表达，不从英文机械转译。
- 专名以 `names.en` 与西语学术通行形式校准。
- 作品名有通行西语译名可用；拿不准时保留英文/原文并在 `notes.md` 标注。
- 不得出现 `TODO`、`TBD`、空串、机翻残留。
- `glossary.es.json` 记录本批核心术语译法；同一术语全批统一。

## 自检

交回前至少检查：
- patch id 集合等于当前满足 `oneLineEn + keywordsEn` 条件的 index id 集合。
- 每条 `oneLineEs` 非空。
- 每条 `keywordsEs.length === keywordsZh.length`。
- `keywordsEs` 无空元素。
- 无 CJK 残留，除非是必须保留的原文/专名并已在 notes 说明。
- `notes.md` 有 Producer 行。

## 盲审与入库前置

本分支产物只做离线 patch。正式入库前必须先完成工程支持：
- schema 增加 Spanish 字段，如 `oneLineEs` / `keywordsEs`。
- i18n locale 增加 `es`。
- UI 取值函数支持 `Es` 回退链。
- 搜索逻辑决定是否纳入 Spanish 字段。
- admit/merge 工具支持 Spanish patch。

完成上述工程前，西语 patch 不得写入 `public/data`。
