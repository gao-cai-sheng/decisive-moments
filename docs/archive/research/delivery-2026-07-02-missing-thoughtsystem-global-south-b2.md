# Delivery: Missing ThoughtSystem Global South Batch 2

日期：2026-07-02

## 范围

为正式库缺 `thoughtSystem` 的 5 位补齐标准档内容：

- `amo`
- `butler`
- `dussel`
- `hooks`
- `hountondji`

暂存目录：

```text
.research/tmp/kimi/2026-07-02-missing-thoughtsystem-global-south-batch2/
```

## 新建真实 works 条目

- `amo`: `amo-right-moors-europe`, `amo-impassivity-human-mind`, `amo-art-philosophising`
- `butler`: `butler-gender-trouble`, `butler-bodies-that-matter`, `butler-excitable-speech`, `butler-undoing-gender`, `butler-giving-account`, `butler-precarious-life`, `butler-frames-war`
- `dussel`: `dussel-philosophy-liberation`, `dussel-underside-modernity`, `dussel-invention-americas`, `dussel-ethics-liberation`, `dussel-twenty-theses-politics`
- `hooks`: `hooks-aint-i-a-woman`, `hooks-feminist-theory-margin-center`, `hooks-teaching-transgress`, `hooks-all-about-love`, `hooks-feminism-everybody`
- `hountondji`: `hountondji-african-philosophy`, `hountondji-struggle-meaning`, `hountondji-endogenous-knowledge`, `hountondji-combats-sens`

本批删除 5 个占位 works：`amo-primary-work / butler-primary-work / dussel-primary-work / hooks-primary-work / hountondji-primary-work`。

本批同步迁移 10 条 `arguments.index.json` workId。

## 门禁与写入

```text
validate:kimi: VALIDATE_KIMI_OK
```

第一次 `quality-audit --batch --require-standard` 未过，原因是 2 条 `summary_thin`。已回到暂存 batch 加厚后重跑：

```text
validate:kimi: VALIDATE_KIMI_OK
quality-audit --batch --require-standard: REQUIRE_STANDARD_OK
```

```text
admit dry-run: ADMIT_DRY_OK
```

```text
admit --write: ADMIT_WRITE_OK
kimi thought-system admission written: 5 planned, 5 written
```

```text
placeholder residual check: placeholder_residual_hits=0
```

正式库复核：

```text
validate:data: VALIDATE_DATA_OK
full quality-audit --require-standard: QA:0
build: BUILD_OK
```

正式库 thoughtSystem 计数：

```text
withTS=116 missing=6
missing=ibn-khaldun,plumwood,senghor,sor-juana,wiredu,zelea
```

## 备注

- 本批 evidence 全部使用 `summary_only`，未添加逐字中文摘录。
- Hountondji 的基础 life 元信息仍显示“1942 年生”；外部检索显示其已于 2024-02-02 去世，建议另开 metadata 修正批。
- 禁止 git commit / push，等待外部审核放行。
