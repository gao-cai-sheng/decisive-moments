# 下阶段路线图 — 2026-07-22（群星璀璨）

框架/数据管线稳定后（standard 204/542），转产品+工程三方向。本文只做 scoping/决策，不含实现。每块建议**各自新开会话**推进（尤其性能需实机 profiling）。

技术栈基线（据 package.json + src）：
- 渲染：`three@0.184` + `@react-three/fiber@9` + `@react-three/drei@10` + `@react-three/postprocessing`（bloom 等后处理）。
- 状态：`zustand`；校验：`zod`；搜索：`fuse.js`；本地缓存：`idb`（IndexedDB）。
- 结构：`src/scene/*`（StarScene / PhilosopherStars / NearbyOrbits / RelationshipLines / CameraRig）、`src/ui/*`（各面板）、`src/data/client.ts`（加载）+ `schemas.ts`（zod）、`src/store/appStore.ts`。
- **i18n 目前为零**（无 i18next，全 greenfield）。

推荐顺序：**① 性能 → ② i18n（先 UI 后内容）→ ③ 开放投稿**。理由：①独立且当下痛点；②schema 已 `Zh` 后缀留伏笔、可增量；③最大且依赖前两者稳定。

---

## ① 性能优化（网页内存 >650MB）

**目标**：把常态内存压到合理区间（目标先定 <300MB 待 profiling 校准）。

**第一步必须实机 profiling，别纸上优化**。分清两类，方向完全不同：
- **随时间涨 = 泄漏**：切换聚焦/详情面板时 Three.js 对象未 dispose（geometry/material/texture）、drei 组件残留、zustand 持旧引用、IndexedDB 读出的 detail 堆在内存。
- **一次性高 = 规模**：星/轨道/卫星逐个 mesh 未用 `InstancedMesh`；542 个文字 label 各自贴图；postprocessing 多 pass 的离屏 buffer；**全部 542 份 detail 常驻内存**（应只懒加载聚焦+邻近星，index 常驻、detail 按需）。

**dedicated 会话第一步**（浏览器工具可驱动）：
1. Chrome DevTools → Performance Monitor 看 JS heap + DOM nodes 随交互曲线；Memory 快照对比"初始 vs 转几圈 vs 开关十次详情面板"。
2. 定位大头：three 场景对象数（`renderer.info.memory` geometries/textures）、heap retained by（detail 数组？label 贴图？）。
3. 按 profiling 结果选点：懒加载 detail（`data/client.ts`）／星与卫星 `InstancedMesh` 化（`PhilosopherStars.tsx`/`NearbyOrbits.tsx`）／面板卸载时 dispose／label 用共享 SDF 图集。

**待你定的**：目标内存阈值；是否接受"只渲染镜头附近 N 星、远处降级/隐藏"（LOD）以换内存。

**开放问题**：现在 650MB 是首屏就有，还是转一会儿涨上去的？（这句能省半天——先回这个）

---

## ② 多语言 i18n

拆两层，工作量天差地别，**必须分开决策**：

**A. UI 层**（按钮/菜单/面板标题/onboarding）——小活：
- 引 `react-i18next` 或轻量自建 dict（zustand 里放 `locale`）。
- 抽 `src/ui/*` 里的硬编码中文串到 `locales/{zh,en}.json`。
- 语言切换持久化（localStorage）。1–2 个会话可完成。

**B. 内容层**（542 位的 summaryZh / problems / claims / evidence / works titleZh…）——大工程：
- schema 已 `Zh` 后缀留伏笔 → 加 `summaryEn` / `titleEn` 等是 **schema-ready** 的增量改造（先改 `src/data/schemas.ts` + `tools/validate-data.mjs` 容忍缺 En）。
- 内容翻译本身 = 又一条 **codex 产 → Claude 盲审** 长流水线（且要审译文准确性，比升格更重）。
- 折中：**UI 全英化 + 内容双语可选**，En 字段缺失时 fallback 显示 Zh（渐进翻译，不阻塞上线）。

**待你定的**：
1. 目标语言（先只 en？还要日/其他？）。
2. 内容层做不做，还是先只 UI 英化、内容留中文 fallback？（**强烈建议先只 UI**，内容翻译单列长期任务。）

---

## ③ 开放式用户投稿

**最大工程，放最后**。好消息：**投稿约束你已有现成一整套**——`proposed-philosophers`/`thought-systems` schema、themes 白名单、结构硬门（problems≥3/claims≥2/evidence≥2）、works 归属、locator 精度、`validate-kimi` + `quality-audit` + 盲审 verdict。开放投稿 = 把这套**约束暴露给外部用户 + 加操作界面 + 加审核队列**。

**三个必须先拍板的架构决策**：
1. **后端 or 纯静态+PR**：
   - *纯静态 + GitHub PR*（推荐起步）：投稿表单在前端校验后，生成规范 JSON，走 GitHub PR/Issue 提交；维护者用现有盲审门审、admit 入库。零后端、零运维、天然复用现管线。缺点：投稿人需 GitHub。
   - *自建后端 + 审核队列*：任意用户提交入 DB 队列，后台审核台。体验好但要后端+鉴权+反滥用+运维。
2. **档位**：外部投稿是否**只开 seed 档**（身份层，门槛低、风险小），standard 升格仍内部走？（建议是。）
3. **鉴权/反滥用**：匿名？登录？速率限制、垃圾/破坏防护。

**UI 侧（无论后端选型都要）**：
- **向导式表单**：分步填 identity → works → relationships（≤3）→ sourceNotes（含 URL）；每步内联校验镜像 `validate-kimi`/`quality-audit` 规则（zod schema 可前端复用 `src/data/schemas.ts`），themes 只能从白名单选、locator 有格式提示、占位 id 直接挡。
- 提交前跑一遍客户端"预盲审"清单，不合规不让交 → 大幅降低维护者审核负担。

**待你定的**：先做 PR 流还是后端流；只开 seed 档否；要不要登录。

**开放问题**：预期投稿量级？（个位数/月 → PR 流足够；规模化 → 才值得后端。）

---

## 落地建议

- 三块都建议**新开会话**、按①→②→③顺序，各自先读本文件对应节 + 相关源码再动手。
- 分工延续：codex 生产/实现，Claude 审核+出指令+设计。
- 每块动手前，先回本文标的"开放问题"（性能是否随时间涨 / i18n 内容层做不做 / 投稿量级），这几句能省大量返工。
