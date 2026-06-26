import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "public", "data");
const philosophersDir = path.join(dataDir, "philosophers");
fs.mkdirSync(philosophersDir, { recursive: true });

const roster = JSON.parse(fs.readFileSync(path.join(root, "tools", "roster-100.json"), "utf8"));

const themes = [
  { id: "justice", zh: "正义", en: "Justice", aliasesZh: ["公正", "公平", "义"] },
  { id: "ethics", zh: "伦理", en: "Ethics", aliasesZh: ["德性", "道德", "善"] },
  { id: "knowledge", zh: "知识", en: "Knowledge", aliasesZh: ["认识", "真理", "经验"] },
  { id: "politics", zh: "政治", en: "Politics", aliasesZh: ["城邦", "国家", "权力"] },
  { id: "metaphysics", zh: "形而上学", en: "Metaphysics", aliasesZh: ["存在", "实体", "本体"] },
  { id: "language", zh: "语言", en: "Language", aliasesZh: ["意义", "命名", "表达"] },
  { id: "freedom", zh: "自由", en: "Freedom", aliasesZh: ["自由意志", "责任", "主体性"] },
  { id: "life_death", zh: "生死", en: "Life and Death", aliasesZh: ["死亡", "人生", "痛苦"] },
  { id: "religion", zh: "宗教", en: "Religion", aliasesZh: ["信仰", "神", "解脱"] },
  { id: "aesthetics", zh: "审美", en: "Aesthetics", aliasesZh: ["艺术", "美", "诗"] },
];

const themeById = new Map(themes.map((theme) => [theme.id, theme]));

const civilizationDefaults = {
  chinese: { traditions: ["chinese_philosophy"], themes: ["ethics", "politics", "justice"] },
  indian: { traditions: ["indian_philosophy"], themes: ["religion", "metaphysics", "life_death"] },
  ancient_greek: { traditions: ["ancient_greek_philosophy"], themes: ["ethics", "metaphysics", "knowledge"] },
  latin_christian: { traditions: ["scholasticism"], themes: ["religion", "metaphysics", "ethics"] },
  european_modern: { traditions: ["modern_european_philosophy"], themes: ["knowledge", "freedom", "politics"] },
  american: { traditions: ["american_philosophy"], themes: ["justice", "politics", "ethics"] },
  global_modern: { traditions: ["global_modern_thought"], themes: ["ethics", "justice", "freedom"] },
  islamic: { traditions: ["islamic_philosophy"], themes: ["metaphysics", "religion", "politics"] },
  jewish: { traditions: ["jewish_philosophy"], themes: ["religion", "ethics", "language"] },
  japanese: { traditions: ["japanese_philosophy"], themes: ["religion", "aesthetics", "ethics"] },
  korean: { traditions: ["korean_confucianism"], themes: ["ethics", "politics", "knowledge"] },
  african: { traditions: ["african_philosophy"], themes: ["politics", "ethics", "language"] },
  latin_american: { traditions: ["latin_american_philosophy"], themes: ["politics", "justice", "freedom"] },
};

const curated = {
  confucius: {
    traditions: ["confucianism"],
    themes: ["ethics", "politics", "justice"],
    oneLineZh: "以仁、礼和君子修养奠定儒家伦理政治传统。",
    summaryZh: "孔子把个人修养、礼乐秩序和政治正当性连成一个整体，使伦理问题成为中国思想史理解社会秩序的入口。",
  },
  laozi: {
    traditions: ["daoism"],
    themes: ["metaphysics", "politics", "life_death"],
    oneLineZh: "以道、无为和反强制秩序开辟道家思想。",
    summaryZh: "老子以道作为万物生成和政治节制的根本尺度，强调无为、柔弱和反身性的治理智慧。",
  },
  zhuangzi: {
    traditions: ["daoism"],
    themes: ["freedom", "language", "life_death"],
    oneLineZh: "以逍遥、齐物和语言怀疑展开自由哲学。",
    summaryZh: "庄子通过寓言、悖论和齐物论动摇固定分别，展现一种从功名、成见和死亡恐惧中松动出来的自由。",
  },
  plato: {
    traditions: ["platonism"],
    themes: ["justice", "knowledge", "metaphysics"],
    oneLineZh: "以理念论和《理想国》构成西方哲学核心源头之一。",
    summaryZh: "柏拉图通过对话录保存并重构苏格拉底的问题意识，以理念论、灵魂论和城邦正义构成西方哲学长期讨论的基本框架。",
    reviewStatus: "reviewed",
  },
  aristotle: {
    traditions: ["peripatetic"],
    themes: ["ethics", "metaphysics", "politics"],
    oneLineZh: "以实体、目的因和德性伦理建立系统哲学框架。",
    summaryZh: "亚里士多德把逻辑、自然、形而上学、伦理和政治组织成系统研究，强调实体、目的和实践德性的解释力。",
    reviewStatus: "reviewed",
  },
  kant: {
    traditions: ["critical_philosophy"],
    themes: ["knowledge", "ethics", "freedom"],
    oneLineZh: "以批判哲学重设知识、自由和道德法则的边界。",
    summaryZh: "康德通过批判哲学追问经验知识何以可能，并以自律和定言命令重构现代道德主体。",
    reviewStatus: "reviewed",
  },
  rawls: {
    traditions: ["liberalism", "political_philosophy"],
    themes: ["justice", "politics", "ethics"],
    oneLineZh: "以公平正义理论重塑当代政治哲学的问题框架。",
    summaryZh: "罗尔斯通过原初状态、无知之幕和两项正义原则，为现代自由主义政治哲学提供系统论证。",
  },
};

function defaultsFor(item) {
  return civilizationDefaults[item.civilization] ?? {
    traditions: ["global_philosophy"],
    themes: ["ethics", "knowledge", "politics"],
  };
}

function themeNames(themeIds) {
  return themeIds.map((themeId) => themeById.get(themeId)?.zh ?? themeId);
}

function influenceWeight(id, index) {
  if (["confucius", "buddha", "socrates", "plato", "aristotle", "descartes", "hume", "kant", "hegel", "marx", "nietzsche", "rawls"].includes(id)) return 3;
  return index % 5 === 0 ? 2 : 1;
}

const philosopherIndex = roster.map((item, index) => {
  const override = curated[item.id] ?? {};
  const base = defaultsFor(item);
  const themesForItem = override.themes ?? base.themes;
  const traditions = override.traditions ?? base.traditions;
  return {
    id: item.id,
    names: { zh: item.zh, en: item.en },
    life: { display: "年代信息待审核" },
    civilization: item.civilization,
    traditions,
    periods: ["first_release"],
    themes: themesForItem,
    keywordsZh: themeNames(themesForItem),
    oneLineZh: override.oneLineZh ?? `${item.zh}是${themeNames(themesForItem).slice(0, 2).join("、")}问题谱系中的第一版候选哲人。`,
    influenceWeight: influenceWeight(item.id, index),
    reviewStatus: override.reviewStatus ?? "draft",
  };
});

const works = philosopherIndex.map((entry) => ({
  id: `${entry.id}-primary-work`,
  philosopherId: entry.id,
  titleZh: `${entry.names.zh}代表文本`,
  titleEn: `${entry.names.en} primary text`,
  noteZh: "第一版用于展示的种子文本，审核时替换为具体作品。",
}));

const details = philosopherIndex.map((entry) => ({
  ...entry,
  summaryZh: curated[entry.id]?.summaryZh ?? `${entry.oneLineZh} 本条目是第一版结构化资料，已经保留文明、传统、主题、作品和论述字段，正式发布前需要继续核对年代、文本出处和概念表述。`,
  works: [`${entry.id}-primary-work`],
  sourceNotes: [{ label: "draft", noteZh: "条目需要人工核对作品、年代和概念表述。" }],
}));

const argumentsIndex = philosopherIndex.flatMap((entry) =>
  entry.themes.slice(0, 2).map((themeId, index) => {
    const theme = themeById.get(themeId);
    return {
      id: `${entry.id}-${themeId}-${index + 1}`,
      philosopherId: entry.id,
      themeIds: [themeId],
      questionZh: `${theme?.zh ?? themeId}意味着什么？`,
      claimZh: `${entry.names.zh}围绕${theme?.zh ?? themeId}提出了可供第一版检索的核心观点。`,
      explanationZh: `${entry.names.zh}的这条论述先作为结构化摘要骨架，用来验证命题检索、详情面板和收藏札记流程；审核阶段需要替换为准确表述。`,
      source: { workId: `${entry.id}-primary-work`, excerptStatus: "summary_only" },
      keywordsZh: [theme?.zh ?? themeId, entry.names.zh],
      reviewStatus: entry.reviewStatus,
    };
  }),
);

const relationshipSeeds = [
  ["socrates", "plato", "direct_student", "knowledge", "柏拉图通过对话录保存并重构苏格拉底的问题意识。"],
  ["plato", "aristotle", "direct_student", "metaphysics", "亚里士多德曾在柏拉图学园学习，并在形而上学和政治哲学上形成回应。"],
  ["confucius", "mencius", "reception", "ethics", "孟子继承并发展孔子关于仁与政治正当性的讨论。"],
  ["confucius", "xunzi", "reception", "ethics", "荀子在儒家框架中以礼法和学习工夫改写人性论。"],
  ["laozi", "zhuangzi", "school", "freedom", "庄子发展道家关于道、无为和自由的思想方向。"],
  ["aristotle", "aquinas", "reception", "metaphysics", "阿奎那借亚里士多德哲学重构经院哲学体系。"],
  ["hume", "kant", "influence", "knowledge", "康德承认休谟的因果怀疑促使他重审知识条件。"],
  ["kant", "hegel", "influence", "freedom", "黑格尔继承并批判康德关于自由、理性和历史的框架。"],
  ["hegel", "marx", "influence", "politics", "马克思在批判中转化黑格尔辩证法和历史理解。"],
  ["husserl", "heidegger", "influence", "metaphysics", "海德格尔从胡塞尔现象学出发，重新追问存在问题。"],
  ["heidegger", "sartre", "influence", "freedom", "萨特在存在主义语境中回应并改写海德格尔问题。"],
  ["frege", "wittgenstein", "influence", "language", "维特根斯坦的早期问题意识与弗雷格逻辑和意义理论密切相关。"],
  ["rawls", "nozick", "critique", "justice", "诺齐克以权利理论批判罗尔斯的分配正义框架。"],
  ["nagarjuna", "adi-shankara", "shared_problem", "metaphysics", "二者围绕终极实在、语言和解脱形成可对照的问题域。"],
  ["ibn-sina", "aquinas", "influence", "metaphysics", "伊本·西那关于存在与本质的讨论影响拉丁中世纪形而上学。"],
];

const philosopherIds = new Set(philosopherIndex.map((item) => item.id));
const relationships = relationshipSeeds
  .filter(([from, to]) => philosopherIds.has(from) && philosopherIds.has(to))
  .map(([from, to, type, themeId, noteZh], index) => ({
    id: `${from}-${to}-${type}`,
    from,
    to,
    type,
    strength: index < 8 ? 3 : 2,
    confidence: index < 12 ? "high" : "medium",
    themeIds: [themeId],
    noteZh,
    reviewStatus: index < 3 ? "reviewed" : "draft",
  }));

for (const file of fs.readdirSync(philosophersDir)) {
  if (file.endsWith(".json")) fs.unlinkSync(path.join(philosophersDir, file));
}

fs.writeFileSync(path.join(dataDir, "themes.json"), JSON.stringify(themes, null, 2));
fs.writeFileSync(path.join(dataDir, "works.json"), JSON.stringify(works, null, 2));
fs.writeFileSync(path.join(dataDir, "arguments.index.json"), JSON.stringify(argumentsIndex, null, 2));
fs.writeFileSync(path.join(dataDir, "relationships.json"), JSON.stringify(relationships, null, 2));
fs.writeFileSync(path.join(dataDir, "philosophers.index.json"), JSON.stringify(philosopherIndex, null, 2));
for (const detail of details) {
  fs.writeFileSync(path.join(philosophersDir, `${detail.id}.json`), JSON.stringify(detail, null, 2));
}

console.log(`seeded ${philosopherIndex.length} philosophers`);
