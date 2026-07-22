# 开放投稿流程 — 2026-07-22

外部用户投稿新哲人（**仅 seed 档**；standard 升格仍内部走）。设计取「纯静态 + GitHub」路线：零后端、零运维，完整复用现有 kimi 审核管线。

## 投稿人视角

1. 站内点「投稿」→ 向导四步：身份 → 作品 → 思想关系 → 来源与提交。
2. 每步内联校验，镜像 seed 硬门（`src/domain/contribution/validation.ts`）：
   - id kebab-case、不与现库重复、禁占位后缀；
   - 作品 1–2 部、关系 2–3 条（指向现库哲人）、来源 ≥1；
   - themes / 关系 themeIds 只能选白名单；summary ≥20 字。
3. 提交前勾选四项"预盲审"清单（真实存在 / 可核对 / 关系有据 / 无版权正文）。
4. 全绿后可「去 GitHub 提交 Issue」（预填 body）或「复制/下载 JSON」手动贴。

生成的 JSON 与 `.research/tmp/kimi/*/proposed-*.json` **完全同构**（`{ schemaVersion: 1, items: [...] }`）。

## 维护者视角

1. **CI 机器门**：投稿若走 PR，`.github/workflows/validate-data.yml` 自动跑 `tsc + test + validate:data`。Issue 形式则维护者本地跑。
2. 把三个 JSON 落到批次目录 `.research/tmp/kimi/<date>-contrib-<id>/`，补 `brief.md`。
3. `node tools/validate-kimi-research.mjs`（结构/引用/占位）+ `node tools/quality-audit.mjs`（薄项、模糊 locator、假引文等）。
4. **盲审**：核对人物真实性、生卒/作品/关系是否可在来源核实、无版权正文；verdict 写 `review-verdict.md`。
5. pass 后 `node tools/admit-kimi-batch.mjs <批次目录>` 入 `public/data`（seed 档，`reviewStatus: draft`）。

## 待拍板项（默认已按推荐取值实现）

- **PR 流 vs 后端**：已实现 PR/Issue 流（推荐起步）。规模化（投稿量 >个位数/月）再评估后端队列。
- **仅 seed 档**：是（外部只开身份层，门槛低、风险小）。
- **鉴权**：无登录（依赖 GitHub 账号 + 维护者盲审 + CI 兜底）。若遇滥用再加 Issue 模板 label 分流或速率限制。

## 关联

- 校验规则单一事实源：`src/domain/contribution/validation.ts`（前端与 CI 复用同一 zod/规则）。
- 文案：`src/i18n/messages.ts` 的 `contribute.*` 键（zh/en 双语）。
- 内容英译是另一条流水线，见 [i18n-content-translation-spec.md](./i18n-content-translation-spec.md)。
