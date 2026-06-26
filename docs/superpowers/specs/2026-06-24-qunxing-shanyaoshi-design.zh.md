# 群星闪耀时设计规格

日期：2026-06-24

## 摘要

`群星闪耀时` 是一个静态优先、基于 WebGL 的哲学文明图谱。它借鉴 `诗云 · Poetry Cloud` 那种可沉浸漫游的宇宙形态，但主题从诗歌转向人类思想史。第一版会把约 100 位经过筛选和整理的哲人呈现为一片黑暗、诗性的星空。用户可以在星图中漫游，搜索哲人或哲学问题，阅读精选论证，追踪带类型的思想关系，并在本机保存收藏和札记。

第一版不是完整百科，也不是用户账户平台。它要验证的是核心体验：一张美观、可导航的人类思想地图，以及一套结构化、可审核、未来可扩展为知识图谱、后端 API 和语义搜索系统的数据基础。

## 目标

- 构建一个打开后直接进入三维哲人星图的首屏体验。
- 策划约 100 位哲人，提供面向中文读者的高质量简介和多语字段。
- 支持轻量级的问题与主题搜索，返回相关哲人和论证摘要。
- 用带类型的关系网络表达思想关联，而不是把思想史做成单一的传承树。
- 提供本机收藏和札记，不引入账号、登录或云同步。
- 保持第一版可以作为静态站点部署，同时保留未来替换为后端 API 的边界。
- 清楚标注数据审核状态，避免把 AI 辅助生成内容包装成未经说明的权威知识。

## 非目标

- 不做登录、用户中心、云同步、公开札记、评论或社交功能。
- 不声称第一版覆盖全部哲人。
- 第一版不做向量数据库或 embedding 管线。
- 不做大规模爬虫、数据摄取系统或编辑后台。
- 不在实际应用前增加营销型落地页。
- 不展示未经授权或未经核验的现代译文长摘录。

## 产品范围

第一版包含：

- 全屏三维星图。
- 哲人详情面板。
- 文明、时期、传统和主题筛选。
- 带类型的思想关系线。
- 覆盖哲人、主题和精选论证的轻量搜索。
- 带 JSON 导入/导出的本机收藏和札记。
- 不超过三步的首次使用引导。
- 带审核状态的静态 JSON 数据文件。

第一版应包含约 100 位经过整理的哲人。人物选择要平衡不同文明和主题覆盖，同时优先选择能形成有意义关系、能支撑问题搜索结果的哲人。

## 视觉方向

选定方向是 `诗性宇宙`。

界面应呈现为黑暗宇宙场，使用温暖金色作为焦点和选中强调，配合有文学感的中文文案和克制的学术信息密度。它可以借用沉浸式星图的交互形态，但主题是哲学文明，而不是诗歌生成。

视觉原则：

- 深色全屏宇宙是主界面。
- 暖金色用于聚焦、引导和选中状态。
- 文明与学派使用更宽的色彩系统，避免界面只剩一种金色。
- 宇宙采用混合地图语法：历史时间控制中心到外围的半径，文明与学派控制扇区、局部聚类和色系。
- 越早的哲人越靠近中心，越近代的哲人越靠近外围。年代未知或有争议时，使用近似时期桶，而不是制造虚假的精确性。
- 核心哲人与其学派或传统后继应共享可识别的同色系，并用色相或明度变化区分子传统。
- 面板保持半透明和紧凑，信息密度足以支持反复阅读。
- 第一屏就是可使用的应用，不是落地页。
- 体验可以诗性，但数据标签和出处说明必须冷静、清楚。

## 信息架构

### 顶部 HUD

- 项目标题：`群星闪耀时`。
- 搜索入口，支持哲人、文明、传统、主题和问题。
- 文明、时期、传统和主题筛选。
- 收藏和札记入口。
- 设置入口，用于画质、标签密度、关系可见性和数据说明。

### 星图

- 一颗星代表一位哲人。
- 星点颜色主要表示文明加学派或思想传统。文明提供基础色，传统或学派提供同色系变体。
- 星点大小结合影响力权重、关系数量和资料完整度。
- 星点位置由年代、文明、传统、主题和哲人 id 种子确定，必须稳定可复现。
- 中心到外围的半径主要表示年代：古代和古典人物靠近中心，中古和近世人物位于中间环，现代和当代人物向外移动。
- 角度扇区和局部聚类表示文明、学派和传统，使用户仍能看出思想邻域。
- 星图应通过轻量的时间环、色彩图例和设置/帮助文案暗示这套语法，但不要把主界面变成说明图。
- 关系线默认保持低调。
- 选中一位哲人时，高亮其相关思想网络，并弱化无关星点。
- 选中一位哲人时，同时在其附近显示该哲人的局部思想星系。

### 思想星系展开

被选中的哲人可以在其星点周围显示一个小型局部 `思想星系`。它与全局哲人宇宙不是同一个尺度。

交互规则：

- 第一层：思想问题或核心概念围绕哲人星点运行，例如 `苦与生命处境`、`缘起`、`无我`。
- 点击思想问题或概念，会展开第二层主张，例如 `四圣谛组织问题` 或 `诸法因缘生`。
- 点击主张，会打开或聚焦详情面板中对应的主张段落。
- 主张详情显示主张文本、简短解释、证据摘要、可用时的作品标题、定位信息、摘录状态和审核状态。
- 局部思想星系应可读、可选、可关闭，不应永久挤占全局宇宙。

第一版可以只支持一次展示一位哲人的思想星系，不需要同时渲染所有哲人的思想系统。

### 哲人面板

桌面右侧面板和移动端底部抽屉显示：

- 中文名、英文名、原文名或本名。
- 生卒年代展示。
- 文明、时期、传统和学派。
- 一句话定位。
- 150 到 250 字中文摘要。
- 关键词。
- 代表作品。
- 三到六个核心问题或思想问题。
- 每个思想问题下可展开的主张。
- 可用时显示主张证据、出处说明、作品定位、摘录状态和审核状态。
- 两到五条精选论证摘要或公版文本摘录。
- 按关系类型分组的思想关系。
- 操作：收藏哲人、收藏论证、添加札记。

### 搜索结果

搜索返回三类结果：

- `philosopher`：点击后定位星点并打开哲人面板。
- `argument`：显示哲人、问题、主张、解释、出处和审核状态。
- `theme`：显示相关哲人与论证。

示例：

- 搜索 `柏拉图` 定位 Plato。
- 搜索 `正义` 返回 Plato、Aristotle、Confucius、Rawls 等人的精选论证。
- 搜索 `人是否自由` 通过别名和关键词映射到自由意志、决定论、责任和主体性等主题。

### 收藏与札记

第一版的收藏和札记只保存在浏览器本地。

支持的目标：

- 哲人。
- 论证。
- 搜索问题。
- 札记。

收藏抽屉按 `philosophers`、`arguments`、`questions` 和 `notes` 分组。札记绑定到一个目标对象。导入和导出使用 JSON，便于用户在没有账号的情况下保留本地数据。

## 数据模型

第一版使用静态 JSON 文件，但数据访问应封装在接近 API 的函数后面，方便未来用后端替换本地文件。

### Philosopher

```ts
type Philosopher = {
  id: string
  names: {
    zh: string
    en: string
    native?: string
  }
  life: {
    birth?: number
    death?: number
    display: string
  }
  civilization: string
  traditions: string[]
  periods: string[]
  themes: string[]
  keywordsZh: string[]
  summaryZh: string
  oneLineZh: string
  works: string[]
  influenceWeight: 1 | 2 | 3
  reviewStatus: "draft" | "reviewed"
  sourceNotes: SourceNote[]
  thoughtSystem?: PhilosopherThoughtSystem
}

type PhilosopherThoughtSystem = {
  problems: ThoughtProblem[]
}

type ThoughtProblem = {
  id: string
  titleZh: string
  questionZh: string
  summaryZh: string
  themeIds: string[]
  weight: 1 | 2 | 3
  claims: ThoughtClaim[]
}

type ThoughtClaim = {
  id: string
  titleZh: string
  claimZh: string
  explanationZh: string
  themeIds: string[]
  weight: 1 | 2 | 3
  evidence: ThoughtEvidence[]
}

type ThoughtEvidence = {
  id: string
  titleZh: string
  summaryZh: string
  source: {
    workId?: string
    locator?: string
    excerptStatus: "none" | "public_domain" | "summary_only"
  }
}
```

思想系统记录是可展开概念卫星的数据来源。它们应保持策划密度：足以让主要哲人的思想结构变得可读，但不要把选中视图做成百科页面。

### Argument

```ts
type Argument = {
  id: string
  philosopherId: string
  themeIds: string[]
  questionZh: string
  claimZh: string
  explanationZh: string
  source: {
    workId?: string
    locator?: string
    publicDomainExcerptZh?: string
    excerptStatus: "none" | "public_domain" | "summary_only"
  }
  keywordsZh: string[]
  reviewStatus: "draft" | "reviewed"
}
```

### Relationship

系统应使用 `思想关系网络`，而不是 `学术传承树`。

```ts
type Relationship = {
  id: string
  from: string
  to: string
  type:
    | "direct_student"
    | "influence"
    | "school"
    | "shared_problem"
    | "critique"
    | "reception"
  strength: 1 | 2 | 3
  confidence: "high" | "medium" | "low"
  themeIds: string[]
  noteZh: string
  reviewStatus: "draft" | "reviewed"
}
```

关系展示规则：

- 默认视图显示高置信度的直接师承、影响和批判关系。
- 可选筛选显示学派、共同问题和接受史关系。
- 弱关联不应污染星图视觉。
- 每条关系都需要关系类型、强度、置信度和解释说明。

### Theme

```ts
type Theme = {
  id: string
  zh: string
  en: string
  aliasesZh: string[]
  parentId?: string
}
```

### Work

```ts
type Work = {
  id: string
  philosopherId: string
  titleZh: string
  titleEn?: string
  originalTitle?: string
  yearDisplay?: string
  noteZh: string
}
```

### Local Collection And Note

```ts
type LocalNote = {
  id: string
  targetType: "philosopher" | "argument" | "search"
  targetId: string
  body: string
  createdAt: string
  updatedAt: string
  userId: null
  syncStatus: "local_only"
}
```

## 数据文件

初始静态数据布局：

- `public/data/philosophers.index.json`
- `public/data/philosophers/{id}.json`
- `public/data/arguments.index.json`
- `public/data/relationships.json`
- `public/data/themes.json`
- `public/data/works.json`

应用应在首屏加载索引，并按需加载完整哲人详情。对于约 100 位哲人的规模，这主要是架构边界，而不是严格性能要求。

## 内容与审核流程

内容流程可以 AI 辅助，但必须通过审核门。

1. 先定义 schema 和验证脚本。
2. 创建覆盖不同文明和主题的 20 位种子哲人。
3. 用种子条目验证星图、面板、搜索、札记和关系网络。
4. 使用 AI 辅助生成约 100 位哲人的候选数据。
5. 将生成内容标记为 `draft`。
6. 人工审核核心字段：姓名、年代、文明、传统、摘要、主题、论证、关系说明和出处说明。
7. 将已审核记录提升为 `reviewed`。
8. 正式 UI 应优先展示已审核内容；如果展示草稿内容，必须明确标注。

内容规则：

- 第一版优先使用中文摘要。
- 从一开始就存储英文名和原文名/本名。
- 只有状态清楚时才可以包含公版文本摘录。
- 除非授权清楚，不使用现代译文摘录。
- 论证记录必须说明其内容是摘要还是公版摘录。

## 技术架构

使用：

- Vite。
- React。
- TypeScript。
- Three.js。
- `@react-three/fiber`。
- `@react-three/drei`。
- Zustand。
- Fuse.js 或小型本地搜索实现。
- IndexedDB 保存本机收藏和札记。
- Vitest 做领域逻辑测试。
- Playwright 做交互 smoke test。

建议源码结构：

```text
src/
  data/
    client.ts
    schemas.ts
    loaders.ts
    search/
  domain/
    layout/
    relationships/
    collections/
  scene/
    StarField.tsx
    PhilosopherStars.tsx
    RelationshipLines.tsx
    CameraRig.tsx
  ui/
    AppShell.tsx
    TopHud.tsx
    SearchPanel.tsx
    PhilosopherPanel.tsx
    ArgumentPanel.tsx
    CollectionsDrawer.tsx
    SettingsPanel.tsx
    Onboarding.tsx
  styles/
  tests/
```

`src/data` 层暴露接近 API 的函数：

```ts
getPhilosopherIndex(): Promise<PhilosopherIndexEntry[]>
getPhilosopher(id: string): Promise<Philosopher>
getRelationships(): Promise<Relationship[]>
searchArguments(query: string): Promise<ArgumentSearchResult[]>
searchPhilosophers(query: string): Promise<PhilosopherSearchResult[]>
```

未来接入后端时，应尽量只替换这一层。

## 搜索设计

第一版不实现向量搜索，而是基于策划数据做结构化轻量搜索。

搜索流程：

1. 规范化查询。
2. 匹配 `themes.aliasesZh` 中的主题别名。
3. 匹配哲人姓名和关键词。
4. 匹配论证字段：`questionZh`、`claimZh`、`explanationZh` 和 `keywordsZh`。
5. 对主题 id 命中的论证进行加权。
6. 优先展示已审核内容。
7. 按主题命中、直接问题命中、关键词命中、解释命中排序。

Provider 接口：

```ts
type ArgumentSearchProvider = {
  search(query: string, options?: SearchOptions): Promise<ArgumentSearchResult[]>
}
```

第一版实现为 `LocalKeywordArgumentSearchProvider`。之后可以加入 `RemoteVectorArgumentSearchProvider`，而不改变 UI 组件。

## 星图布局

第一版布局必须是确定性的。

输入：

- 可用时的出生/死亡年份。
- 精确年代缺失或有争议时的时期桶。
- 文明。
- 传统。
- 主题。
- 影响力权重。
- 关系数量。
- 哲人 id 种子。

规则：

- 历史时间定义从中心向外的主半径。较早记录靠近中心，较晚记录靠近外围。
- 时期桶用于平滑年代不确定性：未知年代应使用类似 `ancient`、`classical`、`medieval`、`early_modern`、`modern` 或 `contemporary` 的桶，而不是假装知道精确年份。
- 文明定义大的角度扇区。
- 传统和学派在扇区内部定义局部聚类与色彩变体。
- 主题可以增加次级局部扰动或关系强调，但不应覆盖“年代 + 学派”的主语法。
- id 种子加入稳定扰动。
- 选中哲人的网络获得强调，无关星点弱化。
- 被选中哲人的思想系统卫星围绕该哲人做局部轨道布局，不影响全局哲人坐标。

布局不需要在第一版就做到历史上完全精确，但必须稳定、可解释。用户应能理解：中心更古老，外围更近代，同色邻域表示相关文明或学派。

## 性能与兼容性

- 首屏应加载索引并渲染，不需要获取所有完整资料。
- 低性能设置应减少 bloom、标签密度和关系线数量。
- 如果 WebGL 不可用，显示可读的浏览器不支持提示。
- 移动端支持触控旋转、双指缩放和底部抽屉面板。
- 桌面端支持拖拽旋转、滚轮缩放和点击选择。

## 里程碑

### M1 项目骨架

创建 Vite、React、TypeScript、R3F、基础样式、数据目录、验证脚手架和静态部署脚本。

### M2 数据模型与 20 位种子哲人

实现 schema 和验证。创建 20 位种子哲人、精选论证、主题、作品和关系。

### M3 星图 MVP

渲染星点、文明颜色、标签、关系线、选中状态、相机控制和哲人详情面板。

### M4 搜索与论证结果

支持哲人、主题和论证搜索。点击结果可以定位星点或打开论证详情。

### M5 收藏与札记

实现本机收藏、札记、JSON 导出和 JSON 导入。

### M6 视觉打磨与引导

应用诗性宇宙视觉方向，加入首次引导、移动端底部抽屉、加载状态、错误状态和设置。

### M7 扩展到 100 位哲人

扩展数据，审核记录，细化关系，补全主题覆盖，并完成最终性能检查。

## 验收标准

- 应用打开后直接进入非空星图。
- 约 100 位哲人在桌面端平滑渲染。
- 选中哲人后打开完整详情面板。
- 搜索可以按中文名、英文名和可用时的原文名/本名找到哲人。
- 至少 8 个主题能返回有用的论证结果。
- 每位精修哲人都有摘要、主题、关键词，以及至少 2 条论证或主张。
- 关系线可以按关系类型筛选。
- UI 不把思想史呈现为单一传承树。
- 全局星图能传达已确认的混合语法：年代控制半径，文明/学派控制颜色和局部聚类。
- 选中有思想系统数据的哲人后，显示可展开的概念卫星。
- 展开概念后可以看到主张，主张详情可以显示解释以及出处/证据元数据。
- 收藏和札记刷新后仍然保留。
- 收藏和札记可以导出和导入为 JSON。
- 数据验证可以捕获缺失 id、损坏的哲人引用、损坏的主题引用、重复 id 和非法审核状态。
- 项目可以构建为静态站点。

## 第一版之后再决定的问题

- 是否加入账号登录和云同步。
- 是否加入后端编辑工作流。
- 是否加入向量搜索或检索增强回答。
- 是否支持存储多语字段之外的多语界面。
- 是否包含较长的公版原文段落。
