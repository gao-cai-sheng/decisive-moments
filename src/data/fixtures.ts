import type { Argument, Philosopher, Relationship, Theme, Work } from "./schemas";

export const validTheme: Theme = {
  id: "justice",
  zh: "正义",
  en: "Justice",
  aliasesZh: ["公正", "公平", "义"],
};

export const validWork: Work = {
  id: "republic",
  philosopherId: "plato",
  titleZh: "理想国",
  titleEn: "Republic",
  originalTitle: "Πολιτεία",
  yearDisplay: "约公元前 375 年",
  noteZh: "政治哲学与理念论核心文本之一。",
};

export const validPhilosopher: Philosopher = {
  id: "plato",
  tier: "standard",
  names: { zh: "柏拉图", en: "Plato", native: "Πλάτων" },
  life: { birth: -428, death: -348, display: "约公元前 428/427 - 前 348/347" },
  civilization: "ancient_greek",
  traditions: ["platonism", "ancient_greek_philosophy"],
  periods: ["classical_antiquity"],
  themes: ["justice", "forms", "knowledge", "soul"],
  keywordsZh: ["理念论", "正义", "灵魂", "城邦"],
  oneLineZh: "以理念论和《理想国》奠定西方形而上学与政治哲学的核心人物。",
  summaryZh:
    "柏拉图通过对话录保存并重构苏格拉底的问题意识，以理念论、灵魂论和城邦正义构成西方哲学长期讨论的基本框架。",
  works: ["republic"],
  influenceWeight: 3,
  reviewStatus: "reviewed",
  sourceNotes: [{ label: "Primary tradition", noteZh: "以柏拉图对话录传统为基础。" }],
};

export const validArgument: Argument = {
  id: "plato-justice-soul-order",
  philosopherId: "plato",
  themeIds: ["justice", "soul", "politics"],
  questionZh: "正义是什么？",
  claimZh: "正义不仅是外在制度安排，也是一种灵魂各部分各安其位的秩序。",
  explanationZh:
    "在《理想国》中，柏拉图把城邦结构与灵魂结构对应起来，认为正义表现为各部分履行自身职分，而非彼此争夺支配权。",
  source: { workId: "republic", locator: "Book IV", excerptStatus: "summary_only" },
  keywordsZh: ["正义", "灵魂秩序", "城邦"],
  reviewStatus: "reviewed",
};

export const validRelationship: Relationship = {
  id: "socrates-plato-direct",
  from: "socrates",
  to: "plato",
  type: "direct_student",
  strength: 3,
  confidence: "high",
  themeIds: ["ethics", "knowledge"],
  noteZh: "柏拉图通过对话录保存并重构苏格拉底的问题意识。",
  reviewStatus: "reviewed",
};
