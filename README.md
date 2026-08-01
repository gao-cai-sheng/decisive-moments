<div align="center">

# 群星闪耀时

**把哲学史上的群星，放回同一片天空**

一张可以飞进去的三维哲人星图

[![CI](https://github.com/gao-cai-sheng/decisive-moments/actions/workflows/validate-data.yml/badge.svg)](https://github.com/gao-cai-sheng/decisive-moments/actions/workflows/validate-data.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/代码-MIT-blue?style=flat-square)](./LICENSE)
[![Content](https://img.shields.io/badge/内容-CC_BY--SA_4.0-lightgrey?style=flat-square)](./LICENSE-CONTENT.md)

[English](./README.en.md) · [在线体验](https://gao-cai-sheng.github.io/decisive-moments/) · [快速开始](#快速开始) · [内容标准](#内容从哪来可信吗) · [参与投稿](#参与投稿)

<img src="docs/assets/hero.png" alt="群星闪耀时主界面：三维哲人星图" width="100%">

</div>

---

## 这是什么

把哲学史做成一片可以飞进去的星空。

每一位哲人是一颗恒星：颜色来自所属文明，位置来自时代与主题，亮度来自影响力。所以在读到任何一个名字之前，星图的疏密本身就有信息——哪个世纪挤满了星，哪个世纪空着。

飞近柏拉图这颗星，它展开成一个恒星系。中心是柏拉图，环绕的四颗行星是他一生反复回到的四个问题：理念与真实、正义与秩序、灵魂与教育、对话与哲学方法。点开第一颗，问题的原话是「真正的存在是可感事物，还是高于经验世界的理念？」；再往下是他给出的论证「理念高于可感事物」，以及支撑它的证据——《理想国》第六卷的线段比喻、第七卷的洞穴比喻，定位到段落。

星与星之间连着线：谁批判了谁，谁师承于谁，谁在千年之后接住了同一个问题。

<div align="center">
<img src="docs/assets/demo.gif" alt="演示：搜索柏拉图 → 飞入恒星系 → 展开思想信息图" width="90%">
<br><em>搜索 → 飞入恒星系 → 展开一条论证的完整证据链</em>
</div>

## 目前收录

<table>
<tr>
<td align="center"><b>542</b><br><sub>位哲人</sub></td>
<td align="center"><b>30</b><br><sub>个文明</sub></td>
<td align="center"><b>618</b><br><sub>个哲学问题</sub></td>
<td align="center"><b>1,237</b><br><sub>条论证</sub></td>
</tr>
<tr>
<td align="center"><b>2,474</b><br><sub>条证据（带原文定位）</sub></td>
<td align="center"><b>1,035</b><br><sub>条思想关系</sub></td>
<td align="center"><b>1,234</b><br><sub>部作品</sub></td>
<td align="center"><b>10</b><br><sub>大主题</sub></td>
</tr>
</table>

以上是 2026 年 8 月的库存。收录仍在继续，这些数字只会往上走——你看到的每一个数都是当天的快照。

表里的「文明」是编目用的分类标签，不是对文明边界的界定：这组标签既有地域传统，也有跨地域的现代思潮。

目前库里中国 114 位、古希腊 33 位、伊斯兰 33 位、印度 27 位、拉美 26 位、犹太 24 位、俄罗斯 16 位、藏传 14 位、东正教 10 位、非洲 8 位、越南 3 位……儒道释、印度六派、kalam / falsafa / 苏非、卡巴拉、解放哲学，和柏拉图、康德进的是同一道收录判据、同一份数据结构。

西方仍是最大的一块（合计约 195 位）。这是资料可得性的结果，不是判断——非西方传统的补全是长期要做的事，也是最需要人手的地方。

哲人分两档：

| 档位 | 数量 | 含有 |
|---|---:|---|
| **standard**（标准档） | 204 | 完整思想体系：根本问题 → 论证 → 证据 → 原文定位 |
| **seed**（种子档） | 338 | 身份层：生卒、文明、传统、主题、一句话定位、来源注记 |

两档全部带来源注记（`sourceNotes`）：每一条都有出处。

## 主要功能

### 三维星图漫游与多维筛选

按文明、时代、传统、主题四个维度交叉筛选，六类思想关系（批判 / 师承 / 影响 / 接受 / 学派 / 共同问题）可独立开关。星点全部由 GPU 实例化渲染：860 余份几何体合并为 5 份，约 1,600 次 mesh 绘制合并为 4 次 instanced draw，低端 GPU 与移动端也能跑动。

<img src="docs/assets/filters.png" alt="筛选出中国文明的哲人，并开启师承与影响关系" width="100%">

### 恒星系：一位哲人的完整思想结构

点开任意一颗星，相机飞入。中心是哲人本人，环绕的行星是其一生追问的根本问题；右栏给出生卒、一句话定位、关键词、代表作与精选论证。

<img src="docs/assets/detail-panel.png" alt="柏拉图的恒星系与详情面板" width="100%">

### 思想信息图：论证 → 证据 → 原文定位

每条论证都配有证据卡片，标注它出自哪部作品的**哪一处**（如「《理想国》第六卷：线段比喻段落」），并注明摘引状态。底部一栏串起这条论证在思想史中的上下游——谁师承、谁影响、谁接受。

<img src="docs/assets/infographic.png" alt="柏拉图「理念与真实」的思想信息图" width="100%">

### 收藏与札记

哲人、论证、搜索问题都可以收藏，本地留存，支持导出 / 导入 JSON。

<img src="docs/assets/collections.png" alt="收藏与札记抽屉" width="100%">

### 其他

- **偶遇** —— 随机挑一位哲人，相机直接带你飞过去。
- **多语言** —— 界面层中英完整；内容层英译在做，西班牙语排在其后。
- **全文搜索** —— 哲人、文明、命题一并检索（Fuse.js 模糊匹配）。
- **纯静态** —— 零后端、零运维，数据全部是 `public/data` 下的 JSON。

## 内容从哪来，可信吗

这是这个项目投入最大的部分。每一条目都要过一道**成文的收录判据**和一次**人工盲审**才能入库；两道门的标准都写在仓库里，可以逐条对照。

**收录判据**（完整版见 [`docs/research/philosopher-definition.md`](docs/research/philosopher-definition.md)）要求三条硬核同时成立：

1. **真人可考** —— 历史确证、有（约）生卒。半传说的奠基者落到可考的系统家身上；断代争议在 `sourceNotes` 里标注。
2. **有可归属的思想著述** —— 至少一部真实作品，包括身后由弟子结集的教法（苏格拉底、孔子、佛陀、密勒日巴皆此类），诚实标注结集或托名性质。
3. **来源可追溯** —— SEP / IEP / Encyclopaedia of Islam / Encyclopaedia Judaica / Treasury of Lives 等权威条目支撑；资料混乱者宁缺毋滥。

因此有一批人物被**明确排除**：神话与经文人物（是被诠释的对象，不是作者）、无可考著述的护法君主与赞助者（松赞干布、阿育王、美第奇一类）——他们只作为关系与背景出现，不单独成星。见 [`excluded-patrons-rulers.md`](docs/research/excluded-patrons-rulers.md)。

**版权红线**：证据一律只存**摘要与定位**，不存版权正文。数据里每条证据都带 `excerptStatus` 字段标明摘引状态。

**入库要过三道门**：

```
研究产出  →  机器校验              →  人工盲审          →  入库
             结构 / 引用 / 占位          真实性 / 可核实       public/data
             tools/validate-*.mjs       review-verdict.md
             + CI: tsc + test
```

相关规范：[审核清单](docs/research/review-checklist.md) · [外部审计手册](docs/research/external-audit-handbook.md) · [研究管线边界](docs/research/kimi-research-bridge.md)

## 快速开始

需要 Node.js 20+。

```bash
git clone https://github.com/gao-cai-sheng/decisive-moments.git
```

```bash
cd decisive-moments && npm install
```

```bash
npm run dev
```

打开 http://localhost:5173 即可。构建产物是纯静态文件，可直接部署到任何静态托管：

```bash
npm run build
```

推送到 `master` 会由 [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) 自动发布到 GitHub Pages（首次使用需在仓库 **Settings → Pages → Source** 选 *GitHub Actions*）。站点挂在 `/decisive-moments/` 子路径下，这个 base 由 `vite.config.ts` 处理；若要部署到根路径（自定义域名等），构建时设 `DEPLOY_BASE=/`。

<details>
<summary><b>全部脚本</b></summary>

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm test` | 单元测试（Vitest） |
| `npm run test:smoke` | 端到端冒烟测试（Playwright） |
| `npm run validate:data` | 校验 `public/data` 的数据契约 |
| `npm run validate:kimi` | 校验研究批次的结构、引用与占位 |
| `npm run admit:kimi` | 盲审通过后把批次并入 `public/data` |
| `npm run sync:dist` | 同步构建产物中的数据 |
| `npm run shoot:readme` | 重新生成 README 素材（需先起 dev server；GIF 需 ffmpeg） |

</details>

## 技术栈

| 层 | 选型 |
|---|---|
| 渲染 | Three.js r184 · @react-three/fiber 9 · drei · postprocessing |
| 应用 | React 19 · TypeScript 6 · Zustand 5 |
| 数据 | 静态 JSON · Zod 4 运行时校验 · idb 本地持久化 · Fuse.js 检索 |
| 构建 | Vite 8 |
| 测试 | Vitest 4（单元） · Playwright（端到端冒烟） |
| CI | GitHub Actions：`tsc -b` + `npm test` + 数据契约校验 |

```
src/
├── scene/         三维星图：相机、恒星实例化、关系连线、轨道
├── ui/            界面层：HUD、详情面板、思想信息图、投稿向导、收藏
├── domain/        领域逻辑：星图布局、筛选、关系、投稿校验、收藏
├── data/          数据加载与 Zod schema、搜索索引
├── store/         Zustand 全局状态
└── i18n/          中英文案与 locale 切换

public/data/       哲人 JSON + 关系 / 作品 / 主题 / 索引
tools/             数据校验、批次入库、质量审计脚本
docs/              内容标准、投稿流程、路线图
docs/archive/      内容生产过程存档（不影响使用）
```

## 一个人做不完

这个项目现在由一个人维护，精力有限。542 位哲人里，204 位铺开了完整的思想体系，其余 338 位还停在身份层——生卒、文明、传统、一句话定位，思想结构是空的。

界面已经是中英双语，内容层的英译在做，西班牙语版本排在它后面。西语之所以在列，是因为库里已经有 26 位拉美哲人和整条解放哲学的线索——这些内容本来就该有一个西语入口，而不是只能隔着中文读。

这两个语种做出来，能一起干活的人会多很多。这就是做它们的原因。

## 参与投稿

站内点「投稿」即可打开四步向导：**身份 → 作品 → 思想关系 → 来源与提交**。每一步内联校验，规则与 CI 共用同一份 [`src/domain/contribution/validation.ts`](src/domain/contribution/validation.ts)，所以表单通过 = 机器门通过。

<img src="docs/assets/contribute.png" alt="投稿向导：四步表单与内联校验" width="100%">

- 外部投稿目前只开 **seed 档**（身份层），门槛低、风险小；standard 档升格走内部管线。
- 提交前需勾选四项预盲审清单：真实存在 / 可核对 / 关系有据 / 无版权正文。
- 全绿后一键跳转 GitHub Issue（预填 body），或复制 / 下载 JSON 手动提交。
- 走 PR 的话，CI 会自动跑类型检查、单测与数据校验。

完整流程见 [`docs/open-contribution-flow.md`](docs/open-contribution-flow.md)。选题可以参考 [1000 人待收录池](docs/philosophers-backlog-1000.md)。

## 路线图

- [x] 542 位哲人入库，204 位完成标准档思想体系
- [x] 星点实例化渲染，移动端与低端 GPU 可用
- [x] UI 层中英双语 + locale 切换
- [x] 开放投稿：站内向导 + GitHub Issue / PR 流 + CI 机器门
- [x] 在线 Demo：GitHub Pages 自动部署
- [ ] 内容层英译（见 [`docs/i18n-content-translation-spec.md`](docs/i18n-content-translation-spec.md)）
- [ ] 内容层西班牙语翻译
- [ ] seed 档批量升格为 standard 档

近期计划见 [`docs/next-phase-roadmap-2026-07-22.md`](docs/next-phase-roadmap-2026-07-22.md)。

## 许可

**代码** —— [MIT](./LICENSE)。

**数据与文档** —— [CC BY-SA 4.0](./LICENSE-CONTENT.md)：`public/data/` 下的哲人数据集与 `docs/` 下的编辑标准可自由使用与演绎（含商用），只需署名并以相同协议共享。

数据中的证据条目只存摘要与定位，不含版权正文；引用的权威工具书（SEP、IEP、Encyclopaedia of Islam 等）版权归各自所有者，本项目的授权不及于它们。

---

书名借自茨威格。他写的是历史在某几个瞬间被少数人推动的那种时刻；这里想做的事更笨一些——把那些人一个一个找回来，标好出处，放回同一片天空下。
