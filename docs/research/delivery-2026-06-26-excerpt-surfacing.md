# 交付说明：把逐字原文摘录接入正式库（第三阶段 / 改进）

**执行人**：Claude（Cowork）
**交付时间**：2026-06-26
**前置**：`delivery-2026-06-26-kimi-thicken-classical.md`（第二阶段，原文仅存在于研究暂存区，未进正式库）
**目标**：让第二阶段已核对的 10 条逐字公有领域原文摘录真正进入 `public/data`，可供前端展示。

---

## 1. 问题根因

第二阶段把逐字原文写在暂存文件 `source.excerptZh` 里，但 `admit-kimi-thought-systems.mjs`（约第 91 行）把暂存 `problems` 直接交给 `philosopherSchema.parse(...)`，Zod `.parse` 会**剥离 schema 未声明的键**，因此 `excerptZh` 在入库时被丢弃，正式库只剩 locator。

仓库其实早有规范字段名：`argumentSchema.source` 已使用 `publicDomainExcerptZh`（schemas.ts 第 93 行）。thoughtEvidence 这条线只是没加。

## 2. 改动（顺既有约定，最小且向后兼容）

```text
1. src/data/schemas.ts —— 给 thoughtEvidenceSchema.source 增加：
     publicDomainExcerptZh: z.string().optional()
   （与 argumentSchema 同名，可选，纯增量、不破坏既有数据）
2. 暂存 thought-systems.json —— 将 source.excerptZh 改名为 source.publicDomainExcerptZh（10 处）
3. 重新入库：npm run admit:kimi -- <batch> --overwrite --write
```

**未改动**：admit 脚本、validate 脚本、前端 UI、其他哲人数据。

## 3. 验证（全部实跑通过）

```text
validate:kimi      → kimi research ok: 22 claims, 10 sources, 5 thought systems
admit --overwrite  → dry run 5 planned；--write 5 written
validate:data      → data ok: 100 philosophers, 200 arguments, 82 relationships, 10 themes
npx tsc --noEmit   → exit 0（schema 改动不破坏类型/构建）
正式库核查         → 5 人各 2 条 evidence 现含 publicDomainExcerptZh，合计 10 条
```

正式库样例（laozi）：`道可道，非常道；名可名，非常名。无名天地之始；有名万物之母。`

## 4. 前端渲染（已完成）

在 `src/ui/PhilosopherPanel.tsx` 的 thought-evidence 区块，于 `summaryZh` 与来源行之间，新增对 `evidence.source.publicDomainExcerptZh` 的条件渲染（`<blockquote className="thought-excerpt">`），仅当该字段存在时显示。配套在 `src/styles/theme.css` 新增 `.thought-excerpt` 样式（左侧金色边线 + 斜体引文）。读者展开 claim 即可看到对应的逐字原文。

类型检查：`npx tsc --noEmit` → exit 0。

构建说明：`npm run build`（Vite/rolldown）须在 macOS 本机运行——校验用的 Linux 沙箱缺少 rolldown 的 darwin 原生二进制，会报 `MODULE_NOT_FOUND`，与本改动无关。请在本机 `npm run build` / `npm run dev` 确认渲染效果。

## 5. 回滚

本次正式改动文件均受 git 跟踪，`git checkout` 即可回滚：

```text
src/data/schemas.ts                       # 加 publicDomainExcerptZh 字段
src/ui/PhilosopherPanel.tsx               # 渲染原文引文
src/styles/theme.css                      # .thought-excerpt 样式
public/data/philosophers/{laozi,zhuangzi,mozi,mencius,xunzi}.json  # 原文入库
```

暂存文件改名前已就地备份（`thought-systems.json.bak-before-excerpt-rename`）。
