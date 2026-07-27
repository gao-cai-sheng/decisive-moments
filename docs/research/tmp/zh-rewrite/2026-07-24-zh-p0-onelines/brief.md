# brief — 92 位 zh-p0 oneLineZh / keywordsZh 重写

**执行者**：grok  
**日期**：2026-07-24  
**交付目录**：`docs/research/tmp/zh-rewrite/2026-07-24-zh-p0-onelines/`

## 做法

1. 从 `public/data/philosophers/<id>.json` 抽取 92 人的 `thoughtSystem.problems`（titleZh / questionZh / claimZh）、`works`、`names`，存为 `_source.extract.json`（仅本地工作底稿，非交付主件）。
2. **禁止外加研究**：每条 `oneLineZh` 与 `keywordsZh` 只压缩该人库内 problems/claims 中已有切口；不引入库外轶事、通行教材口号或自拟学说史标签。
3. 按文明 7 组起草，A 组再拆 6 子簇，写完对照「必须切开」的几对，避免同学派句式收敛。
4. 机器自查（§6.1–6.6）全绿后写 `self-check.md`；人工疑点进 `open-questions.md`。

## 分组与切分依据

| 组 | 范围 | 人数 | 切分依据 |
|---|---|---:|---|
| A | 欧陆近代 | 33 | 见下 6 子簇；同唯理论/现象学/后结构内部硬切 |
| B | 印度 9 ＋ 古希腊 8 | 17 | 印度：耆那/中观/唯识/不二/限制不二/现代；希腊：本原—logos—是—伦理—快乐—斯多葛—新柏拉图 |
| C | 中华 7 ＋ 日本 3 ＋ 朝鲜 2 | 12 | 墨孟荀；朱王分野；胡适/梁漱溟；道元/西田/和辻；退溪/栗谷 |
| D | 伊斯兰 6 ＋ 犹太 4 | 10 | 法拉比—西那—安萨里—鲁世德—萨德拉—赫勒敦；萨阿迪亚/迈蒙尼德；布伯/列维纳斯 |
| E | 拉丁基督教 5 ＋ 非洲 4 | 9 | 奥古斯丁/安瑟伦/阿奎那/奥卡姆；阿莫/维雷杜/桑戈尔/洪通吉 |
| F | 全球当代 5 ＋ 美国 3 | 8 | 辛格/努斯鲍姆/普拉姆伍德/巴特勒/胡克斯；杜威/蒯因/诺齐克 |
| G | 拉美 3 | 3 | 杜塞尔/塞亚/胡安娜修女 |

### A 组 6 子簇

1. **文艺复兴与近代早期**：erasmus, machiavelli, montaigne, bacon, hobbes  
2. **唯理论与经验论**：descartes, spinoza, leibniz, locke, hume  
3. **德国古典与其反叛**：rousseau, hegel, schopenhauer, kierkegaard, marx, nietzsche（mill 因伤害原则/功利归入当代英国自由功利一侧，与马克思并列但不共享句式）  
4. **分析传统**：frege, russell, wittgenstein, whitehead, carnap  
5. **现象学与存在主义**：husserl, bergson, heidegger, sartre, beauvoir, merleau-ponty, camus  
6. **当代法国与批判理论**：arendt, foucault, derrida, habermas  

（密尔放在 A 名单中与马克思、尼采同批书写，但关键词与切口独立：伤害原则 vs 剩余价值 vs 谱系学。）

## 主交付件

- `patch.philosophers.zh.json` — 仅 `oneLineZh` + `keywordsZh`，schemaVersion 1，恰好 92 ids  
- 本 brief / `notes.md` / `open-questions.md` / `self-check.md`

## 未做事项（红线）

- 未改 `public/data/`  
- 未 admit / commit / push  
- 未扩写另外 29 位「关键词=主题名」条目  
- 未动英文层或西语补丁  
