# 草案 · 星图内存优化方案（2026-07-05）

状态：**草案，暂缓实施**。先固化诊断与方案，待升格批告一段落后再动工。动工前重跑一遍现场测量（见 §4），数字可能已变。

## 1. 现象
Chrome 打开线上星图，单标签内存约 **1.1G**。对线上产品偏高。

## 2. 诊断（基于 2026-07-05 代码）
问题**不在数据层**：整库 JSON 5.7MB，`philosophers.index.json` ~388KB，详情档按需加载（`NearbyOrbits` 最多缓存 3 个 + 当前选中）。占用几乎全在 WebGL / Three.js 层，三个源头按影响排序：

1. **542 颗星逐星独立网格（最大头）** — `src/scene/PhilosopherStars.tsx` 每个 node 渲染 2–3 个 drei `<Sphere>`（命中球 + 光晕 + 星体），全库约 1600 个独立 mesh。drei `<Sphere args={...}>` 每实例新建一份 `SphereGeometry`，**不共享几何体/材质**。于是 ~1600 份几何体 + ~1600 份材质 + ~1600 个 R3F fiber 常驻，是内存与 draw call 的主要来源。
2. **`preserveDrawingBuffer: true`**（`StarScene.tsx` 第 274 行）— 强制保留整块绘制缓冲，约等于帧缓冲翻倍，并挡掉部分浏览器优化。仅「导出 canvas 截图」时才需要。
3. **`dpr:[1,2]` + Bloom** — 视网膜屏按 2× 渲染，帧缓冲像素 ×4；再叠 `EffectComposer` Bloom 的多张降采样 render target，均按 2× DPR 分配显存。

## 3. 方案（按性价比排序）

### A. 星场改 InstancedMesh（首选，砍绝大部分）
星体用一个共享 `SphereGeometry` + 一个材质，逐星靠 `instanceColor` 与实例矩阵区分；光晕做第二个 InstancedMesh。点击命中改用 `instanceId` 的实例化 raycast。效果：~1600 个 GPU 对象 → 3 个，~1600 个 fiber → 几个；自转/贴图可保留。
- 佐证：`StarDust` 用 7600 个 points 几乎不耗内存，证明批量渲染代价极低。
- 代价：`PhilosopherStars` 需要重写；自转（`StarSpin` 逐 mesh rotation.y）要改为逐实例矩阵更新或用点/精灵着色器。

### B. 关掉 `preserveDrawingBuffer`
改 `false`。若确需截图，按需在某一帧同步 `toDataURL` 后立即关，不长期开。释放一整块全分辨率帧缓冲。

### C. DPR 封顶
`dpr={[1, 1.5]}`，Bloom 分辨率降一档。像素数随 DPR² 走，2→1.5 约省 44%。

### D. 退而求其次（若不做实例化）
把一份 `SphereGeometry` 和按颜色分的材质在渲染外建好复用，替掉 drei `<Sphere args>` 的每帧重建。作为 A 的过渡。

### E. 泄漏排查（前置判断）
先分清「常驻高」还是「持续涨」。若随操作（选星、`StarNameTwinkle` 每 3.6s 挂载 12 个 Html portal、`NearbyOrbits` 反复重建 `<Line>` 几何）一路涨不回落 → 是泄漏，该 dispose 的 geometry 没释放，需单独查。

## 4. 动工前测量清单
- Chrome 任务管理器：对比 `内存占用` vs `GPU 内存` 两列，定位是 JS heap 还是显存。
- DevTools Performance Monitor：看 JS heap 曲线是否随交互单调上涨。
- 记基线数字，改造后同法复测，验证下降幅度。

## 5. 落地顺序建议
E（判性质）→ B + C（低风险速赢）→ A（主体重构）→ 复测。预期 A+B+C 后 1.1G 明显下降。
