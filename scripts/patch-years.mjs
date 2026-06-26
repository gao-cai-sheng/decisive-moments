// 批量补全所有哲学家的生卒年数据
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const DIR = resolve("public/data/philosophers");
const INDEX_PATH = resolve("public/data/philosophers.index.json");

// id -> { birth?, death?, approx? }
// birth/death: 负数=公元前，undefined=在世或失考
const YEARS = {
  // 中国哲学
  laozi:           { birth: -571, death: -471, approx: true },
  zhuangzi:        { birth: -369, death: -286, approx: true },
  mozi:            { birth: -470, death: -391, approx: true },
  mencius:         { birth: -372, death: -289, approx: true },
  xunzi:           { birth: -310, death: -235, approx: true },
  "wang-yangming": { birth: 1472, death: 1529 },
  "zhu-xi":        { birth: 1130, death: 1200 },
  "hu-shi":        { birth: 1891, death: 1962 },
  "liang-shuming": { birth: 1893, death: 1988 },
  // 印度哲学
  mahavira:        { birth: -599, death: -527, approx: true },
  nagarjuna:       { birth: 150,  death: 250,  approx: true },
  vasubandhu:      { birth: 400,  death: 480,  approx: true },
  "adi-shankara":  { birth: 788,  death: 820,  approx: true },
  ramanuja:        { birth: 1017, death: 1137 },
  tagore:          { birth: 1861, death: 1941 },
  gandhi:          { birth: 1869, death: 1948 },
  ambedkar:        { birth: 1891, death: 1956 },
  krishnamurti:    { birth: 1895, death: 1986 },
  // 古希腊
  thales:          { birth: -624, death: -546, approx: true },
  heraclitus:      { birth: -535, death: -475, approx: true },
  parmenides:      { birth: -515, death: -450, approx: true },
  socrates:        { birth: -469, death: -399 },
  aristotle:       { birth: -384, death: -322 },
  epicurus:        { birth: -341, death: -270 },
  "zeno-citium":   { birth: -334, death: -262, approx: true },
  plotinus:        { birth: 204,  death: 270  },
  hypatia:         { birth: 360,  death: 415,  approx: true },
  // 拉丁基督教
  augustine:       { birth: 354,  death: 430  },
  boethius:        { birth: 477,  death: 524  },
  anselm:          { birth: 1033, death: 1109 },
  aquinas:         { birth: 1225, death: 1274 },
  ockham:          { birth: 1287, death: 1347, approx: true },
  // 欧洲近现代
  erasmus:         { birth: 1466, death: 1536 },
  machiavelli:     { birth: 1469, death: 1527 },
  montaigne:       { birth: 1533, death: 1592 },
  bacon:           { birth: 1561, death: 1626 },
  hobbes:          { birth: 1588, death: 1679 },
  descartes:       { birth: 1596, death: 1650 },
  spinoza:         { birth: 1632, death: 1677 },
  locke:           { birth: 1632, death: 1704 },
  leibniz:         { birth: 1646, death: 1716 },
  hume:            { birth: 1711, death: 1776 },
  rousseau:        { birth: 1712, death: 1778 },
  hegel:           { birth: 1770, death: 1831 },
  schopenhauer:    { birth: 1788, death: 1860 },
  kierkegaard:     { birth: 1813, death: 1855 },
  mill:            { birth: 1806, death: 1873 },
  marx:            { birth: 1818, death: 1883 },
  frege:           { birth: 1848, death: 1925 },
  husserl:         { birth: 1859, death: 1938 },
  bergson:         { birth: 1859, death: 1941 },
  wittgenstein:    { birth: 1889, death: 1951 },
  heidegger:       { birth: 1889, death: 1976 },
  russell:         { birth: 1872, death: 1970 },
  whitehead:       { birth: 1861, death: 1947 },
  carnap:          { birth: 1891, death: 1970 },
  arendt:          { birth: 1906, death: 1975 },
  sartre:          { birth: 1905, death: 1980 },
  beauvoir:        { birth: 1908, death: 1986 },
  "merleau-ponty": { birth: 1908, death: 1961 },
  camus:           { birth: 1913, death: 1960 },
  foucault:        { birth: 1926, death: 1984 },
  derrida:         { birth: 1930, death: 2004 },
  habermas:        { birth: 1929 },
  // 美国哲学
  dewey:           { birth: 1859, death: 1952 },
  quine:           { birth: 1908, death: 2000 },
  rawls:           { birth: 1921, death: 2002 },
  nozick:          { birth: 1938, death: 2002 },
  // 全球现代
  singer:          { birth: 1946 },
  nussbaum:        { birth: 1947 },
  plumwood:        { birth: 1939, death: 2008 },
  butler:          { birth: 1956 },
  hooks:           { birth: 1952, death: 2021 },
  // 伊斯兰哲学
  "al-farabi":     { birth: 872,  death: 950,  approx: true },
  "ibn-sina":      { birth: 980,  death: 1037 },
  "al-ghazali":    { birth: 1058, death: 1111 },
  "ibn-rushd":     { birth: 1126, death: 1198 },
  "mulla-sadra":   { birth: 1571, death: 1636 },
  "ibn-khaldun":   { birth: 1332, death: 1406 },
  // 犹太哲学
  "saadia-gaon":   { birth: 882,  death: 942  },
  maimonides:      { birth: 1138, death: 1204 },
  buber:           { birth: 1878, death: 1965 },
  levinas:         { birth: 1906, death: 1995 },
  // 日本哲学
  dogen:           { birth: 1200, death: 1253 },
  nishida:         { birth: 1870, death: 1945 },
  watsuji:         { birth: 1889, death: 1960 },
  // 朝鲜哲学
  toegye:          { birth: 1501, death: 1570 },
  yulgok:          { birth: 1536, death: 1584 },
  // 非洲哲学
  amo:             { birth: 1703, death: 1759, approx: true },
  wiredu:          { birth: 1931, death: 2022 },
  senghor:         { birth: 1906, death: 2001 },
  hountondji:      { birth: 1942 },
  // 拉丁美洲
  dussel:          { birth: 1934, death: 2023 },
  zelea:           { birth: 1912, death: 2004 },
  "sor-juana":     { birth: 1648, death: 1695 },
};

function makeDisplay({ birth, death, approx }) {
  const pre = approx ? "约" : "";
  function fmt(y) {
    if (y === undefined || y === null) return null;
    if (y < 0) return `前 ${Math.abs(y)}`;
    return `${y}`;
  }
  const b = fmt(birth);
  const d = fmt(death);
  if (b && d) return `${pre}${b}—${d}`;
  if (b) return `${pre}${b} 年生`;
  return "年代待考";
}

// 补丁个人文件
let patched = 0;
for (const [id, data] of Object.entries(YEARS)) {
  const filePath = `${DIR}/${id}.json`;
  let obj;
  try {
    obj = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    console.warn(`跳过（文件不存在）: ${id}`);
    continue;
  }
  if (obj.life?.birth !== undefined) {
    continue; // 已有年份，跳过
  }
  obj.life = {
    display: makeDisplay(data),
    ...(data.birth !== undefined ? { birth: data.birth } : {}),
    ...(data.death !== undefined ? { death: data.death } : {}),
  };
  writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n");
  patched++;
}
console.log(`已补丁 ${patched} 个哲学家文件`);

// 同步索引
const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
let idxPatched = 0;
for (const entry of index) {
  if (entry.life?.birth !== undefined) continue;
  const data = YEARS[entry.id];
  if (!data) continue;
  entry.life = {
    display: makeDisplay(data),
    ...(data.birth !== undefined ? { birth: data.birth } : {}),
    ...(data.death !== undefined ? { death: data.death } : {}),
  };
  idxPatched++;
}
writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n");
console.log(`已同步索引 ${idxPatched} 条`);
