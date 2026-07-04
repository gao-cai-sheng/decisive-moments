#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('public/data/philosophers/dharmakirti.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const replacements = new Map([
  ['dharmakirti:evidence:003', {
    titleZh: '《量评释》第一品论独自相与共相构造',
    summaryZh: '第一品把真正有效的对象限定为具有因果效力的个别相，并把共相解释为概念活动中的构造对象。',
    locator: 'Pramanavarttika I.152 in the nominalism discussion'
  }],
  ['dharmakirti:evidence:005', {
    titleZh: '《量评释》第一品论 apoha 排除机制',
    summaryZh: '第一品通过排除非此者说明词义形成，使语言分类依赖概念排除而不需要承认独立普遍实体。',
    locator: 'Pramanavarttika I, apoha materials in the chapter on inference for oneself'
  }],
  ['dharmakirti:evidence:008', {
    titleZh: '《量评释》因明章节论三相因',
    summaryZh: '相关论证把有效理由限定为在同品成立、异品不成立并与所立法相连，从而保证为他推理的公开可检验性。',
    locator: 'Pramanavarttika, svārthānumāna/parārthānumāna materials on trairūpya'
  }],
  ['dharmakirti:evidence:010', {
    titleZh: '《量评释》第二品论佛陀作为成量者',
    summaryZh: '第二品把佛陀权威建立在无误认识、慈悲动机和解脱教导的可靠性上，而不是把经典当作无条件独立量。',
    locator: 'Pramanavarttika II, pramanasiddhi materials on the Buddha as reliable guide'
  }],
  ['dharmakirti:evidence:012', {
    titleZh: '《量评释》第三品论认知内部化',
    summaryZh: '第三品把外境解释为可由认知显现说明的对象，同时让他心论证承担避免唯我封闭的补充任务。',
    locator: 'Pramanavarttika III, materials on cognition and external object'
  }]
]);

let touched = 0;
const seen = new Set();

function visit(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) visit(item);
    return;
  }
  if (typeof node.id === 'string' && replacements.has(node.id)) {
    const patch = replacements.get(node.id);
    node.titleZh = patch.titleZh;
    node.summaryZh = patch.summaryZh;
    if (!node.source || typeof node.source !== 'object') {
      throw new Error(`evidence ${node.id} has no source object`);
    }
    node.source.locator = patch.locator;
    seen.add(node.id);
    touched += 1;
  }
  for (const value of Object.values(node)) visit(value);
}

visit(data);

const missing = [...replacements.keys()].filter((id) => !seen.has(id));
if (missing.length) {
  throw new Error(`missing target evidence ids: ${missing.join(', ')}`);
}
if (touched !== replacements.size) {
  throw new Error(`expected ${replacements.size} replacements, touched ${touched}`);
}

const serialized = JSON.stringify(data, null, 2) + '\n';
fs.writeFileSync(file, serialized);
console.log(`dharmakirti debt repair written: ${touched} evidence summaries`);
