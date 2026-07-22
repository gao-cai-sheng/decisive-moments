# Seed W4 候选名单（只汇编，不生产）

状态：**停车报批**。名单批准前不得生成 seed batch，不得写 public/data。

去重基线：现库 `public/data/philosophers.index.json` = **381 位**（标准 195｜种子 186，含 W3 26 位）。下列 16 位已对 381 去重（零碰撞）。

口径：**法国断代补全**——启蒙 philosophes（18c）+ 笛卡尔后 17c 连接 + 19c 唯灵论/学院哲学。承 W3 附录备选池。走 Plan B seed 双轨制（身份层、`tier:"seed"`、禁 thoughtSystem、1–2 真实作品、2–3 关系挂靠、sourceNotes≥1）。前 8 位（簇 A 启蒙）标记为试点批。

---

## 核心名单（16 位，2 簇 + 1 组）

### 簇 A — 启蒙 philosophes（18c）【试点批 b1】

| 试点 | 拟用 id | 中文名 | 生卒 | 一句入选理由 | 建议锚点（现库） |
|---|---|---|---|---|---|
| 试点候选 | voltaire | 伏尔泰 | 1694—1778 | 启蒙旗手，宽容/理性/反教权，接洛克经验论。 | locke, rousseau |
| 试点候选 | diderot | 狄德罗 | 1713—1784 | 《百科全书》主编，唯物论与美学。 | rousseau, locke |
| 试点候选 | montesquieu | 孟德斯鸠 | 1689—1755 | 《论法的精神》，分权与政体类型学。 | hobbes, tocqueville |
| 试点候选 | condillac | 孔狄亚克 | 1714—1780 | 感觉论，把洛克经验论推到极致（雕像譬喻）。 | locke |
| 试点候选 | condorcet | 孔多塞 | 1743—1794 | 进步史观与社会数学，接 comte 实证论。 | comte, rousseau |
| 试点候选 | holbach | 霍尔巴赫 | 1723—1789 | 《自然的体系》，彻底唯物论与决定论。 | spinoza |
| 试点候选 | helvetius | 爱尔维修 | 1715—1771 | 感觉论伦理与功利，接边沁。 | locke, bentham |
| 试点候选 | la-mettrie | 拉美特利 | 1709—1751 | 《人是机器》，机械唯物论。 | descartes, spinoza |

### 簇 B — 笛卡尔后 17c 连接（b2 上半）

| 拟用 id | 中文名 | 生卒 | 一句入选理由 | 建议锚点（现库） |
|---|---|---|---|---|
| malebranche | 马勒伯朗士 | 1638—1715 | 偶因论与「在上帝中看见万物」，笛卡尔主义延伸。 | descartes, leibniz |
| gassendi | 伽桑狄 | 1592—1655 | 复兴伊壁鸠鲁原子论，《对沉思的诘难》。 | descartes, epicurus |
| pierre-bayle | 培尔 | 1647—1706 | 《历史批判辞典》，怀疑论与宽容，接莱布尼茨《神义论》。 | leibniz, spinoza |

### 组 C — 19c 唯灵论/学院哲学（b2 下半）

| 拟用 id | 中文名 | 生卒 | 一句入选理由 | 建议锚点（现库） |
|---|---|---|---|---|
| maine-de-biran | 曼恩·德·比朗 | 1766—1824 | 努力/意志的内在经验，法国唯灵论开端。 | descartes, bergson |
| victor-cousin | 库赞 | 1792—1867 | 折衷主义与法国学院哲学建制。 | hegel, kant |
| renouvier | 勒努维耶 | 1815—1903 | 新批判主义，接康德，影响 W. 詹姆斯。 | kant, james |
| ravaisson | 拉韦松 | 1813—1900 | 《论习惯》，影响柏格森。 | bergson, aristotle |
| boutroux | 布特鲁 | 1845—1921 | 自然律的偶然性，接 comte/poincaré。 | comte, poincare |

---

## 批次建议
- **b1 = 簇 A 启蒙（8）** — 试点批。
- **b2 = 簇 B（3）+ 组 C（5）= 8**。

## 红线
- 只汇编，不生产。名单批准前零生产、不写 public/data。
- 身份/时代/著作/来源无法核实者移出，不模板补位。
- 生产后每批走 §2.5 seed 门 + 新上下文盲审 PASS 才 admit；禁 commit/push。
- admit 已含 theme 白名单 + seed 关系上限(≤3) 双前置校验；关系挂靠避免把既有 seed 枢纽顶爆（优先挂标准档锚点）。
